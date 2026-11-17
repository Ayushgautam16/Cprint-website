'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Truck, ExternalLink, ChevronLeft, Search, Sparkles } from 'lucide-react';
import { getStoredOrders } from '@/lib/store';
import { Order } from '@/lib/types';
import { formatCurrency, formatDate, getOrderStatusDetails } from '@/lib/utils';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.items.some((i) => i.productName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#070C1E] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
          <div>
            <Link
              href="/account"
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 mb-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Account Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              My Personalized Orders
            </h1>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID or product..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#091126] border border-navy-800 space-y-3">
            <Package className="w-10 h-10 text-gray-500 mx-auto" />
            <h3 className="text-base font-serif font-bold text-white">No Orders Found</h3>
            <p className="text-xs text-gray-400">
              You haven&apos;t placed any orders matching your search query.
            </p>
            <Link
              href="/shop"
              className="mt-2 inline-block px-5 py-2 rounded-xl text-xs font-semibold bg-[#D4AF37] text-navy-950"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const status = getOrderStatusDetails(order.status);
              return (
                <div
                  key={order.id}
                  className="p-6 rounded-2xl bg-[#091126] border border-navy-800 hover:border-[#D4AF37]/40 transition-colors space-y-4 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-navy-800 pb-4">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#F3E5AB]">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-gray-400 ml-3">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${status.bgClass} ${status.colorClass}`}
                      >
                        {status.label}
                      </span>
                      <Link
                        href={`/track-order?orderNumber=${order.orderNumber}`}
                        className="px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 hover:border-[#D4AF37] text-xs text-[#F3E5AB] font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Live Tracking</span>
                      </Link>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center text-xs">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-navy-950 flex-shrink-0 border border-navy-800">
                          <Image
                            src={
                              item.productImageUrl ||
                              '/images/products/diary-pen-giftset-box.jpg'
                            }
                            alt={item.productName}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white truncate">
                            {item.productName}
                          </h4>
                          <span className="text-gray-400">Qty: {item.quantity}</span>
                          {item.customization?.customText && (
                            <div className="text-[11px] text-[#D4AF37] flex items-center gap-1 mt-0.5">
                              <Sparkles className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">
                                &quot;{item.customization.customText}&quot; ({item.customization.fontName})
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right font-serif font-bold text-white">
                          {formatCurrency(item.totalPrice)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-navy-800/80 flex items-center justify-between text-xs text-gray-400">
                    <span>
                      Payment: <strong className="text-white">{order.paymentMethod}</strong> (
                      {order.paymentStatus})
                    </span>
                    <div className="space-x-3">
                      <Link
                        href={`/account/orders/${order.orderNumber}`}
                        className="text-[#D4AF37] hover:underline font-semibold"
                      >
                        View Full Invoice & Proof Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
