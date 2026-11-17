'use client';

import React from 'react';
import { useLiveSettings } from '@/lib/store';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useLiveSettings();

  if (!settings || !settings.announcementActive) return null;

  const text =
    settings?.announcementText ||
    '✨ FREE ALL-INDIA SHIPPING ON ORDERS ABOVE ₹999 • COMPLIMENTARY PRECISION LASER ENGRAVING • DISPATCH WITHIN 24–48 HOURS • ZERO DEFECT SATISFACTION GUARANTEE';

  return (
    <aside
      aria-label="Announcement"
      className="bg-[#F8F2E3] border-b border-[#EBDDB4] text-[#7A5C16] text-xs font-semibold py-2 overflow-hidden"
    >
      <div className="marq flex items-center text-[12px] tracking-[.18em] uppercase gap-6">
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
      </div>
    </aside>
  );
};

export default AnnouncementBar;
