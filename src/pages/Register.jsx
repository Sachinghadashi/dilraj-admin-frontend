import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { Store, Lock, Mail, AlertCircle, User, Briefcase } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' // By default let them register as admin for first setup
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use the centralized api instance
      const response = await api.post('/auth/register', formData);

      if (response.data.success) {
        // Automatically log them in after successful registration
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('name', response.data.name);

        if (response.data.role === 'cashier') {
          navigate('/billing'); 
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>

      <div className="max-w-md w-full backdrop-blur-xl bg-slate-800/80 rounded-3xl shadow-2xl overflow-hidden border border-slate-700 relative z-10 transition-all transform duration-500">
        <div className="p-8 pb-8">
          
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-tr from-emerald-600 to-emerald-400 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6">
              <Store className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">Create Account</h2>
            <p className="text-slate-400 font-medium">Setup your Kirana Platform profile</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm animate-pulse">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-600 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="Rahul Sharma"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-600 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="admin@dilraj.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                    <Lock className="h-5 w-5" />
                    </div>
                    <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-600 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm"
                    placeholder="••••••••"
                    required
                    minLength="6"
                    />
                </div>
                </div>

                <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">System Role</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                    <Briefcase className="h-5 w-5" />
                    </div>
                    <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="block w-full pl-11 pr-4 py-3.5 border border-slate-600 rounded-xl bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all sm:text-sm appearance-none"
                    required
                    >
                        <option value="admin">Store Admin</option>
                        <option value="cashier">POS Cashier</option>
                    </select>
                </div>
                </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-600/20 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
              ) : (
                'Create Profile'
              )}
            </button>
          </form>
          
        </div>
        <div className="bg-slate-900 px-8 py-5 border-t border-slate-700/80 text-center">
            <p className="text-sm text-slate-400 font-medium">
                Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold ml-1 transition-colors">Sign in here</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
