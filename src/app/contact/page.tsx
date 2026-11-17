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
              <div className="pt-2 border-t border-navy-800">
                <a
                  href={`https://wa.me/${INITIAL_SETTINGS.whatsappNumber}?text=Hello%20RYNOCHI!%20I%20have%20an%20inquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect Directly on WhatsApp</span>
                </a>
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

