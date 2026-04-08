import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Using interceptor

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '' // Added required field
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Form Validation Check
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...dataToSend } = formData;
      const response = await api.post('/auth/register', dataToSend);
      
      if (response.status === 201) {
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 2000); // Wait 2 seconds then redirect
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-zinc-200 p-8">
        <h2 className="text-2xl font-bold text-center text-zinc-900 mb-2">Create an Account</h2>
        <p className="text-center text-sm text-zinc-500 mb-6">Enter your details to get started</p>
        
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-md text-sm mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Full Name</label>
            <input 
              type="text" name="name" required onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border border-zinc-300 rounded-md text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" name="email" required onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border border-zinc-300 rounded-md text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Phone Number</label>
            <input 
              type="tel" name="phone" onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border border-zinc-300 rounded-md text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Password</label>
              <input 
                type="password" name="password" required onChange={handleChange} minLength="6"
                className="w-full px-3 py-2 bg-transparent border border-zinc-300 rounded-md text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Confirm</label>
              <input 
                type="password" name="confirmPassword" required onChange={handleChange} minLength="6"
                className="w-full px-3 py-2 bg-transparent border border-zinc-300 rounded-md text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium py-2.5 rounded-md transition-colors disabled:opacity-70 mt-4"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Already have an account? <Link to="/login" className="font-medium text-zinc-900 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}