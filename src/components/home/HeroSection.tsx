'use client';

import React from 'react';
import Link from 'next/link';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="top"
      className="relative bg-[radial-gradient(ellipse_at_74%_40%,#FBF1D2_0%,#FFFDF8_58%)] overflow-hidden"
    >
      {/* Decorative Spinning Orbit Rings */}
      <svg
        aria-hidden="true"
        width="900"
        height="900"
        viewBox="0 0 900 900"
        fill="none"
        className="absolute right-[-200px] top-[-120px] opacity-70 pointer-events-none"
      >
        <g className="spin" style={{ transformOrigin: '450px 450px' }}>
          <circle cx="450" cy="450" r="400" stroke="#C9A24B" strokeOpacity="0.45" strokeDasharray="2 14" strokeWidth="2" />
          <circle cx="850" cy="450" r="7" fill="#C9A24B" />
        </g>
        <g className="spin-r" style={{ transformOrigin: '450px 450px' }}>
          <circle cx="450" cy="450" r="320" stroke="#C9A24B" strokeOpacity="0.35" />
          <circle cx="130" cy="450" r="5" fill="#D9B45C" />
        </g>
        <circle cx="450" cy="450" r="240" stroke="#C9A24B" strokeOpacity="0.25" />
      </svg>

      {/* Twinkling Star Accents */}
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        className="absolute left-[8%] top-[22%] tw"
      >
        <path d="M7 0l1.6 5.4L14 7l-5.4 1.6L7 14l-1.6-5.4L0 7l5.4-1.6z" fill="#C9A24B" />
      </svg>
      <svg
        aria-hidden="true"
        width="10"
        height="10"
        viewBox="0 0 14 14"
        className="absolute left-[46%] top-[14%] tw2"
      >
        <path d="M7 0l1.6 5.4L14 7l-5.4 1.6L7 14l-1.6-5.4L0 7l5.4-1.6z" fill="#D9B45C" />
      </svg>
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 14 14"
        className="absolute left-[50%] bottom-[14%] tw3"
      >
        <path d="M7 0l1.6 5.4L14 7l-5.4 1.6L7 14l-1.6-5.4L0 7l5.4-1.6z" fill="#C9A24B" />
      </svg>

      <div className="wrap relative flex flex-wrap items-center gap-10 pt-[70px] pb-[100px] min-h-[720px]">
        {/* Left Column: Headlines & CTAs */}
        <div className="flex-1 basis-[480px] min-w-0 max-w-[620px]">
          <div className="eyebrow hero-in d1 flex items-center gap-3.5">
            <span className="w-11 h-[2px] bg-[#C9A24B] inline-block" />
            Laser engraving &amp; premium printing
          </div>

          <h1 className="serif mt-6 text-[clamp(48px,7.4vw,98px)] leading-[0.98] font-semibold tracking-[-0.01em] text-[#2A2620]">
            <span className="hero-in d2 block">Make It</span>
            <span className="hero-in d3 block">Personal.</span>
            <span className="hero-in d4 block">
              Make It <span className="shimmer">RYNOCHI.</span>
            </span>
          </h1>

          <p className="hero-in d5 mt-7 text-[19px] leading-[1.7] text-[#5B5444] max-w-[520px]">
            Turn everyday essentials into extraordinary keepsakes with premium personalized printing and laser engraving.
          </p>

          <div className="hero-in d6 flex flex-wrap gap-4 mt-10">
            <Link href="#shop" className="btn btn-gold">
              <span>Explore Collection</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="#customizer" className="btn btn-line">
              Customize Your Gift
            </Link>
          </div>

          <div className="hero-in d6 flex flex-wrap gap-x-7 gap-y-3 mt-11 text-[#5B5444] text-[13px] font-semibold tracking-[0.06em]">
            <span className="flex items-center gap-2">
              <span className="text-[#B88A2E] font-bold">✓</span> Name, logo or message
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#B88A2E] font-bold">✓</span> Proof before production
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#B88A2E] font-bold">✓</span> Corporate friendly
            </span>
          </div>
        </div>

        {/* Right Column: Floating Luxury Product Showcase */}
        <div className="flex-1 basis-[440px] min-w-0 flex justify-center">
          <div className="relative w-full max-w-[640px] aspect-[1/1.04]">
            {/* Glow pulse backdrop */}
            <div
              className="glowpulse absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(201,162,75,0.38),transparent_68%)] pointer-events-none"
              aria-hidden="true"
            />

            {/* Center: Gold Box Set */}
            <div className="fc f3 left-[16%] top-[12%] w-[66%]">
              <img
                src="/images/showcase/hero-gold-box-set.jpg"
                alt="RYNOCHI personalized diary and pen gift set in a gold pattern box"
              />
            </div>

            {/* Top-Left: Black Pen with Name */}
            <div className="fc f1 left-[-3%] top-[-1%] w-[40%]">
              <img
                src="/images/showcase/hero-black-pen.jpg"
                alt="Black pen laser engraved with a customer name"
              />
            </div>

            {/* Top-Right: Textured Metal Pen & Box */}
            <div className="fc f2 right-[-3%] top-[2%] w-[36%]">
              <img
                src="/images/showcase/hero-textured-pen.jpg"
                alt="Textured metal pen with RYNOCHI gift box"
              />
            </div>

            {/* Bottom-Left: Grey Diary */}
            <div className="fc f4 left-[-4%] bottom-[-2%] w-[27%]">
              <img
                src="/images/showcase/hero-grey-diary.jpg"
                alt="Grey textured diary with a personalized name plate"
              />
            </div>

            {/* Bottom-Right: Floating Pill */}
            <div className="pill right-[2%] bottom-[10%]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B88A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3l2.5 6 6.5.5-5 4.3 1.6 6.4L12 16.5 6.4 20.2 8 13.8 3 9.5 9.5 9z" />
              </svg>
              <span>Laser engraved to order</span>
            </div>
          </div>
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 bottom-[22px] w-[22px] h-[36px] border-[1.5px] border-[#C9A24B] rounded-[12px] -translate-x-1/2 flex justify-center pt-[7px]"
      >
        <span className="scrollhint w-[3px] h-[7px] rounded-[2px] bg-[#B88A2E]" />
      </div>
    </section>
  );
};

export default HeroSection;
