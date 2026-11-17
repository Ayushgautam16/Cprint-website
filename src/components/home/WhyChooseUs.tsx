'use client';

import React from 'react';

const REASONS = [
  {
    title: 'Premium finishing',
    text: 'Clean edges, balanced weight and a finish that feels as good as it looks.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#B88A2E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 6l5 12 13 1-10 9 3 13-11-7-11 7 3-13-10-9 13-1z" />
      </svg>
    ),
  },
  {
    title: 'Precision laser engraving',
    text: 'Sharp, lasting lettering and logos that do not rub off with daily executive use.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#B88A2E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 40L28 20" />
        <path d="M28 20l12-12M32 8l8 8M36 28a3 3 0 100 .1" />
      </svg>
    ),
  },
  {
    title: 'Personalized designs',
    text: 'Names, messages, logos and special artwork, placed where you want them.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#B88A2E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 38l4-12L34 6l8 8-20 20z" />
        <path d="M30 10l8 8" />
      </svg>
    ),
  },
  {
    title: 'Quality-focused production',
    text: 'Every single piece is scrutinized before dispatch so it arrives ready to gift.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#B88A2E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 24l10 10L40 12" />
      </svg>
    ),
  },
  {
    title: 'Corporate gifting',
    text: 'Batch customization for teams and clients, with a digital vector proof before production.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#B88A2E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 18h32v22H8z" />
        <path d="M24 18v22M6 12h36v6H6z" />
      </svg>
    ),
  },
  {
    title: 'Friendly support',
    text: 'Reach us on WhatsApp anytime for help with designs, quantities and custom bulk quotes.',
    icon: (
      <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#B88A2E" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 12h32v20H20l-8 8v-8H8z" />
        <path d="M16 20h16M16 26h10" />
      </svg>
    ),
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-28 bg-[#F8F2E3]">
      <div className="wrap">
        <div className="max-w-[720px]">
          <div className="eyebrow">Why choose RYNOCHI</div>
          <h2 className="serif mt-4 text-[clamp(40px,5.5vw,68px)] leading-[1.04] font-semibold text-[#2A2620]">
            Crafted with <em className="not-italic text-[#8F6A17]">precision</em>, gifted with pride
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {REASONS.map((reason) => (
            <div key={reason.title} className="why">
              {reason.icon}
              <h3 className="serif mt-6 text-[26px] font-semibold text-[#2A2620]">
                {reason.title}
              </h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-[#5B5444]">
                {reason.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
