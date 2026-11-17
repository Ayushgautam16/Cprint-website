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
  Sparkles,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import Logo from '../brand/Logo';
import { useCart } from '@/lib/store';
import { CATEGORIES } from '@/lib/mockData';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalItemCount, setIsOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070C1E]/95 backdrop-blur-md shadow-xl border-b border-[#D4AF37]/25 py-2.5'
          : 'bg-[#0B132B] border-b border-[#D4AF37]/15 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Mobile menu hamburger toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-navy-900 border border-navy-800 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-[#D4AF37]" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo */}
        <div className="flex-shrink-0">
          <Logo size="md" variant="gold" showTagline={!isScrolled} />
        </div>

        {/* Desktop Primary Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium tracking-wide">
          <Link
            href="/"
            className={`relative py-1 transition-colors hover:text-[#D4AF37] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#DFBA6F] after:to-[#AA8417] after:transition-transform after:duration-300 after:origin-left ${
              pathname === '/' ? 'text-[#D4AF37] font-semibold after:scale-x-100' : 'text-gray-200 after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Home
          </Link>

          <Link
            href="/shop"
            className={`relative py-1 transition-colors hover:text-[#D4AF37] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#DFBA6F] after:to-[#AA8417] after:transition-transform after:duration-300 after:origin-left ${
              pathname === '/shop' ? 'text-[#D4AF37] font-semibold after:scale-x-100' : 'text-gray-200 after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Shop All
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCategoriesDropdownOpen(true)}
            onMouseLeave={() => setCategoriesDropdownOpen(false)}
          >
            <button
              type="button"
              className="relative py-1 flex items-center gap-1.5 text-gray-200 hover:text-[#D4AF37] transition-colors focus:outline-none after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#DFBA6F] after:to-[#AA8417] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left"
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  categoriesDropdownOpen ? 'rotate-180 text-[#D4AF37]' : ''
                }`}
              />
            </button>

            {categoriesDropdownOpen && (
              <div className="absolute top-full left-0 w-72 rounded-2xl bg-[#080E24] border border-[#D4AF37]/30 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#C5A059] px-3 py-1.5 border-b border-navy-800">
                  Featured Collections
                </div>
                <div className="mt-1 space-y-1">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex flex-col px-3 py-2 rounded-xl hover:bg-navy-900/80 hover:border-l-2 hover:border-[#D4AF37] transition-all group"
                    >
                      <span className="text-sm font-medium text-gray-200 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all duration-200">
                        {cat.name}
                      </span>
                      <span className="text-[11px] text-gray-500 line-clamp-1">
                        {cat.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/corporate"
            className={`relative py-1 transition-colors hover:text-[#D4AF37] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#DFBA6F] after:to-[#AA8417] after:transition-transform after:duration-300 after:origin-left ${
              pathname === '/corporate' ? 'text-[#D4AF37] font-semibold after:scale-x-100' : 'text-gray-200 after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Corporate & Bulk
          </Link>

          <Link
            href="/about"
            className={`relative py-1 transition-colors hover:text-[#D4AF37] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#DFBA6F] after:to-[#AA8417] after:transition-transform after:duration-300 after:origin-left ${
              pathname === '/about' ? 'text-[#D4AF37] font-semibold after:scale-x-100' : 'text-gray-200 after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className={`relative py-1 transition-colors hover:text-[#D4AF37] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#DFBA6F] after:to-[#AA8417] after:transition-transform after:duration-300 after:origin-left ${
              pathname === '/contact' ? 'text-[#D4AF37] font-semibold after:scale-x-100' : 'text-gray-200 after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Action Controls: Search, Account, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 sm:p-2.5 rounded-xl text-gray-300 hover:text-[#D4AF37] hover:bg-navy-900 transition-colors border border-transparent hover:border-navy-800"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 p-3 rounded-2xl bg-[#070C1E] border border-[#D4AF37]/40 shadow-2xl z-50">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                  className="relative"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pens, diaries, gifts..."
                    autoFocus
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white text-xs placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </form>
              </div>
            )}
          </div>

          {/* Customer / Admin Account link */}
          <Link
            href="/account"
            className="p-2 sm:p-2.5 rounded-xl text-gray-300 hover:text-[#D4AF37] hover:bg-navy-900 transition-colors border border-transparent hover:border-navy-800"
            title="My Account"
          >
            <User className="w-5 h-5" />
          </Link>

          {/* Cart Icon with Live Counter */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="btn-luxury-gold relative p-2.5 rounded-xl text-navy-950 font-bold shadow-md shadow-[#D4AF37]/20 flex items-center justify-center transition-all duration-300"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-navy-950 font-bold" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#060B18] text-[#D4AF37] border border-[#D4AF37] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] z-50 bg-[#060B18]/95 backdrop-blur-xl border-t border-navy-800 p-6 flex flex-col gap-4 overflow-y-auto animate-in fade-in duration-200">
          <nav className="flex flex-col gap-3 text-base">
            <Link
              href="/"
              className="py-2 border-b border-navy-800 text-white font-medium hover:text-[#D4AF37]"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="py-2 border-b border-navy-800 text-white font-medium hover:text-[#D4AF37]"
            >
              Shop All Products
            </Link>

            <div className="py-2 border-b border-navy-800">
              <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold block mb-2">
                Categories
              </span>
              <div className="grid grid-cols-1 gap-2 pl-3">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="text-sm text-gray-300 hover:text-white py-1"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/corporate"
              className="py-2 border-b border-navy-800 text-white font-medium hover:text-[#D4AF37]"
            >
              Corporate & Bulk Orders
            </Link>
            <Link
              href="/track-order"
              className="py-2 border-b border-navy-800 text-white font-medium hover:text-[#D4AF37]"
            >
              Track Your Order
            </Link>
            <Link
              href="/about"
              className="py-2 border-b border-navy-800 text-white font-medium hover:text-[#D4AF37]"
            >
              About RYNOCHI
            </Link>
            <Link
              href="/contact"
              className="py-2 border-b border-navy-800 text-white font-medium hover:text-[#D4AF37]"
            >
              Contact Us
            </Link>
            <Link
              href="/admin"
              className="py-2 text-xs uppercase tracking-wider font-semibold text-[#D4AF37] hover:underline"
            >
              Admin Dashboard →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

