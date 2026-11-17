'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Package,
  Boxes,
  AlertCircle,
} from 'lucide-react';
import { getStoredProducts, saveStoredProducts, getStoredCategories } from '@/lib/store';
import { Product, Category } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    sku: '',
    shortDescription: '',
    description: '',
    basePrice: 999,
    discountPrice: 799,
    stock: 50,
    categoryId: 'cat-pens',
    categoryName: 'Personalized Pens',
    isCustomizable: true,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    images: ['/images/products/pen-imperial-blue-gold.jpg'],
  });

  useEffect(() => {
    setProducts(getStoredProducts());
    setCategories(getStoredCategories());
  }, []);

  const handleToggleActive = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    setProducts(updated);
    saveStoredProducts(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      saveStoredProducts(updated);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.sku) return;

    const matchedCat = categories.find((c) => c.id === newProd.categoryId);

    const created: Product = {
      id: `prod_${Date.now()}`,
      name: newProd.name,
      slug: newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: newProd.sku,
      shortDescription: newProd.shortDescription || 'Bespoke executive gift item.',
      description: newProd.description || 'Precision crafted with high-grade materials.',
      categoryId: newProd.categoryId || 'cat-pens',
      categoryName: matchedCat?.name || 'Personalized Pens',
      basePrice: Number(newProd.basePrice) || 999,
      discountPrice: Number(newProd.discountPrice) || undefined,
      stock: Number(newProd.stock) || 50,
      minOrderQty: 1,
      isCustomizable: Boolean(newProd.isCustomizable),
      additionalCustomizationFee: 0,
      isFeatured: Boolean(newProd.isFeatured),
      isBestseller: Boolean(newProd.isBestseller),
      isNewArrival: Boolean(newProd.isNewArrival),
      isActive: true,
      images: ['/images/products/diary-pen-giftset-box.jpg'],
      rating: 5.0,
      reviewCount: 1,
    };

    const updated = [created, ...products];
    setProducts(updated);
    saveStoredProducts(updated);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    setProducts(updated);
    saveStoredProducts(updated);
    setEditingProduct(null);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Product Catalogue</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage your personalized writing instruments, diaries, variants, and stock counts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950 hover:brightness-110 shadow-md shadow-[#D4AF37]/20 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by product name or SKU..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-[#091126] border border-navy-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-navy-950 text-gray-400 uppercase tracking-wider text-[10px] border-b border-navy-800">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Customizable</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-navy-950/40 transition-colors">
                  <td className="px-4 py-3.5 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-navy-900 border border-navy-800 flex-shrink-0">
                      <Image
                        src={prod.images[0] || '/images/products/diary-pen-giftset-box.jpg'}
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white line-clamp-1 max-w-xs">
                        {prod.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 line-clamp-1">
                        {prod.shortDescription}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-gray-300">{prod.sku}</td>
                  <td className="px-4 py-3.5 text-gray-300">{prod.categoryName}</td>
                  <td className="px-4 py-3.5 font-serif font-bold text-[#F3E5AB]">
                    {formatCurrency(prod.discountPrice || prod.basePrice)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`font-semibold ${
                        prod.stock < 15 ? 'text-rose-400 font-bold' : 'text-emerald-400'
                      }`}
                    >
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {prod.isCustomizable ? (
                      <span className="text-[#D4AF37] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Laser Yes
                      </span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(prod.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        prod.isActive
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {prod.isActive ? 'Active' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(prod)}
                      className="p-1.5 text-gray-400 hover:text-[#D4AF37] hover:bg-navy-900 rounded-lg transition-colors"
                      title="Quick Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(prod.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-navy-900 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091126] border border-[#D4AF37]/40 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-navy-800 pb-3">
              <h3 className="text-base font-serif font-bold text-white">
                Add New Customizable Product
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium block">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="e.g. RYNOCHI Regal Tan A5 Journal"
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    placeholder="e.g. RYN-JRN-007"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Category</label>
                  <select
                    value={newProd.categoryId}
                    onChange={(e) => setNewProd({ ...newProd, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Base Price (₹)</label>
                  <input
                    type="number"
                    value={newProd.basePrice}
                    onChange={(e) => setNewProd({ ...newProd, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={newProd.discountPrice}
                    onChange={(e) =>
                      setNewProd({ ...newProd, discountPrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Initial Stock</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium block">Short Description</label>
                <input
                  type="text"
                  value={newProd.shortDescription}
                  onChange={(e) => setNewProd({ ...newProd, shortDescription: e.target.value })}
                  placeholder="One sentence luxury summary..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={newProd.isCustomizable}
                    onChange={(e) =>
                      setNewProd({ ...newProd, isCustomizable: e.target.checked })
                    }
                    className="accent-[#D4AF37]"
                  />
                  <span>Enable Laser Customization</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={newProd.isFeatured}
                    onChange={(e) => setNewProd({ ...newProd, isFeatured: e.target.checked })}
                    className="accent-[#D4AF37]"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091126] border border-[#D4AF37]/40 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-navy-800 pb-3">
              <h3 className="text-base font-serif font-bold text-white">
                Edit: {editingProduct.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-medium block">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Base Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.basePrice}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        basePrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.discountPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        discountPrice: Number(e.target.value) || undefined,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={editingProduct.isCustomizable}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        isCustomizable: e.target.checked,
                      })
                    }
                    className="accent-[#D4AF37]"
                  />
                  <span>Customizable</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestseller}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        isBestseller: e.target.checked,
                      })
                    }
                    className="accent-[#D4AF37]"
                  />
                  <span>Bestseller</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#D4AF37] text-navy-950"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

