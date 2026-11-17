'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { useCart } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    isLoaded,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    customizationTotal,
    shippingFee,
    taxAmount,
    finalTotal,
    totalItemCount,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (couponCode.toUpperCase().trim() === 'RYNOCHI10') {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setCouponApplied(true);
    } else {
      setCouponError('Invalid coupon code. Try "RYNOCHI10"');
    }
  };

  const netPayable = Math.max(0, finalTotal - discountAmount);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex items-center justify-center text-[#6E675A]">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-[#EBDDB4] pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A2620]">
              Shopping Bag ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
            </h1>
            <p className="text-xs text-[#6E675A] font-sans">
              Review your personalized selections and engraving details before proceeding.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs text-[#D4AF37] hover:text-[#7A5C16] flex items-center gap-1 font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-[#F8F2E3] border border-[#EBDDB4] max-w-xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-full bg-white border border-[#D9C48C] flex items-center justify-center text-[#D4AF37] mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-serif font-bold text-[#2A2620]">Your bag is empty</h2>
              <p className="text-xs text-[#6E675A] font-sans leading-relaxed">
                You haven&apos;t added any personalized creations to your bag yet. Explore our handcrafted pens and diaries.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950 hover:brightness-110 shadow-lg shadow-[#D4AF37]/25"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Items Table (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#F8F2E3] border border-[#EBDDB4] flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-[#EBDDB4] flex-shrink-0">
                      <Image
                        src={
                          (Array.isArray(item?.product?.images) && item.product.images[0]) ||
                          (typeof item?.product?.images === 'string' && item.product.images) ||
                          '/images/products-optimized/1.png'
                        }
                        alt={item?.product?.name || 'Personalized Gift'}
                        fill
                        className="object-contain p-1.5 mix-blend-multiply"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-serif font-bold text-[#2A2620] line-clamp-2 leading-snug">
                        {item?.product?.name || 'Personalized Gift'}
                      </h3>
                      {item.variantName && (
                        <p className="text-xs text-[#C5A059] mt-0.5">Finish: {item.variantName}</p>
                      )}

                      {/* Engraving Tag */}
                      {item.customization?.customText && (
                        <div className="mt-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#D4AF37]/30 text-[11px] flex items-center gap-2 flex-wrap">
                          <Sparkles className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
                          <span className="text-[#5B5444]">
                            Engraving: <strong className="text-[#7A5C16]">&quot;{item.customization.customText}&quot;</strong>
                          </span>
                          <span className="text-gray-500">({item.customization.fontName})</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Pricing */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#EBDDB4]">
                    <div className="flex items-center border border-[#D9C48C] bg-white rounded-lg">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2.5 py-1 text-xs text-[#6E675A] hover:text-[#2A2620]"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold text-[#2A2620]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2.5 py-1 text-xs text-[#6E675A] hover:text-[#2A2620]"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-serif font-bold text-[#D4AF37] block">
                        {formatCurrency(item.totalPrice)}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {formatCurrency(item.unitPrice + item.customizationCharges)} each
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-gray-500 hover:text-rose-400 transition-colors"
                >
                  Clear Bag
                </button>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Personalized design backup saved
                </span>
              </div>
            </div>

            {/* Right Summary Column (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Order Summary Box */}
              <div className="p-6 rounded-2xl bg-[#F8F2E3] border border-[#D4AF37]/30 shadow-xl space-y-5">
                <h3 className="text-base font-serif font-bold text-[#2A2620] border-b border-[#EBDDB4] pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-xs text-[#5B5444]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-[#2A2620] font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Personalized Engraving:</span>
                    <span className="text-emerald-400 font-medium">COMPLIMENTARY</span>
                  </div>
                  {customizationTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Logo Artwork Setup:</span>
                      <span className="text-[#2A2620] font-medium">{formatCurrency(customizationTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated GST (18%):</span>
                    <span className="text-[#2A2620] font-medium">{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Charges:</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-emerald-400 font-semibold">FREE</span>
                      ) : (
                        formatCurrency(shippingFee)
                      )}
                    </span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-[#EBDDB4]">
                      <span>Discount (RYNOCHI10):</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-bold text-[#2A2620] pt-3 border-t border-[#EBDDB4]">
                    <span>Total Payable:</span>
                    <span className="text-xl text-[#D4AF37] font-serif">
                      {formatCurrency(netPayable)}
                    </span>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <form onSubmit={handleApplyCoupon} className="pt-2">
                  <label className="text-[11px] text-[#6E675A] block mb-1">
                    Have a promo coupon?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. RYNOCHI10"
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#D9C48C] text-[#2A2620] text-xs uppercase placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F8F2E3] text-[#7A5C16] hover:bg-[#D4AF37] hover:text-navy-950 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}
                  {couponApplied && (
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Coupon RYNOCHI10 applied (10% discount)!
                    </p>
                  )}
                </form>

                <Link
                  href="/checkout"
                  className="btn-luxury-gold w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide text-navy-950 shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-2 group/btn"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[11px] text-[#6E675A] pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Razorpay Verified Payment Gateway</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

