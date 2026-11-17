'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, RefreshCw, MessageCircle, ChevronLeft } from 'lucide-react';
import Logo from '@/components/brand/Logo';

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Transaction was interrupted or declined by bank.';

  return (
    <div className="min-h-screen bg-[#070C1E] py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#091126] border border-rose-500/30 shadow-2xl text-center space-y-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <Logo size="md" variant="gold" showTagline={false} />
            <div className="w-16 h-16 rounded-full bg-rose-950/80 border-2 border-rose-500/50 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-900/30">
              <AlertCircle className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-rose-400 block">
              Payment Not Completed
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              We Could Not Process Your Transaction
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
              No amount has been deducted. If any amount was debited from your account, your bank will
              automatically reverse it within 2–4 business days.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 text-xs text-rose-300">
            <strong>Reason:</strong> {reason}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/checkout"
              className="btn-luxury-gold w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20 group/btn"
            >
              <RefreshCw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
              <span>Retry Payment</span>
            </Link>

            <a
              href="https://wa.me/917277338436?text=Hello%20RYNOCHI!%20My%20payment%20failed%20during%20checkout.%20Please%20help%20me%20complete%20the%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>

          <div className="pt-4 border-t border-navy-800">
            <Link
              href="/cart"
              className="text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Return to Shopping Bag
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070C1E] p-12 text-center text-gray-400">Loading...</div>}>
      <PaymentFailureContent />
    </Suspense>
  );
}

