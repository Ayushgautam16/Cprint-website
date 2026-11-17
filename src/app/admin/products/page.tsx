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
  Image as ImageIcon,
  Upload,
  Star,
  ArrowUpDown,
  CheckCircle2,
} from 'lucide-react';
import { getStoredProducts, saveStoredProducts, getStoredCategories } from '@/lib/store';
import { Product, Category } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

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
    images: ['/images/products-optimized/1.png'],
  });

  useEffect(() => {
    setProducts(getStoredProducts());
    setCategories(getStoredCategories());

    const refreshProducts = () => {
      fetch('/api/products?admin=true')
        .then((res) => res.json())
        .then((data) => {
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
            saveStoredProducts(data.products);
          }
        })
        .catch((err) => console.warn('Products fetch error:', err));
    };

    refreshProducts();

    // Supabase Realtime channel subscription for instant multi-device sync
    const channel = supabase
      .channel('admin-products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          refreshProducts();
        }
      )
      .subscribe();

    const handleUpdate = () => {
      setProducts(getStoredProducts());
    };
    window.addEventListener('rynochi-products-updated', handleUpdate);

    return () => {
      window.removeEventListener('rynochi-products-updated', handleUpdate);
      supabase.removeChannel(channel);
    };
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleActive = (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const newActive = !target.isActive;
    const updated = products.map((p) => (p.id === id ? { ...p, isActive: newActive } : p));
    setProducts(updated);
    saveStoredProducts(updated);
    showToast('Product visibility updated.');

    // Direct Supabase update for Realtime broadcast
    supabase
      .from('products')
      .update({ is_active: newActive, updated_at: new Date().toISOString() })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.warn('Direct product active update error:', error.message);
      });

    // Server API route PATCH
    fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: newActive }),
    }).catch((err) => console.warn('Product active sync error:', err));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      saveStoredProducts(updated);
      showToast('Product removed.');

      // Direct Supabase delete for Realtime broadcast
      supabase
        .from('products')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.warn('Direct product delete error:', error.message);
        });

      // Server API route DELETE
      fetch(`/api/products/${id}`, {
        method: 'DELETE',
      }).catch((err) => console.warn('Product delete sync error:', err));
    }
  };

  // Add a new image from device file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (!result) return;

      if (isEditing && editingProduct) {
        setEditingProduct({
          ...editingProduct,
          images: [...editingProduct.images, result],
        });
      } else {
        setNewProd({
          ...newProd,
          images: [...(newProd.images || []), result],
        });
      }
      showToast('Image uploaded successfully.');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Add image by URL or path
  const handleAddImageUrl = (isEditing = true) => {
    if (!newImageUrl.trim()) return;
    const url = newImageUrl.trim();

    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: [...editingProduct.images, url],
      });
    } else {
      setNewProd({
        ...newProd,
        images: [...(newProd.images || []), url],
      });
    }
    setNewImageUrl('');
    showToast('Image added.');
  };

  // Remove an image from the product's images array
  const handleRemoveImage = (indexToRemove: number, isEditing = true) => {
    if (isEditing && editingProduct) {
      if (editingProduct.images.length <= 1) {
        alert('Each product must have at least one image.');
        return;
      }
      const updatedImages = editingProduct.images.filter((_, idx) => idx !== indexToRemove);
      setEditingProduct({
        ...editingProduct,
        images: updatedImages,
      });
    } else {
      const updatedImages = (newProd.images || []).filter((_, idx) => idx !== indexToRemove);
      setNewProd({
        ...newProd,
        images: updatedImages,
      });
    }
  };

  // Set an image as primary / cover (moves it to index 0)
  const handleSetPrimaryImage = (indexToPrimary: number, isEditing = true) => {
    if (isEditing && editingProduct) {
      const target = editingProduct.images[indexToPrimary];
      const remaining = editingProduct.images.filter((_, idx) => idx !== indexToPrimary);
      setEditingProduct({
        ...editingProduct,
        images: [target, ...remaining],
      });
    } else {
      const target = (newProd.images || [])[indexToPrimary];
      const remaining = (newProd.images || []).filter((_, idx) => idx !== indexToPrimary);
      setNewProd({
        ...newProd,
        images: [target, ...remaining],
      });
    }
  };

  // Save changes to editing product
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    setProducts(updated);
    saveStoredProducts(updated);
    setEditingProduct(null);
    showToast('Product & pricing updated successfully!');

    // Direct Supabase update for instant Realtime broadcast across all browsers
    supabase
      .from('products')
      .update({
        name: editingProduct.name,
        slug: editingProduct.slug,
        sku: editingProduct.sku,
        short_description: editingProduct.shortDescription,
        description: editingProduct.description,
        category_id: editingProduct.categoryId,
        category_name: editingProduct.categoryName,
        base_price: editingProduct.basePrice,
        discount_price: editingProduct.discountPrice || null,
        stock: editingProduct.stock,
        is_customizable: editingProduct.isCustomizable,
        is_featured: editingProduct.isFeatured,
        is_bestseller: editingProduct.isBestseller,
        is_new_arrival: editingProduct.isNewArrival,
        is_active: editingProduct.isActive,
        images: editingProduct.images,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingProduct.id)
      .then(({ error }) => {
        if (error) console.warn('Direct product update error:', error.message);
      });

    // Server API route PATCH
    fetch(`/api/products/${editingProduct.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingProduct),
    }).catch((err) => console.warn('Supabase product sync error:', err));
  };

  // Create new product
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
      images: (newProd.images && newProd.images.length > 0) ? newProd.images : ['/images/products-optimized/1.png'],
      rating: 5.0,
      reviewCount: 1,
    };

    const updated = [created, ...products];
    setProducts(updated);
    saveStoredProducts(updated);
    setIsAddModalOpen(false);
    showToast('New product created successfully!');

    // Direct Supabase insert for instant Realtime broadcast
    supabase
      .from('products')
      .insert({
        id: created.id,
        name: created.name,
        slug: created.slug,
        sku: created.sku,
        short_description: created.shortDescription,
        description: created.description,
        category_id: created.categoryId,
        category_name: created.categoryName,
        base_price: created.basePrice,
        discount_price: created.discountPrice || null,
        stock: created.stock,
        is_customizable: created.isCustomizable,
        is_featured: created.isFeatured,
        is_bestseller: created.isBestseller,
        is_new_arrival: created.isNewArrival,
        is_active: true,
        images: created.images,
      })
      .then(({ error }) => {
        if (error) console.warn('Direct product insert error:', error.message);
      });

    // Sync to Supabase via API
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
    }).catch((err) => console.warn('Supabase product create error:', err));
  };

  // Filter products by search and category
  const filtered = products.filter((p) => {
    const matchCat = categoryFilter === 'ALL' || p.categoryId === categoryFilter;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-[#091126] border border-[#D4AF37] text-white text-xs shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Product Catalogue & Images</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage product photos, set base and discount prices, update descriptions, and stock counts.
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

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-navy-900 border border-navy-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="ALL">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products List (Cards with ALL Images displayed) */}
      <div className="space-y-4">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className="p-5 rounded-2xl bg-[#091126] border border-navy-800 hover:border-navy-700 shadow-xl transition-all space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Product Info */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-serif font-bold text-white">{prod.name}</h3>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-navy-950 text-gray-400 border border-navy-800">
                    {prod.sku}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                    {prod.categoryName}
                  </span>
                  {prod.isCustomizable && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Laser Customization
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">{prod.shortDescription}</p>
              </div>

              {/* Price & Stock Stats */}
              <div className="flex items-center gap-6 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-gray-500 block">Selling Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif font-bold text-[#F3E5AB] text-base">
                      {formatCurrency(prod.discountPrice || prod.basePrice)}
                    </span>
                    {prod.discountPrice && (
                      <span className="line-through text-gray-500 text-xs">
                        {formatCurrency(prod.basePrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-gray-500 block">Stock</span>
                  <span
                    className={`font-semibold ${
                      prod.stock < 15 ? 'text-rose-400 font-bold' : 'text-emerald-400'
                    }`}
                  >
                    {prod.stock} units
                  </span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleToggleActive(prod.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                      prod.isActive
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {prod.isActive ? 'Active' : 'Draft'}
                  </button>
                </div>

                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => setEditingProduct(prod)}
                  className="btn-luxury-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider !text-[#0A0F1D] flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/30 hover:brightness-110 transition-all active:scale-95"
                >
                  <Edit2 className="w-3.5 h-3.5 !text-[#0A0F1D]" />
                  <span>Edit Product & Images</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(prod.id)}
                  className="p-2 text-gray-500 hover:text-rose-400 hover:bg-navy-900 rounded-xl transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ALL EXISTING IMAGES GALLERY FOR THIS PRODUCT */}
            <div className="pt-3 border-t border-navy-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Existing Product Images ({prod.images.length} photos)
                </span>
                <span className="text-[10px] text-gray-500">
                  Swipe/Cycle sequence on website
                </span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2 touch-pan-x scroll-smooth snap-x scrollbar-thin">
                {prod.images.map((imgUrl, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="relative w-20 h-20 rounded-xl overflow-hidden bg-navy-950 border border-navy-700/80 flex-shrink-0 group shadow"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${prod.name} - view ${imgIdx + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-gray-300">
                      #{imgIdx + 1}
                    </div>
                    {imgIdx === 0 && (
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-[#D4AF37] text-[9px] font-bold text-navy-950">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* EDIT PRODUCT & IMAGES MODAL */}
      {/* ============================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091126] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-navy-800 pb-4">
              <div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Edit Product: {editingProduct.name}
                </h3>
                <p className="text-xs text-gray-400">
                  Manage all photos, prices, descriptions, and availability.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-xl text-gray-400 hover:text-white hover:bg-navy-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-6 text-xs">
              {/* SECTION 1: PRODUCT IMAGES MANAGEMENT */}
              <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Product Images Gallery ({editingProduct.images.length})
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Add, delete, or set primary cover photo. These images cycle smoothly on the website.
                    </p>
                  </div>
                </div>

                {/* Visual Grid of All Current Images */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {editingProduct.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative h-28 rounded-xl overflow-hidden bg-navy-900 border border-navy-700 group"
                    >
                      <Image
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        fill
                        className="object-contain p-2"
                        sizes="150px"
                      />

                      {/* Photo Badge */}
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-gray-300">
                        #{idx + 1}
                      </span>

                      {/* Primary Cover Badge or Make Cover Button */}
                      {idx === 0 ? (
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-[#D4AF37] text-navy-950 font-bold text-[9px]">
                          Main Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx, true)}
                          className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-navy-950/80 text-[9px] text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#D4AF37] hover:text-navy-950"
                        >
                          Make Cover
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx, true)}
                        className="absolute top-1.5 right-1.5 p-1.5 rounded-lg bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500 shadow"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Image Controls */}
                <div className="pt-2 border-t border-navy-900 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {/* Upload from Device */}
                  <label className="px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-[#F3E5AB] cursor-pointer flex items-center justify-center gap-2 transition-colors flex-shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>

                  {/* Add by URL / Path */}
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Paste image path or URL (e.g. /images/...)"
                      className="flex-1 px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddImageUrl(true)}
                      className="px-3 py-2 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-navy-950 font-semibold transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PRICING & DISCOUNTS */}
              <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-3">
                <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-[#D4AF37]">
                  Pricing & Stock
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-medium block">Base Price / MRP (₹)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.basePrice}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          basePrice: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-medium block">
                      Selling / Discount Price (₹)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.discountPrice || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          discountPrice: Number(e.target.value) || undefined,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-medium block">Stock Quantity (Units)</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Live Discount calculation */}
                {editingProduct.discountPrice && editingProduct.discountPrice < editingProduct.basePrice && (
                  <div className="text-[11px] text-emerald-400 font-medium">
                    Customer saves ₹{editingProduct.basePrice - editingProduct.discountPrice} (
                    {Math.round(
                      ((editingProduct.basePrice - editingProduct.discountPrice) /
                        editingProduct.basePrice) *
                        100
                    )}
                    % OFF)
                  </div>
                )}
              </div>

              {/* SECTION 3: PRODUCT TITLE & CATEGORY */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-medium block">Product Name / Title</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-medium block">Category</label>
                    <select
                      value={editingProduct.categoryId}
                      onChange={(e) => {
                        const cat = categories.find((c) => c.id === e.target.value);
                        setEditingProduct({
                          ...editingProduct,
                          categoryId: e.target.value,
                          categoryName: cat?.name || editingProduct.categoryName,
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">
                    Short Description (Shown on cards)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.shortDescription}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, shortDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Full Detailed Description */}
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">
                    Full Detailed Description (Specifications, materials, engraving instructions)
                  </label>
                  <textarea
                    rows={4}
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {/* SECTION 4: TOGGLES */}
              <div className="flex flex-wrap gap-5 pt-1">
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
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <span>Enable Laser Engraving Customization</span>
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
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <span>Homepage Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={editingProduct.isActive}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        isActive: e.target.checked,
                      })
                    }
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <span>Active on Store</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950 hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Product & Pricing</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ADD NEW PRODUCT MODAL */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091126] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-navy-800 pb-3">
              <h3 className="text-base font-serif font-bold text-white">Add New Product</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Product Name</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    placeholder="e.g. Signature Golden Ballpoint Pen"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    placeholder="e.g. RYN-PEN-01"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                  />
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
                    value={newProd.discountPrice || ''}
                    onChange={(e) =>
                      setNewProd({ ...newProd, discountPrice: Number(e.target.value) || undefined })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Stock Quantity</label>
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
                  placeholder="One line summary for product grid..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium block">Detailed Description</label>
                <textarea
                  rows={3}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  placeholder="Specifications, materials, engraving instructions..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white"
                />
              </div>

              {/* Upload image */}
              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
                <label className="text-gray-300 font-medium block">Product Photos</label>
                <div className="flex gap-2">
                  <label className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-gray-300 cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={newProd.isCustomizable}
                    onChange={(e) => setNewProd({ ...newProd, isCustomizable: e.target.checked })}
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
    </div>
  );
}
