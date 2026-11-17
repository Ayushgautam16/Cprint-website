'use client';

import React from 'react';
import Image from 'next/image';

interface EmblemProps {
  size?: number;
  className?: string;
}

export const Emblem: React.FC<EmblemProps> = ({ size = 44, className = '' }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] ${className}`}
      style={{ width: size, height: Math.round(size * 0.6) }}
    >
      <Image
        src="/images/brand/rynochi-wings-emblem.png"
        alt="RYNOCHI Golden Wings Crest"
        fill
        className="object-contain filter brightness-105 contrast-105"
      />
    </div>
  );
};

export default Emblem;
