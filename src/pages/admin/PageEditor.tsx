import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/useStore';
import { useParams, useNavigate } from 'react-router-dom';
import { Page, PageSection } from '../../types';

export function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const { db, saveAdminData } = useAdminStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Page | null>(null);

  useEffect(() => {
    if (db && db.pages) {
      const page = db.pages.find(p => p.id === id);
      if (page) {
        setFormData(page);
      }
    }
  }, [db, id]);

  if (!formData) return <div className="p-8">Loading...</div>;

  const handleSave = () => {
    if (!db) return;
    saveAdminData({
      ...db,
      pages: db.pages.map(p => p.id === formData.id ? formData : p)
    });
    alert('Page saved successfully!');
    navigate('/admin/pages');
  };

  const addSection = () => {
    const newSection: PageSection = {
      id: `sec_${Date.now()}`,
      type: 'richText',
      title: 'New Section',
      description: '',
      content: '',
      image: '',
      buttons: [],
      visible: true,
      sortOrder: (formData.sections?.length || 0) + 1,
      settings: {}
    };
    setFormData({ ...formData, sections: [...(formData.sections || []), newSection] });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Edit Page: {formData.name}</h1>
          <p className="text-gray-500 mt-1">Manage SEO and content sections.</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
        >
          Save Page
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold mb-6">Page Settings</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-bold text-gray-700">SEO Title</label>
            <input
              type="text"
              value={formData.seo.title}
              onChange={e => setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } })}
              className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-300 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700">SEO Description</label>
            <input
              type="text"
              value={formData.seo.description}
              onChange={e => setFormData({ ...formData, seo: { ...formData.seo, description: e.target.value } })}
              className="w-full px-4 py-2 mt-1 rounded-xl border border-gray-300 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-gray-900">Content Sections</h2>
        <button onClick={addSection} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">
          + Add Section
        </button>
      </div>

      <div className="space-y-6">
        {formData.sections.sort((a,b) => a.sortOrder - b.sortOrder).map((section, index) => (
          <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <input 
                type="checkbox" 
                checked={section.visible}
                onChange={e => {
                  const newSecs = [...formData.sections];
                  newSecs[index].visible = e.target.checked;
                  setFormData({ ...formData, sections: newSecs });
                }}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <span className="font-bold text-gray-700 w-24">{section.type}</span>
              <input
                type="number"
                value={section.sortOrder}
                onChange={e => {
                  const newSecs = [...formData.sections];
                  newSecs[index].sortOrder = parseInt(e.target.value) || 0;
                  setFormData({ ...formData, sections: newSecs });
                }}
                className="w-16 px-2 py-1 text-center rounded border border-gray-300"
              />
              <button
                onClick={() => {
                  if (confirm('Delete section?')) {
                    setFormData({ ...formData, sections: formData.sections.filter(s => s.id !== section.id) });
                  }
                }}
                className="ml-auto text-red-500 font-bold px-3 py-1 bg-red-50 rounded-lg hover:bg-red-100"
              >
                Delete
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Section Title</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={e => {
                    const newSecs = [...formData.sections];
                    newSecs[index].title = e.target.value;
                    setFormData({ ...formData, sections: newSecs });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 mt-1"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Description / Subtitle</label>
                <textarea
                  value={section.description}
                  onChange={e => {
                    const newSecs = [...formData.sections];
                    newSecs[index].description = e.target.value;
                    setFormData({ ...formData, sections: newSecs });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 mt-1"
                  rows={2}
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Content (HTML allowed)</label>
                <textarea
                  value={section.content}
                  onChange={e => {
                    const newSecs = [...formData.sections];
                    newSecs[index].content = e.target.value;
                    setFormData({ ...formData, sections: newSecs });
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 mt-1 font-mono text-sm"
                  rows={5}
                />
              </div>
            </div>
          </div>
        ))}
        
        {formData.sections.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 italic">
            No sections added to this page.
          </div>
        )}
      </div>
    </div>
  );
}
