'use client';

import React from 'react';
import Link from 'next/link';
import { useLiveCategories } from '@/lib/store';
import { CATEGORIES } from '@/lib/mockData';

export const Footer: React.FC = () => {
  const { categories: liveCategories } = useLiveCategories();
  const categoriesList = Array.isArray(liveCategories) && liveCategories.length > 0 ? liveCategories : CATEGORIES;
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
              <p className="flex items-center gap-1.5 font-medium text-[#2A2620]">
                <span>✉️ Email / Enquiries:</span>
                <a href="mailto:rynochioffice@gmail.com" className="text-[#8F6A17] font-bold hover:underline">
                  rynochioffice@gmail.com
                </a>
              </p>
              <p className="leading-snug text-[11px] text-[#6E675A]">
                📍 T371-FAST FLOR CHAMELIN ROAD KAROL BAGH DELHI-110006 NEW DELHI DELHI 110006 India
              </p>
            </div>
            {/* Social Media & Official Marketplaces */}
            <div className="pt-2 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A5C16]">
                Connect With Us
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/rynochi__eye_wear?utm_source=qr&srtk=MTB0MDVyMzd5anJsOQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Follow RYNOCHI on Instagram"
                  className="iconbtn border border-[#D9C48C] hover:bg-[#FBF3DC] hover:text-[#E4405F] hover:border-[#E4405F]/50 transition-all duration-300"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/19ca1jff5P/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Follow RYNOCHI on Facebook"
                  className="iconbtn border border-[#D9C48C] hover:bg-[#FBF3DC] hover:text-[#1877F2] hover:border-[#1877F2]/50 transition-all duration-300"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="http://youtube.com/@rynochi-p?si=8yDkeTxuhbS1fZQ3"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  title="Subscribe to RYNOCHI on YouTube"
                  className="iconbtn border border-[#D9C48C] hover:bg-[#FBF3DC] hover:text-[#FF0000] hover:border-[#FF0000]/50 transition-all duration-300"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/917277338436?text=Hello%20RYNOCHI,%20I%20have%20an%20enquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  title="Chat with RYNOCHI on WhatsApp"
                  className="iconbtn border border-[#D9C48C] hover:bg-[#FBF3DC] hover:text-[#25D366] hover:border-[#25D366]/50 transition-all duration-300"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3z" />
                  </svg>
                </a>

                {/* Amazon Store Icon */}
                <a
                  href="https://www.amazon.in/storefront?me=A199V62RGC67K7&ref_=ssf_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Shop on Amazon India"
                  title="Shop now from RYNOCHI®️ storefront on Amazon and avail benefits!!"
                  className="iconbtn border border-[#D9C48C] hover:bg-[#FBF3DC] hover:text-[#FF9900] hover:border-[#FF9900]/50 transition-all duration-300"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.607 15.35c-2.42 1.782-5.918 2.73-8.91 1.666-.418-.149-.089-.724.316-.622 2.61.657 5.703-.134 7.82-1.705.32-.239.774.208.774.661zm1.096-.927c-.206-.264-1.356-.124-1.874-.062-.158.019-.181-.122-.04-.22 1.157-.803 2.825-.333 3.011-.097.185.236-.481 1.83-1.34 2.428-.105.073-.205.034-.158-.062.247-.497.607-1.723.401-1.987zm-2.02-3.138c0 .991-.044 1.821-.652 2.645-.558.756-1.378 1.139-2.28 1.139-1.282 0-2.043-.902-2.043-2.23 0-2.617 2.302-3.097 4.975-3.097v1.543zm2.597 4.127c-.156-.124-.226-.296-.226-.499V8.922c0-1.272-.257-2.284-.969-3.04-.847-.902-2.115-1.288-3.41-1.288-2.203 0-4.148.974-4.668 2.85-.052.191.077.348.272.383l1.884.225c.168.02.31-.107.368-.266.33-.918 1.097-1.357 2.05-1.357 1.085 0 1.866.586 1.866 1.688v.489c-2.457.072-5.068.747-6.074 2.213-.659.957-.751 2.219-.247 3.296.536 1.144 1.657 1.764 2.923 1.764 1.777 0 2.842-.712 3.619-1.895v1.391c0 .193.109.349.278.412l2.036.78c.189.072.378-.052.378-.246v-.884c0-.285-.12-.477-.286-.599z"/>
                  </svg>
                </a>
              </div>

              {/* Amazon Store Badge */}
              <a
                href="https://www.amazon.in/storefront?me=A199V62RGC67K7&ref_=ssf_share"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-[#D9C48C] bg-gradient-to-r from-[#FFFDF8] via-[#FFF9EE] to-[#FBF3DC] hover:border-[#8F6A17] hover:shadow-sm transition-all group"
                title="Shop now from RYNOCHI®️ storefront on Amazon and avail benefits!!"
              >
                <div className="w-7 h-7 rounded-lg bg-[#232F3E] text-[#FF9900] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M13.607 15.35c-2.42 1.782-5.918 2.73-8.91 1.666-.418-.149-.089-.724.316-.622 2.61.657 5.703-.134 7.82-1.705.32-.239.774.208.774.661zm1.096-.927c-.206-.264-1.356-.124-1.874-.062-.158.019-.181-.122-.04-.22 1.157-.803 2.825-.333 3.011-.097.185.236-.481 1.83-1.34 2.428-.105.073-.205.034-.158-.062.247-.497.607-1.723.401-1.987zm-2.02-3.138c0 .991-.044 1.821-.652 2.645-.558.756-1.378 1.139-2.28 1.139-1.282 0-2.043-.902-2.043-2.23 0-2.617 2.302-3.097 4.975-3.097v1.543zm2.597 4.127c-.156-.124-.226-.296-.226-.499V8.922c0-1.272-.257-2.284-.969-3.04-.847-.902-2.115-1.288-3.41-1.288-2.203 0-4.148.974-4.668 2.85-.052.191.077.348.272.383l1.884.225c.168.02.31-.107.368-.266.33-.918 1.097-1.357 2.05-1.357 1.085 0 1.866.586 1.866 1.688v.489c-2.457.072-5.068.747-6.074 2.213-.659.957-.751 2.219-.247 3.296.536 1.144 1.657 1.764 2.923 1.764 1.777 0 2.842-.712 3.619-1.895v1.391c0 .193.109.349.278.412l2.036.78c.189.072.378-.052.378-.246v-.884c0-.285-.12-.477-.286-.599z"/>
                  </svg>
                </div>
                <div className="text-left leading-tight">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#8F6A17]">Also Available On</div>
                  <div className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1">
                    <span>Amazon India Store</span>
                    <span className="text-[#8F6A17] font-semibold text-[11px] group-hover:translate-x-0.5 transition-transform">↗</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="eyebrow mb-4">Categories</div>
            <ul className="space-y-1">
              {categoriesList.map((cat) => (
                <li key={cat.id || cat.slug}>
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
              <li>
                <a
                  href="https://www.amazon.in/storefront?me=A199V62RGC67K7&ref_=ssf_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flink flex items-center gap-1.5 text-[#8F6A17] font-semibold hover:underline"
                  title="Shop now from RYNOCHI®️ storefront on Amazon and avail benefits!!"
                >
                  <span>Amazon Storefront</span>
                  <span className="text-[10px]">↗</span>
                </a>
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
