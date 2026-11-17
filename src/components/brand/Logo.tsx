'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'gold',
  size = 'md',
  showTagline = true,
  className = '',
  href = '/',
}) => {
  const sizeMap = {
    sm: { width: 110, height: 63, tagline: 'text-[8px] tracking-[0.2em]' },
    md: { width: 145, height: 83, tagline: 'text-[9px] tracking-[0.25em]' },
    lg: { width: 190, height: 109, tagline: 'text-[11px] tracking-[0.3em]' },
    xl: { width: 240, height: 138, tagline: 'text-xs tracking-[0.35em]' },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div
      className={`inline-flex flex-col items-center justify-center select-none group transition-all duration-300 ${className}`}
    >
      {/* Official 3D Metallic Wings & RYNOCHI Brand Logo */}
      <div className="relative transition-transform duration-300 ease-out group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.45)]">
        <Image
          src="/images/brand/rynochi-gold-logo.png"
          alt="RYNOCHI Official Logo"
          width={currentSize.width}
          height={currentSize.height}
          priority
          className="object-contain filter brightness-105 contrast-105 transition-all duration-500 group-hover:brightness-115"
        />

        {/* Hover Radiant Light Sweep Sweep Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      </div>

      {/* Tagline */}
      {showTagline && (
        <span
          className={`font-serif tracking-[0.25em] uppercase font-semibold text-[#DFBA6F] group-hover:text-[#F3E5AB] transition-colors duration-300 mt-1 opacity-90 ${currentSize.tagline}`}
        >
          WRITE • PLAN • ACHIEVE
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-block focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded-lg p-1 transition-transform duration-200 active:scale-95"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
