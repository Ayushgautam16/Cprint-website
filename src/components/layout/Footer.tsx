'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, CheckCircle, Shield, Award, Sparkles, Send } from 'lucide-react';
import Logo from '../brand/Logo';
import { CATEGORIES, INITIAL_SETTINGS } from '@/lib/mockData';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  return (
    <footer className="bg-[#050914] text-gray-300 border-t border-[#D4AF37]/25 relative overflow-hidden">
      {/* Decorative Gold Accent Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      {/* Brand Value Assurance Bar */}
      <div className="border-b border-navy-800/80 bg-[#070D1F] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                Precision Fiber Laser
              </h4>
              <p className="text-[11px] text-gray-400">Microscopic permanent engraving</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                Zero-Flaw Guarantee
              </h4>
              <p className="text-[11px] text-gray-400">100% Free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                Luxury Presentation Box
              </h4>
              <p className="text-[11px] text-gray-400">Gold satin pull-ribbon casing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy-900 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">
                Razorpay Verified
              </h4>
              <p className="text-[11px] text-gray-400">Secure UPI & 256-bit encrypted checkout</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Heritage */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" variant="gold" showTagline={true} />
            <p className="text-xs text-gray-400 leading-relaxed pr-6">
              RYNOCHI elevates everyday writing instruments and executive journals into
              bespoke keepsakes. Combining laser craftsmanship with premium PU leather and aerospace-grade
              alloys, we craft personalized corporate gifts, executive pens, and organizers tailored
              for milestones that matter.
            </p>

            <div className="space-y-2 pt-2 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>{INITIAL_SETTINGS.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>{INITIAL_SETTINGS.supportPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>{INITIAL_SETTINGS.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-[#F3E5AB] uppercase tracking-widest border-b border-navy-800 pb-2">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="inline-block text-gray-400 hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-[#F3E5AB] uppercase tracking-widest border-b border-navy-800 pb-2">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/track-order" className="inline-block text-gray-400 hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/corporate" className="inline-block text-gray-400 hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300">
                  Corporate Bulk Orders
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="inline-block text-gray-400 hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/about" className="inline-block text-gray-400 hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300">
                  Our Laser Craft & Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-block text-gray-400 hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-300">
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link href="/admin" className="inline-block text-[#C5A059] hover:underline transition-colors font-medium">
                  Staff / Admin Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Direct Updates */}
          <div className="space-y-3">
            <h4 className="text-xs font-serif font-bold text-[#F3E5AB] uppercase tracking-widest border-b border-navy-800 pb-2">
              Privilege Circle
            </h4>
            <p className="text-xs text-gray-400">
              Subscribe for private previews, seasonal gifting catalogs, and corporate volume rates.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter executive email"
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
              <button
                type="submit"
                className="btn-luxury-gold w-full py-2.5 rounded-xl text-navy-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#D4AF37]/20 group/btn"
              >
                <Send className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                <span>Subscribe</span>
              </button>
            </form>

            {isSubscribed && (
              <p className="text-[11px] text-emerald-400">
                ✓ Thank you. You are on the RYNOCHI VIP list.
              </p>
            )}
          </div>
        </div>

        {/* Legal Policies & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} RYNOCHI. All rights reserved. Handcrafted in India.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400">
            <Link href="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:text-[#D4AF37] transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/shipping-policy" className="hover:text-[#D4AF37] transition-colors">
              Shipping Policy
            </Link>
            <span>•</span>
            <Link href="/refund-cancellation-policy" className="hover:text-[#D4AF37] transition-colors">
              Cancellation & Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

