'use client';

import React from 'react';

const REVIEWS = [
  {
    quote:
      'We ordered 120 custom engraved leather diaries and pens for our annual executive partner summit. The gold nameplates and crisp logo engraving exceeded all expectations. Every guest commented on the immaculate craftsmanship.',
    author: 'Vikramaditya Roy',
    role: 'Chief Operating Officer, Apex Group',
    product: 'Signature Gold Box Gift Set',
  },
  {
    quote:
      'Ordered the personalized Matte Black rollerball as an anniversary gift for my husband. The brass exposure from the laser cut has a breathtaking golden luster that looks far more luxurious than luxury retail pens costing triple.',
    author: 'Dr. Ananya Sharma',
    role: 'Verified Patron, New Delhi',
    product: 'Matte Black Engraved Pen',
  },
  {
    quote:
      'Fast 48-hour dispatch, responsive WhatsApp design approval, and the packaging presentation box is ready for instant gifting. RYNOCHI has become our permanent partner for corporate onboarding.',
    author: 'Raghav Singhania',
    role: 'VP Human Resources, Zscaler India',
    product: 'Executive Diary & Pen Suite',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-28 bg-[#F8F2E3]">
      <div className="wrap">
        <div className="text-center max-w-[680px] mx-auto">
          <div className="eyebrow">Customer stories</div>
          <h2 className="serif mt-4 text-[clamp(38px,5vw,60px)] leading-[1.05] font-semibold text-[#2A2620]">
            Words from people who gifted RYNOCHI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {REVIEWS.map((rev) => (
            <figure
              key={rev.author}
              className="m-0 p-8 sm:p-9 bg-white border border-[#EBDDB4] shadow-sm flex flex-col gap-4 min-h-[260px] justify-between transition-transform duration-300 hover:-translate-y-1.5"
            >
              <div>
                <div className="serif text-[56px] leading-[0.6] text-[#C9A24B] mb-4">“</div>
                {/* 5 gold stars */}
                <div className="flex gap-1 text-[#C9A24B] text-sm mb-3">
                  {'★★★★★'}
                </div>
                <blockquote className="m-0 text-[15.5px] leading-[1.7] text-[#5B5444]">
                  {rev.quote}
                </blockquote>
              </div>
              <figcaption className="mt-4 pt-4 border-t border-[#EBDDB4]/50">
                <div className="text-[13px] font-bold tracking-[.08em] uppercase text-[#7A5C16]">
                  {rev.author}
                </div>
                <div className="text-xs text-[#6E675A] mt-0.5">{rev.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
