'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Phone, Mail, MapPin, Sparkles, CreditCard, Shield } from 'lucide-react';
import { getStoredSettings, saveStoredSettings } from '@/lib/store';
import { WebsiteSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    saveStoredSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!settings) {
    return <div className="p-8 text-gray-400 text-xs">Loading store settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">Store & Studio Settings</h1>
        <p className="text-xs text-gray-400 mt-1">
          Configure business details, concierge WhatsApp, shipping policies, and payment gateway options.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Business Info */}
        <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 space-y-4">
          <h2 className="text-sm font-serif font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center gap-2">
            <span>1. Brand Identity & Contact</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-300 font-medium block">Brand Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium block">
                WhatsApp Business Phone (without +)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium block">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium block">Support Phone</label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-gray-300 font-medium block">Artisan Studio Address</label>
              <input
                type="text"
                value={settings.officeAddress}
                onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Announcement Header */}
        <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 space-y-4">
          <h2 className="text-sm font-serif font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center gap-2">
            <span>2. Top Announcement Bar</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-gray-300 font-medium block">Promotional Banner Message</label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-gray-300">
              <input
                type="checkbox"
                checked={settings.announcementActive}
                onChange={(e) =>
                  setSettings({ ...settings, announcementActive: e.target.checked })
                }
                className="accent-[#D4AF37]"
              />
              <span>Display Announcement Bar on Storefront</span>
            </label>
          </div>
        </div>

        {/* Shipping & Tax Rules */}
        <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 space-y-4">
          <h2 className="text-sm font-serif font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center gap-2">
            <span>3. Shipping & Taxation</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-300 font-medium block">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={settings.shippingFee}
                onChange={(e) =>
                  setSettings({ ...settings, shippingFee: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium block">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-300 font-medium block">GST Rate (%)</label>
              <input
                type="number"
                value={settings.taxRatePercent}
                onChange={(e) =>
                  setSettings({ ...settings, taxRatePercent: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
              />
            </div>
          </div>
        </div>

        {/* Payment Configuration */}
        <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 space-y-4">
          <h2 className="text-sm font-serif font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center gap-2">
            <span>4. Payment Gateways</span>
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-gray-300">
              <input
                type="checkbox"
                checked={settings.razorpayEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, razorpayEnabled: e.target.checked })
                }
                className="accent-[#D4AF37]"
              />
              <span>Enable Razorpay Payment Gateway (UPI, Cards, Net Banking)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-gray-300">
              <input
                type="checkbox"
                checked={settings.codEnabled}
                onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                className="accent-[#D4AF37]"
              />
              <span>Enable Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="px-7 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950 hover:brightness-110 shadow-lg shadow-[#D4AF37]/25 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>

          {isSaved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

