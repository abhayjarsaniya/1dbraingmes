import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../store/useStore';
import { Upload, Copy, Check, Image as ImageIcon, Loader2 } from 'lucide-react';

interface MediaItem {
  url: string;
  name: string;
  size: number;
  modified: string;
  category: string;
}

export function MediaList() {
  const { token, db } = useAdminStore();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const items = await res.json();
        setMedia(items);
      }
    } catch (err) {
      console.error('Failed to fetch media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [token]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append('image', files[i]);
        await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        });
      }
      await fetchMedia();
    } catch (err: any) {
      alert('Upload failed: ' + (err?.message || 'Error'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const categories = ['All', ...new Set(media.map(m => m.category))];
  const filtered = filter === 'All' ? media : media.filter(m => m.category === filter);

  return (
    <div className="p-8 max-w-7xl mx-auto pb-32 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Media Library</h1>
          <p className="text-gray-500 mt-1">Upload and manage static game assets, covers, icons, and banners.</p>
        </div>

        <label className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-600/20 cursor-pointer">
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={uploading}
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-4 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              filter === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat} {cat === 'All' ? `(${media.length})` : `(${media.filter(m => m.category === cat).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="font-bold text-lg text-gray-700">No media assets found</p>
          <p className="text-sm">Click "Upload Media" to add your first asset.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden flex items-center justify-center p-2">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm">
                  {item.category}
                </span>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-800 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {(item.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  onClick={() => copyToClipboard(item.url)}
                  className={`mt-2.5 w-full py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    copiedUrl === item.url
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  {copiedUrl === item.url ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedUrl === item.url ? 'Copied!' : 'Copy Path'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

