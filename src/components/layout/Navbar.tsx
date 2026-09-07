import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { data } = useStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!data?.settings?.header.enabled) return null;
  const { header } = data.settings;

  const navItems = header.navigation.filter(n => n.visible).sort((a, b) => a.order - b.order);

  return (
    <header className={`${header.sticky ? 'sticky top-0 z-50' : ''} bg-[#0A051A]/80 backdrop-blur-md border-b border-white/5`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight text-white uppercase">
              {header.logoText}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            <div className="flex gap-8 text-sm font-medium text-white/60">
              {navItems.map((item) => (
                <Link 
                  key={item.id} 
                  to={item.url}
                  className={`transition-colors ${
                    location.pathname === item.url ? 'text-[#FFD600] border-b-2 border-[#FFD600] pb-1' : 'hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {header.cta.enabled && (
              <Link 
                to={header.cta.url}
                className="bg-white text-[#0A051A] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#FFD600] transition-colors"
              >
                {header.cta.text}
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end md:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Drawer Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-4/5 max-w-sm bg-[#1E1E2E] h-full shadow-2xl flex flex-col border-l border-white/10"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <span className="text-xl font-bold tracking-tight text-white uppercase">
                  Menu
                </span>
                <button 
                  className="p-2 text-white/70 hover:text-white transition-colors bg-white/5 rounded-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="px-6 py-8 flex flex-col gap-6 overflow-y-auto">
                {navItems.map((item) => (
                  <Link 
                    key={item.id} 
                    to={item.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-black text-2xl tracking-tight transition-colors ${
                      location.pathname === item.url ? 'text-[#FFD600]' : 'text-white hover:text-white/70'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {header.cta.enabled && (
                <div className="mt-auto p-6 border-t border-white/5">
                  <Link 
                    to={header.cta.url}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full bg-[#FF3D00] text-white px-6 py-4 rounded-2xl font-bold text-center text-lg shadow-lg shadow-[#FF3D00]/20 hover:bg-[#FF5500] transition-colors"
                  >
                    {header.cta.text}
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
