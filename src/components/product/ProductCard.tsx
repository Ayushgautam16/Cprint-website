'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import ProductAutoSlider from './ProductAutoSlider';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  if (!product) return null;

  const basePrice = Number(product.basePrice) || 0;
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : undefined;
  const discountPercent = calculateDiscountPercentage(basePrice, discountPrice);
  const badgeLabel = product.isBestseller
    ? 'Bestseller'
    : product.isNewArrival
    ? 'New'
    : product.isFeatured
    ? 'Featured'
    : 'Customizable';

  const safeImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : typeof product.images === 'string' && (product.images as string).trim()
    ? [product.images]
    : ['/images/products-optimized/1.png'];

  return (
    <article className="prod rvs rounded-none border border-[#EBDDB4] bg-white flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_56px_rgba(122,92,22,0.18)] hover:border-[#C9A24B] overflow-hidden group">
      {/* Product Image Stage with Auto-Swiping Gallery */}
      <div className="pstage relative aspect-square w-full bg-[radial-gradient(circle_at_50%_40%,#FFFFFF_0%,#F8F2E3_100%)] overflow-hidden flex items-center justify-center">
        {/* Badge */}
        <span className="badge absolute top-3.5 left-3.5 z-10 text-[11px] font-bold tracking-[.14em] uppercase py-1.5 px-2.5 bg-white text-[#7A5C16] border border-[#C9A24B] shadow-sm">
          {badgeLabel}
        </span>

        {/* Auto-Swiping Images */}
        <ProductAutoSlider
          images={safeImages}
          alt={product.name || 'Personalized Luxury Product'}
          intervalMs={3600}
          showDots={true}
        />

        {/* Quick View / Customize Hover Bar */}
        <Link
          href={`/product/${product.slug}`}
          className="qv absolute left-3.5 right-3.5 bottom-3.5 min-h-[44px] bg-gradient-to-r from-[#C9A24B] to-[#F0DFAE] text-[#2A2620] font-bold text-[13px] tracking-[.08em] uppercase flex items-center justify-center shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        >
          Quick View
        </Link>
      </div>

      {/* Content Body */}
      <div className="p-6 flex flex-col gap-3 flex-1 justify-between bg-white">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] tracking-[.14em] font-bold text-[#7A5C16] uppercase">
              {product.categoryName}
            </span>
            {discountPercent > 0 && (
              <span className="text-[11px] font-bold text-[#8F6A17] bg-[#FBF3DC] px-2 py-0.5 border border-[#EBDDB4]">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <Link href={`/product/${product.slug}`} className="block group-hover:text-[#8F6A17] transition-colors">
            <h3 className="serif text-[22px] leading-tight font-semibold text-[#2A2620] line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-[13px] text-[#5B5444] line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Price & CTA */}
        <div className="pt-3 border-t border-[#EBDDB4]/60 flex items-center justify-between gap-3 mt-auto">
          <div>
            <div className="text-[11px] text-[#6E675A] font-medium">Starts from</div>
            <div className="flex items-baseline gap-2">
              <span className="serif text-xl font-bold text-[#2A2620]">
                {formatCurrency(product.discountPrice || product.basePrice)}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-[#9A927F] line-through">
                  {formatCurrency(product.basePrice)}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className="btn btn-gold min-h-[44px] px-5 text-xs font-bold tracking-wider"
          >
            Customize Now
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
