'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountPercent = calculateDiscountPercentage(product.basePrice, product.discountPrice);

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#101B3B] via-[#0D1630] to-[#070D1F] border border-navy-800 hover-luxury-card flex flex-col justify-between">
      {/* Product Image & Badges */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square w-full bg-navy-950 overflow-hidden">
        <Image
          src={product.images[0] || '/images/products/diary-pen-giftset-box.jpg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestseller && (
            <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-gradient-to-r from-[#DFBA6F] to-[#AA8417] text-navy-950 shadow-md">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-indigo-600 text-white shadow-md">
              New Arrival
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-sm shadow-md">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Personalization Tag at bottom-right */}
        <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-0.5 rounded bg-navy-950/80 backdrop-blur-md border border-[#D4AF37]/30 text-[10px] text-[#F3E5AB] flex items-center gap-1 font-medium">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>Laser Customizable</span>
        </div>
      </Link>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="uppercase tracking-wider text-[10px] text-[#C5A059] font-semibold">
              {product.categoryName}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-[#D4AF37]">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[11px] font-bold">{product.rating}</span>
              </div>
            )}
          </div>

          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-serif font-bold text-white group-hover:text-[#F3E5AB] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-400 line-clamp-2 font-sans leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-navy-800/80 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base font-serif font-bold text-[#D4AF37]">
                {formatCurrency(product.discountPrice || product.basePrice)}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrency(product.basePrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 block">Free Name Engraving</span>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="btn-luxury-gold px-4 py-2 rounded-xl text-xs font-bold text-navy-950 flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/20 active:scale-95 group/btn"
          >
            <span>Customize</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

