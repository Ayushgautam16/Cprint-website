'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Building2,
  CheckCircle2,
  MessageCircle,
  FileSpreadsheet,
  Upload,
  Send,
  Sparkles,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function CorporatePage() {
  const [units, setUnits] = useState(50);
  const [selectedProductType, setSelectedProductType] = useState('gift-set');
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Volume pricing calculation
  const getBaseRate = (type: string) => {
    switch (type) {
      case 'diary':
        return 1199;
      case 'pen':
        return 849;
      case 'stylus':
        return 999;
      case 'gift-set':
      default:
        return 1899;
    }
  };

  const getDiscountPercent = (qty: number) => {
    if (qty >= 500) return 35;
    if (qty >= 250) return 30;
    if (qty >= 100) return 25;
    if (qty >= 50) return 20;
    if (qty >= 25) return 15;
    return 5;
  };

  const baseRate = getBaseRate(selectedProductType);
  const discountPercent = getDiscountPercent(units);
  const discountedRate = Math.round(baseRate * (1 - discountPercent / 100));
  const totalEstimatedCost = discountedRate * units;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070C1E] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111C3A] border border-[#D4AF37]/30 text-xs font-semibold uppercase tracking-widest text-[#F3E5AB]">
            <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            Enterprise & Milestone Gifting
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight">
            Elevate Corporate Identity with{' '}
            <span className="gold-gradient-text block sm:inline">Bespoke Laser Artistry</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
            Partner with RYNOCHI for leadership onboarding kits, client anniversary keepsakes, and festive gifting suites tailored with your corporate insignia.
          </p>
        </div>

        {/* Interactive Volume Pricing Estimator */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#091126] via-[#101B3B] to-[#091126] border border-[#D4AF37]/40 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
              Interactive Estimator
            </span>
            <h2 className="text-2xl font-serif font-bold text-white">
              Instant Volume Discount Calculator
            </h2>
            <p className="text-xs text-gray-400">
              Adjust quantity and select gift category to view wholesale tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 block">
                  Select Product Category:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'gift-set', name: 'Executive Gift Set' },
                    { id: 'diary', name: 'A5 Leather Diary' },
                    { id: 'pen', name: 'Imperial Blue Pen' },
                    { id: 'stylus', name: 'Emerald Stylus Pen' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedProductType(p.id)}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-center transition-all ${
                        selectedProductType === p.id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#F3E5AB] ring-1 ring-[#D4AF37]'
                          : 'border-navy-800 bg-navy-950 text-gray-400'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-300">Required Quantity:</span>
                  <span className="text-lg font-mono font-bold text-[#F3E5AB]">
                    {units} Units
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>10 units (Trial)</span>
                  <span>100 units</span>
                  <span>500 units</span>
                  <span>1,000+ units (Master Wholesale)</span>
                </div>
              </div>
            </div>

            {/* Right Result Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-navy-950 border border-navy-800 text-center space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                {discountPercent}% Corporate Volume Discount Applied
              </div>

              <div className="space-y-1">
                <span className="text-xs text-gray-400">Estimated Unit Price:</span>
                <div className="text-2xl font-serif font-bold text-[#D4AF37]">
                  {formatCurrency(discountedRate)}{' '}
                  <span className="text-xs text-gray-500 line-through">
                    {formatCurrency(baseRate)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-navy-800">
                <span className="text-xs text-gray-400">Total Estimated Project Value:</span>
                <div className="text-3xl font-serif font-extrabold text-white mt-1">
                  {formatCurrency(totalEstimatedCost)}
                </div>
                <span className="text-[10px] text-gray-500 block mt-1">
                  Includes individual recipient name & corporate logo laser marking
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Inquiry Form */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#091126] border border-navy-800 shadow-xl max-w-3xl mx-auto">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-2xl font-serif font-bold text-white">
              Request Bespoke Digital Proof & Proposal
            </h2>
            <p className="text-xs text-gray-400">
              Our executive gifting director will provide mockups and commercial terms within 4 business hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-white">
                Inquiry Received with Distinction
              </h3>
              <p className="text-xs text-gray-300">
                Thank you, {contactPerson}. Our enterprise team will connect with digital vector proofs and commercial quotation shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Organization / Firm Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Tata Consultancy Services"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Contact Executive Name *</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Alok Verma"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Direct Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium block">
                  Project Scope, Expected Date & Customization Notes
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mention delivery locations, branding requirements, or packaging preferences..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="btn-luxury-gold w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs text-navy-950 shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center gap-2 group/btn"
              >
                <Send className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                <span>Submit Corporate RFP</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

