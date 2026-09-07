import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Games() {
  const { data } = useStore();
  const [filter, setFilter] = useState('All');
  
  if (!data) return null;
  const { games } = data;
  
  const publishedGames = games.filter(g => g.status === 'Published').sort((a, b) => a.sortOrder - b.sortOrder);
  const categories = ['All', ...new Set(publishedGames.map(g => g.category))];
  
  const filteredGames = filter === 'All' ? publishedGames : publishedGames.filter(g => g.category === filter);

  return (
    <div className="bg-[#0A051A] min-h-[calc(100vh-6rem)] pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">Every Game Is a New Challenge.</h1>
          <p className="text-xl text-white/50">Explore our collection of mind-bending puzzles and relaxing focus games.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${
                filter === cat 
                  ? 'bg-white text-[#0A051A] border-white' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGames.map((game, index) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              key={game.id}
              className="group flex flex-col bg-[#1E1E2E] rounded-[2rem] overflow-hidden shadow-2xl transition-all border border-white/10 hover:border-white/20"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-black/50">
                <img src={game.coverImage} alt={game.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E] to-transparent" />
                <div className="absolute bottom-6 left-6 flex items-center gap-4">
                  <img src={game.icon} alt={`${game.name} icon`} className="w-16 h-16 rounded-2xl shadow-lg border border-white/20" />
                  <div>
                    <h3 className="text-2xl font-black text-white">{game.name}</h3>
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold mt-1 border border-white/10">
                      {game.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <p className="font-bold text-lg text-[#FFD600] mb-2">{game.tagline}</p>
                <p className="text-white/60 mb-8 flex-1">{game.shortDescription}</p>
                <Link 
                  to={`/games/${game.slug}`}
                  className="w-full py-4 bg-white/5 text-white font-bold rounded-xl text-center hover:bg-[#FF3D00] transition-colors border border-white/10 hover:border-transparent"
                >
                  View Game &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-white/50 font-medium">No games found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
