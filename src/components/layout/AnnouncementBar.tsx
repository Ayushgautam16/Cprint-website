'use client';

import React from 'react';
import Link from 'next/link';

export const AnnouncementBar: React.FC = () => {
  return (
    <aside
      aria-label="Announcement"
      className="bg-[#F8F2E3] border-b border-[#EBDDB4] text-[#7A5C16] text-xs font-semibold py-2 overflow-hidden"
    >
      <div className="marq flex items-center text-[12px] tracking-[.18em] uppercase">
        <span>✨ FREE ALL-INDIA SHIPPING ON ORDERS ABOVE ₹999</span>
        <span>•</span>
        <span>COMPLIMENTARY PRECISION LASER ENGRAVING</span>
        <span>•</span>
        <span>DISPATCH WITHIN 24–48 HOURS</span>
        <span>•</span>
        <span>ZERO DEFECT SATISFACTION GUARANTEE</span>
        <span>•</span>
        <span>DIGITAL ARTWORK PROOF BEFORE PRODUCTION</span>
        <span>•</span>
        <span>✨ FREE ALL-INDIA SHIPPING ON ORDERS ABOVE ₹999</span>
        <span>•</span>
        <span>COMPLIMENTARY PRECISION LASER ENGRAVING</span>
        <span>•</span>
        <span>DISPATCH WITHIN 24–48 HOURS</span>
        <span>•</span>
        <span>ZERO DEFECT SATISFACTION GUARANTEE</span>
        <span>•</span>
        <span>DIGITAL ARTWORK PROOF BEFORE PRODUCTION</span>
      </div>
    </aside>
  );
};

export default AnnouncementBar;
