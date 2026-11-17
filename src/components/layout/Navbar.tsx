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

            {/* Social Channels & Amazon in Mobile Drawer */}
            <div className="pt-4 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A5C16]">
                Connect With Us
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/rynochi__eye_wear?utm_source=qr&srtk=MTB0MDVyMzd5anJsOQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-[#D9C48C] flex items-center justify-center text-[#7A5C16] hover:bg-[#FBF3DC] hover:text-[#E4405F]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/share/19ca1jff5P/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full border border-[#D9C48C] flex items-center justify-center text-[#7A5C16] hover:bg-[#FBF3DC] hover:text-[#1877F2]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="http://youtube.com/@rynochi-p?si=8yDkeTxuhbS1fZQ3"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full border border-[#D9C48C] flex items-center justify-center text-[#7A5C16] hover:bg-[#FBF3DC] hover:text-[#FF0000]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/917277338436?text=Hello%20RYNOCHI,%20I%20have%20an%20enquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full border border-[#D9C48C] flex items-center justify-center text-[#7A5C16] hover:bg-[#FBF3DC] hover:text-[#25D366]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3z"/>
                  </svg>
                </a>
              </div>
              <a
                href="https://www.amazon.in/sp?ie=UTF8&seller=A199V62RGC67K7&asin=B0G5QF6YG8&ref_=dp_merchant_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-[#D9C48C] bg-[#FFF8EB] text-xs font-semibold text-[#2A2620]"
              >
                <div className="w-5 h-5 rounded bg-[#232F3E] text-[#FF9900] flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M13.607 15.35c-2.42 1.782-5.918 2.73-8.91 1.666-.418-.149-.089-.724.316-.622 2.61.657 5.703-.134 7.82-1.705.32-.239.774.208.774.661zm1.096-.927c-.206-.264-1.356-.124-1.874-.062-.158.019-.181-.122-.04-.22 1.157-.803 2.825-.333 3.011-.097.185.236-.481 1.83-1.34 2.428-.105.073-.205.034-.158-.062.247-.497.607-1.723.401-1.987zm-2.02-3.138c0 .991-.044 1.821-.652 2.645-.558.756-1.378 1.139-2.28 1.139-1.282 0-2.043-.902-2.043-2.23 0-2.617 2.302-3.097 4.975-3.097v1.543zm2.597 4.127c-.156-.124-.226-.296-.226-.499V8.922c0-1.272-.257-2.284-.969-3.04-.847-.902-2.115-1.288-3.41-1.288-2.203 0-4.148.974-4.668 2.85-.052.191.077.348.272.383l1.884.225c.168.02.31-.107.368-.266.33-.918 1.097-1.357 2.05-1.357 1.085 0 1.866.586 1.866 1.688v.489c-2.457.072-5.068.747-6.074 2.213-.659.957-.751 2.219-.247 3.296.536 1.144 1.657 1.764 2.923 1.764 1.777 0 2.842-.712 3.619-1.895v1.391c0 .193.109.349.278.412l2.036.78c.189.072.378-.052.378-.246v-.884c0-.285-.12-.477-.286-.599z"/>
                  </svg>
                </div>
                <span>Also on Amazon India ↗</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
