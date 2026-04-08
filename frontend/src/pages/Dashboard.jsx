import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Inbox, Edit2, X, Check, Activity, Clock, CheckCircle2, ListTodo } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, completed: 0 });
  const [error, setError] = useState('');
  
  // Create Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Edit Mode State
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', status: 'active' });

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, statsRes] = await Promise.all([
        api.get('/items'),
        api.get('/items/stats')
      ]);
      setItems(itemsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  // --- CRUD OPERATIONS ---
  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/items', { title, description });
      setTitle('');
      setDescription('');
      fetchData(); // Refresh list and stats
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  const handleDelete = async (id) => {
    // REQUIRED: Confirmation Dialog
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/items/${id}`);
      fetchData();
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditForm({ title: item.title, description: item.description, status: item.status });
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/items/${id}`, editForm);
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  // --- UI COMPONENTS ---
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-semibold text-zinc-900">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 font-sans pb-12 pt-8">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-1">Welcome back, {user?.name || 'User'}</p>
          </div>
          <button 
            onClick={logout}
            className="text-sm font-medium text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 px-4 py-2 rounded-md transition-colors w-fit"
          >
            Logout
          </button>
        </header>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">{error}</div>}

        {/* REQUIRED: Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Tasks" value={stats.total} icon={ListTodo} color="bg-zinc-100 text-zinc-700" />
          <StatCard title="Active" value={stats.active} icon={Activity} color="bg-blue-50 text-blue-600" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} color="bg-amber-50 text-amber-600" />
          <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Create Task Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm sticky top-24">
              <h2 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-zinc-500" /> New Task
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Title</label>
                  <input 
                    type="text" value={title} onChange={(e) => setTitle(e.target.value)} required 
                    className="w-full px-3 py-2 bg-transparent border border-zinc-300 rounded-md text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                    placeholder="E.g., Update schema"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Description</label>
                  <textarea 
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border border-zinc-300 rounded-md text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 resize-none"
                    rows="3" placeholder="Brief details..."
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium py-2 rounded-md transition-colors">
                  Create Task
                </button>
              </form>
            </div>
          </div>

          {/* Items List */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50">
                <h2 className="text-sm font-semibold text-zinc-900">Your Tasks</h2>
              </div>
              
              <div className="p-0">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                    <Inbox className="w-10 h-10 mb-3 stroke-[1.5]" />
                    <p className="text-sm font-medium text-zinc-600">No tasks found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {items.map((item) => (
                      <div key={item.id} className="p-5 hover:bg-zinc-50 transition-colors group">
                        
                        {/* EDIT MODE */}
                        {editingId === item.id ? (
                          <div className="space-y-3 bg-zinc-50 p-4 rounded-md border border-zinc-200">
                            <input 
                              type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                              className="w-full px-3 py-1.5 border border-zinc-300 rounded text-sm focus:outline-none focus:border-zinc-900"
                            />
                            <textarea 
                              value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                              className="w-full px-3 py-1.5 border border-zinc-300 rounded text-sm focus:outline-none focus:border-zinc-900 resize-none" rows="2"
                            />
                            {/* REQUIRED: Status Dropdown */}
                            <select 
                              value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                              className="w-full px-3 py-1.5 border border-zinc-300 rounded text-sm focus:outline-none focus:border-zinc-900"
                            >
                              <option value="active">Active</option>
                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                            </select>
                            
                            <div className="flex justify-end gap-2 pt-2">
                              <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 px-3 py-1.5 border border-zinc-300 rounded">
                                <X className="w-3 h-3" /> Cancel
                              </button>
                              <button onClick={() => handleUpdate(item.id)} className="flex items-center gap-1 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded">
                                <Check className="w-3 h-3" /> Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          
                          /* VIEW MODE */
                          <div className="flex justify-between items-start">
                            <div className="pr-4">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className={`text-sm font-medium ${item.status === 'completed' ? 'text-zinc-400 line-through' : 'text-zinc-900'}`}>{item.title}</h3>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                  ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                                    item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                                    'bg-blue-100 text-blue-700'}`}>
                                  {item.status || 'Active'}
                                </span>
                              </div>
                              <p className="text-sm text-zinc-500 mt-2">{item.description}</p>
                            </div>
                            
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEditing(item)} className="p-1.5 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}