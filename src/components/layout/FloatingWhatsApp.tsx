'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { INITIAL_SETTINGS } from '@/lib/mockData';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [inquiryType, setInquiryType] = useState('Personalized Gifting');
  const [userMessage, setUserMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = INITIAL_SETTINGS.whatsappNumber;
    const text = encodeURIComponent(
      `Hello RYNOCHI Concierge!\n\n*Name:* ${customerName || 'A Customer'}\n*Inquiry Type:* ${inquiryType}\n*Message:* ${userMessage || 'I would like help with custom engraving and gifting options.'}\n\nPlease guide me!`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Dialogue */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#070C1E] border border-[#D4AF37]/40 shadow-2xl p-4 text-white animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-[#F3E5AB]">
                  RYNOCHI WhatsApp Concierge
                </h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Typically replies in 5 minutes
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSend} className="mt-3 space-y-2.5 text-xs">
            <div>
              <label className="block text-[11px] text-gray-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-300 mb-1">Inquiry Purpose</label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="Personalized Gifting">Personalized Gifting / Single Order</option>
                <option value="Corporate Bulk Order">Corporate Bulk Order (25+ units)</option>
                <option value="Custom Logo Engraving Proof">Custom Logo Engraving Proof</option>
                <option value="Existing Order Tracking">Existing Order Tracking</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-gray-300 mb-1">Customization Note / Request</label>
              <textarea
                rows={2}
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Product name, desired engraving, or special dates..."
                className="w-full px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all active:scale-[0.98]"
            >
              <Send className="w-3.5 h-3.5" />
              Chat on WhatsApp
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all border border-emerald-400/40 group"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="text-xs font-semibold tracking-wide hidden sm:inline">
          Chat with Concierge
        </span>
      </button>
    </div>
  );
};

export default FloatingWhatsApp;

