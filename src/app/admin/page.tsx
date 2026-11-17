'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { getStoredOrders, getStoredProducts } from '@/lib/store';
import { Order, Product } from '@/lib/types';
import { formatCurrency, formatDate, getOrderStatusDetails } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setOrders(getStoredOrders());
    setProducts(getStoredProducts());

    const handleUpdate = () => {
      setOrders(getStoredOrders());
      setProducts(getStoredProducts());
    };

    window.addEventListener('rynochi-orders-updated', handleUpdate);
    window.addEventListener('rynochi-products-updated', handleUpdate);
    return () => {
      window.removeEventListener('rynochi-orders-updated', handleUpdate);
      window.removeEventListener('rynochi-products-updated', handleUpdate);
    };
  }, []);

  // Compute live analytics metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(
    (o) => !['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(o.status)
  ).length;
  const completedOrders = orders.filter((o) => o.status === 'DELIVERED').length;
  const lowStockProducts = products.filter((p) => p.stock < 15);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Operations & Studio Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time telemetry on custom laser engraving, fulfillment queues, and sales revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-navy-800 hover:bg-navy-700 text-white border border-navy-700 transition-colors"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950 hover:brightness-110 shadow-md shadow-[#D4AF37]/20"
          >
            Fulfillment Queue ({pendingOrders})
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Gross Revenue */}
        <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Gross Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-white">
            {formatCurrency(totalRevenue)}
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +28% vs last month
          </span>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-white">{orders.length}</div>
          <span className="text-[11px] text-gray-400">Across retail & corporate gifting</span>
        </div>

        {/* Metric 3: Active Production Queue */}
        <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>In Laser Production</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-amber-400">{pendingOrders}</div>
          <span className="text-[11px] text-gray-400">Awaiting dispatch / engraving</span>
        </div>

        {/* Metric 4: Low Stock Warnings */}
        <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Stock Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-white">
            {lowStockProducts.length}
          </div>
          <span className="text-[11px] text-rose-400 font-medium">SKUs near replenishment trigger</span>
        </div>
      </div>

      {/* Production Analytics Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B132B] via-[#101B3B] to-[#070D1F] border border-[#D4AF37]/30 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-serif font-bold text-[#F3E5AB] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Fiber Laser Machine 01 & 02 Status: Optimal (Calibrated at 0.02mm)
            </h3>
            <p className="text-xs text-gray-400">
              Average personalization turnaround today: <strong>14.2 minutes per unit</strong>. All pending proofs reviewed.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-navy-900 border border-navy-700 text-white hover:border-[#D4AF37] transition-colors"
          >
            Open Laser Queue →
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-2xl bg-[#091126] border border-navy-800 space-y-4">
        <div className="flex items-center justify-between border-b border-navy-800 pb-3">
          <h2 className="text-base font-serif font-bold text-white">
            Recent Orders & Customization Proofs
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-navy-950 text-gray-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Engraving Text</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {orders.slice(0, 5).map((order) => {
                const statusDetails = getOrderStatusDetails(order.status);
                const firstCustomization = order.items.find((i) => i.customization?.customText)
                  ?.customization;

                return (
                  <tr key={order.id} className="hover:bg-navy-950/50 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-white">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3.5 text-gray-300">
                      <div className="font-semibold text-white">{order.customerName}</div>
                      <div className="text-[10px] text-gray-500">{order.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      {firstCustomization ? (
                        <div className="text-[#D4AF37] font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate max-w-[140px]">
                            &quot;{firstCustomization.customText}&quot;
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Standard</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-gray-300">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="px-4 py-3.5 font-serif font-bold text-[#F3E5AB]">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusDetails.bgClass} ${statusDetails.colorClass}`}
                      >
                        {statusDetails.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/admin/orders`}
                        className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-navy-950 hover:bg-[#FFF0B8] font-bold text-[11px] uppercase tracking-wider transition-all shadow-sm"
                      >
                        Update
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

