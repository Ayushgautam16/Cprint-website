'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/mockData';

export const FeaturedCategories: React.FC = () => {
  return (
    <section id="categories" className="py-28 bg-[#FFFDF8]">
      <div className="wrap">
        <div className="text-center max-w-[720px] mx-auto">
          <div className="eyebrow">Shop by category</div>
          <h2 className="serif mt-4 text-[clamp(40px,5.5vw,68px)] leading-[1.04] font-semibold text-[#2A2620]">
            Find the piece worth <em className="not-italic text-[#8F6A17]">personalising</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="cat rvs group"
            >
              <div className="cimg p-6 flex items-center justify-center">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-7 flex flex-col gap-3">
                <h3 className="serif text-[28px] font-semibold leading-tight text-[#2A2620] group-hover:text-[#8F6A17] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[15px] leading-relaxed text-[#5B5444]">
                  {cat.description}
                </p>
                <div className="line" />
                <div className="arr flex items-center gap-2.5 font-bold text-[13px] tracking-[.1em] text-[#7A5C16] mt-1">
                  <span>EXPLORE</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
