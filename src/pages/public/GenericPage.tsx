import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Helmet } from 'react-helmet-async';
import { WhatsAppButton } from '../../components/ui/WhatsAppButton';

function formatLegalText(text: string) {
  if (!text) return '<p class="text-white/60">No content provided.</p>';
  if (/<\s*(p|div|h[1-6]|ul|ol|table|br)\b[^>]*>/i.test(text)) return text;

  const lines = text.split(/\r?\n/);
  let html = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (inList) { html += '</ul>\n'; inList = false; }
      continue;
    }

    if (/^#{1,3}\s+/.test(line)) {
      if (inList) { html += '</ul>\n'; inList = false; }
      const headingText = line.replace(/^#{1,3}\s+/, '');
      html += `<h2 class="text-xl font-bold text-white mt-8 mb-3">${headingText}</h2>\n`;
      continue;
    }

    if (/^\d+(\.\d+)*\.\s+[A-Z]/.test(line)) {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<h3 class="text-lg font-bold text-white mt-6 mb-2">${line}</h3>\n`;
      continue;
    }

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

    html += `<p class="text-base text-white/80 leading-relaxed mb-3">${line}</p>\n`;
  }

  if (inList) html += '</ul>\n';
  return html;
}

export function GenericPage({ slugOverride }: { slugOverride?: string }) {
  const { data } = useStore();
  const { slug } = useParams<{ slug: string }>();
  
  const targetSlug = slugOverride || slug;
  
  if (!data || !data.pages) return null;
  
  const page = data.pages?.find(p => p.slug === targetSlug && p.status === 'Published');
  
  if (!page) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-[70vh] bg-[#0A051A] text-white pt-32 pb-20">
      <Helmet>
        <title>{page.seo.title}</title>
        <meta name="description" content={page.seo.description} />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-black mb-12">{page.name}</h1>
        
        <div className="space-y-12">
          {page.sections.filter(s => s.visible).sort((a,b) => a.sortOrder - b.sortOrder).map(section => (
            <div key={section.id} className="prose prose-invert prose-lg max-w-none">
              {section.title && section.type !== 'richText' && <h2 className="text-2xl font-bold mb-4">{section.title}</h2>}
              {section.description && <p className="text-gray-400 mb-6">{section.description}</p>}
              
              {section.type === 'richText' && (
                <div dangerouslySetInnerHTML={{ __html: formatLegalText(section.content) }} className="w-full prose-headings:font-black prose-a:text-[#FFD600]" />
              )}
            </div>
          ))}
        </div>
        {targetSlug === 'contact' && data.settings?.whatsapp?.enabled && (
          <div className="mt-16 p-8 bg-[#1E1E2E] rounded-3xl border border-white/10 text-center">
            <h2 className="text-3xl font-black mb-4">Want to talk to us directly?</h2>
            <p className="text-white/60 mb-8">Reach out on WhatsApp for a faster response.</p>
            <WhatsAppButton context="general" />
          </div>
        )}

      </div>
    </div>
  );
}
