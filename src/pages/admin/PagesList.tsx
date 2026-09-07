import React from 'react';
import { useAdminStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { FileText, Edit, Plus, Trash2 } from 'lucide-react';

export function PagesList() {
  const { db, deletePage } = useAdminStore();
  if (!db) return <div className="p-8">Loading pages...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Pages</h1>
          <p className="text-gray-500 mt-1">Manage global site pages and sections.</p>
        </div>
        <Link 
          to="/admin/pages/new" 
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" />
          Add Page
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-100">
          {db.pages?.map(page => (
            <div key={page.id} className="p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="font-bold text-gray-900">{page.name}</p>
                    <p className="text-xs text-gray-500">/{page.slug}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  {page.status}
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <Link to={`/admin/pages/${page.id}`} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                  <Edit className="w-5 h-5" />
                </Link>
                <button 
                  onClick={async () => {
                    if (confirm(`Are you sure you want to delete "${page.name}"?`)) {
                      await deletePage(page.id);
                    }
                  }} 
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-700">Page Name</th>
                <th className="px-6 py-4 font-bold text-gray-700">Slug</th>
                <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 font-bold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {db.pages?.map(page => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      <span className="font-bold text-gray-900">{page.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">/{page.slug}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        to={`/admin/pages/${page.id}`}
                        className="text-indigo-600 font-bold hover:text-indigo-800 text-sm"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete "${page.name}"?`)) {
                            await deletePage(page.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Delete Page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
