import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      {/* Temporary Navigation Bar for testing */}
      <nav className="bg-white shadow-md p-4 flex justify-center gap-6">
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
        <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register</Link>
        <Link to="/dashboard" className="text-blue-600 font-semibold hover:underline">Dashboard</Link>
      </nav>

      {/* The Router Engine that swaps the pages */}
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default to Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;