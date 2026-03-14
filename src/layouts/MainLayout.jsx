import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Receipt, ShoppingCart, LogOut, UserCircle } from 'lucide-react';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Force a reload to app.jsx check
    window.location.href = '/login'; 
  };

  const userRole = localStorage.getItem('role') || 'Admin'; // Mock for now, will pull from state later
  const userName = localStorage.getItem('name') || 'Dilraj Store';

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['admin'] },
    { name: 'POS Billing', path: '/billing', icon: <Receipt size={20} />, roles: ['admin', 'cashier'] },
    { name: 'Inventory', path: '/products', icon: <Package size={20} />, roles: ['admin'] },
    { name: 'E-commerce Orders', path: '/orders', icon: <ShoppingCart size={20} />, roles: ['admin'] },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex rounded-r-2xl shadow-xl my-4 ml-4">
        {/* Brand Area */}
        <div className="h-20 flex items-center justify-center border-b border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Dilraj Kirana Store
          </h1>
        </div>

        {/* User Card */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-emerald-400">
            <UserCircle size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate w-36 text-slate-200">{userName}</span>
            <span className="text-xs text-blue-400 px-2 py-0.5 bg-blue-500/10 rounded-full w-fit mt-1 capitalize font-medium border border-blue-500/20">{userRole.toLowerCase()}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
          {menuItems.map((item) => {
            // Role based rendering (if role matches, or user is admin)
            if (userRole.toLowerCase() === 'admin' || item.roles.includes(userRole.toLowerCase())) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out font-medium group ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  <span className={`${location.pathname === item.path ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            }
            return null;
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 font-medium hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-300"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden max-h-screen">
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 relative p-8">
            <div className="max-w-7xl mx-auto w-full">
                <Outlet />
            </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
