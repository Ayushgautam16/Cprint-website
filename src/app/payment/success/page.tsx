'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, MessageCircle, Printer, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import Logo from '@/components/brand/Logo';
import { getStoredOrders } from '@/lib/store';
import { Order } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'RYN-2026-1049';

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F3E5AB', '#C5A059', '#1C2541'],
      });
    } catch (e) {
      // Ignored if canvas-confetti is not loaded
    }

    // Load order from store
    const orders = getStoredOrders();
    const found = orders.find((o) => o.orderNumber === orderNumber);
    if (found) {
      setOrder(found);
    }
  }, [orderNumber]);

  return (
    <div className="min-h-screen bg-[#070C1E] py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#091126] border border-[#D4AF37]/40 shadow-2xl text-center space-y-6">
          {/* Brand Logo & Success Badge */}
          <div className="flex flex-col items-center justify-center gap-4">
            <Logo size="md" variant="gold" showTagline={false} />
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-900/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block">
              Payment & Order Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
              Thank You for Your Patronage
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-sans max-w-lg mx-auto leading-relaxed">
              Your order has been safely placed with the RYNOCHI Artisan Studio. Our master craftsmen
              will now review your personalization and prepare the laser engraving.
            </p>
          </div>

          {/* Order Reference Card */}
          <div className="p-5 rounded-2xl bg-navy-950 border border-navy-800 text-left max-w-md mx-auto space-y-3">
            <div className="flex justify-between items-center text-xs border-b border-navy-800 pb-2">
              <span className="text-gray-400">Order Reference:</span>
              <span className="font-mono font-bold text-[#F3E5AB] text-sm">{orderNumber}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-navy-800 pb-2">
              <span className="text-gray-400">Estimated Dispatch:</span>
              <span className="text-white font-medium">Within 24–48 Hours</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">Confirmation Sent To:</span>
              <span className="text-white font-medium">
                {order?.customerEmail || 'Your Registered Email & SMS'}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={`/track-order?orderNumber=${orderNumber}`}
              className="btn-luxury-gold w-full sm:w-auto px-7 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 group/btn"
            >
              <Package className="w-4 h-4" />
              <span>Track Order Timeline</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </Link>

            <a
              href={`https://wa.me/919876543210?text=Hi%20RYNOCHI!%20I%20just%20placed%20order%20${orderNumber}.%20Please%20confirm%20laser%20engraving%20details.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send WhatsApp Update</span>
            </a>
          </div>

          <div className="pt-6 border-t border-navy-800 flex items-center justify-center gap-6 text-xs text-gray-500">
            <button
              type="button"
              onClick={() => window.print()}
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Order Receipt</span>
            </button>
            <span>•</span>
            <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070C1E] p-12 text-center text-gray-400">Loading receipt...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

