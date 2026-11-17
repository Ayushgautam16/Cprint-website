'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Boxes, AlertTriangle, ArrowUpDown, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { getStoredProducts, saveStoredProducts } from '@/lib/store';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockChanges, setStockChanges] = useState<{ [id: string]: number }>({});
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    setProducts(getStoredProducts());

    const refresh = () => {
      fetch('/api/products?admin=true')
        .then((res) => res.json())
        .then((data) => {
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
            saveStoredProducts(data.products);
          }
        })
        .catch((err) => console.warn('Inventory products fetch error:', err));
    };

    refresh();

    // Supabase Realtime channel subscription
    let channel: any = null;
    try {
      const channelId = `inventory-products-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          () => {
            refresh();
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Inventory products realtime subscription skipped:', e);
    }

    const handleUpdate = () => {
      setProducts(getStoredProducts());
    };
    window.addEventListener('rynochi-products-updated', handleUpdate);

    return () => {
      window.removeEventListener('rynochi-products-updated', handleUpdate);
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          console.warn('Realtime channel cleanup skipped:', e);
        }
      }
    };
  }, []);

  const handleAdjustStock = (id: string, delta: number) => {
    let targetNewStock = 0;
    const updated = products.map((p) => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        targetNewStock = newStock;
        return { ...p, stock: newStock };
      }
      return p;
    });

    setProducts(updated);
    saveStoredProducts(updated);
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2000);

    // Direct Supabase update for instant Realtime broadcast
    supabase
      .from('products')
      .update({ stock: targetNewStock, updated_at: new Date().toISOString() })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Stock update direct supabase error:', error.message);
      });

    // Server API route PATCH
    fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: targetNewStock }),
    }).catch((err) => console.warn('Stock sync error:', err));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">Inventory & Stock Tracking</h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor raw pen barrels, leather journal blanks, and replenishment thresholds.
        </p>
      </div>

      <div className="rounded-2xl bg-[#091126] border border-navy-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-navy-950 text-gray-400 uppercase tracking-wider text-[10px] border-b border-navy-800">
              <tr>
                <th className="px-4 py-3">Product Blank</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Unit Value</th>
                <th className="px-4 py-3">Current Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {products.map((prod) => {
                const isLow = prod.stock < 15;
                return (
                  <tr key={prod.id} className="hover:bg-navy-950/40 transition-colors">
                    <td className="px-4 py-3.5 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-navy-900 flex-shrink-0">
                        <Image
                          src={prod.images[0] || '/images/products/diary-pen-giftset-box.jpg'}
                          alt={prod.name}
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                      <span className="font-semibold text-white max-w-xs truncate">{prod.name}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-gray-300">{prod.sku}</td>
                    <td className="px-4 py-3.5 text-gray-400">{prod.categoryName}</td>
                    <td className="px-4 py-3.5 text-[#F3E5AB]">
                      {formatCurrency(prod.discountPrice || prod.basePrice)}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-white text-sm">
                      {prod.stock} units
                    </td>
                    <td className="px-4 py-3.5">
                      {isLow ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-500/40 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40">
                          Sufficient
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(prod.id, -5)}
                          className="px-2 py-1 rounded bg-navy-800 hover:bg-navy-700 text-gray-300 text-[11px] font-mono"
                          title="Deduct 5 units"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(prod.id, 5)}
                          className="px-2 py-1 rounded bg-navy-800 hover:bg-[#D4AF37] hover:text-navy-950 text-gray-300 text-[11px] font-mono"
                          title="Add 5 units"
                        >
                          +5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(prod.id, 25)}
                          className="px-2.5 py-1 rounded bg-navy-800 hover:bg-[#D4AF37] hover:text-navy-950 text-gray-300 text-[11px] font-mono font-bold"
                          title="Restock +25"
                        >
                          +25
                        </button>
                        {savedId === prod.id && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />
                        )}
                      </div>
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

