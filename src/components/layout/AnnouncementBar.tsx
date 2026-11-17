'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, PhoneCall } from 'lucide-react';
import { INITIAL_SETTINGS } from '@/lib/mockData';

export const AnnouncementBar: React.FC = () => {
  return (
    <aside aria-label="Announcement" className="bg-gradient-to-r from-[#060B18] via-[#0B132B] to-[#060B18] border-b border-[#D4AF37]/30 text-gray-200 text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Contact support pill */}
        <div className="hidden md:flex items-center gap-2 text-gray-400">
          <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Concierge: {INITIAL_SETTINGS.supportPhone}</span>
        </div>

        {/* Center: Promo text */}
        <div className="flex-1 text-center flex items-center justify-center gap-2 text-[11px] sm:text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse flex-shrink-0" />
          <span className="font-medium text-[#F3E5AB]">
            Complimentary Laser Engraving & Free All-India Shipping on Orders &gt; ₹999
          </span>
          <span className="hidden sm:inline text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20 text-[10px]">
            CODE: RYNOCHI10
          </span>
        </div>

        {/* Right: Quick Links */}
        <div className="hidden lg:flex items-center gap-4 text-gray-400 text-xs">
          <Link href="/track-order" className="hover:text-[#D4AF37] transition-colors">
            Track Order
          </Link>
          <span className="text-gray-600">|</span>
          <Link href="/corporate" className="hover:text-[#D4AF37] transition-colors">
            Corporate Gifting
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default AnnouncementBar;

