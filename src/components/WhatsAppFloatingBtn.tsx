'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export function WhatsAppFloatingBtn({ hotline = '966591206299' }: { hotline?: string }) {
  const defaultText = encodeURIComponent(
    'Assalam o Alaikum! I need Umrah taxi transfer assistance.'
  );

  return (
    <aside aria-label="Customer support" className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <a
        href={`https://api.whatsapp.com/send?phone=${hotline}&text=${defaultText}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Booking Chat"
        className="group relative flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
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
