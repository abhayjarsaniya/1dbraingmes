import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';
import { Game } from '../../types';
import { DynamicHero } from '../../components/game/DynamicHero';
import { WhatsAppButton } from '../../components/ui/WhatsAppButton';

export function GameDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const { data } = useStore();

  useEffect(() => {
    if (data && data.games) {
      const foundGame = data.games.find(g => g.slug === slug && g.status === 'Published');
      setGame(foundGame || null);
      setLoading(false);
    }
  }, [slug, data]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0A051A]"><div className="w-8 h-8 border-4 border-[#FFD600] border-t-transparent rounded-full animate-spin"></div></div>;

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A051A] px-4 text-center">
        <h1 className="text-4xl font-black text-white mb-4">Oops! This puzzle piece is missing.</h1>
        <p className="text-xl text-white/50 mb-8">The game you are looking for doesn't exist or has been hidden.</p>
        <Link to="/games" className="px-8 py-4 bg-[#FF3D00] text-white rounded-2xl font-bold hover:bg-[#FF5500] transition-colors">
          Back to Games
        </Link>
      </div>
    );
  }

  const publishedGames = data?.games.filter(g => g.status === 'Published' && g.id !== game.id).slice(0, 3) || [];

  const renderSection = (section: any) => {
    switch (section.type) {
      case 'hero':
        return <DynamicHero key={section.id} game={game} config={section.config} />;
      case 'infoStrip':
        return (
          <section key={section.id} className="py-8 bg-[#1E1E2E] border-y border-white/5 relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center md:text-left">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Type</p>
                  <p className="text-lg font-bold text-white">{game.gameType}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Difficulty</p>
                  <p className="text-lg font-bold text-white">{game.difficulty}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Play Style</p>
                  <p className="text-lg font-bold text-white">{game.infoStrip?.playStyle || 'Any'}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Platform</p>
                  <p className="text-lg font-bold text-white">{game.infoStrip?.platform || 'Mobile'}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Session</p>
                  <p className="text-lg font-bold text-white">{game.infoStrip?.session || 'Any'}</p>
                </div>
              </div>
            </div>
          </section>
        );
      case 'whatIsIt':
        return (
          <section key={section.id} className="py-24 bg-[#0A051A] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-16 items-start">
                <div>
                  <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">What Is <br/>{game.name}?</h2>
                  <p className="text-2xl text-white/80 mb-6 leading-relaxed font-bold">{game.shortDescription}</p>
                  {game.longDescription && (
                    <div className="text-lg text-white/60 leading-relaxed whitespace-pre-wrap mb-10">
                      {game.longDescription}
                    </div>
                  )}
                </div>
                <div className="bg-[#1E1E2E] rounded-[2rem] p-10 border border-white/5 sticky top-24">
                  <h3 className="text-2xl font-black mb-8 text-white">At a Glance</h3>
                  <ul className="flex flex-col gap-6">
                    {game.whatIsIt?.map((point, i) => (
                      <li key={i} className="flex items-center gap-4 text-xl font-bold">
                        <span className="w-8 h-8 rounded-full flex items-center justify-center border border-white/20 text-sm shrink-0" style={{ color: game.accentColor }}>{i+1}</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        );
      case 'howItWorks':
        return (
          <section key={section.id} className="py-24 bg-[#05020A] border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory hide-scrollbar">
                {game.howToPlay?.map((step, i) => (
                  <div key={step.id} className="min-w-[300px] max-w-[400px] flex-1 bg-[#1E1E2E] rounded-[2rem] p-10 border border-white/10 snap-center">
                    <span className="text-5xl font-black block mb-6" style={{ color: game.accentColor || '#FFF' }}>0{i+1}</span>
                    <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                    <p className="text-xl text-white/50">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'features':
        if (!game.features?.length) return null;
        return (
          <section key={section.id} className="py-32 bg-[#0A051A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-5xl font-black text-white mb-16">What's Inside</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {game.features.map(f => (
                  <div key={f.id} className="bg-gradient-to-br from-[#1E1E2E] to-[#0A051A] p-10 rounded-[2rem] border border-white/5 hover:border-white/20 transition-colors">
                    <h3 className="text-2xl font-bold text-white mb-4" style={{ color: game.accentColor || '#FFF' }}>{f.title}</h3>
                    <p className="text-white/60 text-lg leading-relaxed">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'screenshots':
        if (!game.screenshots?.length) return null;
        return (
          <section key={section.id} className="py-24 md:py-32 bg-[#1E1E2E] border-y border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex items-end justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-white/50 mb-2 block">Gameplay Showcase</span>
                <h2 className="text-4xl md:text-5xl font-black text-white">Inside the Game</h2>
              </div>
              {game.screenshots.length > 2 && (
                <div className="hidden sm:flex items-center gap-2 text-white/40 text-sm font-medium">
                  <span>Swipe or scroll to explore</span>
                  <span>&rarr;</span>
                </div>
              )}
            </div>
            {game.screenshots.length <= 2 ? (
              <div className="relative h-[550px] flex items-center justify-center w-full max-w-7xl mx-auto">
                {game.screenshots.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Gameplay"
                    className={`absolute w-64 md:w-80 rounded-[3rem] shadow-2xl border-4 border-white/10 transition-transform hover:z-30 hover:scale-105 ${
                      i === 0 ? 'left-[15%] md:left-[25%] rotate-[-6deg] z-10' : 'right-[15%] md:right-[25%] rotate-[6deg] z-20'
                    }`}
                  />
                ))}
                {game.screenshots.length === 1 && (
                  <img src={game.screenshots[0]} alt="Gameplay" className="w-80 rounded-[3rem] shadow-2xl border-4 border-white/10" />
                )}
              </div>
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth snap-x">
                  {game.screenshots.map((src, i) => (
                    <div key={i} className="flex-shrink-0 snap-center">
                      <img
                        src={src}
                        alt={`${game.name} screenshot ${i + 1}`}
                        className="w-64 md:w-72 h-auto rounded-[2.5rem] shadow-2xl border-4 border-white/10 transition-all duration-300 hover:scale-105 hover:border-white/30"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      case 'audience':
        return (
          <section key={section.id} className="py-32 bg-[#0A051A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-5xl md:text-7xl font-black mb-16 text-center">Made For <br/>Curious Minds</h2>
              <div className="flex flex-wrap justify-center gap-6">
                {game.audienceCards?.map((card, i) => (
                  <div key={i} className="px-8 py-6 rounded-[2rem] bg-white/5 border border-white/10 text-2xl font-bold hover:bg-white/10 transition-colors">
                    {card}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'whyPlay':
        return (
          <section key={section.id} className="py-40 bg-[#0A051A] relative border-y border-white/5 overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay" />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              <h2 className="text-7xl md:text-[100px] font-black tracking-tighter mb-6">{game.whyPlay?.heading || 'One More Round.'}</h2>
              <p className="text-3xl font-bold mb-16" style={{ color: game.accentColor || '#FFD600' }}>{game.whyPlay?.subheading}</p>
              
              <div className="flex flex-wrap justify-center gap-6">
                {game.whyPlay?.points.map((pt, i) => (
                  <div key={i} className="text-2xl font-black bg-[#1E1E2E] px-8 py-4 rounded-full border border-white/10">{pt}</div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'storeCta':
        return (
          <section key={section.id} className="py-32 bg-[#0A051A] text-center">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-6xl font-black mb-12">Ready to Play?</h2>
              <div className="flex flex-col sm:flex-row justify-center flex-wrap gap-4 sm:gap-6">
                {game.storeLinks.googlePlay.enabled && (
                  <a href={game.storeLinks.googlePlay.url || '#'} className="w-full sm:w-auto px-10 py-4 sm:py-5 bg-white text-[#0A051A] rounded-2xl font-bold hover:bg-gray-200 transition-colors text-lg sm:text-xl text-center">
                    {game.storeLinks.googlePlay.buttonText}
                  </a>
                )}
                {game.storeLinks.appStore.enabled && (
                  <a href={game.storeLinks.appStore.url || '#'} className="w-full sm:w-auto px-10 py-4 sm:py-5 bg-[#1E1E2E] border border-white/10 text-white rounded-2xl font-bold hover:bg-white/10 transition-colors text-lg sm:text-xl text-center">
                    {game.storeLinks.appStore.buttonText}
                  </a>
                )}
                {game.whatsapp?.enabled && (
                  <WhatsAppButton game={game} context="game" className="w-full sm:w-auto py-4 sm:py-5 text-lg sm:text-xl" />
                )}
              </div>
            </div>
          </section>
        );

      case 'bentoGrid':
        return (
          <section key={section.id} className="py-24 bg-[#05020A] border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-5xl font-black mb-12 text-center">More To Explore</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                {(section.config?.items || []).map((item: any, i: number) => (
                  <div key={i} className="rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden group" style={{
                    gridColumn: `span ${item.colSpan || 1}`,
                    gridRow: `span ${item.rowSpan || 1}`,
                    backgroundColor: item.color || '#1E1E2E'
                  }}>
                    <h3 className="text-2xl font-black relative z-10 text-white">{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      
      case 'customHtml':
        return (
          <section key={section.id} className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dangerouslySetInnerHTML={{ __html: section.config?.html || '' }} />
          </section>
        );

      case 'numberedSteps':
        const title = section.config?.title || 'Steps';
        return (
          <section key={section.id} className="py-24 relative bg-white text-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl md:text-6xl font-black mb-16 text-center">{title}</h2>
              <div className={`grid gap-8 ${section.config?.style === 'horizontal' ? 'md:grid-cols-3' : 'md:grid-cols-1 max-w-3xl mx-auto'}`}>
                {game.howToPlay?.map((step: any, i: number) => (
                  <div key={i} className="flex gap-6 items-start">
                    <span className="text-5xl font-black text-gray-200">0{i+1}</span>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'moreGames':
        if (publishedGames.length === 0) return null;
        return (
          <section key={section.id} className="py-32 bg-[#1E1E2E] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-black text-white mb-12">More Games</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {publishedGames.map(pg => (
                  <Link key={pg.id} to={`/games/${pg.slug}`} className="group bg-[#0A051A] rounded-[2rem] overflow-hidden border border-white/10 hover:border-white/30 transition-all flex flex-col">
                    <div className="aspect-video relative overflow-hidden bg-black/50">
                      <img src={pg.coverImage} className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500 group-hover:scale-105" alt="" />
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-black mb-2" style={{ color: pg.accentColor || '#FFF' }}>{pg.name}</h3>
                      <p className="text-white/60">{pg.tagline}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const sectionsToRender = game.sectionOrder?.filter(s => s.visible).sort((a, b) => a.order - b.order) || [];

  return (
    <div className="bg-[#0A051A] min-h-screen">
      {sectionsToRender.map(renderSection)}
      
      {/* Legal Links */}
      {(game.privacyPolicy?.enabled || game.termsAndConditions?.enabled) && (
        <section className="py-12 bg-[#0A051A] text-center border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 max-w-4xl mx-auto px-4">
            {game.privacyPolicy?.enabled && (
              <div className="flex flex-col gap-2 items-center">
                <Link to={`/games/${game.slug}/privacy`} className="text-white/50 hover:text-white font-medium underline transition-colors">
                  Privacy Policy
                </Link>
                <a 
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(game.privacyPolicy.content)}`} 
                  download={`${game.slug}-privacy-policy.txt`}
                  className="text-xs text-white/30 hover:text-white/50 transition-colors"
                >
                  Download Privacy Policy
                </a>
              </div>
            )}
            
            {game.privacyPolicy?.enabled && game.termsAndConditions?.enabled && (
              <div className="hidden sm:block w-px h-8 bg-white/10"></div>
            )}
            
            {game.termsAndConditions?.enabled && (
              <div className="flex flex-col gap-2 items-center">
                <Link to={`/games/${game.slug}/terms`} className="text-white/50 hover:text-white font-medium underline transition-colors">
                  Terms & Conditions
                </Link>
                <a 
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(game.termsAndConditions.content)}`} 
                  download={`${game.slug}-terms.txt`}
                  className="text-xs text-white/30 hover:text-white/50 transition-colors"
                >
                  Download Terms & Conditions
                </a>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
