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
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { getStoredProducts, saveStoredProducts, getStoredCategories } from '@/lib/store';
import { Product, Category } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { uploadProductImage } from '@/lib/imageUpload';

const getSafeImages = (imgs: any): string[] => {
  if (Array.isArray(imgs)) {
    const filtered = imgs.filter((img): img is string => typeof img === 'string' && img.trim().length > 0);
    return filtered.length > 0 ? filtered : ['/images/products-optimized/1.png'];
  }
  if (typeof imgs === 'string' && imgs.trim().length > 0) {
    try {
      const parsed = JSON.parse(imgs);
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter((img): img is string => typeof img === 'string' && img.trim().length > 0);
        return filtered.length > 0 ? filtered : ['/images/products-optimized/1.png'];
      }
    } catch {}
    return [imgs.trim()];
  }
  return ['/images/products-optimized/1.png'];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New product form state
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    sku: '',
    shortDescription: '',
    description: '',
    basePrice: 999,
    discountPrice: 799,
    stock: 50,
    categoryId: 'cat-keychain',
    categoryName: 'Keychain',
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
    let channel: any = null;
    try {
      const channelId = `admin-products-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          () => {
            refreshProducts();
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Admin products realtime subscription skipped:', e);
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

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleActive = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const newActive = !target.isActive;
    const updated = products.map((p) => (p.id === id ? { ...p, isActive: newActive } : p));
    setProducts(updated);
    saveStoredProducts(updated);
    window.dispatchEvent(new Event('rynochi-products-updated'));
    showToast(`Product visibility marked as ${newActive ? 'Active' : 'Draft'}.`);

    try {
      // 1. Direct Supabase update for Realtime broadcast
      await supabase
        .from('products')
        .update({ is_active: newActive, updated_at: new Date().toISOString() })
        .eq('id', id);

      // 2. Server API route PATCH
      await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newActive }),
      });
    } catch (err) {
      console.warn('Product active sync error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;

    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveStoredProducts(updated);
    window.dispatchEvent(new Event('rynochi-products-updated'));
    showToast('Product removed.');

    try {
      // 1. Direct Supabase delete for Realtime broadcast
      await supabase.from('products').delete().eq('id', id);

      // 2. Server API route DELETE
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Product delete sync error:', err);
    }
  };

  // Add a new image from device file upload via Supabase CDN
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    showToast('Compressing & uploading photo to Cloud CDN...');

    try {
      const result = await uploadProductImage(file);
      if (!result.success || !result.url) {
        alert(result.error || 'Failed to upload photo. Please check your internet connection.');
        return;
      }

      const cdnUrl = result.url;

      if (isEditing && editingProduct) {
        const updatedImages = [...editingProduct.images, cdnUrl];
        setEditingProduct({
          ...editingProduct,
          images: updatedImages,
        });
        showToast('Photo uploaded to Cloud CDN! Click Save Product to persist.');
      } else {
        setNewProd((prev) => ({
          ...prev,
          images: [...(prev.images || []), cdnUrl],
        }));
        showToast('Photo uploaded and added to gallery.');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      alert('Upload error: ' + (err?.message || 'Failed'));
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
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
      setNewProd((prev) => ({
        ...prev,
        images: [...(prev.images || []), url],
      }));
    }
    setNewImageUrl('');
    showToast('Image URL added.');
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
      setNewProd((prev) => ({
        ...prev,
        images: updatedImages,
      }));
    }
    showToast('Image removed from draft.');
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
      setNewProd((prev) => ({
        ...prev,
        images: [target, ...remaining],
      }));
    }
    showToast('Main cover photo selected.');
  };

  // Save changes to editing product
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSaving(true);
    showToast('Saving & syncing product to database...');

    const updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    setProducts(updated);
    saveStoredProducts(updated);

    try {
      // 1. Direct Supabase update for instant Realtime broadcast across all browsers
      await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          slug: editingProduct.slug,
          sku: editingProduct.sku,
          short_description: editingProduct.shortDescription,
          description: editingProduct.description,
          category_id: editingProduct.categoryId,
          category_name: editingProduct.categoryName,
          base_price: Number(editingProduct.basePrice),
          discount_price: editingProduct.discountPrice ? Number(editingProduct.discountPrice) : null,
          stock: Number(editingProduct.stock),
          is_customizable: Boolean(editingProduct.isCustomizable),
          is_featured: Boolean(editingProduct.isFeatured),
          is_bestseller: Boolean(editingProduct.isBestseller),
          is_new_arrival: Boolean(editingProduct.isNewArrival),
          is_active: Boolean(editingProduct.isActive),
          images: editingProduct.images,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingProduct.id);

      // 2. Server API route PATCH (runs with service role key, bypassing RLS)
      await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      // 3. Dispatch local event for instant local tab sync
      window.dispatchEvent(new Event('rynochi-products-updated'));
      showToast('Product & photos updated and synced live across website!');
      setEditingProduct(null);
    } catch (err: any) {
      console.error('Save product error:', err);
      showToast('Saved locally.');
      setEditingProduct(null);
    } finally {
      setIsSaving(false);
    }
  };

  // Create new product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.sku) return;

    setIsSaving(true);
    showToast('Creating product & broadcasting to live storefront...');

    const matchedCat = categories.find((c) => c.id === newProd.categoryId);

    const created: Product = {
      id: `prod_${Date.now()}`,
      name: newProd.name,
      slug: newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      sku: newProd.sku,
      shortDescription: newProd.shortDescription || 'Bespoke executive gift item.',
      description: newProd.description || 'Precision crafted with high-grade materials.',
      categoryId: newProd.categoryId || 'cat-keychain',
      categoryName: matchedCat?.name || 'Keychain',
      basePrice: Number(newProd.basePrice) || 999,
      discountPrice: newProd.discountPrice ? Number(newProd.discountPrice) : undefined,
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

    try {
      // 1. Direct Supabase insert
      await supabase.from('products').insert({
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // 2. Server API route POST
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created),
      });

      // 3. Dispatch local event
      window.dispatchEvent(new Event('rynochi-products-updated'));
      showToast('New product created & live on website!');
      setIsAddModalOpen(false);
      setNewProd({
        name: '',
        sku: '',
        shortDescription: '',
        description: '',
        basePrice: 999,
        discountPrice: 799,
        stock: 50,
        categoryId: 'cat-keychain',
        categoryName: 'Keychain',
        isCustomizable: true,
        isFeatured: true,
        isBestseller: false,
        isNewArrival: true,
        isActive: true,
        images: ['/images/products-optimized/1.png'],
      });
    } catch (err: any) {
      console.error('Create product error:', err);
      showToast('Product created locally.');
      setIsAddModalOpen(false);
    } finally {
      setIsSaving(false);
    }
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
            {(() => {
              const safeProdImages = getSafeImages(prod.images);
              return (
                <div className="pt-3 border-t border-navy-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Existing Product Images ({safeProdImages.length} photos)
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Swipe/Cycle sequence on website
                    </span>
                  </div>

                  <div className="flex items-center gap-3 overflow-x-auto pb-2 touch-pan-x scroll-smooth snap-x scrollbar-thin">
                    {safeProdImages.map((imgUrl, imgIdx) => (
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
              );
            })()}
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
                      Product Images Gallery ({getSafeImages(editingProduct.images).length})
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      Add, delete, or set primary cover photo. These images cycle smoothly on the website.
                    </p>
                  </div>
                  {isUploadingImage && (
                    <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span>Uploading to CDN...</span>
                    </div>
                  )}
                </div>

                {/* Visual Grid of All Current Images */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {getSafeImages(editingProduct.images).map((imgUrl, idx) => (
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
                  <label className={`px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-[#F3E5AB] cursor-pointer flex items-center justify-center gap-2 transition-colors flex-shrink-0 ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                    {isUploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{isUploadingImage ? 'Uploading...' : 'Upload from Device'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingImage}
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
                      placeholder="Paste image path or URL (e.g. https://...)"
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
                    <label className="text-gray-300 font-medium block">Base Price (₹)</label>
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
                      Discounted Price (₹)
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
                      placeholder="Optional"
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-medium block">Stock Units</label>
                    <input
                      type="number"
                      required
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
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingImage}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950 hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-navy-950" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Product & Photos</span>
                    </>
                  )}
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
          <div className="bg-[#091126] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-navy-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-white">Create New Product</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    placeholder="e.g. Sovereign Matte Black Ballpoint"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    placeholder="e.g. RYN-PEN-BLK-01"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium block">Category</label>
                <select
                  value={newProd.categoryId}
                  onChange={(e) => {
                    const cat = categories.find((c) => c.id === e.target.value);
                    setNewProd({
                      ...newProd,
                      categoryId: e.target.value,
                      categoryName: cat?.name || newProd.categoryName,
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProd.basePrice}
                    onChange={(e) => setNewProd({ ...newProd, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
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
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 font-medium block">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
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
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-medium block">Detailed Description</label>
                <textarea
                  rows={3}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  placeholder="Specifications, materials, engraving instructions..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Upload image & preview for New Product */}
              <div className="p-3.5 rounded-2xl bg-navy-950 border border-navy-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 font-medium block">Product Photos</label>
                  {isUploadingImage && (
                    <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                      <span>Uploading to CDN...</span>
                    </div>
                  )}
                </div>

                {/* Previews of uploaded images */}
                {Array.isArray(newProd.images) && newProd.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                    {newProd.images.filter(Boolean).map((img, idx) => (
                      <div
                        key={idx}
                        className="relative h-20 rounded-xl overflow-hidden bg-navy-900 border border-navy-700 group"
                      >
                        <Image
                          src={img}
                          alt={`New Product Photo ${idx + 1}`}
                          fill
                          className="object-contain p-1"
                          sizes="100px"
                        />
                        <span className="absolute top-1 left-1 px-1 rounded bg-black/70 text-[9px] text-gray-300">
                          #{idx + 1}
                        </span>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 rounded bg-[#D4AF37] text-navy-950 text-[9px] font-bold">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx, false)}
                          className="absolute top-1 right-1 p-1 rounded bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-navy-900">
                  <label className={`px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-[#F3E5AB] cursor-pointer flex items-center justify-center gap-2 transition-colors flex-shrink-0 ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                    {isUploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                    )}
                    <span>{isUploadingImage ? 'Uploading...' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingImage}
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Paste image URL (e.g. https://...)"
                      className="flex-1 px-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddImageUrl(false)}
                      className="px-3 py-2 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-navy-950 font-semibold transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={newProd.isCustomizable}
                    onChange={(e) => setNewProd({ ...newProd, isCustomizable: e.target.checked })}
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <span>Enable Laser Customization</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-300">
                  <input
                    type="checkbox"
                    checked={newProd.isFeatured}
                    onChange={(e) => setNewProd({ ...newProd, isFeatured: e.target.checked })}
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingImage}
                  className="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DFBA6F] via-[#D4AF37] to-[#AA8417] text-navy-950 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-navy-950" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Product</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
