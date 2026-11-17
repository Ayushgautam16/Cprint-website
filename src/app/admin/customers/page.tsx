'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, ShoppingBag, Search } from 'lucide-react';
import { getStoredOrders } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const orders = getStoredOrders();
    const customerMap: { [email: string]: any } = {};

    orders.forEach((o) => {
      const email = o.customerEmail.toLowerCase();
      if (!customerMap[email]) {
        customerMap[email] = {
          email: o.customerEmail,
          name: o.customerName,
          phone: o.customerPhone,
          city: o.shippingAddress.city,
          state: o.shippingAddress.state,
          orderCount: 0,
          totalSpend: 0,
          firstOrder: o.createdAt,
          lastOrder: o.createdAt,
        };
      }
      customerMap[email].orderCount += 1;
      customerMap[email].totalSpend += o.totalAmount;
      if (new Date(o.createdAt) > new Date(customerMap[email].lastOrder)) {
        customerMap[email].lastOrder = o.createdAt;
      }
    });

    setCustomers(Object.values(customerMap));
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">Customer Directory</h1>
        <p className="text-xs text-gray-400 mt-1">
          Review customer lifetime value, order frequency, and personalized gifting histories.
        </p>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by customer name, email, phone..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
      </div>

      <div className="rounded-2xl bg-[#091126] border border-navy-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-navy-950 text-gray-400 uppercase tracking-wider text-[10px] border-b border-navy-800">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {filtered.map((c, idx) => (
                <tr key={idx} className="hover:bg-navy-950/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-[10px] text-[#D4AF37]">Patron since 2026</div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-300">
                    <div>{c.email}</div>
                    <div className="text-gray-500 font-mono text-[10px]">{c.phone}</div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-400">
                    {c.city}, {c.state}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-white">
                    {c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'}
                  </td>
                  <td className="px-4 py-3.5 font-serif font-bold text-[#F3E5AB] text-right">
                    {formatCurrency(c.totalSpend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

