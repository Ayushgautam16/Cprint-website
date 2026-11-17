'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Download,
  AlertCircle,
  Sparkles,
  Save,
  MessageCircle,
} from 'lucide-react';
import { getStoredOrders, saveStoredOrders } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import { formatCurrency, formatDate, getOrderStatusDetails } from '@/lib/utils';

const STATUS_OPTIONS: OrderStatus[] = [
  'ORDER_PLACED',
  'PAYMENT_CONFIRMED',
  'CUSTOMIZATION_UNDER_REVIEW',
  'DESIGN_APPROVAL_PENDING',
  'DESIGN_APPROVED',
  'PROCESSING',
  'PRINTING_ENGRAVING',
  'QUALITY_CHECK',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Edit fields for selected order modal
  const [editStatus, setEditStatus] = useState<OrderStatus>('ORDER_PLACED');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const list = getStoredOrders();
    setOrders(list);
    if (list.length > 0) {
      setSelectedOrder(list[0]);
      setEditStatus(list[0].status);
      setTrackingNumber(list[0].trackingNumber || '');
      setCourierName(list[0].courierName || 'Blue Dart Express');
      setAdminNotes(list[0].adminNotes || '');
    }
  }, []);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setTrackingNumber(order.trackingNumber || '');
    setCourierName(order.courierName || 'Blue Dart Express');
    setAdminNotes(order.adminNotes || '');
    setIsSaved(false);
  };

  const handleUpdateOrder = () => {
    if (!selectedOrder) return;

    const now = new Date().toISOString();
    const updatedStatusHistory = [
      ...selectedOrder.statusHistory,
      ...(selectedOrder.status !== editStatus
        ? [
            {
              id: `hist_${Date.now()}`,
              status: editStatus,
              notes: adminNotes || `Status updated to ${editStatus} by Admin`,
              changedBy: 'Admin Panel',
              createdAt: now,
            },
          ]
        : []),
    ];

    const updatedOrder: Order = {
      ...selectedOrder,
      status: editStatus,
      trackingNumber: trackingNumber.trim() || undefined,
      courierName: courierName.trim() || undefined,
      adminNotes: adminNotes.trim() || undefined,
      updatedAt: now,
      statusHistory: updatedStatusHistory,
    };

    const allOrders = getStoredOrders();
    const updatedList = allOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
    saveStoredOrders(updatedList);
    setOrders(updatedList);
    setSelectedOrder(updatedOrder);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = o.orderNumber.toLowerCase().includes(q);
      const matchCustomer = o.customerName.toLowerCase().includes(q);
      const matchEmail = o.customerEmail.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      return matchNumber || matchCustomer || matchEmail || matchPhone;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">
          Order Management & Laser Studio Desk
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Inspect customer artwork, approve laser proofs, and advance orders across the 12 lifecycle stages.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer, phone..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-navy-900 border border-navy-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">All Statuses ({orders.length})</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Master-Detail Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Orders List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center bg-[#091126] rounded-2xl border border-navy-800 text-xs text-gray-400">
              No orders found matching filters.
            </div>
          ) : (
            filteredOrders.map((o) => {
              const statusDetails = getOrderStatusDetails(o.status);
              const isSelected = selectedOrder?.id === o.id;

              return (
                <div
                  key={o.id}
                  onClick={() => handleSelectOrder(o)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-[#101B3B] border-[#D4AF37] ring-1 ring-[#D4AF37]/50 shadow-lg'
                      : 'bg-[#091126] border-navy-800 hover:border-navy-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-white text-xs block">
                        {o.orderNumber}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {o.customerName}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusDetails.bgClass} ${statusDetails.colorClass}`}
                    >
                      {statusDetails.label}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-400 pt-1 border-t border-navy-900">
                    <span>{formatDate(o.createdAt)}</span>
                    <span className="font-serif font-bold text-[#D4AF37]">
                      {formatCurrency(o.totalAmount)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Order Detail & Update Controls (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="p-6 rounded-2xl bg-[#091126] border border-[#D4AF37]/30 shadow-xl space-y-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-navy-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-mono font-bold text-[#F3E5AB]">
                      {selectedOrder.orderNumber}
                    </h2>
                    <span className="text-xs text-emerald-400 font-medium bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      Payment: {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Customer: {selectedOrder.customerName} ({selectedOrder.customerEmail} •{' '}
                    {selectedOrder.customerPhone})
                  </p>
                </div>

                <a
                  href={`https://wa.me/${selectedOrder.customerPhone.replace(
                    /[^0-9]/g,
                    ''
                  )}?text=Hello%20${encodeURIComponent(
                    selectedOrder.customerName
                  )},%20this%20is%20RYNOCHI%20Studio%20regarding%20order%20${
                    selectedOrder.orderNumber
                  }.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-medium flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Customer</span>
                </a>
              </div>

              {/* Laser Engraving Specifications */}
              <div className="space-y-3">
                <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Laser Engraving Proof & Instructions
                </h3>

                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 text-xs space-y-1.5"
                    >
                      <div className="flex justify-between text-white font-medium">
                        <span>{item.productName}</span>
                        <span className="text-[#F3E5AB]">Qty: {item.quantity}</span>
                      </div>

                      {item.customization ? (
                        <div className="p-2.5 rounded-lg bg-[#070D1F] border border-[#D4AF37]/30 text-gray-300 space-y-1 text-[11px]">
                          <div>
                            Engraving Name/Text:{' '}
                            <strong className="text-[#F3E5AB] text-xs">
                              &quot;{item.customization.customText}&quot;
                            </strong>
                          </div>
                          <div>
                            Font Selection:{' '}
                            <span className="text-[#C5A059] font-medium">
                              {item.customization.fontName}
                            </span>
                          </div>
                          <div>
                            Placement Target:{' '}
                            <span className="text-gray-400">
                              {item.customization.placement}
                            </span>
                          </div>
                          {item.customization.specialInstructions && (
                            <div>
                              Special Notes:{' '}
                              <span className="italic text-gray-400">
                                {item.customization.specialInstructions}
                              </span>
                            </div>
                          )}
                          {item.customization.artworkFileName && (
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-emerald-400">
                                Artwork File: {item.customization.artworkFileName}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  alert(
                                    `Downloading customer artwork vector: ${item.customization?.artworkFileName}`
                                  )
                                }
                                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download File</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-[11px]">No engraving specified</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="space-y-4 pt-2 border-t border-navy-800">
                <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-gray-300">
                  Update Lifecycle Stage
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-gray-400 block font-medium">Order Status:</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white font-medium focus:outline-none focus:border-[#D4AF37]"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 block font-medium">Courier Partner:</label>
                    <input
                      type="text"
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder="e.g. Blue Dart, Delhivery, DTDC"
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-gray-400 block font-medium">
                      Courier AWB / Tracking Number:
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. BLUEDART-882391024"
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white font-mono placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-gray-400 block font-medium">Internal Notes:</label>
                    <textarea
                      rows={2}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Laser machine calibration notes, customer proof confirmation..."
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleUpdateOrder}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950 hover:brightness-110 shadow-md shadow-[#D4AF37]/20 flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Order Changes</span>
                  </button>

                  {isSaved && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Order updated successfully!
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#091126] border border-navy-800 text-gray-500 text-xs">
              Select an order from the list on the left to view details and update status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

