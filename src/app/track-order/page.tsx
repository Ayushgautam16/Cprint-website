'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { getStoredOrders } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import { formatCurrency, formatDate, getOrderStatusDetails } from '@/lib/utils';
import Logo from '@/components/brand/Logo';
import Emblem from '@/components/brand/Emblem';

const ALL_TIMELINE_STAGES: Array<{ status: OrderStatus; label: string }> = [
  { status: 'ORDER_PLACED', label: 'Order Placed' },
  { status: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed' },
  { status: 'CUSTOMIZATION_UNDER_REVIEW', label: 'Artisan Review' },
  { status: 'DESIGN_APPROVED', label: 'Design Approved' },
  { status: 'PRINTING_ENGRAVING', label: 'Laser Engraving' },
  { status: 'QUALITY_CHECK', label: 'Quality Inspection' },
  { status: 'PACKED', label: 'Packed in Gift Box' },
  { status: 'SHIPPED', label: 'Dispatched / In Transit' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { status: 'DELIVERED', label: 'Delivered' },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('orderNumber') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery.trim()) {
      handleLookup(initialQuery);
    }
  }, [initialQuery]);

  const handleLookup = (query: string) => {
    setSearched(true);
    const q = query.trim().toUpperCase();
    const orders = getStoredOrders();
    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === q ||
        o.customerEmail.toUpperCase() === q ||
        o.customerPhone.includes(q)
    );
    setActiveOrder(found || null);
  };

  const currentStatusDetails = activeOrder
    ? getOrderStatusDetails(activeOrder.status)
    : null;

  return (
    <div className="min-h-screen bg-[#070C1E] py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="md" variant="gold" showTagline={false} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111C3A] border border-[#D4AF37]/30 text-xs font-semibold uppercase tracking-widest text-[#F3E5AB]">
            <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
            Live Dispatch Tracking
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Track Your Custom Kept Gift
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-sans max-w-lg mx-auto">
            Enter your RYNOCHI Order Reference (e.g. <code>RYN-2026-1049</code>) or mobile number to track manufacturing and courier milestones.
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="max-w-xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup(searchQuery);
            }}
            className="flex gap-2 p-2 rounded-2xl bg-[#091126] border border-[#D4AF37]/40 shadow-xl hover-luxury-card"
          >
            <div className="relative flex-1">
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. RYN-2026-1049)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="btn-luxury-gold px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-navy-950 shadow-md shadow-[#D4AF37]/20 flex items-center gap-2 group/btn"
            >
              <span>Track</span>
              <Truck className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
          </form>

          {/* Quick Demo Pre-fill Links */}
          <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-gray-500">
            <span>Try sample order:</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('RYN-2026-1049');
                handleLookup('RYN-2026-1049');
              }}
              className="text-[#D4AF37] underline hover:text-[#F3E5AB]"
            >
              RYN-2026-1049 (Engraving)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('RYN-2026-1050');
                handleLookup('RYN-2026-1050');
              }}
              className="text-[#D4AF37] underline hover:text-[#F3E5AB]"
            >
              RYN-2026-1050 (Shipped)
            </button>
          </div>
        </div>

        {/* Tracking Result View */}
        {searched && !activeOrder && (
          <div className="p-10 text-center rounded-2xl bg-[#091126] border border-navy-800 space-y-3 max-w-lg mx-auto">
            <Package className="w-10 h-10 text-gray-500 mx-auto" />
            <h3 className="text-base font-serif font-bold text-white">Order Not Found</h3>
            <p className="text-xs text-gray-400">
              No matching order record was found for &quot;{searchQuery}&quot;. Please verify the order number on your email receipt or contact our WhatsApp concierge.
            </p>
          </div>
        )}

        {activeOrder && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Current Status Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#091126] border border-[#D4AF37]/30 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-800 pb-5">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-gray-400">
                    Order Reference
                  </span>
                  <h2 className="text-xl sm:text-2xl font-mono font-bold text-[#F3E5AB]">
                    {activeOrder.orderNumber}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Placed on {formatDate(activeOrder.createdAt)}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end">
                  <div
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${currentStatusDetails?.bgClass} ${currentStatusDetails?.colorClass}`}
                  >
                    {currentStatusDetails?.label}
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1">
                    {currentStatusDetails?.description}
                  </span>
                </div>
              </div>

              {/* Courier Tracking Pill if Shipped */}
              {activeOrder.trackingNumber && (
                <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-[#D4AF37]" />
                    <div>
                      <span className="text-gray-300 font-semibold block">
                        Courier: {activeOrder.courierName || 'Blue Dart Express'}
                      </span>
                      <span className="text-gray-500 font-mono">
                        AWB No: {activeOrder.trackingNumber}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      `${activeOrder.courierName} tracking ${activeOrder.trackingNumber}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4AF37] hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Track on Carrier Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Visual 10-Stage Milestone Progress Bar */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs uppercase font-serif font-bold text-gray-300 tracking-wider">
                  Milestone Progress
                </h3>

                <div className="space-y-1">
                  {ALL_TIMELINE_STAGES.map((stage, idx) => {
                    const stageNumber = idx + 1;
                    const isCompleted =
                      (currentStatusDetails?.stepNumber || 0) >= stageNumber;
                    const isCurrent =
                      (currentStatusDetails?.stepNumber || 0) === stageNumber;

                    return (
                      <div key={stage.status} className="flex items-start gap-4">
                        {/* Step Indicator Column with Connecting Line */}
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all z-10 ${
                              isCurrent
                                ? 'bg-[#D4AF37] text-navy-950 ring-4 ring-[#D4AF37]/30 shadow-lg'
                                : isCompleted
                                ? 'bg-emerald-500 text-white shadow-sm'
                                : 'bg-navy-900 text-gray-500 border border-navy-800'
                            }`}
                          >
                            {isCompleted ? '✓' : stageNumber}
                          </div>
                          {idx < ALL_TIMELINE_STAGES.length - 1 && (
                            <div
                              className={`w-0.5 h-6 my-1 ${
                                isCompleted ? 'bg-emerald-500/50' : 'bg-navy-800'
                              }`}
                            />
                          )}
                        </div>

                        {/* Stage Content */}
                        <div className="pt-0.5">
                          <h4
                            className={`text-xs font-semibold ${
                              isCurrent
                                ? 'text-[#F3E5AB] font-bold'
                                : isCompleted
                                ? 'text-white'
                                : 'text-gray-500'
                            }`}
                          >
                            {stage.label}
                          </h4>
                          {isCurrent && (
                            <p className="text-[11px] text-[#C5A059] mt-0.5">
                              Current status in progress at RYNOCHI studio.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items & Customization Breakdown */}
              <div className="pt-6 border-t border-navy-800 space-y-3">
                <h3 className="text-xs uppercase font-serif font-bold text-gray-300 tracking-wider">
                  Personalized Items in this Consignment
                </h3>
                <div className="space-y-3">
                  {activeOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-navy-950 border border-navy-800 flex gap-4 text-xs"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-navy-900 flex-shrink-0">
                        <Image
                          src={item.productImageUrl || '/images/products/diary-pen-giftset-box.jpg'}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white">{item.productName}</h4>
                        <p className="text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                        {item.customization?.customText && (
                          <div className="mt-1 text-[#D4AF37] flex items-center gap-1.5 font-medium">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Laser Engraved Name: &quot;{item.customization.customText}&quot;</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right font-serif font-semibold text-white">
                        {formatCurrency(item.totalPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070C1E] p-12 text-center text-gray-400">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}

