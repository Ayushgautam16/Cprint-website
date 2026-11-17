'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { PRODUCTS } from '@/lib/mockData';
import ProductCard from '../product/ProductCard';

export const BestsellerGrid: React.FC = () => {
  const bestsellers = PRODUCTS.filter((p) => p.isBestseller || p.isFeatured).slice(0, 4);

  return (
    <section className="py-20 bg-[#0B132B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
                Customer Favorites
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Bestselling Personalized Creations
            </h2>
          </div>

          <Link
            href="/shop"
            className="mt-4 md:mt-0 text-sm font-semibold text-[#D4AF37] hover:text-[#F3E5AB] flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore All 20+ Designs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestsellerGrid;

