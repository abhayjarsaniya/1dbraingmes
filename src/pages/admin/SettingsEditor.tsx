import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/useStore';
import { SiteSettings } from '../../types';

export function SettingsEditor() {
  const { db, saveAdminData } = useAdminStore();
  const [formData, setFormData] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (db && db.settings) {
      setFormData(db.settings);
    }
  }, [db]);

  if (!formData) return <div className="p-8">Loading settings...</div>;

  const handleSave = () => {
    if (!db) return;
    saveAdminData({
      ...db,
      settings: formData
    });
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Global Settings</h1>
          <p className="text-gray-500 mt-1">Manage header, footer, global CTAs, and company details.</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          Save Changes
        </button>
      </div>

      <div className="space-y-8">
        {/* Branding */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-6">Brand Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Header Logo Text</label>
              <input
                type="text"
                value={formData.header.logoText}
                onChange={e => setFormData({ ...formData, header: { ...formData.header, logoText: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Header Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Header Navigation</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-bold text-gray-600">Enable Header</span>
              <input
                type="checkbox"
                checked={formData.header.enabled}
                onChange={e => setFormData({ ...formData, header: { ...formData.header, enabled: e.target.checked } })}
                className="w-5 h-5 text-indigo-600 rounded"
              />
            </label>
          </div>
          <div className="space-y-4">
            {formData.header.navigation.sort((a, b) => a.order - b.order).map((nav, index) => (
              <div key={nav.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  checked={nav.visible}
                  onChange={e => {
                    const newNav = [...formData.header.navigation];
                    newNav[index].visible = e.target.checked;
                    setFormData({ ...formData, header: { ...formData.header, navigation: newNav } });
                  }}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
                <input
                  type="text"
                  value={nav.label}
                  onChange={e => {
                    const newNav = [...formData.header.navigation];
                    newNav[index].label = e.target.value;
                    setFormData({ ...formData, header: { ...formData.header, navigation: newNav } });
                  }}
                  className="w-1/3 px-3 py-2 rounded-lg border border-gray-300"
                />
                <input
                  type="text"
                  value={nav.url}
                  onChange={e => {
                    const newNav = [...formData.header.navigation];
                    newNav[index].url = e.target.value;
                    setFormData({ ...formData, header: { ...formData.header, navigation: newNav } });
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
                />
                <input
                  type="number"
                  value={nav.order}
                  onChange={e => {
                    const newNav = [...formData.header.navigation];
                    newNav[index].order = parseInt(e.target.value) || 0;
                    setFormData({ ...formData, header: { ...formData.header, navigation: newNav } });
                  }}
                  className="w-20 px-3 py-2 rounded-lg border border-gray-300 text-center"
                />
              </div>
            ))}
          </div>

          {/* Header CTA */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="font-bold mb-4">Header CTA Button</h3>
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={formData.header.cta.enabled}
                onChange={e => setFormData({ ...formData, header: { ...formData.header, cta: { ...formData.header.cta, enabled: e.target.checked } } })}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <input
                type="text"
                value={formData.header.cta.text}
                onChange={e => setFormData({ ...formData, header: { ...formData.header, cta: { ...formData.header.cta, text: e.target.value } } })}
                placeholder="Button Text"
                className="w-1/3 px-3 py-2 rounded-lg border border-gray-300"
              />
              <input
                type="text"
                value={formData.header.cta.url}
                onChange={e => setFormData({ ...formData, header: { ...formData.header, cta: { ...formData.header.cta, url: e.target.value } } })}
                placeholder="Target URL"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
              />
            </div>
          </div>
        </div>


        {/* Global WhatsApp Contact */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Global WhatsApp Contact</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-bold text-gray-600">Enable</span>
              <input
                type="checkbox"
                checked={formData.whatsapp?.enabled}
                onChange={e => setFormData({ ...formData, whatsapp: { ...formData.whatsapp, enabled: e.target.checked } } as any)}
                className="w-5 h-5 text-indigo-600 rounded"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="text-sm font-bold text-gray-700">Phone Number (with Country Code)</label>
              <input
                type="text"
                placeholder="e.g. 1234567890"
                value={formData.whatsapp?.number || ''}
                onChange={e => setFormData({ ...formData, whatsapp: { ...formData.whatsapp, number: e.target.value } } as any)}
                className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-300 outline-none"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="text-sm font-bold text-gray-700">Default Message</label>
              <input
                type="text"
                value={formData.whatsapp?.defaultMessage || ''}
                onChange={e => setFormData({ ...formData, whatsapp: { ...formData.whatsapp, defaultMessage: e.target.value } } as any)}
                className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-300 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Global CTA */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Global Bottom CTA</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-bold text-gray-600">Enable</span>
              <input
                type="checkbox"
                checked={formData.globalCta.enabled}
                onChange={e => setFormData({ ...formData, globalCta: { ...formData.globalCta, enabled: e.target.checked } })}
                className="w-5 h-5 text-indigo-600 rounded"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-bold text-gray-700">Heading</label>
              <input
                type="text"
                value={formData.globalCta.heading}
                onChange={e => setFormData({ ...formData, globalCta: { ...formData.globalCta, heading: e.target.value } })}
                className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-300 outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-bold text-gray-700">Description</label>
              <textarea
                value={formData.globalCta.description}
                onChange={e => setFormData({ ...formData, globalCta: { ...formData.globalCta, description: e.target.value } })}
                className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-300 outline-none"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Button Text</label>
              <input
                type="text"
                value={formData.globalCta.buttonText}
                onChange={e => setFormData({ ...formData, globalCta: { ...formData.globalCta, buttonText: e.target.value } })}
                className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-300 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Button URL</label>
              <input
                type="text"
                value={formData.globalCta.buttonUrl}
                onChange={e => setFormData({ ...formData, globalCta: { ...formData.globalCta, buttonUrl: e.target.value } })}
                className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-300 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Global Store Links Strip */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Global Store Strip</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-bold text-gray-600">Enable</span>
              <input
                type="checkbox"
                checked={formData.globalStoreLinks.stripEnabled}
                onChange={e => setFormData({ ...formData, globalStoreLinks: { ...formData.globalStoreLinks, stripEnabled: e.target.checked } })}
                className="w-5 h-5 text-indigo-600 rounded"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-bold text-gray-700">Strip Text</label>
              <input
                type="text"
                value={formData.globalStoreLinks.stripText}
                onChange={e => setFormData({ ...formData, globalStoreLinks: { ...formData.globalStoreLinks, stripText: e.target.value } })}
                className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-300 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Google Play URL</label>
              <input
                type="text"
                value={formData.globalStoreLinks.googlePlayUrl}
                onChange={e => setFormData({ ...formData, globalStoreLinks: { ...formData.globalStoreLinks, googlePlayUrl: e.target.value } })}
                className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-300 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">App Store URL</label>
              <input
                type="text"
                value={formData.globalStoreLinks.appStoreUrl}
                onChange={e => setFormData({ ...formData, globalStoreLinks: { ...formData.globalStoreLinks, appStoreUrl: e.target.value } })}
                className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-300 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Footer</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm font-bold text-gray-600">Enable</span>
              <input
                type="checkbox"
                checked={formData.footer.enabled}
                onChange={e => setFormData({ ...formData, footer: { ...formData.footer, enabled: e.target.checked } })}
                className="w-5 h-5 text-indigo-600 rounded"
              />
            </label>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700">Description</label>
              <textarea
                value={formData.footer.description}
                onChange={e => setFormData({ ...formData, footer: { ...formData.footer, description: e.target.value } })}
                className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-300 outline-none"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">Copyright Text</label>
              <input
                type="text"
                value={formData.footer.copyrightText}
                onChange={e => setFormData({ ...formData, footer: { ...formData.footer, copyrightText: e.target.value } })}
                className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-300 outline-none"
              />
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-bold mb-4">Social Links</h3>
              {formData.footer.socialLinks.map((social, index) => (
                <div key={social.platform} className="flex items-center gap-4 mb-2">
                  <input
                    type="checkbox"
                    checked={social.visible}
                    onChange={e => {
                      const newLinks = [...formData.footer.socialLinks];
                      newLinks[index].visible = e.target.checked;
                      setFormData({ ...formData, footer: { ...formData.footer, socialLinks: newLinks } });
                    }}
                    className="w-5 h-5 text-indigo-600 rounded"
                  />
                  <span className="w-24 font-bold text-gray-700">{social.platform}</span>
                  <input
                    type="text"
                    value={social.url}
                    onChange={e => {
                      const newLinks = [...formData.footer.socialLinks];
                      newLinks[index].url = e.target.value;
                      setFormData({ ...formData, footer: { ...formData.footer, socialLinks: newLinks } });
                    }}
                    placeholder={`${social.platform} URL`}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
