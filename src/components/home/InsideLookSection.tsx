'use client';

import React, { useState } from 'react';

const TABS = [
  {
    label: 'Black Leather Diary',
    img: '/images/showcase/inside-black-diary-exploded.jpg',
    alt: 'Exploded view of the RYNOCHI black leather diary showing every layer',
    maxWidth: '100%',
  },
  {
    label: 'Grey Notebook Diary',
    img: '/images/showcase/inside-grey-diary-dimensions.jpg',
    alt: 'Exploded view of the RYNOCHI grey notebook diary with dimensions',
    maxWidth: '100%',
  },
  {
    label: 'Diary & Pen Gift Set',
    img: '/images/showcase/inside-giftset-exploded.jpg',
    alt: 'Exploded view and components of the RYNOCHI diary and pen gift set',
    maxWidth: '760px',
  },
];

export const InsideLookSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="inside" className="py-28 bg-[#FFFDF8]">
      <div className="wrap">
        <div className="text-center max-w-[760px] mx-auto">
          <div className="eyebrow">Inside look</div>
          <h2 className="serif mt-4 text-[clamp(40px,5.5vw,68px)] leading-[1.04] font-semibold text-[#2A2620]">
            See what makes it <span className="shimmer">premium</span>
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mt-11">
          {TABS.map((tab, idx) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(idx)}
              className="tab"
              style={{
                background:
                  activeTab === idx
                    ? 'linear-gradient(110deg,#C9A24B,#F0DFAE)'
                    : '#fff',
                color: activeTab === idx ? '#2A2620' : '#7A5C16',
                border: activeTab === idx ? '1px solid #C9A24B' : '1px solid #D9C48C',
                boxShadow:
                  activeTab === idx
                    ? '0 10px 24px rgba(201,162,75,.35)'
                    : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Interactive Diagram Showcase */}
        <div className="relative mt-10">
          <div className="relative bg-white border border-[#EBDDB4] p-3.5 shadow-[0_34px_70px_rgba(122,92,22,0.16)] max-w-[1100px] mx-auto overflow-hidden">
            <div className="sweepline" />
            <img
              key={TABS[activeTab].img}
              src={TABS[activeTab].img}
              alt={TABS[activeTab].alt}
              className="swap w-full h-auto mx-auto object-contain"
              style={{ maxWidth: TABS[activeTab].maxWidth }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsideLookSection;

