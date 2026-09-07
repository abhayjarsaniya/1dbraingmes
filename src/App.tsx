import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/public/Home';
import { Games } from './pages/public/Games';
import { GameDetail } from './pages/public/GameDetail';
import About from './pages/public/About';
import { GenericPage } from './pages/public/GenericPage';
import { NotFound } from './pages/public/NotFound';
import { GameLegalPage } from './pages/public/GameLegalPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { GamesList } from './pages/admin/GamesList';
import { GameEditor } from './pages/admin/GameEditor';
import { SettingsEditor } from './pages/admin/SettingsEditor';

import { PagesList } from './pages/admin/PagesList';
import { PageEditor } from './pages/admin/PageEditor';
import { MediaList } from './pages/admin/MediaList';
import { SeoSettings } from './pages/admin/SeoSettings';
import { Login } from './pages/admin/Login';

function PublicLayout() {
  const { fetchPublicData, loading, data } = useStore();

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  if (loading || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0A051A]"><div className="w-8 h-8 border-4 border-[#FFD600] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-[#0A051A] text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="games" element={<GamesList />} />
          <Route path="games/new" element={<GameEditor />} />
          <Route path="games/:id" element={<GameEditor />} />
          <Route path="settings" element={<SettingsEditor />} />
          <Route path="pages" element={<PagesList />} />
          <Route path="pages/new" element={<PageEditor />} />
          <Route path="pages/:id" element={<PageEditor />} />
          <Route path="media" element={<MediaList />} />
          <Route path="seo" element={<SeoSettings />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:slug" element={<GameDetail />} />
          <Route path="/games/:slug/privacy" element={<GameLegalPage type="privacy" />} />
          <Route path="/games/:slug/terms" element={<GameLegalPage type="terms" />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<GenericPage slugOverride="contact" />} />
          <Route path="/privacy" element={<GenericPage slugOverride="privacy" />} />
          <Route path="/terms" element={<GenericPage slugOverride="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
