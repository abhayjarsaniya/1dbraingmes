import React from 'react';
import { useAdminStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, Copy, Archive, GripVertical } from 'lucide-react';

export function GamesList() {
  const { db, updateGame, deleteGame, addGame, saveAdminData } = useAdminStore();
  if (!db) return null;

  const toggleStatus = (game: any) => {
    const newStatus = game.status === 'Published' ? 'Hidden' : 'Published';
    updateGame({ ...game, status: newStatus });
  };

  const duplicateGame = (game: any) => {
    const newGame = {
      ...game,
      id: `g_${Date.now()}`,
      name: `${game.name} (Copy)`,
      slug: `${game.slug}-copy`,
      status: 'Draft',
      sortOrder: db.games.length
    };
    addGame(newGame);
  };

  const archiveGame = (game: any) => {
    updateGame({ ...game, status: 'Archived' });
  };

  const onDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('dragIndex', index.toString());
  };

  const onDrop = (e: React.DragEvent, dropIndex: number) => {
    const dragIndex = parseInt(e.dataTransfer.getData('dragIndex'));
    if (dragIndex === dropIndex || isNaN(dragIndex)) return;
    
    const sortedGames = [...db.games].sort((a, b) => a.sortOrder - b.sortOrder);
    const [draggedItem] = sortedGames.splice(dragIndex, 1);
    sortedGames.splice(dropIndex, 0, draggedItem);
    
    // Update sortOrder for all
    const newGames = sortedGames.map((g, i) => ({ ...g, sortOrder: i }));
    saveAdminData({ ...db, games: newGames });
  };
  
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Games</h1>
          <p className="text-gray-500 mt-1">Manage your game catalog.</p>
        </div>
        <Link to="/admin/games/new" className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
          <Plus className="w-5 h-5" />
          Add Game
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-100">
          {db.games.sort((a, b) => a.sortOrder - b.sortOrder).map((game, index) => (
            <div key={game.id} className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="cursor-grab text-gray-400" draggable onDragStart={(e) => onDragStart(e, index)} onDrop={(e) => onDrop(e, index)} onDragOver={onDragOver}>
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <img src={game.icon} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm border border-gray-200" />
                  <div>
                    <p className="font-bold text-gray-900">{game.name}</p>
                    <p className="text-xs text-gray-500">{game.slug}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  game.status === 'Published' ? 'bg-green-100 text-green-700' : 
                  game.status === 'Hidden' ? 'bg-orange-100 text-orange-700' : 
                  game.status === 'Archived' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {game.status}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleStatus(game)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    {game.status === 'Published' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <Link to={`/admin/games/${game.id}`} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button onClick={() => duplicateGame(game)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    <Copy className="w-5 h-5" />
                  </button>
                  <button onClick={() => { if(confirm('Archive this game?')) archiveGame(game) }} className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
                    <Archive className="w-5 h-5" />
                  </button>
                  <button onClick={() => { if(confirm('Delete this game?')) deleteGame(game.id) }} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-2 py-4 w-10"></th><th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Game</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Category</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-xs">Featured</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {db.games.sort((a, b) => a.sortOrder - b.sortOrder).map((game, index) => (
                <tr 
                  key={game.id} 
                  className="hover:bg-gray-50/50 transition-colors"
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDrop={(e) => onDrop(e, index)}
                  onDragOver={onDragOver}
                >
                  <td className="px-2 py-4 cursor-grab text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-5 h-5" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={game.icon} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm border border-gray-200" />
                      <div>
                        <p className="font-bold text-gray-900">{game.name}</p>
                        <p className="text-sm text-gray-500">{game.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      game.status === 'Published' ? 'bg-green-100 text-green-700' : 
                      game.status === 'Hidden' ? 'bg-orange-100 text-orange-700' : 
                      game.status === 'Archived' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {game.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">{game.category}</td>
                  <td className="px-6 py-4">
                    {game.featured ? <span className="text-indigo-600 font-bold">Yes</span> : <span className="text-gray-400">No</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toggleStatus(game)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title={game.status === 'Published' ? 'Hide' : 'Publish'}>
                        {game.status === 'Published' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <Link to={`/admin/games/${game.id}`} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Edit">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button onClick={() => duplicateGame(game)} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Duplicate">
                        <Copy className="w-5 h-5" />
                      </button>
                      <button onClick={() => { if(confirm('Archive this game?')) archiveGame(game) }} className="p-2 text-gray-400 hover:text-orange-600 transition-colors" title="Archive">
                        <Archive className="w-5 h-5" />
                      </button>
                      <button onClick={() => { if(confirm('Are you sure you want to delete this game?')) deleteGame(game.id) }} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-5 h-5" />
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
