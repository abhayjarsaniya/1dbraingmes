import React from 'react';
import { motion } from 'framer-motion';
import { WhatsAppButton } from '../ui/WhatsAppButton';

export const DynamicHero: React.FC<{ game: any, config?: any }> = ({ game, config }) => {
  const layout = config?.layout || 'asymmetric';
  const heading = config?.heading || game.name;
  const bgImage = config?.bgImage || game.coverImage;
  const accentColor = game.accentColor || '#FF3D00';

  if (layout === 'centered') {
    return (
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#0A051A] text-white min-h-[80vh] flex items-center justify-center border-b border-white/5 text-center">
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover opacity-20 mix-blend-overlay blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A051A] via-[#0A051A]/80 to-transparent" />
        </div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 pointer-events-none" style={{ backgroundColor: accentColor }} />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
          <motion.img initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} src={game.icon} alt={game.name} className="w-24 h-24 rounded-3xl shadow-2xl mb-8 border border-white/20" />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter text-white">
            {heading}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-xl md:text-2xl lg:text-3xl font-bold mb-8" style={{ color: accentColor }}>
            {game.tagline}
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-wrap justify-center gap-4 mb-10">
            <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/10 uppercase tracking-widest">{game.category}</span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/10 uppercase tracking-widest">{game.gameType}</span>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full sm:w-auto px-4">
            {game.storeLinks.googlePlay.enabled && (
              <a href={game.storeLinks.googlePlay.url || '#'} className="w-full sm:w-auto justify-center px-10 py-4 sm:py-5 bg-white text-[#0A051A] rounded-2xl font-bold transition-colors flex items-center gap-2" style={{ '--tw-hover-bg-opacity': 1, backgroundColor: '#FFF' } as any} onMouseOver={(e) => e.currentTarget.style.backgroundColor = accentColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFF'}>
                {game.storeLinks.googlePlay.buttonText}
              </a>
            )}
            {game.storeLinks.appStore.enabled && (
              <a href={game.storeLinks.appStore.url || '#'} className="w-full sm:w-auto justify-center px-10 py-4 sm:py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                {game.storeLinks.appStore.buttonText}
              </a>
            )}
            {game.whatsapp?.enabled && (
              <WhatsAppButton game={game} context="game" className="w-full sm:w-auto py-4 sm:py-5" />
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  // asymmetric layout
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-[#0A051A] text-white min-h-[80vh] flex items-center border-b border-white/5">
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="" className="w-full h-full object-cover opacity-20 mix-blend-overlay blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A051A] via-[#0A051A]/80 to-transparent" />
      </div>
      <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ backgroundColor: accentColor }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <img src={game.icon} alt={game.name} className="w-24 h-24 rounded-3xl shadow-2xl mb-8 border border-white/20" />
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter text-white">{heading}</h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-6" style={{ color: accentColor }}>{game.tagline}</p>
            
            <div className="flex gap-4 mb-10">
              <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/10 uppercase tracking-widest">{game.category}</span>
              <span className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold border border-white/10 uppercase tracking-widest">{game.gameType}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {game.storeLinks.googlePlay.enabled && (
                <a href={game.storeLinks.googlePlay.url || '#'} className="w-full sm:w-auto justify-center px-10 py-4 sm:py-5 bg-white text-[#0A051A] rounded-2xl font-bold transition-colors flex items-center gap-2" style={{ '--tw-hover-bg-opacity': 1, backgroundColor: '#FFF' } as any} onMouseOver={(e) => e.currentTarget.style.backgroundColor = accentColor} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFF'}>
                  {game.storeLinks.googlePlay.buttonText}
                </a>
              )}
              {game.storeLinks.appStore.enabled && (
                <a href={game.storeLinks.appStore.url || '#'} className="w-full sm:w-auto justify-center px-10 py-4 sm:py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                  {game.storeLinks.appStore.buttonText}
                </a>
              )}
              {game.whatsapp?.enabled && (
                <WhatsAppButton game={game} context="game" className="w-full sm:w-auto py-4 sm:py-5" />
              )}
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden lg:block relative">
              <img src={game.screenshots[0] || game.coverImage} alt="Gameplay" className="w-full max-w-md mx-auto rounded-[3rem] shadow-2xl border-4 border-white/10 transform rotate-3 hover:rotate-0 transition-transform duration-700" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
