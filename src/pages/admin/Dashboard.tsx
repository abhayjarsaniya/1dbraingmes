import React from 'react';
import { useAdminStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { Gamepad2, Eye, EyeOff, FileText, Settings } from 'lucide-react';

export function Dashboard() {
  const { db } = useAdminStore();
  if (!db) return null;

  const stats = [
    { label: 'Total Games', value: db.games.length, icon: Gamepad2, color: 'bg-blue-500' },
    { label: 'Published Games', value: db.games.filter(g => g.status === 'Published').length, icon: Eye, color: 'bg-green-500' },
    { label: 'Hidden Games', value: db.games.filter(g => g.status === 'Hidden').length, icon: EyeOff, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back to the Brain Game Puzzle CMS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl ${stat.color} text-white flex items-center justify-center shadow-lg shadow-${stat.color}/30`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/games/new" className="p-4 rounded-xl border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-colors flex flex-col items-center justify-center gap-3 text-center group">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform"><Gamepad2 className="w-5 h-5" /></div>
            <span className="font-semibold text-gray-700 group-hover:text-indigo-700">Add New Game</span>
          </Link>
          <Link to="/admin/games" className="p-4 rounded-xl border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-colors flex flex-col items-center justify-center gap-3 text-center group">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform"><FileText className="w-5 h-5" /></div>
            <span className="font-semibold text-gray-700 group-hover:text-indigo-700">Manage Games</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
