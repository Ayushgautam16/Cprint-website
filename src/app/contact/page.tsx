'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { INITIAL_SETTINGS } from '@/lib/mockData';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Customization Inquiry',
    message: '',
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Customization Inquiry',
        message: '',
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#070C1E] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111C3A] border border-[#D4AF37]/30 text-xs font-semibold uppercase tracking-widest text-[#F3E5AB]">
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            Connect With Our Studio
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            We Are At Your Service
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
            Have questions regarding personalized fonts, bulk gifting quotes, or an active order? Reach out to our concierge desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Studio Details & Direct Channels (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 space-y-5">
              <h2 className="text-base font-serif font-bold text-white border-b border-navy-800 pb-3">
                RYNOCHI Studio & Concierge
              </h2>

              <div className="space-y-4 text-xs text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Production Atelier</strong>
                    <span>{INITIAL_SETTINGS.officeAddress}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <div>
                    <strong className="text-white block">Telephone</strong>
                    <span>{INITIAL_SETTINGS.supportPhone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <div>
                    <strong className="text-white block">Email</strong>
                    <span>{INITIAL_SETTINGS.supportEmail}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                  <div>
                    <strong className="text-white block">Studio Hours</strong>
                    <span>Monday – Saturday: 9:30 AM – 7:00 PM IST</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="pt-2 border-t border-navy-800 space-y-3">
                <a
                  href={`https://wa.me/917277338436?text=${encodeURIComponent('Hello RYNOCHI! I have an inquiry.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3z" />
                  </svg>
                  <span>Connect Directly on WhatsApp</span>
                </a>

                {/* Social Channels & Amazon */}
                <div className="pt-2">
                  <span className="text-[11px] uppercase tracking-wider text-[#D4AF37] font-bold block mb-2">
                    Official Channels & Store
                  </span>
                  <div className="flex items-center gap-2.5">
                    <a
                      href="https://www.instagram.com/rynochi__eye_wear?utm_source=qr&srtk=MTB0MDVyMzd5anJsOQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center text-gray-300 hover:text-[#E4405F] hover:border-[#E4405F]/50 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
                      className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center text-gray-300 hover:text-[#1877F2] hover:border-[#1877F2]/50 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href="http://youtube.com/@rynochi-p?si=8yDkeTxuhbS1fZQ3"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center text-gray-300 hover:text-[#FF0000] hover:border-[#FF0000]/50 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.amazon.in/storefront?me=A199V62RGC67K7&ref_=ssf_share"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Shop now from RYNOCHI®️ storefront on Amazon and avail benefits!!"
                      title="Shop now from RYNOCHI®️ storefront on Amazon and avail benefits!!"
                      className="flex-1 py-1.5 px-3 rounded-lg bg-navy-900 border border-[#D4AF37]/40 flex items-center justify-center gap-1.5 text-xs text-[#F3E5AB] hover:bg-navy-800 transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF9900">
                        <path d="M13.607 15.35c-2.42 1.782-5.918 2.73-8.91 1.666-.418-.149-.089-.724.316-.622 2.61.657 5.703-.134 7.82-1.705.32-.239.774.208.774.661zm1.096-.927c-.206-.264-1.356-.124-1.874-.062-.158.019-.181-.122-.04-.22 1.157-.803 2.825-.333 3.011-.097.185.236-.481 1.83-1.34 2.428-.105.073-.205.034-.158-.062.247-.497.607-1.723.401-1.987zm-2.02-3.138c0 .991-.044 1.821-.652 2.645-.558.756-1.378 1.139-2.28 1.139-1.282 0-2.043-.902-2.043-2.23 0-2.617 2.302-3.097 4.975-3.097v1.543zm2.597 4.127c-.156-.124-.226-.296-.226-.499V8.922c0-1.272-.257-2.284-.969-3.04-.847-.902-2.115-1.288-3.41-1.288-2.203 0-4.148.974-4.668 2.85-.052.191.077.348.272.383l1.884.225c.168.02.31-.107.368-.266.33-.918 1.097-1.357 2.05-1.357 1.085 0 1.866.586 1.866 1.688v.489c-2.457.072-5.068.747-6.074 2.213-.659.957-.751 2.219-.247 3.296.536 1.144 1.657 1.764 2.923 1.764 1.777 0 2.842-.712 3.619-1.895v1.391c0 .193.109.349.278.412l2.036.78c.189.072.378-.052.378-.246v-.884c0-.285-.12-.477-.286-.599z"/>
                      </svg>
                      <span>Amazon Store ↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-[#091126] border border-[#D4AF37]/30 shadow-xl space-y-6">
              <h2 className="text-lg font-serif font-bold text-white border-b border-navy-800 pb-3">
                Send an Inquiry Message
              </h2>

              {isSent ? (
                <div className="p-6 text-center bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="font-semibold text-sm text-white">Message Dispatched</p>
                  <p>Our studio team has received your communication and will reply within 2 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-gray-300 font-medium block">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Saurabh Kumar"
                        className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-300 font-medium block">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-gray-300 font-medium block">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-300 font-medium block">Inquiry Type</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="General Customization Inquiry">General Customization Inquiry</option>
                        <option value="Corporate Bulk Order">Corporate Bulk Order (25+)</option>
                        <option value="Existing Order Tracking">Existing Order Tracking</option>
                        <option value="Design Proof Assistance">Design Proof Assistance</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-medium block">Your Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify desired product, customization texts, or required delivery dates..."
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-luxury-gold w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs text-navy-950 shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center gap-2 group/btn"
                  >
                    <Send className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                    <span>Send Message to Studio</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

