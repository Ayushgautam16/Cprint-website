import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Shield, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import Logo from '@/components/brand/Logo';

export const metadata = {
  title: 'About Our Laser Heritage & Craft | RYNOCHI',
  description:
    'Discover RYNOCHI’s dedication to precision laser engraving, handcrafted PU leather journals, and luxury corporate gifting.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070C1E] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="flex justify-center">
            <Logo size="lg" variant="gold" showTagline={true} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111C3A] border border-[#D4AF37]/30 text-xs font-semibold uppercase tracking-widest text-[#F3E5AB]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            The RYNOCHI Story
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
            Crafting Unforgettable Keepsakes with{' '}
            <span className="gold-gradient-text">Microscopic Precision.</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
            RYNOCHI was born from a simple belief: in a world of fleeting digital messages, tangible,
            personalized items possess irreplaceable emotional and professional gravity.
          </p>
        </div>

        {/* Narrative Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
            <h2 className="text-2xl font-serif font-bold text-white">
              Where Engineering Meets Timeless Artistry
            </h2>
            <p>
              Each RYNOCHI writing instrument and leather diary begins as an uncompromised blank.
              We source solid brass and aerospace alloy cores, multi-layered lacquer finishes, and
              water-resistant, hand-stitched PU leather.
            </p>
            <p>
              Our production floor in Noida, NCR utilizes cutting-edge German MOPA and Fiber Laser
              systems. Operating at 0.02 millimeter tolerances, our lasers vaporize exterior lacquers
              to expose gleaming underlying brass, ensuring a mark that will outlast generations without fading.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:underline"
              >
                <span>Explore the Signature Line</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-square rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-navy-950">
            <Image
              src="/images/products/giftset-diary-pen-showcase.jpg"
              alt="RYNOCHI Craftsmanship"
              fill
              className="object-contain p-4"
            />
          </div>
        </div>

        {/* Core Principles */}
        <div className="p-8 rounded-3xl bg-[#091126] border border-navy-800 space-y-6">
          <h3 className="text-xl font-serif font-bold text-white text-center">
            Our Guiding Standards
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-gray-300">
            <div className="space-y-2 text-center p-4">
              <div className="w-10 h-10 rounded-xl bg-navy-900 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-white text-sm">Authentic Laser Etch</h4>
              <p className="text-gray-400">
                No surface paint or vinyl stickers. Only permanent, thermal fiber laser engraving.
              </p>
            </div>

            <div className="space-y-2 text-center p-4">
              <div className="w-10 h-10 rounded-xl bg-navy-900 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-white text-sm">Signature Packaging</h4>
              <p className="text-gray-400">
                Custom rigid gift presentation boxes with satin pull-ribbons included standard with every piece.
              </p>
            </div>

            <div className="space-y-2 text-center p-4">
              <div className="w-10 h-10 rounded-xl bg-navy-900 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-white text-sm">Zero-Defect Commitment</h4>
              <p className="text-gray-400">
                If our craftsmen make any typographical or mechanical error, we replace it 100% free of charge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

