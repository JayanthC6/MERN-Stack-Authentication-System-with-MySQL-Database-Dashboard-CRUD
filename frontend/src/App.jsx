import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Components (Route Guards)
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Navbar Component to keep App.jsx clean
function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-zinc-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-bold text-zinc-900 tracking-tight">
          AppSpace.
        </Link>
        <div className="flex gap-6 items-center">
          {!token ? (
            <>
              <Link to="/login" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Login</Link>
              <Link to="/register" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Dashboard</Link>
              <button 
                onClick={logout}
                className="text-sm font-medium text-zinc-600 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 px-3 py-1.5 rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider handles global login/logout state [cite: 105] */}
      <AuthProvider>
        <div className="min-h-screen bg-zinc-50">
          <Navbar />
          
          <Routes>
            {/* PUBLIC ROUTES: 
                Wrapped in PublicRoute to redirect logged-in users away from Auth pages  
            */}
            <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password/:token" element={<PublicRoute><ResetPassword /></PublicRoute>} />

            {/* PROTECTED ROUTES: 
                Wrapped in ProtectedRoute to prevent unauthenticated access  
            */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;