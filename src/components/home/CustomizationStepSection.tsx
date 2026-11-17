'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Type, Eye, ArrowRight, ShieldCheck } from 'lucide-react';

export const CustomizationStepSection: React.FC = () => {
  const [demoName, setDemoName] = useState('Vikramaditya Roy');
  const [demoFont, setDemoFont] = useState('Great Vibes');

  const getDemoFontSize = (name: string) => {
    if (name.length > 20) return 'text-sm sm:text-base';
    if (name.length > 14) return 'text-base sm:text-lg';
    return 'text-lg sm:text-xl';
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#070D1F] via-[#0B132B] to-[#070D1F] relative overflow-hidden border-y border-[#D4AF37]/20">
      {/* Subtle Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111C3A] border border-[#D4AF37]/30 text-xs font-semibold uppercase tracking-widest text-[#F3E5AB]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Bespoke Creation Process
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
            Your Design. Your Name.{' '}
            <span className="gold-gradient-text block sm:inline">Your Creation.</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
            Experience effortless personalization in three curated steps. No design software needed—preview
            your laser engraved keepsake in real time.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <div className="p-8 rounded-2xl bg-[#091126] border border-navy-800 hover-luxury-card shadow-xl space-y-4 relative group">
            <span className="text-4xl font-serif font-extrabold text-[#D4AF37]/30 group-hover:text-[#D4AF37] transition-colors duration-300">
              01
            </span>
            <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#F3E5AB] transition-colors duration-300">Choose Your Product</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
              Select from handcrafted A5 leather diaries, solid brass executive rollerballs,
              touchscreen styluses, or coordinated corporate suites.
            </p>
            <div className="pt-2 text-xs text-[#C5A059] font-semibold flex items-center gap-1">
              <span>Over 50+ heirloom items</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-8 rounded-2xl bg-[#091126] border border-[#D4AF37]/50 hover-luxury-card shadow-xl space-y-4 relative group">
            <span className="text-4xl font-serif font-extrabold text-[#D4AF37] group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.6)] transition-all duration-300">
              02
            </span>
            <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#F3E5AB] transition-colors duration-300">Personalize with Precision</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
              Type recipient names, corporate titles, or upload high-resolution vector logos.
              Select from curated serif, script, or modern typography fonts.
            </p>
            <div className="pt-2 text-xs text-[#C5A059] font-semibold flex items-center gap-1">
              <span>0.02mm Fiber Laser Accuracy</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-8 rounded-2xl bg-[#091126] border border-navy-800 hover-luxury-card shadow-xl space-y-4 relative group">
            <span className="text-4xl font-serif font-extrabold text-[#D4AF37]/30 group-hover:text-[#D4AF37] transition-colors duration-300">
              03
            </span>
            <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#F3E5AB] transition-colors duration-300">Preview, Approve & Order</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
              Instantly inspect the live digital proof on the product mockup. Securely pay with
              UPI or card via Razorpay and track every crafting milestone.
            </p>
            <div className="pt-2 text-xs text-[#C5A059] font-semibold flex items-center gap-1">
              <span>Dispatch in 24-48 Hours</span>
            </div>
          </div>
        </div>

        {/* Interactive Mini-Studio Widget */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#101B3B] via-[#0B132B] to-[#101B3B] border border-[#D4AF37]/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
                  Try It Live Now
                </span>
                <h4 className="text-2xl font-serif font-bold text-white">
                  Type Any Name to See the Gold Laser Engraving
                </h4>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Recipient Name / Organization:
                </label>
                <input
                  type="text"
                  maxLength={25}
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-[#D4AF37]/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Choose Style:
                </label>
                <div className="flex gap-2">
                  {['Great Vibes', 'Cinzel', 'Montserrat'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setDemoFont(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        demoFont === f
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#F3E5AB]'
                          : 'border-navy-700 bg-navy-950 text-gray-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Preview Card */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-navy-950 border border-navy-800">
              <span className="text-[11px] text-gray-400 uppercase tracking-widest mb-3">
                Simulated Laser Plaque Mockup
              </span>
              <div className="w-full max-w-sm px-6 py-4 rounded-md bg-gradient-to-r from-[#DFBA6F] via-[#F3E5AB] to-[#C5A059] border-2 border-[#AA8417] shadow-2xl flex items-center justify-center text-center">
                <span
                  className={`text-navy-950 font-bold tracking-wider ${getDemoFontSize(demoName)} drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] transition-all duration-200`}
                  style={{
                    fontFamily:
                      demoFont === 'Great Vibes'
                        ? "'Great Vibes', cursive"
                        : demoFont === 'Cinzel'
                        ? "'Cinzel', serif"
                        : "'Montserrat', sans-serif",
                  }}
                >
                  {demoName || 'Your Name Here'}
                </span>
              </div>
              <p className="text-[10px] text-[#D4AF37] mt-3">
                ✓ Rendered in 24K Gold tone with deep laser micro-relief
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizationStepSection;
