import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // Using our new interceptor!
import { useAuth } from '../context/AuthContext'; // Using our global state!

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state requirement
  
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Look how clean this API call is now!
      const response = await api.post('/auth/login', formData);
      
      if (response.status === 200) {
        // Use our context to log the user in globally
        login(response.data.user, response.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
        <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">Welcome Back</h2>
        <p className="text-center text-sm text-zinc-500 mb-6">Sign in to your account to continue</p>
        
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full px-3 py-2 bg-transparent border border-zinc-300 rounded-md text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-shadow"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full px-3 py-2 bg-transparent border border-zinc-300 rounded-md text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-shadow"
              onChange={handleChange}
            />
          </div>

          {/* Required UI Elements: Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-sm text-zinc-600 cursor-pointer">
              <input type="checkbox" className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm font-medium text-zinc-900 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium py-2.5 rounded-md transition-colors disabled:opacity-70 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Don't have an account? <Link to="/register" className="font-medium text-zinc-900 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}