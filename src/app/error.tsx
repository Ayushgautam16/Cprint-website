'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Captured client error:', error);
  }, [error]);

  const handleClearAndReload = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('rynochi_products_v1');
        localStorage.removeItem('rynochi_categories_v1');
        localStorage.removeItem('rynochi_settings_v1');
        window.location.reload();
      }
    } catch {
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-6 text-[#2A2620]">
      <div className="max-w-md w-full bg-white border border-[#EBDDB4] p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FBF3DC] border border-[#D9C48C] flex items-center justify-center mx-auto text-[#7A5C16] text-2xl font-serif">
          ✨
        </div>
        <div className="space-y-2">
          <h2 className="serif text-2xl font-semibold text-[#2A2620]">
            Welcome to RYNOCHI
          </h2>
          <p className="text-xs text-[#5B5444] leading-relaxed">
            We are refreshing the luxury catalog experience. Please click below to reload the latest collection.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleClearAndReload}
            className="btn btn-gold w-full min-h-[46px] font-bold text-xs uppercase tracking-wider"
          >
            Reload Website
          </button>
          <Link
            href="/"
            onClick={() => window.location.href = '/'}
            className="text-xs text-[#7A5C16] hover:underline font-semibold"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

