'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Package, MapPin, LogOut, Sparkles, ChevronRight, Truck } from 'lucide-react';
import { getStoredOrders } from '@/lib/store';
import { Order } from '@/lib/types';
import { formatCurrency, formatDate, getOrderStatusDetails } from '@/lib/utils';
import Emblem from '@/components/brand/Emblem';

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  return (
    <div className="min-h-screen bg-[#070C1E] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Profile Header */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#101B3B] to-[#070D1F] border border-[#D4AF37]/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover-luxury-card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950 font-serif font-bold text-2xl flex items-center justify-center shadow-lg relative">
              S
              <div className="absolute -bottom-1 -right-1">
                <Emblem size={20} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Saurabh Kumar
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-400/20 text-[#D4AF37] border border-gold-400/30">
                  Patron
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">saurabh.kumar@example.com • +91 98112 34567</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-navy-900"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Orders Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
            <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-[#D4AF37]" />
              Your Personalized Orders ({orders.length})
            </h2>
            <Link href="/shop" className="text-xs text-[#D4AF37] hover:underline font-medium">
              Create New Gift →
            </Link>
          </div>

          <div className="space-y-4">
            {orders.map((order) => {
              const status = getOrderStatusDetails(order.status);
              return (
                <div
                  key={order.id}
                  className="p-6 rounded-2xl bg-[#091126] border border-navy-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-navy-800 pb-4">
                    <div>
                      <span className="font-mono font-bold text-sm text-white">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        Placed on {formatDate(order.createdAt)}
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
                        className="px-3 py-1.5 rounded-lg bg-navy-900 border border-navy-700 hover:border-[#D4AF37] text-xs text-[#F3E5AB] font-semibold flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </Link>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs text-gray-300"
                      >
                        <div>
                          <span className="font-medium text-white">{item.productName}</span>
                          <span className="text-gray-500 ml-2">x {item.quantity}</span>
                          {item.customization?.customText && (
                            <span className="text-[#D4AF37] block text-[11px]">
                              Engraved Name: &quot;{item.customization.customText}&quot; ({item.customization.fontName})
                            </span>
                          )}
                        </div>
                        <span className="font-serif font-bold text-white">
                          {formatCurrency(item.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-navy-800/80 flex items-center justify-between text-xs text-gray-400">
                    <span>
                      Delivery to:{' '}
                      <strong className="text-gray-300">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </strong>
                    </span>
                    <span className="text-sm font-serif font-bold text-[#F3E5AB]">
                      Total: {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

