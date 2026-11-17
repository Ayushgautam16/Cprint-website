'use client';

import React from 'react';
import { Sparkles, Shield, Award, Clock, HeartHandshake, Box } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Fiber Laser Precision',
      desc: 'Our German-engineered MOPA fiber lasers etch with 0.02mm accuracy, revealing shining brass undertones that will never peel or fade.',
    },
    {
      icon: Award,
      title: 'Heirloom Finishing',
      desc: 'Triple-lacquered brass barrels, 24K gold PVD accents, and supple full-grain PU leather crafted for decades of dependable use.',
    },
    {
      icon: Box,
      title: 'Luxury Gift Unboxing',
      desc: 'Every item arrives nestled in custom rigid presentation boxes tied with champagne gold satin ribbons, ready for immediate gifting.',
    },
    {
      icon: Clock,
      title: 'Rapid 24-48h Dispatch',
      desc: 'Even personalized orders are custom-engraved and dispatched within 1–2 business days via premier air express couriers.',
    },
    {
      icon: HeartHandshake,
      title: 'Corporate Gifting Concierge',
      desc: 'Dedicated account managers for corporate bulk orders, complimentary digital proofing, and bespoke branding customizations.',
    },
    {
      icon: Shield,
      title: 'Zero-Defect Guarantee',
      desc: 'If your custom engraving has any spelling flaw on our end or transit damage, we issue a 100% free expedited replacement.',
    },
  ];

  return (
    <section className="py-24 bg-[#070D1F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
            The RYNOCHI Distinction
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Why Discerning Clients Choose RYNOCHI
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-sans">
            Every piece we craft is a testament to timeless luxury, mechanical precision, and personal sentiment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-[#0B132B] border border-navy-800 hover-luxury-card shadow-xl space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-900 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#F3E5AB] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

