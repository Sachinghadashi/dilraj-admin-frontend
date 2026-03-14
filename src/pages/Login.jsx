import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { Store, Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use the centralized api instance
      const response = await api.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        // Save auth data to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('name', response.data.name);

        // Redirect based on role
        if (response.data.role === 'cashier') {
          // Cashiers are forced to land straight on the POS Billing screen
          navigate('/billing'); 
        } else {
          // Admins land on the Dashboard
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background elements for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>

      <div className="max-w-md w-full backdrop-blur-xl bg-slate-800/80 rounded-3xl shadow-2xl overflow-hidden border border-slate-700 relative z-10 transition-all transform duration-500 hover:shadow-blue-900/40 hover:border-slate-600">
        <div className="p-8 pb-10">
          
          <div className="text-center mb-10">
            <div className="mx-auto bg-gradient-to-tr from-blue-600 to-blue-400 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 transform -rotate-3 transition-transform hover:rotate-0 duration-300">
              <Store className="text-white w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Dilraj Platform</h2>
            <p className="text-slate-400 font-medium">Log in to your workspace</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm animate-pulse">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-600 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="admin@dilraj.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-600 rounded-xl bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
              ) : (
                'Access System'
              )}
            </button>
          </form>
          
        </div>
        <div className="bg-slate-900 px-8 py-5 border-t border-slate-700/80">
            <p className="text-xs text-center text-slate-500 font-medium mb-3">
                Dilraj Kirana Store Management System &copy; {new Date().getFullYear()}
            </p>
            <p className="text-sm text-center text-slate-400 font-medium">
                New to the platform? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-bold ml-1 transition-colors">Create an account</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
