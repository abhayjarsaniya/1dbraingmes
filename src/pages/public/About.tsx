import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';

export default function About() {
  const { data } = useStore();
  const games = data?.games || [];
  const aboutPage = data?.pages?.find(p => p.slug === 'about');
  const heroSec = aboutPage?.sections?.find(s => s.type === 'aboutHero');
  const statementSec = aboutPage?.sections?.find(s => s.type === 'aboutStatement');

  const publishedGames = games.filter(g => g.status === 'Published').sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 3);

  return (
    <div className="bg-[#0A051A] min-h-screen text-white pt-24 pb-32">
      {/* S1: ABOUT HERO */}
      {heroSec?.visible !== false && (
      <section className="relative py-24 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400"
            dangerouslySetInnerHTML={{ __html: heroSec?.title || 'We Build Games <br className="hidden md:block"/> for Curious Minds.' }}
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl text-white/60 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            {heroSec?.description || '1D Brain Games creates mobile games that turn simple ideas into challenging experiences.'}
          </motion.p>
        </div>
      </section>
      )}

      {/* S2: Think. Play. Repeat. */}
      {statementSec?.visible !== false && (
      <section className="py-24 relative overflow-hidden">
        <div className="absolute left-[-10%] top-[20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4">{statementSec?.title || 'Think. Play. Repeat.'}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/5 border border-white/10 p-12 rounded-[2rem] hover:bg-white/10 transition-colors">
              <h3 className="text-3xl font-black mb-4 text-[#FFD600]">Simple Ideas</h3>
              <p className="text-white/50 text-lg">Every great puzzle starts with a mechanic so simple anyone can understand it in seconds.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-12 rounded-[2rem] hover:bg-white/10 transition-colors mt-0 md:mt-12">
              <h3 className="text-3xl font-black mb-4 text-[#00E5FF]">Smart Gameplay</h3>
              <p className="text-white/50 text-lg">We build complexity through interaction, not instruction. The difficulty scales naturally.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-12 rounded-[2rem] hover:bg-white/10 transition-colors mt-0 md:mt-24">
              <h3 className="text-3xl font-black mb-4 text-[#D500F9]">Endless Curiosity</h3>
              <p className="text-white/50 text-lg">Our games are designed to make you ask: 'What happens if I try this instead?'</p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* S3: What We Care About */}
      <section className="py-24 border-y border-white/5 bg-[#1E1E2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-black mb-16 text-center">What We Care About</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 border border-white/10 rounded-3xl bg-[#0A051A] hover:border-pink-500/50 transition-colors">
              <span className="text-pink-500 text-sm font-bold tracking-widest uppercase mb-4 block">01</span>
              <h3 className="text-3xl font-black mb-2">FUN</h3>
              <p className="text-white/60 text-lg">Games should feel good to play.</p>
            </div>
            <div className="p-10 border border-white/10 rounded-3xl bg-[#0A051A] hover:border-cyan-500/50 transition-colors">
              <span className="text-cyan-500 text-sm font-bold tracking-widest uppercase mb-4 block">02</span>
              <h3 className="text-3xl font-black mb-2">THINKING</h3>
              <p className="text-white/60 text-lg">Every mechanic should make you think.</p>
            </div>
            <div className="p-10 border border-white/10 rounded-3xl bg-[#0A051A] hover:border-yellow-500/50 transition-colors">
              <span className="text-yellow-500 text-sm font-bold tracking-widest uppercase mb-4 block">03</span>
              <h3 className="text-3xl font-black mb-2">CURIOSITY</h3>
              <p className="text-white/60 text-lg">We want players to discover.</p>
            </div>
            <div className="p-10 border border-white/10 rounded-3xl bg-[#0A051A] hover:border-green-500/50 transition-colors">
              <span className="text-green-500 text-sm font-bold tracking-widest uppercase mb-4 block">04</span>
              <h3 className="text-3xl font-black mb-2">PROGRESS</h3>
              <p className="text-white/60 text-lg">Every session should feel meaningful.</p>
            </div>
          </div>
        </div>
      </section>

      {/* S4: Small Games. Big Ideas. */}
      <section className="py-32 relative text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Small Games. <br/> Big Ideas.</h2>
          <p className="text-2xl text-white/50">
            From quick puzzles to deeper challenges, we build experiences designed to stay in your mind.
          </p>
        </div>
      </section>

      {/* S5: Game Collection */}
      {publishedGames.length > 0 && (
        <section className="py-24 bg-[#1E1E2E] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Our Collection</h2>
            <div className="flex flex-col gap-8">
              {publishedGames.map((game, i) => (
                <div key={game.id} className="flex flex-col md:flex-row items-center gap-8 bg-[#0A051A] rounded-[2rem] p-4 border border-white/10 hover:border-white/30 transition-all">
                  <div className={`w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden ${i % 2 !== 0 ? 'md:order-2' : ''}`}>
                    <img src={game.coverImage} alt={game.name} className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all" />
                  </div>
                  <div className="w-full md:w-2/3 p-8">
                    <h3 className="text-4xl font-black mb-2" style={{ color: game.accentColor || '#FFF' }}>{game.name}</h3>
                    <p className="text-xl text-white/50 mb-6">{game.tagline}</p>
                    <Link to={`/games/${game.slug}`} className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">
                      View Game &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* S6: CTA */}
      <section className="py-32 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF3D00]/20 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-10">Find Your Next Challenge.</h2>
          <Link to="/games" className="inline-block px-10 py-5 bg-[#FF3D00] hover:bg-[#FF5500] text-white rounded-2xl font-bold text-xl transition-all hover:scale-105 shadow-xl shadow-[#FF3D00]/20">
            Explore Games
          </Link>
        </div>
      </section>
    </div>
  );
}
