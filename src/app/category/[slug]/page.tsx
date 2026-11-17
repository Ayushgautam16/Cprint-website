import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { CATEGORIES, PRODUCTS } from '@/lib/mockData';
import { getBreadcrumbStructuredData } from '@/lib/seo';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = CATEGORIES.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = PRODUCTS.filter((p) => p.categoryId === category.id);

  const breadcrumbsJsonLd = getBreadcrumbStructuredData([
    { name: 'Home', url: 'https://rynochi.com' },
    { name: 'Categories', url: 'https://rynochi.com/shop' },
    { name: category.name, url: `https://rynochi.com/category/${category.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-[#070C1E] py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#D4AF37] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">
            Collections
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#F3E5AB] font-medium">{category.name}</span>
        </nav>

        {/* Category Header Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#101B3B] to-[#070D1F] border border-[#D4AF37]/30 shadow-2xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-950/60 border border-[#D4AF37]/40 text-xs font-semibold uppercase tracking-widest text-[#F3E5AB]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Official Collection
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm text-gray-300 max-w-2xl leading-relaxed font-sans">
            {category.description}
          </p>
          <div className="pt-2 text-xs text-[#C5A059] font-medium">
            {categoryProducts.length} Heirloom pieces available for custom personalization
          </div>
        </div>

        {/* Product Cards Grid */}
        {categoryProducts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#091126] border border-navy-800">
            <p className="text-sm text-gray-400">
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
            {categoryProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

