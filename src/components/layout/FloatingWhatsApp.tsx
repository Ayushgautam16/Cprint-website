'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { INITIAL_SETTINGS } from '@/lib/mockData';

export const FloatingWhatsApp: React.FC = () => {
  const phone = INITIAL_SETTINGS.whatsappNumber || '917277338436';
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    'Hello RYNOCHI! I would like to inquire about customized printing and personalized gifting.'
  )}`;

  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#25D366] via-emerald-500 to-teal-600 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all border border-emerald-300/40 group cursor-pointer"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <MessageCircle className="w-5 h-5 text-white fill-white" />
        <span className="text-xs font-bold tracking-wide">
          Chat with Us
        </span>
      </a>
    </aside>
  );
};

export default FloatingWhatsApp;
