'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Sparkles, X } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useLiveProducts, useLiveCategories } from '@/lib/store';
import { Product } from '@/lib/types';

function ShopContent() {
  const { allProducts } = useLiveProducts();
  const { categories } = useLiveCategories();

  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMechanism, setSelectedMechanism] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [onlyCustomizable, setOnlyCustomizable] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return (Array.isArray(allProducts) ? allProducts : []).filter((product) => {
      if (!product) return false;
      // Category filter
      if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
        return false;
      }
      // Customizable filter
      if (onlyCustomizable && !product.isCustomizable) {
        return false;
      }
      // Price filter
      const effectivePrice = product.discountPrice || product.basePrice || 0;
      if (effectivePrice > priceRange) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (product.name || '').toLowerCase().includes(q);
        const matchesDesc = (product.shortDescription || '').toLowerCase().includes(q);
        const matchesSku = (product.sku || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesSku) return false;
      }
      // Pen Mechanism filter
      if (selectedMechanism !== 'all') {
        const mech = product.specifications?.['Pen Mechanism'];
        if (mech !== selectedMechanism) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (!a || !b) return 0;
      const priceA = a.discountPrice || a.basePrice || 0;
      const priceB = b.discountPrice || b.basePrice || 0;

      switch (sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [allProducts, searchQuery, selectedCategory, selectedMechanism, sortBy, priceRange, onlyCustomizable]);

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left space-y-2 border-b border-[#EBDDB4] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111C3A] border border-[#D4AF37]/30 text-xs font-semibold uppercase tracking-widest text-[#7A5C16]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Complete Collection
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2A2620] tracking-tight">
            Personalized Luxury Gifting & Instruments
          </h1>
          <p className="text-xs sm:text-sm text-[#6E675A] font-sans max-w-2xl">
            Explore our comprehensive catalog of laser-engraved pens, handcrafted A5 leather journals,
            touchscreen styluses, and corporate gift suites.
          </p>
        </div>

        {/* Toolbar: Search & Sort Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, finish, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9C48C] text-[#2A2620] text-xs placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
            <Search className="w-4 h-4 text-[#6E675A] absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#6E675A] hover:text-[#2A2620]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#D9C48C] text-xs font-semibold text-[#2A2620]"
            >
              <Filter className="w-4 h-4 text-[#D4AF37]" />
              <span>Filters</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-2 bg-white border border-[#D9C48C] rounded-xl px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-[#2A2620] focus:outline-none cursor-pointer"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout: Filters Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 p-6 rounded-2xl bg-[#F8F2E3] border border-[#EBDDB4]/80 h-fit sticky top-24">
            <div className="flex items-center justify-between border-b border-[#EBDDB4] pb-3">
              <h3 className="text-sm font-serif font-bold text-[#2A2620] uppercase tracking-wider">
                Filter Catalog
              </h3>
              {(selectedCategory !== 'all' || searchQuery || onlyCustomizable) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setOnlyCustomizable(false);
                    setPriceRange(5000);
                  }}
                  className="text-[11px] text-[#D4AF37] hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#7A5C16] uppercase tracking-wider block">
                Categories
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all duration-200 flex justify-between items-center ${
                    selectedCategory === 'all'
                      ? 'bg-[#D4AF37]/20 text-[#7A5C16] font-semibold border border-[#D4AF37]/40 shadow-sm'
                      : 'text-[#6E675A] hover:text-[#2A2620] hover:translate-x-1'
                  }`}
                >
                  <span>All Products</span>
                  <span>{allProducts.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all duration-200 flex justify-between items-center ${
                      selectedCategory === cat.id
                        ? 'bg-[#D4AF37]/20 text-[#7A5C16] font-semibold border border-[#D4AF37]/40 shadow-sm'
                        : 'text-[#6E675A] hover:text-[#2A2620] hover:translate-x-1'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span>
                      {allProducts.filter((p) => p.categoryId === cat.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 border-t border-[#EBDDB4] pt-4">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#7A5C16] uppercase tracking-wider">
                  Max Budget
                </span>
                <span className="text-[#D4AF37] font-bold">Up to ₹{priceRange}</span>
              </div>
              <input
                type="range"
                min={500}
                max={5000}
                step={250}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#D4AF37] bg-[#F8F2E3] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>₹500</span>
                <span>₹5,000</span>
              </div>
            </div>

            {/* Customization Toggle */}
            <div className="border-t border-[#EBDDB4] pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#5B5444]">
                <input
                  type="checkbox"
                  checked={onlyCustomizable}
                  onChange={(e) => setOnlyCustomizable(e.target.checked)}
                  className="rounded border-[#D9C48C] text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <span>Only Laser Customizable</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-xs text-[#6E675A] flex items-center justify-between">
              <span>Showing {filteredProducts.length} handcrafted products</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#F8F2E3] border border-[#EBDDB4] space-y-4">
                <p className="text-base font-serif font-semibold text-[#5B5444]">
                  No matching products found
                </p>
                <p className="text-xs text-gray-500">
                  Try adjusting your search query, filter criteria, or category selection.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setPriceRange(5000);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#D4AF37] text-navy-950"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFDF8] p-12 text-center text-[#6E675A]">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}

