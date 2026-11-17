'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFFDF8] text-[#4A432F] pt-20 pb-10 border-t border-[#D9C48C]">
      <div className="wrap">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" aria-label="RYNOCHI">
              <img
                src="/images/brand/rynochi-gold-logo.png"
                alt="RYNOCHI"
                className="h-[64px] w-auto mix-blend-multiply"
              />
            </Link>
            <p className="text-[15px] leading-relaxed text-[#5B5444] max-w-[320px]">
              Premium custom printing, precision laser engraving and personalised corporate gifting essentials.
            </p>
            <div className="text-xs text-[#5B5444] space-y-1.5 pt-1">
              <p className="flex items-center gap-1.5 font-medium text-[#2A2620]">
                <span>📞 Call / WhatsApp:</span>
                <a href="tel:+917277338436" className="text-[#8F6A17] font-bold hover:underline">
                  +91 72773 38436
                </a>
              </p>
              <p className="leading-snug text-[11px] text-[#6E675A]">
                📍 T371-FAST FLOR CHAMELIN ROAD KAROL BAGH DELHI-110006 NEW DELHI DELHI 110006 India
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <a
                href="https://instagram.com/rynochi.official"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="iconbtn border border-[#D9C48C] hover:bg-[#FBF3DC]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://facebook.com/rynochi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="iconbtn border border-[#D9C48C] hover:bg-[#FBF3DC]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <path d="M14 8h3V4h-3a4 4 0 00-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
                </svg>
              </a>
              <a
                href="https://wa.me/917277338436?text=Hello%20RYNOCHI,%20I%20have%20an%20enquiry"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="iconbtn border border-[#D9C48C] hover:bg-[#FBF3DC]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="eyebrow mb-4">Categories</div>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="flink">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Services */}
          <div>
            <div className="eyebrow mb-4">Quick Links</div>
            <ul className="space-y-1">
              <li>
                <Link href="/shop" className="flink">Shop All Products</Link>
              </li>
              <li>
                <Link href="/#customizer" className="flink">Live Customizer</Link>
              </li>
              <li>
                <Link href="/corporate" className="flink">Corporate & Bulk Orders</Link>
              </li>
              <li>
                <Link href="/track-order" className="flink">Track Your Order</Link>
              </li>
              <li>
                <Link href="/about" className="flink">About RYNOCHI</Link>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div>
            <div className="eyebrow mb-4">Policies</div>
            <ul className="space-y-1">
              <li>
                <Link href="/shipping-policy" className="flink">Shipping & Delivery</Link>
              </li>
              <li>
                <Link href="/refund-cancellation-policy" className="flink">Returns & Replacements</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="flink">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="flink">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/faqs" className="flink">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#EBDDB4] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E675A]">
          <p>© {new Date().getFullYear()} RYNOCHI. All rights reserved. Handcrafted with pride in India.</p>
          <p className="flex items-center gap-2">
            <span>Precision Laser Craft</span>
            <span>•</span>
            <span>Zero-Defect Guarantee</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
