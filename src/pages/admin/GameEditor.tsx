import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/useStore';
import { Game } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { Save, ArrowLeft, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export function GameEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { db, addGame, updateGame, token } = useAdminStore();
  
  const [formData, setFormData] = useState<Game | null>(null);

  useEffect(() => {
    if (!db) return;
    if (id) {
      const existing = db.games.find(g => g.id === id);
      if (existing) setFormData(existing);
    } else {
      // Setup new game
      setFormData({
        id: uuidv4(),
        name: '',
        slug: '',
        tagline: '',
        shortDescription: '',
        longDescription: '',
        category: 'Puzzle',
        gameType: '',
        difficulty: 'Medium',
        tags: [],
        icon: '',
        coverImage: '',
        screenshots: [],
        features: [],
        howToPlay: [],
        audience: 'Everyone',
        storeLinks: {
          googlePlay: { enabled: true, buttonText: 'Google Play', url: '' },
          appStore: { enabled: true, buttonText: 'App Store', url: '' }
        },
        status: 'Draft',
        featured: false,
        sortOrder: db.games.length + 1,
        privacyPolicy: { enabled: false, title: '', content: '', lastUpdated: new Date().toISOString(), slug: '' },
        termsAndConditions: { enabled: false, title: '', content: '', lastUpdated: new Date().toISOString(), slug: '' },
        whatsapp: { enabled: false, message: '', number: '' },
        seo: { title: '', description: '', noIndex: false },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }, [id, db]);

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      const isNew = !id;
      let success = false;
      if (isNew) {
        success = await addGame(formData);
      } else {
        success = await updateGame({ ...formData, updatedAt: new Date().toISOString() });
      }
      if (success) {
        navigate('/admin/games');
      }
    } catch (err: any) {
      alert('Save failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  const [isUploading, setIsUploading] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      if (!res.ok) throw new Error('Status ' + res.status);
      const data = await res.json();
      return data.url;
    } catch (err: any) {
      console.error(err);
      alert('Upload failed: ' + (err.message || 'Server error'));
      return null;
    }
  };

  if (!formData) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/games')} className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-black text-gray-900">{id ? 'Edit Game' : 'Add Game'}</h1>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="flex items-center gap-2 bg-indigo-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? 'Saving...' : 'Save Game'}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
        {/* Basic Info */}
        <div>
          <h2 className="text-xl font-bold mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Game Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Slug</label>
              <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700">Tagline</label>
              <input type="text" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700">Short Description</label>
              <textarea value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-700">Long Description (HTML allowed)</label>
              <textarea value={formData.longDescription} onChange={e => setFormData({...formData, longDescription: e.target.value})} rows={6} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
            <div className="space-y-2 flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl border border-gray-200">
                <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded" />
                <span className="font-bold text-gray-700">Featured Game</span>
              </label>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Media & Static Assets */}
        <div>
          <h2 className="text-xl font-bold mb-2">Game Media & Static Assets</h2>
          <p className="text-sm text-gray-500 mb-6">Upload images directly or enter static file paths (e.g. <code>/screenshots/...</code> or <code>/uploads/...</code>).</p>
          
          <div className="space-y-8">
            {/* Game Icon */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-bold text-gray-800">Game Icon</label>
                  <p className="text-xs text-gray-500 mt-0.5">Recommended 512x512 square PNG image.</p>
                </div>
                <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold cursor-pointer transition-colors shadow-sm">
                  {isUploading === 'icon' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{isUploading === 'icon' ? 'Uploading...' : 'Upload Icon'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    disabled={isUploading === 'icon'}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploading('icon');
                      const url = await uploadImage(file);
                      if (url) setFormData({ ...formData, icon: url });
                      setIsUploading(null);
                      e.target.value = '';
                    }} 
                  />
                </label>
              </div>
              
              <div className="flex gap-4 items-center">
                {formData.icon ? (
                  <div className="relative group">
                    <img src={formData.icon} alt="Game Icon" className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-200 shadow-md bg-black/10" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, icon: '' })} 
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Icon"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-white">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                  </div>
                )}
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Static URL / Path</label>
                  <input 
                    type="text" 
                    value={formData.icon} 
                    onChange={e => setFormData({ ...formData, icon: e.target.value })} 
                    placeholder="/screenshots/paper-plane-puzzle/icon.png"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 font-mono mt-1" 
                  />
                </div>
              </div>
            </div>

            {/* Cover Banner */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-bold text-gray-800">Cover Banner Image</label>
                  <p className="text-xs text-gray-500 mt-0.5">Recommended 1024x500 or 1200x600 landscape banner.</p>
                </div>
                <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold cursor-pointer transition-colors shadow-sm">
                  {isUploading === 'cover' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{isUploading === 'cover' ? 'Uploading...' : 'Upload Cover'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    disabled={isUploading === 'cover'}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploading('cover');
                      const url = await uploadImage(file);
                      if (url) setFormData({ ...formData, coverImage: url });
                      setIsUploading(null);
                      e.target.value = '';
                    }} 
                  />
                </label>
              </div>

              <div className="space-y-3">
                {formData.coverImage && (
                  <div className="relative group max-w-md">
                    <img src={formData.coverImage} alt="Cover Banner" className="w-full h-40 rounded-2xl object-cover border border-gray-300 shadow-sm" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, coverImage: '' })} 
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow-md hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Cover"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase">Static URL / Path</label>
                  <input 
                    type="text" 
                    value={formData.coverImage} 
                    onChange={e => setFormData({ ...formData, coverImage: e.target.value })} 
                    placeholder="/screenshots/paper-plane-puzzle/cover.png"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 font-mono mt-1" 
                  />
                </div>
              </div>
            </div>

            {/* Screenshots */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-bold text-gray-800">Screenshots ({formData.screenshots.length})</label>
                  <p className="text-xs text-gray-500 mt-0.5">Upload phone gameplay screenshots. Users can swipe through them on the game detail page.</p>
                </div>
                <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold cursor-pointer transition-colors shadow-sm">
                  {isUploading === 'screenshots' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{isUploading === 'screenshots' ? 'Uploading...' : 'Upload Screenshot(s)'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    className="hidden" 
                    disabled={isUploading === 'screenshots'}
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      setIsUploading('screenshots');
                      const newUrls: string[] = [];
                      for (let i = 0; i < files.length; i++) {
                        const url = await uploadImage(files[i]);
                        if (url) newUrls.push(url);
                      }
                      if (newUrls.length > 0) {
                        setFormData({
                          ...formData,
                          screenshots: [...formData.screenshots, ...newUrls]
                        });
                      }
                      setIsUploading(null);
                      e.target.value = '';
                    }} 
                  />
                </label>
              </div>

              {formData.screenshots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                  {formData.screenshots.map((src, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-300 aspect-[9/16] bg-black/10">
                      <img src={src} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button" 
                          onClick={() => {
                            setFormData({
                              ...formData,
                              screenshots: formData.screenshots.filter((_, i) => i !== idx)
                            });
                          }}
                          className="bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors shadow-lg"
                          title="Delete screenshot"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-400 bg-white">
                  <p className="text-sm font-medium">No screenshots added yet. Click above to upload.</p>
                </div>
              )}

              <div className="pt-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Manual URL / Path List (Comma-separated)</label>
                <textarea 
                  value={formData.screenshots.join(',\n')} 
                  onChange={e => setFormData({
                    ...formData, 
                    screenshots: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })} 
                  rows={3} 
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-gray-300 mt-1" 
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Store Links */}
        <div>
          <h2 className="text-xl font-bold mb-6">Store Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.storeLinks.googlePlay.enabled} onChange={e => setFormData({...formData, storeLinks: { ...formData.storeLinks, googlePlay: { ...formData.storeLinks.googlePlay, enabled: e.target.checked } }})} className="w-5 h-5 text-indigo-600 rounded" />
                <span className="font-bold text-gray-700">Enable Google Play</span>
              </label>
              <input type="text" placeholder="Button Text" value={formData.storeLinks.googlePlay.buttonText} onChange={e => setFormData({...formData, storeLinks: { ...formData.storeLinks, googlePlay: { ...formData.storeLinks.googlePlay, buttonText: e.target.value } }})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" />
              <input type="text" placeholder="URL" value={formData.storeLinks.googlePlay.url} onChange={e => setFormData({...formData, storeLinks: { ...formData.storeLinks, googlePlay: { ...formData.storeLinks.googlePlay, url: e.target.value } }})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" />
            </div>
            <div className="space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.storeLinks.appStore.enabled} onChange={e => setFormData({...formData, storeLinks: { ...formData.storeLinks, appStore: { ...formData.storeLinks.appStore, enabled: e.target.checked } }})} className="w-5 h-5 text-indigo-600 rounded" />
                <span className="font-bold text-gray-700">Enable App Store</span>
              </label>
              <input type="text" placeholder="Button Text" value={formData.storeLinks.appStore.buttonText} onChange={e => setFormData({...formData, storeLinks: { ...formData.storeLinks, appStore: { ...formData.storeLinks.appStore, buttonText: e.target.value } }})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" />
              <input type="text" placeholder="URL" value={formData.storeLinks.appStore.url} onChange={e => setFormData({...formData, storeLinks: { ...formData.storeLinks, appStore: { ...formData.storeLinks.appStore, url: e.target.value } }})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none" />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />
        
        {/* Visual Identity */}
        <div>
          <h2 className="text-xl font-bold mb-6">Visual Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Accent Color</label>
              <div className="flex gap-4">
                <input type="color" value={formData.accentColor || '#FF3D00'} onChange={e => setFormData({...formData, accentColor: e.target.value})} className="w-12 h-12 rounded cursor-pointer" />
                <input type="text" value={formData.accentColor || ''} onChange={e => setFormData({...formData, accentColor: e.target.value})} placeholder="#FF3D00" className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none uppercase" />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Content Elements */}
        <div>
          <h2 className="text-xl font-bold mb-6">Game Content Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* What Is It */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">What Is It? (One per line)</label>
              <textarea 
                rows={5} 
                value={formData.whatIsIt?.join('\n') || ''} 
                onChange={e => setFormData({...formData, whatIsIt: e.target.value.split('\n').filter(s => s.trim() !== '')})} 
                placeholder="Quick decisions\nSimple controls" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none" 
              />
            </div>

            {/* Audience Cards */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Audience Cards (One per line)</label>
              <textarea 
                rows={5} 
                value={formData.audienceCards?.join('\n') || ''} 
                onChange={e => setFormData({...formData, audienceCards: e.target.value.split('\n').filter(s => s.trim() !== '')})} 
                placeholder="Puzzle Lovers\nCasual Players" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none" 
              />
            </div>

                        {/* How To Play Builder */}
            <div className="space-y-4 md:col-span-2 p-6 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-800">How To Play (Steps)</h3>
                <button 
                  onClick={() => setFormData({...formData, howToPlay: [...(formData.howToPlay || []), { id: `htp_${Date.now()}`, title: '', description: '', image: '' }]})}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold"
                >
                  + Add Step
                </button>
              </div>
              <div className="space-y-4">
                {(formData.howToPlay || []).map((step, idx) => (
                  <div key={step.id} className="p-4 bg-white border border-gray-200 rounded-xl relative">
                    <button 
                      onClick={() => setFormData({...formData, howToPlay: formData.howToPlay.filter((_, i) => i !== idx)})}
                      className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      X
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                        <input type="text" value={step.title} onChange={e => {
                          const newHtp = [...formData.howToPlay];
                          newHtp[idx].title = e.target.value;
                          setFormData({...formData, howToPlay: newHtp});
                        }} className="w-full px-3 py-2 rounded-lg border border-gray-300 mt-1" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Image URL (optional)</label>
                        <input type="text" value={step.image} onChange={e => {
                          const newHtp = [...formData.howToPlay];
                          newHtp[idx].image = e.target.value;
                          setFormData({...formData, howToPlay: newHtp});
                        }} className="w-full px-3 py-2 rounded-lg border border-gray-300 mt-1" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea value={step.description} onChange={e => {
                          const newHtp = [...formData.howToPlay];
                          newHtp[idx].description = e.target.value;
                          setFormData({...formData, howToPlay: newHtp});
                        }} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-300 mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
                {(!formData.howToPlay || formData.howToPlay.length === 0) && (
                  <div className="text-sm text-gray-500 italic text-center py-4">No steps added.</div>
                )}
              </div>
            </div>
            
{/* Why Play */}
            <div className="space-y-4 md:col-span-2 p-6 bg-gray-50 border border-gray-200 rounded-xl">
              <h3 className="font-bold text-gray-800">Why Play Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Heading</label>
                  <input type="text" value={formData.whyPlay?.heading || ''} onChange={e => setFormData({...formData, whyPlay: { ...formData.whyPlay, heading: e.target.value } as any})} className="w-full px-3 py-2 rounded-lg border border-gray-300" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Subheading</label>
                  <input type="text" value={formData.whyPlay?.subheading || ''} onChange={e => setFormData({...formData, whyPlay: { ...formData.whyPlay, subheading: e.target.value } as any})} className="w-full px-3 py-2 rounded-lg border border-gray-300" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Points (One per line)</label>
                  <textarea rows={3} value={formData.whyPlay?.points?.join('\n') || ''} onChange={e => setFormData({...formData, whyPlay: { ...formData.whyPlay, points: e.target.value.split('\n').filter(s=>s.trim() !== '') } as any})} className="w-full px-3 py-2 rounded-lg border border-gray-300" />
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Dynamic Sections Control */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Dynamic Sections Layout</h2>
              <p className="text-sm text-gray-500">Add, configure, and reorder sections on the game detail page.</p>
            </div>
            <button
              onClick={() => {
                const newSection = {
                  id: `sec_${Date.now()}`,
                  type: 'hero',
                  visible: true,
                  order: (formData.sectionOrder?.length || 0) + 1,
                  config: {}
                };
                setFormData({
                  ...formData,
                  sectionOrder: [...(formData.sectionOrder || []), newSection]
                });
              }}
              className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold hover:bg-indigo-200 transition-colors"
            >
              + Add Section
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.sectionOrder?.sort((a,b) => a.order - b.order).map((section, index) => (
              <div key={section.id} className="flex flex-col gap-4 p-5 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-4">
                  <input type="checkbox" checked={section.visible} onChange={e => {
                    const newOrder = [...formData.sectionOrder];
                    const i = newOrder.findIndex(s => s.id === section.id);
                    if(i >= 0) newOrder[i].visible = e.target.checked;
                    setFormData({...formData, sectionOrder: newOrder});
                  }} className="w-5 h-5 text-indigo-600 rounded" />
                  
                  <select 
                    value={section.type} 
                    onChange={e => {
                      const newOrder = [...formData.sectionOrder];
                      const i = newOrder.findIndex(s => s.id === section.id);
                      if(i >= 0) newOrder[i].type = e.target.value;
                      setFormData({...formData, sectionOrder: newOrder});
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 font-bold text-gray-800 capitalize"
                  >
                    <option value="hero">Hero</option>
                    <option value="infoStrip">Info Strip</option>
                    <option value="whatIsIt">What Is It?</option>
                    <option value="howItWorks">How It Works</option>
                    <option value="features">Features</option>
                    <option value="screenshots">Screenshots</option>
                    <option value="audience">Audience</option>
                    <option value="whyPlay">Why Play?</option>
                    <option value="storeCta">Store CTA</option>
                    <option value="moreGames">More Games</option>
                    <option value="bentoGrid">Bento Grid</option>
                    <option value="customHtml">Custom HTML</option>
                    <option value="numberedSteps">Numbered Steps</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Order:</span>
                    <input type="number" value={section.order} onChange={e => {
                      const newOrder = [...formData.sectionOrder];
                      const i = newOrder.findIndex(s => s.id === section.id);
                      if(i >= 0) newOrder[i].order = parseInt(e.target.value) || 0;
                      setFormData({...formData, sectionOrder: newOrder});
                    }} className="w-16 px-2 py-2 rounded-lg border border-gray-300 text-center" />
                  </div>

                  <button
                    onClick={() => {
                      if(confirm('Delete this section?')) {
                        setFormData({
                          ...formData,
                          sectionOrder: formData.sectionOrder.filter(s => s.id !== section.id)
                        });
                      }
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>

                {/* Section Specific Config */}
                {/* Custom Editors */}
                {section.type === 'customHtml' && (
                  <div className="ml-9 p-4 bg-white border border-gray-100 rounded-lg space-y-4">
                    <h4 className="font-bold text-sm text-gray-700">Custom HTML Configuration</h4>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">HTML Content</label>
                      <textarea
                        value={section.config?.html || ''}
                        onChange={e => {
                          const newOrder = [...formData.sectionOrder];
                          newOrder[index].config = { ...newOrder[index].config, html: e.target.value };
                          setFormData({...formData, sectionOrder: newOrder});
                        }}
                        rows={6}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono text-sm"
                      />
                    </div>
                  </div>
                )}
                
                {section.type === 'bentoGrid' && (
                  <div className="ml-9 p-4 bg-white border border-gray-100 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-gray-700">Bento Grid Configuration</h4>
                      <button 
                        onClick={() => {
                          const newOrder = [...formData.sectionOrder];
                          const items = newOrder[index].config?.items || [];
                          newOrder[index].config = { ...newOrder[index].config, items: [...items, { title: '', content: '', colSpan: 1, rowSpan: 1, color: '#0A051A' }] };
                          setFormData({...formData, sectionOrder: newOrder});
                        }}
                        className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"
                      >
                        + Add Bento Item
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {(section.config?.items || []).map((item: any, i: number) => (
                        <div key={i} className="p-3 bg-gray-50 border border-gray-200 rounded relative">
                          <button 
                            onClick={() => {
                              const newOrder = [...formData.sectionOrder];
                              const items = [...newOrder[index].config.items];
                              items.splice(i, 1);
                              newOrder[index].config.items = items;
                              setFormData({...formData, sectionOrder: newOrder});
                            }}
                            className="absolute top-2 right-2 text-red-500"
                          >
                            X
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mr-6">
                            <div>
                              <label className="text-xs font-bold text-gray-500">Title</label>
                              <input type="text" value={item.title || ''} onChange={e => {
                                const newOrder = [...formData.sectionOrder];
                                newOrder[index].config.items[i].title = e.target.value;
                                setFormData({...formData, sectionOrder: newOrder});
                              }} className="w-full px-2 py-1 text-sm border rounded" />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500">Bg Color</label>
                              <input type="text" value={item.color || ''} onChange={e => {
                                const newOrder = [...formData.sectionOrder];
                                newOrder[index].config.items[i].color = e.target.value;
                                setFormData({...formData, sectionOrder: newOrder});
                              }} className="w-full px-2 py-1 text-sm border rounded" />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500">Col Span</label>
                              <input type="number" value={item.colSpan || 1} onChange={e => {
                                const newOrder = [...formData.sectionOrder];
                                newOrder[index].config.items[i].colSpan = parseInt(e.target.value);
                                setFormData({...formData, sectionOrder: newOrder});
                              }} className="w-full px-2 py-1 text-sm border rounded" />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500">Row Span</label>
                              <input type="number" value={item.rowSpan || 1} onChange={e => {
                                const newOrder = [...formData.sectionOrder];
                                newOrder[index].config.items[i].rowSpan = parseInt(e.target.value);
                                setFormData({...formData, sectionOrder: newOrder});
                              }} className="w-full px-2 py-1 text-sm border rounded" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section.type === 'numberedSteps' && (
                  <div className="ml-9 p-4 bg-white border border-gray-100 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-gray-700">Numbered Steps Overrides</h4>
                    </div>
                    <p className="text-xs text-gray-500">This overrides the default "How To Play" steps with custom numbers and layouts.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Override Title</label>
                        <input
                          type="text"
                          value={section.config?.title || ''}
                          onChange={e => {
                            const newOrder = [...formData.sectionOrder];
                            newOrder[index].config = { ...newOrder[index].config, title: e.target.value };
                            setFormData({...formData, sectionOrder: newOrder});
                          }}
                          className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Style</label>
                        <select
                          value={section.config?.style || 'vertical'}
                          onChange={e => {
                            const newOrder = [...formData.sectionOrder];
                            newOrder[index].config = { ...newOrder[index].config, style: e.target.value };
                            setFormData({...formData, sectionOrder: newOrder});
                          }}
                          className="w-full px-3 py-2 rounded border border-gray-300 text-sm"
                        >
                          <option value="vertical">Vertical Timeline</option>
                          <option value="horizontal">Horizontal Grid</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {section.type === 'hero' && (
                  <div className="ml-9 p-4 bg-white border border-gray-100 rounded-lg space-y-4">
                    <h4 className="font-bold text-sm text-gray-700">Hero Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Layout</label>
                        <select 
                          value={section.config?.layout || 'asymmetric'}
                          onChange={e => {
                            const newOrder = [...formData.sectionOrder];
                            const i = newOrder.findIndex(s => s.id === section.id);
                            if(i >= 0) newOrder[i].config = { ...newOrder[i].config, layout: e.target.value };
                            setFormData({...formData, sectionOrder: newOrder});
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                        >
                          <option value="asymmetric">Asymmetric</option>
                          <option value="centered">Centered</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Heading Override (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="Uses game name if empty"
                          value={section.config?.heading || ''}
                          onChange={e => {
                            const newOrder = [...formData.sectionOrder];
                            const i = newOrder.findIndex(s => s.id === section.id);
                            if(i >= 0) newOrder[i].config = { ...newOrder[i].config, heading: e.target.value };
                            setFormData({...formData, sectionOrder: newOrder});
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Background Image Override (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="Uses cover image if empty"
                          value={section.config?.bgImage || ''}
                          onChange={e => {
                            const newOrder = [...formData.sectionOrder];
                            const i = newOrder.findIndex(s => s.id === section.id);
                            if(i >= 0) newOrder[i].config = { ...newOrder[i].config, bgImage: e.target.value };
                            setFormData({...formData, sectionOrder: newOrder});
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {formData.sectionOrder?.length === 0 && (
              <div className="text-center p-8 text-gray-500 italic bg-gray-50 rounded-xl border border-gray-200">
                No sections added. Click "+ Add Section" to start building this page.
              </div>
            )}
          </div>
        </div>

        <hr className="border-gray-100" />
        
        {/* Features & Privacy */}
        <div>
          <h2 className="text-xl font-bold mb-6">Features JSON (Advanced)</h2>
          <textarea value={JSON.stringify(formData.features, null, 2)} onChange={e => { try { setFormData({...formData, features: JSON.parse(e.target.value)}) } catch(e){} }} rows={6} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none font-mono text-sm" />
          
          <h2 className="text-xl font-bold mt-8 mb-6">Game Privacy Policy</h2>
          <div className="space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-200">
             <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.privacyPolicy.enabled} onChange={e => setFormData({...formData, privacyPolicy: { ...formData.privacyPolicy, enabled: e.target.checked }})} className="w-5 h-5 text-indigo-600 rounded" />
                <span className="font-bold text-gray-700">Enable Individual Game Privacy Policy</span>
              </label>
              {formData.privacyPolicy.enabled && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Policy Title</label>
                    <input type="text" value={formData.privacyPolicy.title} onChange={e => setFormData({...formData, privacyPolicy: { ...formData.privacyPolicy, title: e.target.value }})} className="w-full px-3 py-2 rounded-lg border border-gray-300 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Slug</label>
                    <input type="text" value={formData.privacyPolicy.slug} onChange={e => setFormData({...formData, privacyPolicy: { ...formData.privacyPolicy, slug: e.target.value }})} className="w-full px-3 py-2 rounded-lg border border-gray-300 mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-500 uppercase">Policy Content (Plain text or HTML)</label>
                      <span className="text-[11px] text-indigo-600 font-medium">Tip: Just copy & paste as-is. Paragraphs & line breaks are preserved cleanly.</span>
                    </div>
                    <textarea 
                      value={formData.privacyPolicy.content} 
                      onChange={e => setFormData({...formData, privacyPolicy: { ...formData.privacyPolicy, content: e.target.value }})} 
                      rows={12} 
                      placeholder="Paste your game's full privacy policy here as plain text or HTML..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 font-sans text-sm mt-1 focus:ring-2 focus:ring-indigo-600 outline-none leading-relaxed" 
                    />
                  </div>
                </div>
              )}
          </div>
          <h2 className="text-xl font-bold mt-8 mb-6">Game Terms & Conditions</h2>
          <div className="space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-200">
             <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.termsAndConditions?.enabled} onChange={e => setFormData({...formData, termsAndConditions: { ...formData.termsAndConditions, enabled: e.target.checked }} as any)} className="w-5 h-5 text-indigo-600 rounded" />
                <span className="font-bold text-gray-700">Enable Individual Game Terms & Conditions</span>
              </label>
              {formData.termsAndConditions?.enabled && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Terms Title</label>
                    <input type="text" value={formData.termsAndConditions.title} onChange={e => setFormData({...formData, termsAndConditions: { ...formData.termsAndConditions, title: e.target.value }} as any)} className="w-full px-3 py-2 rounded-lg border border-gray-300 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Slug</label>
                    <input type="text" value={formData.termsAndConditions.slug} onChange={e => setFormData({...formData, termsAndConditions: { ...formData.termsAndConditions, slug: e.target.value }} as any)} className="w-full px-3 py-2 rounded-lg border border-gray-300 mt-1" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-500 uppercase">Terms Content (Plain text or HTML)</label>
                      <span className="text-[11px] text-indigo-600 font-medium">Tip: Just copy & paste as-is. Paragraphs & line breaks are preserved cleanly.</span>
                    </div>
                    <textarea 
                      value={formData.termsAndConditions.content} 
                      onChange={e => setFormData({...formData, termsAndConditions: { ...formData.termsAndConditions, content: e.target.value }} as any)} 
                      rows={12} 
                      placeholder="Paste your terms & conditions here as plain text or HTML..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 font-sans text-sm mt-1 focus:ring-2 focus:ring-indigo-600 outline-none leading-relaxed" 
                    />
                  </div>
                </div>
              )}
          </div>

          <h2 className="text-xl font-bold mt-8 mb-6">WhatsApp Contact CTA</h2>
          <div className="space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-200">
             <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.whatsapp?.enabled} onChange={e => setFormData({...formData, whatsapp: { ...formData.whatsapp, enabled: e.target.checked }} as any)} className="w-5 h-5 text-indigo-600 rounded" />
                <span className="font-bold text-gray-700">Enable WhatsApp CTA on this game</span>
              </label>
              {formData.whatsapp?.enabled && (
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Phone Number (optional override)</label>
                    <input type="text" placeholder="Leaves empty to use global setting" value={formData.whatsapp.number || ''} onChange={e => setFormData({...formData, whatsapp: { ...formData.whatsapp, number: e.target.value }} as any)} className="w-full px-3 py-2 rounded-lg border border-gray-300 mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Pre-filled Message</label>
                    <input type="text" placeholder="e.g. Hi, I want to know more about this game." value={formData.whatsapp.message} onChange={e => setFormData({...formData, whatsapp: { ...formData.whatsapp, message: e.target.value }} as any)} className="w-full px-3 py-2 rounded-lg border border-gray-300 mt-1" />
                  </div>
                </div>
              )}
          </div>

        </div>
      </div>
    </div>
  );
}
