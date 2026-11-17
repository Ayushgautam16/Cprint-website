'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Shield, Award, CheckCircle } from 'lucide-react';
import Emblem from '../brand/Emblem';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0B132B] via-[#070D1F] to-[#040814] pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-[#D4AF37]/20">
      {/* Background Decorative Rings & Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#D4AF37]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Crown Crest & Sub-badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111C3A] border border-[#D4AF37]/40 shadow-lg">
              <Emblem size={20} />
              <span className="text-xs uppercase font-semibold tracking-widest text-[#F3E5AB]">
                Atelier of Bespoke Gifting
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-[1.15]">
              Make It Personal.{' '}
              <span className="gold-gradient-text block mt-1">Make It RYNOCHI.</span>
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Turn everyday essentials into extraordinary keepsakes with precision laser engraving
              and bespoke printing. From handcrafted leather journals to solid brass executive pens,
              craft unforgettable impressions for yourself and those who matter.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/shop"
                className="btn-luxury-gold w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold tracking-wide text-navy-950 shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-2 group/btn"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </Link>

              <Link
                href="/product/executive-diary-pen-gift-box-set"
                className="btn-luxury-ghost w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37] transition-transform duration-300 group-hover:rotate-12" />
                <span>Customize Your Gift</span>
              </Link>
            </div>

            {/* Hallmark Trust Pillars */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-navy-800/80 max-w-xl mx-auto lg:mx-0 text-left">
              <div>
                <span className="block text-xl font-bold font-serif text-[#D4AF37]">0.02mm</span>
                <span className="text-xs text-gray-400">Fiber Laser Precision</span>
              </div>
              <div>
                <span className="block text-xl font-bold font-serif text-[#D4AF37]">24-48h</span>
                <span className="text-xs text-gray-400">Express Dispatch</span>
              </div>
              <div>
                <span className="block text-xl font-bold font-serif text-[#D4AF37]">100%</span>
                <span className="text-xs text-gray-400">Defect-Free Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Product Showcase Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Showcase Box */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#101B3B] to-[#070D1F] border border-[#D4AF37]/40 shadow-2xl p-4 sm:p-5 group hover-luxury-card">
                <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-navy-950">
                  <Image
                    src="/images/products/diary-pen-giftset-box.jpg"
                    alt="RYNOCHI Signature Gift Box Set: Diary and Pen"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070C1E]/60 via-transparent to-transparent opacity-80" />

                  {/* Luxury Hallmark Callout Badge placed cleanly on top-right of image */}
                  <div className="absolute top-3 right-3 z-10 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0B132B]/95 backdrop-blur-md border border-[#D4AF37]/50 shadow-xl">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] flex items-center justify-center text-navy-950">
                      <Award className="w-4 h-4 text-navy-950 font-bold" />
                    </div>
                    <div>
                      <h4 className="text-xs font-serif font-bold text-white leading-tight">Premium PU Leather</h4>
                      <p className="text-[10px] text-gray-400 leading-tight">Hand-stitched • 80 GSM Paper</p>
                    </div>
                  </div>
                </div>

                {/* Product Tag & Pricing */}
                <div className="mt-4 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                      Featured Executive Set
                    </span>
                    <h3 className="text-base font-serif font-bold text-white">
                      Executive Diary & Pen Gift Suite
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Complimentary nameplate laser engraving included
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-lg font-bold text-[#D4AF37] font-serif block">
                      ₹1,899
                    </span>
                    <span className="text-xs text-gray-500 line-through">₹2,499</span>
                  </div>
                </div>

                {/* Action Bar - Clean, completely unobstructed */}
                <div className="mt-4 pt-3 border-t border-navy-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Ready for immediate personalization</span>
                  </span>
                  <Link
                    href="/product/executive-diary-pen-gift-box-set"
                    className="text-[#D4AF37] hover:text-[#F3E5AB] font-semibold flex items-center gap-1 group/link transition-colors"
                  >
                    <span>Personalize Now</span>
                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

