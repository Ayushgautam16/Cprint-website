'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLiveProducts, useLiveCategories } from '@/lib/store';
import ProductCard from '../product/ProductCard';

export const BestsellerGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { products: filteredProducts } = useLiveProducts(activeCategory);
  const { categories } = useLiveCategories();

  return (
    <section id="shop" className="py-24 bg-[#F8F2E3]">
      <div className="wrap">
        {/* Header with Title & View All */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[640px]">
            <div className="eyebrow">Bestselling</div>
            <h2 className="serif mt-4 text-[clamp(40px,5.5vw,68px)] leading-[1.04] font-semibold text-[#2A2620]">
              Made to carry your name
            </h2>
          </div>
          <Link href="/shop" className="btn btn-line">
            View all products
          </Link>
        </div>

        <p className="mt-4 text-sm text-[#6E675A]">
          Every piece includes complimentary laser personalization and arrives in a luxury presentation box.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2.5 mt-8 pb-2">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-[#C9A24B] to-[#F0DFAE] text-[#2A2620] shadow-md'
                : 'bg-white text-[#7A5C16] border border-[#D9C48C] hover:bg-[#FFFDF8]'
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#C9A24B] to-[#F0DFAE] text-[#2A2620] shadow-md'
                  : 'bg-white text-[#7A5C16] border border-[#D9C48C] hover:bg-[#FFFDF8]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid with Auto-Swiping Galleries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mt-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestsellerGrid;
