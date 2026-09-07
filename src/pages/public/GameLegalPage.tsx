import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { NotFound } from './NotFound';

function formatLegalText(text: string) {
  if (!text) return '<p class="text-white/60">No content provided.</p>';
  
  // If content contains standard HTML block tags, render as is
  if (/<\s*(p|div|h[1-6]|ul|ol|table|br)\b[^>]*>/i.test(text)) {
    return text;
  }
  
  // Clean, uniform plain-text parser that preserves exact structure
  const lines = text.split(/\r?\n/);
  let html = '';
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Empty line = spacer between paragraphs
    if (!line) {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      continue;
    }
    
    // Explicit markdown heading: #, ##, ###
    if (/^#{1,3}\s+/.test(line)) {
      if (inList) { html += '</ul>\n'; inList = false; }
      const headingText = line.replace(/^#{1,3}\s+/, '');
      html += `<h2 class="text-xl font-bold text-white mt-8 mb-3">${headingText}</h2>\n`;
      continue;
    }
    
    // Section headers like "1. Introduction" or "1.0 Overview"
    if (/^\d+(\.\d+)*\.\s+[A-Z]/.test(line)) {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<h3 class="text-lg font-bold text-white mt-6 mb-2">${line}</h3>\n`;
      continue;
    }
    
    // Bullet list items (- or * or •)
    if (/^[-*•]\s+/.test(line)) {
      if (!inList) {
        html += '<ul class="list-disc list-inside space-y-1 my-2 pl-2 text-white/80 text-base leading-relaxed">\n';
        inList = true;
      }
      const itemText = line.replace(/^[-*•]\s+/, '');
      html += `<li>${itemText}</li>\n`;
      continue;
    }
    
    if (inList) {
      html += '</ul>\n';
      inList = false;
    }
    
    // Normal text line - uniform readable font size!
    html += `<p class="text-base text-white/80 leading-relaxed mb-3">${line}</p>\n`;
  }
  
  if (inList) {
    html += '</ul>\n';
  }
  
  return html;
}

export function GameLegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const { slug } = useParams<{ slug: string }>();
  const { data } = useStore();
  
  if (!data) return null;
  
  const game = data.games?.find(g => g.slug === slug);
  
  if (!game) return <NotFound />;
  
  const legalData = type === 'privacy' ? game.privacyPolicy : game.termsAndConditions;
  
  if (!legalData?.enabled) return <NotFound />;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#0A051A] min-h-screen pt-32 pb-24 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/games/${game.slug}`} className="text-[#FFD600] font-bold hover:underline mb-8 inline-block">
          &larr; Back to {game.name}
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black mb-4">{legalData.title}</h1>
        <div className="text-white/50 text-sm font-medium mb-12 uppercase tracking-widest border-b border-white/10 pb-8">
          Last Updated: {new Date(legalData.lastUpdated || game.updatedAt).toLocaleDateString()}
        </div>
        
        <div 
          className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-a:text-[#FFD600]"
          dangerouslySetInnerHTML={{ __html: formatLegalText(legalData.content) }}
        />
        
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <a 
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(legalData.content)}`} 
            download={`${game.slug}-${type}.txt`}
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors"
          >
            Download as Text
          </a>
        </div>
      </div>
    </div>
  );
}
