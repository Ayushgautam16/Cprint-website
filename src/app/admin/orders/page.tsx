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
  X,
  Package,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  Edit2,
  ChevronDown,
} from 'lucide-react';
import { getStoredOrders, saveStoredOrders } from '@/lib/store';
import { Order, OrderStatus } from '@/lib/types';
import { formatCurrency, formatDate, getOrderStatusDetails } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

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
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Edit fields for selected order modal
  const [editStatus, setEditStatus] = useState<OrderStatus>('ORDER_PLACED');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // 1. Initial local cache load
    const list = getStoredOrders();
    setOrders(list);

    // 2. Fetch latest orders from Supabase via API
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
          saveStoredOrders(data.orders);
        }
      })
      .catch((err) => console.warn('Orders fetch error:', err));

    const handleUpdate = () => {
      setOrders(getStoredOrders());
    };
    window.addEventListener('rynochi-orders-updated', handleUpdate);

    // 3. Supabase Realtime WebSocket subscription
    let channel: any = null;
    try {
      const channelId = `admin-orders-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          () => {
            fetch('/api/orders')
              .then((res) => res.json())
              .then((data) => {
                if (data.orders) {
                  setOrders(data.orders);
                  saveStoredOrders(data.orders);
                }
              })
              .catch((err) => console.warn('Realtime refresh error:', err));
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Admin orders realtime subscription skipped:', e);
    }

    return () => {
      window.removeEventListener('rynochi-orders-updated', handleUpdate);
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          console.warn('Realtime channel cleanup skipped:', e);
        }
      }
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenEditModal = (order: Order) => {
    setEditingOrder(order);
    setEditStatus(order.status);
    setTrackingNumber(order.trackingNumber || '');
    setCourierName(order.courierName || 'Blue Dart Express');
    setAdminNotes(order.adminNotes || '');
  };

  const handleSaveOrderChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    const now = new Date().toISOString();
    const updatedStatusHistory = [
      ...editingOrder.statusHistory,
      ...(editingOrder.status !== editStatus
        ? [
            {
              id: `hist_${Date.now()}`,
              status: editStatus,
              notes: adminNotes || `Status updated to ${editStatus} by Admin Panel`,
              changedBy: 'Admin Panel',
              createdAt: now,
            },
          ]
        : []),
    ];

    const updatedOrder: Order = {
      ...editingOrder,
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
    setEditingOrder(null);
    showToast(`Order ${updatedOrder.orderNumber} updated successfully!`);

    // 1. Direct Supabase update for instant Realtime broadcast
    supabase
      .from('orders')
      .update({
        status: updatedOrder.status,
        tracking_number: updatedOrder.trackingNumber || null,
        delivery_partner: updatedOrder.courierName || null,
        notes: updatedOrder.adminNotes || null,
        updated_at: now,
      })
      .eq('order_number', updatedOrder.orderNumber)
      .then(({ error }) => {
        if (error) console.warn('Direct Supabase update:', error.message);
      });

    // 2. Sync to Supabase via server API route
    fetch(`/api/orders/${updatedOrder.orderNumber}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: updatedOrder.status,
        trackingNumber: updatedOrder.trackingNumber,
        deliveryPartner: updatedOrder.courierName,
        notes: updatedOrder.adminNotes,
      }),
    }).catch((err) => console.warn('Supabase sync error:', err));
  };

  // Quick inline status change
  const handleQuickStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const now = new Date().toISOString();
    const updatedOrder: Order = {
      ...targetOrder,
      status: newStatus,
      updatedAt: now,
      statusHistory: [
        ...targetOrder.statusHistory,
        {
          id: `hist_${Date.now()}`,
          status: newStatus,
          notes: `Status changed to ${newStatus} via quick select`,
          changedBy: 'Admin Panel',
          createdAt: now,
        },
      ],
    };

    const updatedList = orders.map((o) => (o.id === orderId ? updatedOrder : o));
    saveStoredOrders(updatedList);
    setOrders(updatedList);
    showToast(`Status updated to ${newStatus.replace(/_/g, ' ')}`);

    // 1. Direct Supabase update for instant Realtime broadcast
    supabase
      .from('orders')
      .update({
        status: newStatus,
        updated_at: now,
      })
      .eq('order_number', updatedOrder.orderNumber)
      .then(({ error }) => {
        if (error) console.warn('Direct Supabase update:', error.message);
      });

    // 2. Sync to Supabase via server API route
    fetch(`/api/orders/${updatedOrder.orderNumber}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
      }),
    }).catch((err) => console.warn('Supabase sync error:', err));
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = o.orderNumber.toLowerCase().includes(q);
      const matchCustomer = o.customerName.toLowerCase().includes(q);
      const matchEmail = o.customerEmail.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      const matchItem = o.items.some((i) => i.productName.toLowerCase().includes(q));
      const matchEngraved = o.items.some(
        (i) => i.customization?.customText?.toLowerCase().includes(q)
      );
      return matchNumber || matchCustomer || matchEmail || matchPhone || matchItem || matchEngraved;
    }
    return true;
  });

  // Calculate live stats
  const totalOrdersCount = orders.length;
  const inProductionCount = orders.filter((o) =>
    ['CUSTOMIZATION_UNDER_REVIEW', 'DESIGN_APPROVED', 'PROCESSING', 'PRINTING_ENGRAVING', 'QUALITY_CHECK'].includes(o.status)
  ).length;
  const shippedCount = orders.filter((o) => ['PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(o.status)).length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-[#091126] border border-[#D4AF37] text-white text-xs shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">Order Management</h1>
        <p className="text-xs text-gray-400 mt-1">
          Review incoming personalized orders, laser engraving proofs, and manage shipping dispatch horizontally.
        </p>
      </div>

      {/* Top Metrics Bar (Horizontal) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#091126] border border-navy-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-gray-400">Total Orders</span>
          <div className="text-xl font-serif font-bold text-white">{totalOrdersCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091126] border border-navy-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-amber-400">Laser In-Production</span>
          <div className="text-xl font-serif font-bold text-amber-400">{inProductionCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091126] border border-navy-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-sky-400">Packed / Dispatched</span>
          <div className="text-xl font-serif font-bold text-sky-400">{shippedCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#091126] border border-navy-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-400">Delivered</span>
          <div className="text-xl font-serif font-bold text-emerald-400">{deliveredCount}</div>
        </div>
      </div>

      {/* Search & Filter Toolbar (Horizontal) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer, phone, engraved name..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-navy-900 border border-navy-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-navy-900 border border-navy-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none"
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

      {/* ============================================================== */}
      {/* HORIZONTAL FULL-WIDTH ORDERS LIST */}
      {/* ============================================================== */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center bg-[#091126] rounded-2xl border border-navy-800 text-xs text-gray-400">
          No orders found matching filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusDetails = getOrderStatusDetails(order.status);
            const firstItem = order.items[0];
            const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');

            return (
              <div
                key={order.id}
                className="w-full p-5 sm:p-6 rounded-2xl bg-[#091126] border border-navy-800 hover:border-[#D4AF37]/50 shadow-xl transition-all space-y-4"
              >
                {/* 1. TOP HORIZONTAL BAR: Order ID, Date, Amount, Status & Quick Action */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-navy-800/80">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-base font-bold text-[#F3E5AB]">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      {formatDate(order.createdAt)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      Payment: {order.paymentStatus}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-right mr-2">
                      <span className="text-[10px] text-gray-500 block uppercase">Total Amount</span>
                      <span className="font-serif font-bold text-lg text-[#F3E5AB]">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>

                    {/* WhatsApp Customer Button */}
                    <a
                      href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                        order.customerName
                      )},%20this%20is%20RYNOCHI%20Studio%20regarding%20your%20order%20${
                        order.orderNumber
                      }.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Direct Chat with Customer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Customer</span>
                    </a>

                    {/* Manage & Update Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(order)}
                      className="btn-luxury-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-navy-950 flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/25 hover:brightness-110 active:scale-95"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Update Status</span>
                    </button>
                  </div>
                </div>

                {/* 2. MIDDLE HORIZONTAL GRID (4 Clear Columns across the card) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
                  {/* Column 1: Customer Details */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-navy-950/60 border border-navy-800/80">
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] block flex items-center gap-1">
                      <User className="w-3 h-3" /> Customer & Shipping
                    </span>
                    <div className="font-semibold text-white text-sm">{order.customerName}</div>
                    <div className="text-gray-300 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span>{order.customerPhone}</span>
                    </div>
                    <div className="text-gray-400 text-[11px] truncate flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{order.customerEmail}</span>
                    </div>
                    <div className="text-gray-400 text-[11px] leading-snug pt-1 flex items-start gap-1.5">
                      <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0 mt-0.5" />
                      <span>
                        {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                      </span>
                    </div>
                  </div>

                  {/* Column 2: Products Ordered */}
                  <div className="space-y-2 p-3 rounded-xl bg-navy-950/60 border border-navy-800/80">
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] block flex items-center gap-1">
                      <Package className="w-3 h-3" /> Product Ordered ({order.items.length})
                    </span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-2.5 items-center">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-navy-900 border border-navy-800 flex-shrink-0">
                          <Image
                            src={item.productImageUrl || '/images/products/diary-pen-giftset-box.jpg'}
                            alt={item.productName}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white text-xs truncate">
                            {item.productName}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            Qty: <strong className="text-white">{item.quantity}</strong> •{' '}
                            {formatCurrency(item.totalPrice)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Column 3: Laser Customization Proof & Instructions */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-navy-950/60 border border-navy-800/80">
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] block flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Laser Engraving Proof
                    </span>
                    {firstItem?.customization ? (
                      <div className="space-y-1">
                        <div>
                          <span className="text-gray-400 text-[11px]">Engraved Text:</span>
                          <div className="font-bold text-[#F3E5AB] text-xs">
                            &quot;{firstItem.customization.customText}&quot;
                          </div>
                        </div>
                        <div className="text-[11px] text-gray-300">
                          Font: <span className="text-[#D4AF37] font-medium">{firstItem.customization.fontName}</span>
                        </div>
                        <div className="text-[11px] text-gray-400">
                          Placement: {firstItem.customization.placement}
                        </div>
                        {firstItem.customization.artworkFileName && (
                          <div className="pt-1 flex items-center justify-between text-[11px]">
                            <span className="text-emerald-400 truncate">
                              File: {firstItem.customization.artworkFileName}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                alert(`Downloading artwork file: ${firstItem.customization?.artworkFileName}`)
                              }
                              className="text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold ml-1 flex-shrink-0"
                            >
                              <Download className="w-3 h-3" />
                              <span>Download</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic text-[11px]">Standard (No Custom Text)</div>
                    )}
                  </div>

                  {/* Column 4: Shipping Tracking & Direct Status Selector */}
                  <div className="space-y-2 p-3 rounded-xl bg-navy-950/60 border border-navy-800/80">
                    <span className="text-[10px] uppercase font-bold text-[#D4AF37] block flex items-center gap-1">
                      <Truck className="w-3 h-3" /> Fulfillment & Stage
                    </span>

                    {/* Current Stage Badge */}
                    <div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusDetails.bgClass} ${statusDetails.colorClass}`}
                      >
                        {statusDetails.label}
                      </span>
                    </div>

                    {/* Quick Status Dropdown */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 block">Quick Stage Change:</label>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleQuickStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-navy-900 border border-navy-700 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tracking AWB details */}
                    {order.trackingNumber ? (
                      <div className="text-[11px] text-gray-300 pt-1">
                        <span className="text-gray-500 block text-[10px]">AWB Tracking:</span>
                        <span className="font-mono text-[#F3E5AB] font-bold">
                          {order.trackingNumber}
                        </span>{' '}
                        ({order.courierName || 'Courier'})
                      </div>
                    ) : (
                      <div className="text-[10px] text-gray-500 italic pt-1">
                        AWB not assigned yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* EDIT ORDER & TRACKING MODAL */}
      {/* ============================================================== */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091126] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-navy-800 pb-3">
              <div>
                <h3 className="text-base font-serif font-bold text-white">
                  Update Order: {editingOrder.orderNumber}
                </h3>
                <p className="text-xs text-gray-400">
                  Customer: {editingOrder.customerName} ({editingOrder.customerPhone})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrderChanges} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium block">Lifecycle Stage</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Courier Partner</label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g. Blue Dart Express, Delhivery"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">AWB Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. BLUEDART-882391024"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium block">Internal Notes / Log</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Laser engraving proof confirmed, boxed in luxury packaging..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950 hover:brightness-110 shadow-md shadow-[#D4AF37]/20 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Order Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
