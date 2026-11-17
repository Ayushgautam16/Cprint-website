'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { Category, Product } from '@/lib/types';
import { useLiveProducts, useLiveCategories } from '@/lib/store';

interface CategoryDetailLiveProps {
  initialCategory: Category;
  initialProducts: Product[];
}

export const CategoryDetailLive: React.FC<CategoryDetailLiveProps> = ({
  initialCategory,
  initialProducts,
}) => {
  const { categories } = useLiveCategories();
  const { allProducts } = useLiveProducts();

  const currentCategory =
    categories.find((c) => c.slug === initialCategory.slug || c.id === initialCategory.id) ||
    initialCategory;

  const categoryProducts = allProducts.filter(
    (p) => p.categoryId === currentCategory.id || p.categoryName === currentCategory.name
  );

  const displayProducts = categoryProducts.length > 0 ? categoryProducts : initialProducts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#6E675A] mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#D4AF37] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">
          Collections
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#7A5C16] font-medium">{currentCategory.name}</span>
      </nav>

      {/* Category Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#101B3B] to-[#070D1F] border border-[#D4AF37]/30 shadow-2xl mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-[#D4AF37]/40 text-xs font-semibold uppercase tracking-widest text-[#7A5C16]">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          Official Collection
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-[#2A2620] tracking-tight">
          {currentCategory.name}
        </h1>
        <p className="text-sm text-[#5B5444] max-w-2xl leading-relaxed font-sans">
          {currentCategory.description}
        </p>
        <div className="pt-2 text-xs text-[#C5A059] font-medium">
          {displayProducts.length} Heirloom pieces available for custom personalization
        </div>
      </div>

      {/* Product Cards Grid */}
      {displayProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#F8F2E3] border border-[#EBDDB4]">
          <p className="text-sm text-[#6E675A]">
            New customized items are currently being added to this collection.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-block px-5 py-2 rounded-xl text-xs font-semibold bg-[#D4AF37] text-navy-950"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDetailLive;