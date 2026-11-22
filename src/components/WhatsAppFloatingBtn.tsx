'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { getSiteSettings } from '@/lib/supabase/data';
import { cleanWhatsAppNumber, openWhatsAppChat } from '@/lib/whatsapp';

export function WhatsAppFloatingBtn({ hotline }: { hotline?: string }) {
  const [activeNumber, setActiveNumber] = useState<string>(() => {
    if (hotline) return cleanWhatsAppNumber(hotline);
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem('umrah_cached_site_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.whatsapp_number) return cleanWhatsAppNumber(parsed.whatsapp_number);
        }
      } catch (e) {}
    }
    return '923086819634';
  });

  useEffect(() => {
    if (hotline) {
      setActiveNumber(cleanWhatsAppNumber(hotline));
    } else {
      getSiteSettings().then((s) => {
        if (s.whatsapp_number) setActiveNumber(cleanWhatsAppNumber(s.whatsapp_number));
      });
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'umrah_cached_site_settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.whatsapp_number) setActiveNumber(cleanWhatsAppNumber(parsed.whatsapp_number));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [hotline]);

  const defaultText = 'Assalam o Alaikum! I need Umrah taxi transfer assistance.';

  return (
    <aside aria-label="Customer support" className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <a
        href={`https://api.whatsapp.com/send?phone=${activeNumber}&text=${encodeURIComponent(defaultText)}`}
        onClick={(e) => {
          e.preventDefault();
          openWhatsAppChat(activeNumber, defaultText);
        }}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Booking Chat"
        className="group relative flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageSquare className="w-6 h-6 fill-current text-white" />
        <span className="font-bold text-sm tracking-wide hidden sm:inline-block">
          Need Help? Chat WhatsApp
        </span>
      </a>
    </aside>
  );
}
