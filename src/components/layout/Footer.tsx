import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { WhatsAppButton } from '../ui/WhatsAppButton';

export function Footer() {
  const { data } = useStore();
  if (!data?.settings?.footer.enabled) return null;
  
  const { footer, companyName } = data.settings;
  const activeSocials = footer.socialLinks.filter(s => s.visible);

  return (
    <footer className="bg-white/5 border-t border-white/5 py-16 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{companyName}</h3>
            <p className="text-white/60 leading-relaxed max-w-sm text-sm">
              {footer.description}
            </p>
          </div>
          <div>
            <h4 className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-4">Company</h4>
            <ul className="space-y-2 text-white/60 text-sm font-medium">
              <li><Link to="/games" className="hover:text-white transition-colors">Games</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2 text-white/60 text-sm font-medium">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link to="/admin" className="hover:text-amber-400 transition-colors flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Admin Portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
          <p className="text-xs text-white/30 font-medium mb-4 md:mb-0">{footer.copyrightText}</p>
          <div className="flex gap-4 items-center">
            {activeSocials.length > 0 && (
              <div className="flex gap-4">
                {activeSocials.map((social, i) => (
                  <a key={i} href={social.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer text-[10px] font-bold">
                    {social.platform.substring(0, 2).toUpperCase()}
                  </a>
                ))}
              </div>
            )}
            {data.settings?.whatsapp?.enabled && (
               <WhatsAppButton variant="icon" />
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
