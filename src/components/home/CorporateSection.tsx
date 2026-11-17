'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, CheckCircle2, MessageCircle, ArrowRight, ShieldAlert } from 'lucide-react';

export const CorporateSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#0B132B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-gradient-to-r from-[#070D1F] via-[#101B3B] to-[#070D1F] border border-[#D4AF37]/30 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111C3A] border border-[#D4AF37]/30 text-xs font-semibold uppercase tracking-widest text-[#F3E5AB]">
                <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                Corporate & Bulk Gifting
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
                Strengthen Client & Team Relationships With{' '}
                <span className="gold-gradient-text">Bespoke Executive Suites.</span>
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                Whether you are welcoming new leadership, celebrating annual milestones, or expressing gratitude to valued partners, RYNOCHI delivers turn-key corporate gifting programs tailored to your brand identity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>Custom Logo Laser Marking & Foil Deboss</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>Tiered Volume Rates (25 to 5,000+ units)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>Complimentary WhatsApp Digital Proofs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <span>Individual Pan-India Multi-Address Shipping</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link
                  href="/corporate"
                  className="btn-luxury-gold w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center gap-2 group/btn"
                >
                  <span>Request Corporate Catalog & Quote</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Link>

                <a
                  href="https://wa.me/919876543210?text=Hello%20RYNOCHI%20Corporate%20Desk!%20I%20would%20like%20a%20bulk%20quote%20for%20our%20firm."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Bulk Desk</span>
                </a>
              </div>
            </div>

            {/* Right Product Image Montage */}
            <div className="lg:col-span-5 relative group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-navy-950 hover-luxury-card">
                <Image
                  src="/images/products/giftset-diary-pen-showcase.jpg"
                  alt="Corporate Gifting Showcase"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateSection;

