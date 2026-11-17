'use client';

import React from 'react';
import Link from 'next/link';

export const VisualBannerSection: React.FC = () => {
  return (
    <section className="pt-10 pb-28 bg-[#FFFDF8]">
      <div className="wrap">
        <div className="relative overflow-hidden border border-[#EBDDB4] shadow-[0_34px_70px_rgba(122,92,22,0.16)] bg-white">
          <div className="overflow-hidden aspect-[16/9] max-h-[640px] w-full">
            <img
              src="/images/showcase/banner-pen-luxury-box.jpg"
              alt="RYNOCHI textured metal pen next to its black gift box"
              className="w-full h-full object-cover object-center transition-transform duration-1000 hover:scale-105"
            />
          </div>

          <div className="f2 absolute left-[5%] bottom-[8%] max-w-[420px] bg-[rgba(255,253,248,0.96)] backdrop-blur-md border border-[#EBDDB4] p-7 sm:p-8 shadow-[0_24px_50px_rgba(122,92,22,0.22)]">
            <div className="eyebrow">Precision laser engraving</div>
            <h3 className="serif mt-3 text-[32px] sm:text-[36px] leading-[1.1] font-semibold text-[#2A2620]">
              Detail you can see and feel
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5B5444]">
              Calibrated MOPA fiber laser etching that vaporizes microns of surface coating to expose rich underlying metallic luster.
            </p>
            <Link href="#shop" className="btn btn-gold mt-5 !min-h-[46px] px-6">
              Shop Pens
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualBannerSection;

