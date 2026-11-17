'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '@/lib/store';
import { CATEGORIES } from '@/lib/mockData';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalItemCount, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close menus on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-[rgba(255,253,248,.96)] backdrop-blur-md border-b border-[#EBDDB4] transition-all">
      <div className="wrap flex items-center justify-between h-[84px] gap-5">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#7A5C16] hover:bg-[#FBF3DC] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" aria-label="RYNOCHI home" className="flex items-center">
          <img
            src="/images/brand/rynochi-gold-logo.png"
            alt="RYNOCHI"
            className="h-[54px] sm:h-[58px] w-auto object-contain mix-blend-multiply transition-transform hover:scale-105 duration-300"
          />
        </Link>

        {/* Desktop Primary Navlinks */}
        <nav className="hidden lg:flex items-center gap-9 text-[15px] font-semibold text-[#2A2620]">
          <Link href="/" className={`navlink ${pathname === '/' ? 'active text-[#8F6A17]' : ''}`}>
            Home
          </Link>
          <Link href="/shop" className={`navlink ${pathname === '/shop' ? 'active text-[#8F6A17]' : ''}`}>
            Shop All
          </Link>

          {/* Categories dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCategoriesDropdownOpen(true)}
            onMouseLeave={() => setCategoriesDropdownOpen(false)}
          >
            <button
              type="button"
              className="navlink flex items-center gap-1.5 focus:outline-none"
            >
              <span>Categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180 text-[#8F6A17]' : ''}`} />
            </button>

            {categoriesDropdownOpen && (
              <div className="absolute top-full left-0 w-72 bg-[#FFFDF8] border border-[#EBDDB4] shadow-2xl p-3 z-50 animate-in fade-in duration-200">
                <div className="text-[10px] uppercase font-bold tracking-[.18em] text-[#7A5C16] px-3 py-1.5 border-b border-[#EBDDB4]">
                  Browse Collections
                </div>
                <div className="py-1">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="block px-3 py-2 text-sm text-[#2A2620] hover:bg-[#F8F2E3] hover:text-[#8F6A17] font-medium transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/#customizer" className="navlink">
            Customize
          </Link>
          <Link href="/corporate" className={`navlink ${pathname === '/corporate' ? 'active text-[#8F6A17]' : ''}`}>
            Corporate
          </Link>
          <Link href="/contact" className={`navlink ${pathname === '/contact' ? 'active text-[#8F6A17]' : ''}`}>
            Contact
          </Link>
        </nav>

        {/* Right Icon Actions */}
        <div className="flex items-center gap-2">
          {/* Search Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="iconbtn"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-3 bg-white border border-[#EBDDB4] shadow-2xl z-50">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pens, diaries, gift sets..."
                    autoFocus
                    className="field !min-h-[44px] text-sm"
                  />
                </form>
              </div>
            )}
          </div>

          {/* Account */}
          <Link href="/account" className="iconbtn" aria-label="Account">
            <User className="w-5 h-5" />
          </Link>

          {/* Cart with Count */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="iconbtn relative"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItemCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#C9A24B] text-[#2A2620] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EBDDB4] bg-[#FFFDF8] px-6 py-6 shadow-xl flex flex-col gap-4 animate-in fade-in duration-200">
          <nav className="flex flex-col gap-3 text-base font-semibold text-[#2A2620]">
            <Link href="/" className="py-2 border-b border-[#EBDDB4]/50 hover:text-[#8F6A17]">
              Home
            </Link>
            <Link href="/shop" className="py-2 border-b border-[#EBDDB4]/50 hover:text-[#8F6A17]">
              Shop All Products
            </Link>
            <div className="py-2 border-b border-[#EBDDB4]/50">
              <span className="text-xs uppercase tracking-[.18em] text-[#7A5C16] font-bold block mb-2">
                Categories
              </span>
              <div className="grid grid-cols-1 gap-2 pl-3">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="text-sm text-[#4A432F] hover:text-[#8F6A17] py-1"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/#customizer" className="py-2 border-b border-[#EBDDB4]/50 hover:text-[#8F6A17]">
              Live Customizer
            </Link>
            <Link href="/corporate" className="py-2 border-b border-[#EBDDB4]/50 hover:text-[#8F6A17]">
              Corporate & Bulk Orders
            </Link>
            <Link href="/track-order" className="py-2 border-b border-[#EBDDB4]/50 hover:text-[#8F6A17]">
              Track Order
            </Link>
            <Link href="/contact" className="py-2 border-b border-[#EBDDB4]/50 hover:text-[#8F6A17]">
              Contact Us
            </Link>
            <Link href="/admin" className="py-2 text-xs uppercase tracking-wider font-bold text-[#8F6A17]">
              Admin Portal →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
