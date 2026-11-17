'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    subtotal,
    shippingFee,
    finalTotal,
    totalItemCount,
  } = useCart();

  if (!isOpen) return null;

  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF8] border-l border-[#D4AF37]/30 shadow-2xl flex flex-col text-[#2A2620]">
          {/* Header */}
          <div className="p-5 border-b border-[#EBDDB4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-lg font-serif font-bold text-[#2A2620] tracking-wide">
                Your Shopping Bag ({totalItemCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-[#6E675A] hover:text-[#2A2620] hover:bg-[#FBF3DC] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-[#F8F2E3] border-b border-[#EBDDB4]">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#5B5444]">
                {amountNeeded > 0 ? (
                  <>
                    Add <strong className="text-[#D4AF37]">{formatCurrency(amountNeeded)}</strong> for Free Express Shipping
                  </>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Congratulations! You unlocked Free Shipping!
                  </span>
                )}
              </span>
              <span className="text-[#6E675A]">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FBF3DC] border border-[#EBDDB4] flex items-center justify-center text-gray-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-serif font-semibold text-[#5B5444]">
                    Your bag is currently empty
                  </p>
                  <p className="text-xs text-gray-500">
                    Explore our exquisite collection of personalized pens and handcrafted leather diaries.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950 hover:brightness-110 shadow-lg shadow-[#D4AF37]/20"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white/60 border border-[#EBDDB4]/80 flex gap-3 group relative"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#FBF3DC] flex-shrink-0 border border-[#EBDDB4]">
                    <Image
                      src={item.product.images[0] || '/images/products/diary-pen-giftset-box.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-contain p-1.5 mix-blend-multiply"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-200 line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                      {item.variantName && (
                        <p className="text-[11px] text-[#C5A059] mt-0.5">
                          Variant: {item.variantName}
                        </p>
                      )}

                      {/* Customization Details Pill */}
                      {item.customization?.customText && (
                        <div className="mt-1 px-2 py-1 rounded bg-[#0A1128] border border-[#D4AF37]/30 text-[10px] space-y-0.5">
                          <div className="text-[#5B5444] flex items-center justify-between">
                            <span>Engraving:</span>
                            <span className="font-semibold text-[#F3E5AB]">
                              &quot;{item.customization.customText}&quot;
                            </span>
                          </div>
                          <div className="text-[#6E675A] flex items-center justify-between">
                            <span>Font:</span>
                            <span className="italic">{item.customization.fontName}</span>
                          </div>
                          {item.customization.artworkFileName && (
                            <div className="text-emerald-400 flex items-center justify-between">
                              <span>Artwork:</span>
                              <span className="truncate max-w-[120px]">
                                {item.customization.artworkFileName}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-navy-900">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#EBDDB4] bg-[#FBF3DC] rounded-lg">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-xs text-[#6E675A] hover:text-[#2A2620]"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-medium text-[#2A2620]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-xs text-[#6E675A] hover:text-[#2A2620]"
                        >
                          +
                        </button>
                      </div>

                      {/* Price & Delete */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-[#D4AF37]">
                          {formatCurrency(item.totalPrice)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-gray-500 hover:text-rose-400 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 bg-[#0A1128] border-t border-[#EBDDB4] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6E675A]">
                  <span>Subtotal:</span>
                  <span className="text-[#2A2620] font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#6E675A]">
                  <span>Laser Personalization:</span>
                  <span className="text-emerald-400 font-medium">Included / Free</span>
                </div>
                <div className="flex justify-between text-[#6E675A]">
                  <span>Shipping:</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-medium">FREE</span>
                    ) : (
                      formatCurrency(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#2A2620] pt-2 border-t border-[#EBDDB4]">
                  <span>Estimated Total:</span>
                  <span className="text-base text-[#D4AF37] font-serif">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="btn-luxury-gold w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-navy-950 shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center gap-2 group/btn"
              >
                <span>Proceed To Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#6E675A] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>256-bit Secure Razorpay Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

