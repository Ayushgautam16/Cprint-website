'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  Truck,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  MessageCircle,
} from 'lucide-react';
import { getStoredOrders } from '@/lib/store';
import { Order } from '@/lib/types';
import { formatCurrency, formatDate, getOrderStatusDetails } from '@/lib/utils';

export default function OrderDetailsPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orders = getStoredOrders();
    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === params.orderId.toUpperCase() ||
        o.id === params.orderId
    );
    setOrder(found || null);
  }, [params.orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#070C1E] py-16 flex items-center justify-center p-6 text-center space-y-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Order Not Found</h1>
          <p className="text-xs text-gray-400 mt-1">
            Could not retrieve order details for #{params.orderId}.
          </p>
          <Link
            href="/account/orders"
            className="mt-4 inline-block px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#D4AF37] text-navy-950 uppercase tracking-wider"
          >
            Return to Orders
          </Link>
        </div>
      </div>
    );
  }

  const status = getOrderStatusDetails(order.status);

  return (
    <div className="min-h-screen bg-[#070C1E] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
          <div>
            <Link
              href="/account/orders"
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 mb-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back to All Orders
            </Link>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white">
              Invoice #{order.orderNumber}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Placed on {formatDate(order.createdAt)} • Payment Method: {order.paymentMethod}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-navy-900 border border-navy-700 hover:border-[#D4AF37] text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <Link
              href={`/track-order?orderNumber=${order.orderNumber}`}
              className="btn-luxury-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/20 group/btn"
            >
              <Truck className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
              <span>Track Consignment</span>
            </Link>
          </div>
        </div>

        {/* Status Banner */}
        <div className="p-6 rounded-2xl bg-[#091126] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${status.bgClass} ${status.colorClass}`}>
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-gray-400 uppercase tracking-widest block">
                Current Production Stage
              </span>
              <h3 className="text-lg font-serif font-bold text-white">{status.label}</h3>
              <p className="text-xs text-gray-300 mt-0.5">{status.description}</p>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="text-left sm:text-right text-xs bg-navy-950 p-3 rounded-xl border border-navy-800">
              <span className="text-gray-400 block">Courier Partner:</span>
              <strong className="text-white font-medium">{order.courierName}</strong>
              <div className="font-mono text-[#D4AF37] mt-0.5">{order.trackingNumber}</div>
            </div>
          )}
        </div>

        {/* Personalized Items */}
        <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-serif font-bold uppercase tracking-wider text-[#F3E5AB] border-b border-navy-800 pb-3">
            Custom Items & Laser Engraving Specifications
          </h3>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-3 text-xs"
              >
                <div className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-navy-900 border border-navy-800 flex-shrink-0">
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
                    <h4 className="font-semibold text-white text-sm">{item.productName}</h4>
                    <span className="text-gray-400">
                      SKU: {item.productSku} • Qty: {item.quantity}
                    </span>
                  </div>
                  <div className="text-right font-serif font-bold text-white text-sm">
                    {formatCurrency(item.totalPrice)}
                  </div>
                </div>

                {/* Engraving Proof Details */}
                {item.customization && (
                  <div className="p-3.5 rounded-lg bg-[#070D1F] border border-[#D4AF37]/30 text-gray-300 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Engraving Inscription:</span>
                      <strong className="text-[#F3E5AB] text-sm">
                        &quot;{item.customization.customText}&quot;
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Typography Font:</span>
                      <span className="text-[#C5A059] italic font-medium">
                        {item.customization.fontName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Target Placement:</span>
                      <span className="text-gray-200">{item.customization.placement}</span>
                    </div>
                    {item.customization.artworkFileName && (
                      <div className="flex items-center justify-between pt-1 border-t border-navy-900">
                        <span className="text-emerald-400">
                          Uploaded Artwork: {item.customization.artworkFileName}
                        </span>
                        <span className="text-[11px] text-[#D4AF37]">Verified by Studio</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Addresses & Financial Breakdown Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Shipping Address */}
          <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 space-y-3">
            <h3 className="font-serif font-bold text-white uppercase tracking-wider text-xs border-b border-navy-800 pb-2">
              Delivery Destination
            </h3>
            <div className="text-gray-300 space-y-1 leading-relaxed">
              <strong className="text-white block font-medium">
                {order.shippingAddress.fullName}
              </strong>
              <div>{order.shippingAddress.addressLine1}</div>
              {order.shippingAddress.addressLine2 && (
                <div>{order.shippingAddress.addressLine2}</div>
              )}
              <div>
                {order.shippingAddress.city}, {order.shippingAddress.state} –{' '}
                {order.shippingAddress.postalCode}
              </div>
              <div className="pt-1 text-gray-400">Contact: {order.shippingAddress.phone}</div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 space-y-3">
            <h3 className="font-serif font-bold text-white uppercase tracking-wider text-xs border-b border-navy-800 pb-2">
              Payment & Tax Summary
            </h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-white font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Laser Customization:</span>
                <span className="text-emerald-400 font-medium">COMPLIMENTARY</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charges:</span>
                <span>
                  {order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>{formatCurrency(order.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-white pt-2 border-t border-navy-800">
                <span>Total Invoiced:</span>
                <span className="text-[#D4AF37]">{formatCurrency(order.totalAmount)}</span>
              </div>
              {order.razorpayPaymentId && (
                <div className="text-[10px] text-gray-500 pt-1">
                  Razorpay Transaction Ref: <code>{order.razorpayPaymentId}</code>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Concierge Support Link */}
        <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-between text-xs">
          <span className="text-gray-400">
            Need urgent assistance or modification regarding this invoice?
          </span>
          <a
            href={`https://wa.me/919876543210?text=Hello%20RYNOCHI!%20I%20have%20a%20question%20regarding%20invoice%20${order.orderNumber}.`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Studio Concierge</span>
          </a>
        </div>
      </div>
    </div>
  );
}
