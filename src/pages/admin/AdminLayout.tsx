import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAdminStore } from '../../store/useStore';
import { LayoutDashboard, Gamepad2, FileText, Settings, LogOut, Image as ImageIcon, Search } from 'lucide-react';
import { Login } from './Login';

export function AdminLayout() {
  const { token, fetchAdminData, logout, db } = useAdminStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token, fetchAdminData]);

  if (!token) {
    return <Login />;
  }

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Games', icon: Gamepad2, path: '/admin/games' },
    { label: 'Pages', icon: FileText, path: '/admin/pages' },
    { label: 'Media', icon: ImageIcon, path: '/admin/media' },
    { label: 'SEO', icon: Search, path: '/admin/seo' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-950 text-white p-4 flex justify-between items-center border-b border-indigo-900">
        <div>
          <h2 className="text-lg font-black">1D Brain Games</h2>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">CMS Panel</p>
        </div>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      
      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative w-4/5 max-w-sm bg-indigo-950 text-indigo-100 flex flex-col h-full shadow-2xl">
              <div className="p-6 border-b border-indigo-900 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-white">1D Brain Games</h2>
                  <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mt-1">CMS Panel</p>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {navItems.map(item => {
                  const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                        active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'hover:bg-indigo-900/50 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-indigo-900">
                <button 
                  onClick={() => { logout(); navigate('/admin'); }}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-indigo-300 hover:bg-indigo-900/50 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-indigo-950 text-indigo-100 flex-col">
        <div className="p-6 border-b border-indigo-900">
          <h2 className="text-xl font-black text-white">1D Brain Games</h2>
          <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mt-1">CMS Panel</p>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map(item => {
            const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'hover:bg-indigo-900/50 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-indigo-900">
          <button 
            onClick={() => { logout(); navigate('/admin'); }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium text-indigo-300 hover:bg-indigo-900/50 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50/50">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {db ? <Outlet /> : <div className="flex items-center justify-center h-full"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>}
        </div>
      </main>
    </div>
  );
}
