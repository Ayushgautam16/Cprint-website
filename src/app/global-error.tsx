'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleReload = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.href = '/';
      }
    } catch {
      reset();
    }
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FFFDF8] flex items-center justify-center p-6 text-[#2A2620] font-sans">
        <div className="max-w-md w-full bg-white border border-[#EBDDB4] p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#FBF3DC] border border-[#D9C48C] flex items-center justify-center mx-auto text-[#7A5C16] text-2xl font-serif">
            ✨
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-[#2A2620]">
              RYNOCHI Luxury Gifting
            </h1>
            <p className="text-xs text-[#5B5444] leading-relaxed">
              We updated our catalog system. Please click below to refresh your browser.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReload}
            className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-[#C9A24B] to-[#F0DFAE] text-[#2A2620] font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all"
          >
            Refresh Website
          </button>
        </div>
      </body>
    </html>
  );
}
