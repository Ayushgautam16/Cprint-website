'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/mockData';

export const FeaturedCategories: React.FC = () => {
  return (
    <section className="py-20 bg-[#070D1F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
                Curated Collections
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Explore Our Signature Categories
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 text-sm font-semibold text-[#D4AF37] hover:text-[#F3E5AB] flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative h-80 rounded-2xl overflow-hidden bg-navy-950 border border-navy-800 hover-luxury-card shadow-xl flex flex-col justify-end p-6"
            >
              {/* Category Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-[#060B18]/70 to-transparent" />
              </div>

              {/* Category Information */}
              <div className="relative z-10 space-y-2">
                <div className="inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/30 backdrop-blur-sm">
                  {cat.productCount} Designs Available
                </div>
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-[#F3E5AB] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed font-sans">
                  {cat.description}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;

