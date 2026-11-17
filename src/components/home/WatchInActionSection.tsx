'use client';

import React from 'react';

export const WatchInActionSection: React.FC = () => {
  return (
    <section className="relative py-28 bg-gradient-to-b from-[#FFFDF8] to-[#F8F2E3] overflow-hidden">
      <div className="wrap relative">
        <div className="text-center max-w-[720px] mx-auto">
          <div className="eyebrow">Behind the engraving</div>
          <h2 className="serif mt-4 text-[clamp(40px,5.5vw,68px)] leading-[1.04] font-semibold text-[#2A2620]">
            Watch it come to <span className="shimmer">life</span>
          </h2>
          <p className="mt-4 text-base text-[#5B5444]">
            Aerospace fiber laser optics running at 20W power output, etching precision names and logos within seconds.
          </p>
        </div>

        <div className="relative mt-16 flex justify-center">
          {/* Main Video / Showcase Frame */}
          <div className="media-ph w-full max-w-[920px] aspect-[16/9] gap-5 shadow-[0_30px_60px_rgba(122,92,22,0.12)]">
            <button
              type="button"
              className="playbtn"
              aria-label="Play showreel video"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <span className="text-xs uppercase font-bold tracking-[.2em] text-[#7A5C16]">
              RYNOCHI STUDIO SHOWREEL
            </span>
            <span className="text-xs text-[#5B5444] font-medium tracking-[.06em]">
              High-Precision Laser Engraving &amp; Hand-Finishing
            </span>
          </div>

          {/* Floating Product Accents */}
          <div className="fc f1 hidden sm:block left-0 -top-12 w-[20%] max-w-[220px]">
            <img
              src="/images/showcase/hero-black-diary.jpg"
              alt="Black leather diary with a personalized name plate"
            />
          </div>

          <div className="fc f5 hidden sm:block right-0 -bottom-12 w-[24%] max-w-[270px]">
            <img
              src="/images/showcase/showcase-white-box-set.jpg"
              alt="RYNOCHI diary and pen gift set in a white box"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WatchInActionSection;

