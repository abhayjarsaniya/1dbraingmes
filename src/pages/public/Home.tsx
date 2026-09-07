import React from 'react';
import { useStore } from '../../store/useStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Home() {
  const { data } = useStore();
  if (!data) return null;
  const { games, settings } = data;
  const homePage = data.pages?.find(p => p.slug === 'home');
  const heroSec = homePage?.sections?.find(s => s.type === 'homeHero');
  const threeWaysSec = homePage?.sections?.find(s => s.type === 'threeWays');
  const curiousMindsSec = homePage?.sections?.find(s => s.type === 'curiousMinds');
  const bentoSec = homePage?.sections?.find(s => s.type === 'bentoCollection');
  const whyWeBuildSec = homePage?.sections?.find(s => s.type === 'whyWeBuild');

  const featuredGames = games.filter(g => g.featured).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      {/* Hero Section */}
      {heroSec?.visible !== false && (
      <section className="relative overflow-hidden pt-20 pb-32 min-h-[calc(100vh-6rem)] flex items-center">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl flex flex-col gap-6"
            >
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 w-fit rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">New Game Released: SHIFT</span>
              </div>
              <h1 className="text-[64px] lg:text-[84px] leading-[0.9] font-black tracking-tighter text-white" dangerouslySetInnerHTML={{ __html: heroSec?.title || 'GAMES THAT <br/> MAKE YOUR <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 text-[80px] lg:text-[100px]">BRAIN PLAY.</span>' }}></h1>
              <p className="text-lg text-white/50 leading-relaxed max-w-lg">
                {heroSec?.description || 'Crafting immersive, intelligent puzzle experiences for mobile. From strategic folding to physics-defying taps, we challenge your perspective.'}
              </p>
              <div className="flex gap-4 mt-4">
                <Link to="/games" className="bg-[#FF3D00] hover:bg-[#FF5500] px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-orange-500/20 text-white transition-colors">
                  Play Our Games
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
                <a href="#featured" className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-bold text-white transition-colors">
                  Learn More
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:flex items-center justify-center h-full"
            >
              <div className="grid grid-cols-2 gap-4 rotate-[-6deg]">
                <div className="flex flex-col gap-4 mt-12">
                  <div className="w-48 h-64 bg-[#1E1E2E] rounded-[32px] border border-white/10 p-4 shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-10 h-10 bg-blue-500 rounded-lg mb-4 flex items-center justify-center font-bold text-white">S</div>
                    <h3 className="font-bold mb-1 text-white">SHIFT</h3>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4">Physics Puzzle</p>
                    <div className="w-full h-32 bg-[#2D2D44] rounded-xl border border-white/5 flex items-end p-2 relative overflow-hidden">
                       <img src={featuredGames[0]?.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen" alt="Game cover" />
                       <div className="w-full h-1/2 bg-blue-500/20 rounded-lg border border-blue-500/30 relative z-10"></div>
                    </div>
                  </div>
                  <div className="w-48 h-64 bg-[#1E1E2E] rounded-[32px] border border-white/10 p-4 shadow-2xl flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 bg-purple-500 rounded-lg mb-4 flex items-center justify-center font-bold text-white">M</div>
                      <h3 className="font-bold mb-1 text-white">MIND</h3>
                      <p className="text-[10px] text-white/50 uppercase tracking-widest">The Journey</p>
                    </div>
                    <div className="relative h-24 rounded-xl overflow-hidden mb-4">
                       <img src={featuredGames[1]?.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-screen" alt="Game cover" />
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full w-2/3 bg-purple-500"></div></div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="w-48 h-80 bg-[#1E1E2E] rounded-[32px] border border-white/10 p-4 shadow-2xl flex flex-col">
                    <div className="w-10 h-10 bg-teal-500 rounded-lg mb-4 flex items-center justify-center font-bold text-white">P</div>
                    <h3 className="font-bold mb-1 leading-tight text-white">Paper Plane Puzzle</h3>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mb-6">Strategy</p>
                    <div className="flex-1 bg-[#2D2D44] rounded-2xl flex flex-col gap-2 p-3 relative overflow-hidden">
                      <img src={featuredGames[2]?.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-screen" alt="Game cover" />
                      <div className="h-2 w-full bg-white/10 rounded-full relative z-10"></div>
                      <div className="h-2 w-4/5 bg-white/10 rounded-full relative z-10"></div>
                      <div className="h-2 w-full bg-white/10 rounded-full relative z-10"></div>
                      <div className="flex-1 flex items-center justify-center opacity-20 relative z-10 text-white">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.62c-.31.18-.69.18-1 0L3.53 17.38c-.32-.17-.53-.5-.53-.88V7.5c0-.38.21-.71.53-.88l7.97-4.62c.31-.18.69-.18 1 0l7.97 4.62c.32.17.53.5.53.88v9z"></path></svg>
                      </div>
                    </div>
                  </div>
                  <div className="w-48 h-48 bg-gradient-to-br from-[#FFD600] to-[#FFB800] rounded-[32px] border border-white/10 p-6 flex flex-col justify-center items-center text-black">
                    <span className="text-4xl font-black mb-1">{games.length}+</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Live Games</span>
                    <Link to="/games" className="mt-4 text-[10px] underline font-bold cursor-pointer hover:opacity-50 transition-opacity">View All</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-4 -translate-y-1/2 flex-col gap-8 opacity-20 hidden 2xl:flex z-0">
          <span className="[writing-mode:vertical-rl] rotate-180 uppercase text-[10px] font-bold tracking-[0.4em] text-white">SCROLL TO EXPLORE</span>
          <div className="w-px h-24 bg-white mx-auto"></div>
        </div>
      </section>
      )}

      {/* Featured Games Section */}
      <section id="featured" className="py-32 relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Featured Experiences</h2>
            <p className="text-xl text-white/50">Curated puzzles for curious minds.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGames.slice(0, 3).map((game, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                      <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold mt-1 border border-white/10" style={{ color: game.accentColor }}>
                        {game.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <p className="font-bold text-lg mb-2" style={{ color: game.accentColor || '#FFD600' }}>{game.tagline}</p>
                  <p className="text-white/60 mb-8 flex-1">{game.shortDescription}</p>
                  <Link 
                    to={`/games/${game.slug}`}
                    className="w-full py-4 bg-white/5 text-white font-bold rounded-xl text-center transition-colors border border-white/10 hover:border-transparent"
                    style={{ '--tw-hover-bg-opacity': 1, backgroundColor: 'transparent' } as any}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = game.accentColor || '#FF3D00'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    View Game &rarr;
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* S2: Three Ways to Play */}
      {threeWaysSec?.visible !== false && (
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center md:text-left mb-16">
            <h2 className="text-5xl md:text-7xl font-black mb-4">Different Games. <br className="hidden md:block"/> Different Minds.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#FF3D00] rounded-[2.5rem] p-10 flex flex-col justify-between h-[400px] hover:scale-[1.02] transition-transform">
              <h3 className="text-5xl font-black text-[#0A051A]">THINK</h3>
              <div className="text-white text-2xl font-bold flex flex-col gap-2">
                <span>Solve.</span>
                <span>Plan.</span>
                <span>React.</span>
              </div>
            </div>
            <div className="bg-[#D500F9] rounded-[2.5rem] p-10 flex flex-col justify-between h-[400px] md:mt-12 hover:scale-[1.02] transition-transform">
              <h3 className="text-5xl font-black text-[#0A051A]">FOCUS</h3>
              <div className="text-white text-2xl font-bold flex flex-col gap-2">
                <span>Observe.</span>
                <span>Concentrate.</span>
                <span>Control.</span>
              </div>
            </div>
            <div className="bg-[#00E5FF] rounded-[2.5rem] p-10 flex flex-col justify-between h-[400px] md:mt-24 hover:scale-[1.02] transition-transform">
              <h3 className="text-5xl font-black text-[#0A051A]">EXPLORE</h3>
              <div className="text-[#0A051A] text-2xl font-bold flex flex-col gap-2">
                <span>Discover.</span>
                <span>Experiment.</span>
                <span>Progress.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* S3: Built for Curious Minds */}
      {curiousMindsSec?.visible !== false && (
      <section className="py-40 bg-[#05020A] relative overflow-hidden border-y border-white/5">
        <div className="absolute top-[10%] left-[20%] w-[100px] h-[100px] bg-blue-500 rounded-lg rotate-12 blur-sm opacity-50 animate-pulse" />
        <div className="absolute bottom-[20%] right-[15%] w-[150px] h-[150px] bg-purple-500 rounded-full rotate-45 blur-sm opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] right-[30%] w-[80px] h-[80px] bg-yellow-500 rounded-3xl -rotate-12 blur-sm opacity-60 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-7xl md:text-[120px] leading-[0.8] font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/30" dangerouslySetInnerHTML={{ __html: curiousMindsSec?.title || 'PLAY WITH <br/> YOUR MIND.' }} />
          <p className="text-3xl font-bold text-[#00E5FF] mb-16">{curiousMindsSec?.description || 'Simple to start. Difficult to master.'}</p>
          
          <div className="flex flex-wrap justify-center gap-6 text-xl font-bold">
            <span className="px-6 py-3 bg-white/5 border border-white/10 rounded-full">Quick Challenges</span>
            <span className="px-6 py-3 bg-white/5 border border-white/10 rounded-full">Unexpected Mechanics</span>
            <span className="px-6 py-3 bg-white/5 border border-white/10 rounded-full">Progressive Difficulty</span>
            <span className="px-6 py-3 bg-white/5 border border-white/10 rounded-full">Satisfying Gameplay</span>
          </div>
        </div>
      </section>
      )}

      {/* S4: Game Collection Bento */}
      {bentoSec?.visible !== false && (
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4">{bentoSec?.title || 'Find Your Next Challenge.'}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            <div className="col-span-2 row-span-2 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[2rem] p-8 flex flex-col justify-end relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 mix-blend-overlay group-hover:scale-110 transition-transform duration-700" />
              <h3 className="text-4xl font-black relative z-10">Puzzle</h3>
            </div>
            <div className="bg-[#FF3D00] rounded-[2rem] p-8 flex flex-col justify-end text-black hover:scale-[1.02] transition-transform">
              <h3 className="text-2xl font-black">Focus</h3>
            </div>
            <div className="row-span-2 bg-[#1E1E2E] border border-white/10 rounded-[2rem] p-8 flex flex-col justify-end hover:bg-white/5 transition-colors">
              <h3 className="text-2xl font-black text-[#00E5FF]">Strategy</h3>
            </div>
            <div className="bg-[#D500F9] rounded-[2rem] p-8 flex flex-col justify-end text-black hover:scale-[1.02] transition-transform">
              <h3 className="text-2xl font-black">Reaction</h3>
            </div>
            <div className="bg-[#FFD600] rounded-[2rem] p-8 flex flex-col justify-end text-black hover:scale-[1.02] transition-transform">
              <h3 className="text-2xl font-black">Logic</h3>
            </div>
            <div className="col-span-2 bg-[#0A051A] border border-white/10 rounded-[2rem] p-8 flex items-center justify-center hover:bg-white/5 transition-colors">
               <Link to="/games" className="text-2xl font-black underline hover:text-[#FF3D00] transition-colors">View Full Collection &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* S5: Why We Build Games */}
      {whyWeBuildSec?.visible !== false && (
      <section className="py-32 bg-[#1E1E2E] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <h2 className="text-5xl md:text-7xl font-black leading-tight" dangerouslySetInnerHTML={{ __html: whyWeBuildSec?.title || 'Why We <br/> Build Games' }} />
            <p className="text-xl text-white/50 max-w-md">{whyWeBuildSec?.description || 'Our core philosophy behind every mechanic we design.'}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="border-t-2 border-[#FFD600] pt-8">
              <span className="text-4xl font-black text-[#FFD600] block mb-4">01</span>
              <h3 className="text-xl font-bold mb-2">Simple Ideas</h3>
              <p className="text-white/50">Accessible entry points.</p>
            </div>
            <div className="border-t-2 border-[#FF3D00] pt-8 md:mt-12">
              <span className="text-4xl font-black text-[#FF3D00] block mb-4">02</span>
              <h3 className="text-xl font-bold mb-2">Smart Mechanics</h3>
              <p className="text-white/50">Depth through interaction.</p>
            </div>
            <div className="border-t-2 border-[#D500F9] pt-8 md:mt-24">
              <span className="text-4xl font-black text-[#D500F9] block mb-4">03</span>
              <h3 className="text-xl font-bold mb-2">Meaningful Challenges</h3>
              <p className="text-white/50">Tests that respect your time.</p>
            </div>
            <div className="border-t-2 border-[#00E5FF] pt-8 md:mt-36">
              <span className="text-4xl font-black text-[#00E5FF] block mb-4">04</span>
              <h3 className="text-xl font-bold mb-2">Satisfying Progress</h3>
              <p className="text-white/50">Reward focus and logic.</p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Global CTA Block */}
      {settings?.globalCta.enabled && (
        <section className="py-24 bg-[#FF3D00] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000&opacity=0.1')] bg-cover bg-center opacity-20 mix-blend-overlay" />
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">{settings.globalCta.heading}</h2>
            <p className="text-xl text-white/80 mb-10">{settings.globalCta.description}</p>
            <Link 
              to={settings.globalCta.buttonUrl}
              className="inline-block bg-[#0A051A] text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-black transition-colors"
            >
              {settings.globalCta.buttonText}
            </Link>
          </div>
        </section>
      )}

      {/* Global Store Strip */}
      {settings?.globalStoreLinks.stripEnabled && (
        <div className="bg-[#1E1E2E] border-t border-white/5 py-6">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/70 font-bold text-lg lg:text-xl uppercase tracking-widest text-[14px]">{settings.globalStoreLinks.stripText}</p>
            <div className="flex gap-4">
              {settings.globalStoreLinks.googlePlayUrl && (
                <a href={settings.globalStoreLinks.googlePlayUrl} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-bold transition-colors text-sm">
                  Google Play
                </a>
              )}
              {settings.globalStoreLinks.appStoreUrl && (
                <a href={settings.globalStoreLinks.appStoreUrl} className="bg-white text-[#0A051A] hover:bg-[#FFD600] px-6 py-3 rounded-xl font-bold transition-colors text-sm">
                  App Store
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
