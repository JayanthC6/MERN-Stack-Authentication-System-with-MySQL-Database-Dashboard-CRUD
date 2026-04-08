import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // 1. Grab the token from browser storage
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // 2. Create our Auth Header configuration for Axios
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // 3. Run this code immediately when the page loads
  useEffect(() => {
    // If there is no token, kick the user back to the login page
    if (!token) {
      navigate('/login');
      return;
    }
    fetchItems();
  }, [navigate, token]);

  // --- API CALLS ---

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items', axiosConfig);
      setItems(response.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate('/login'); // Token expired/invalid
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/items', { title, description }, axiosConfig);
      setTitle(''); // Clear the input
      setDescription(''); // Clear the input
      fetchItems(); // Refresh the list automatically!
    } catch (err) {
      setError('Failed to create item.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`, axiosConfig);
      fetchItems(); // Refresh the list
    } catch (err) {
      setError('Failed to delete item.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- USER INTERFACE ---
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user.name || 'User'}!
          </h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Create Item Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-1 h-fit">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Add New Item</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors"
              >
                Add Item
              </button>
            </form>
          </div>

          {/* Items List */}
          <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Your Items</h2>
            
            {items.length === 0 ? (
              <p className="text-gray-500 italic">No items found. Create one to get started!</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded p-4 flex justify-between items-start hover:shadow-md transition-shadow">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      <span className="inline-block mt-2 text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {item.status}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm ml-4"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}