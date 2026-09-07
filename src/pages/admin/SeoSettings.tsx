import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/useStore';
import { Globe, Search, Save, CheckCircle2 } from 'lucide-react';

export function SeoSettings() {
  const { db, saveAdminData } = useAdminStore();
  const [formData, setFormData] = useState({
    metaTitle: '1D Brain Games - Mobile Puzzle & Focus Games',
    metaDescription: 'Discover handcrafted brain puzzles and reflex games designed for focus and fun.',
    keywords: 'brain games, mobile puzzles, focus games, saw dash, shift, paper plane puzzle',
    ogImage: '/screenshots/saw-dash/cover.png',
    indexing: true,
    analyticsId: ''
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (db?.settings?.seo) {
      setFormData({
        metaTitle: db.settings.seo.metaTitle || '1D Brain Games - Mobile Puzzle & Focus Games',
        metaDescription: db.settings.seo.metaDescription || '',
        keywords: db.settings.seo.keywords || '',
        ogImage: db.settings.seo.ogImage || '/screenshots/saw-dash/cover.png',
        indexing: db.settings.seo.indexing !== false,
        analyticsId: db.settings.seo.analyticsId || ''
      });
    }
  }, [db]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setSaving(true);
    setSavedSuccess(false);
    try {
      const updatedSettings = {
        ...db.settings,
        seo: formData
      };
      const success = await saveAdminData({
        ...db,
        settings: updatedSettings
      });
      if (success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err: any) {
      alert('Failed to save SEO settings: ' + (err?.message || 'Error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900">SEO Configuration</h1>
          <p className="text-gray-500 mt-1">Manage global search engine metadata, Open Graph preview, and indexing rules.</p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> SEO Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Save SEO'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Meta Tags */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Globe className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Search Engine Metadata</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Global Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="Site Title - Tagline"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Recommended length: 50-60 characters ({formData.metaTitle.length} chars)</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Global Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="A compelling description for search engine result snippets..."
                rows={3}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Recommended length: 140-160 characters ({formData.metaDescription.length} chars)</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Meta Keywords (Comma-separated)</label>
              <input
                type="text"
                value={formData.keywords}
                onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="brain games, puzzle games, shift, saw dash"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Sharing / Open Graph */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Search className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Social Share & Analytics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Social Preview Banner (OG Image URL)</label>
              <input
                type="text"
                value={formData.ogImage}
                onChange={e => setFormData({ ...formData, ogImage: e.target.value })}
                placeholder="/screenshots/saw-dash/cover.png"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none font-mono text-sm"
              />
              {formData.ogImage && (
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 aspect-[16/9] bg-gray-50 max-w-sm">
                  <img src={formData.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Google Analytics / Measurement ID</label>
                <input
                  type="text"
                  value={formData.analyticsId}
                  onChange={e => setFormData({ ...formData, analyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none font-mono text-sm"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <input
                    type="checkbox"
                    checked={formData.indexing}
                    onChange={e => setFormData({ ...formData, indexing: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded"
                  />
                  <div>
                    <span className="font-bold text-gray-800 text-sm block">Allow Search Engine Indexing</span>
                    <span className="text-xs text-gray-500">Uncheck to set robots meta tag to 'noindex, nofollow'</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

