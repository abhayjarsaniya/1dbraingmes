import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface WhatsAppButtonProps {
  game?: any;
  context?: 'general' | 'game' | 'support' | 'feedback';
  className?: string;
  variant?: 'solid' | 'outline' | 'icon';
}

export function WhatsAppButton({ game, context = 'general', className = '', variant = 'solid' }: WhatsAppButtonProps) {
  const { data } = useStore();
  const globalWhatsapp = data?.settings?.whatsapp;
  
  // Decide which settings to use
  let number = globalWhatsapp?.number || '';
  let message = globalWhatsapp?.defaultMessage || 'Hi, I would like to contact you.';

  // If we have game-specific whatsapp enabled
  if (game?.whatsapp?.enabled) {
    if (game.whatsapp.number) number = game.whatsapp.number;
    if (game.whatsapp.message) message = game.whatsapp.message;
  } else if (game) {
    // Dynamic context message if no custom game message is set
    if (context === 'game') message = `Hi, I want to know more about ${game.name}.`;
    if (context === 'support') message = `Hi, I need help regarding ${game.name}.`;
    if (context === 'feedback') message = `Hi, I would like to share feedback about ${game.name}.`;
  }

  if (!number) return null; // Don't show if no number configured

  // Strip non-digits from number
  const cleanNumber = number.replace(/\D/g, '');
  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  if (variant === 'icon') {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center p-3 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors ${className}`} title="Chat on WhatsApp">
        <MessageCircle className="w-5 h-5" />
      </a>
    );
  }

  if (variant === 'outline') {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold transition-colors ${className}`}>
        <MessageCircle className="w-5 h-5" />
        Chat With Us
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a] font-bold shadow-lg shadow-[#25D366]/20 transition-colors ${className}`}>
      <MessageCircle className="w-5 h-5" />
      Chat on WhatsApp
    </a>
  );
}
