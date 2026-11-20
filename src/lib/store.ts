'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product, Category, Order, CartItem, WebsiteSettings, OrderStatus, PaymentStatus } from './types';
import { PRODUCTS, CATEGORIES, SAMPLE_ORDERS, INITIAL_SETTINGS } from './mockData';
import { supabase } from './supabase';

const CART_STORAGE_KEY = 'rynochi_cart_items_v1';
const ORDERS_STORAGE_KEY = 'rynochi_orders_v1';
const PRODUCTS_STORAGE_KEY = 'rynochi_products_v3';
const CATEGORIES_STORAGE_KEY = 'rynochi_categories_v3';
const SETTINGS_STORAGE_KEY = 'rynochi_settings_v1';

export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item: any) => item && item.product && typeof item.product === 'object')
      .map((item: any) => ({
        ...item,
        id: item.id || `item_${Date.now()}`,
        productId: item.productId || item.product?.id || '',
        variantId: item.variantId || '',
        quantity: Math.max(1, Number(item.quantity) || 1),
        unitPrice: Number(item.unitPrice) || Number(item.product?.basePrice) || 0,
        customizationCharges: Number(item.customizationCharges) || 0,
        totalPrice: Number(item.totalPrice) || 0,
        product: sanitizeProduct(item.product),
      }));
  } catch (e) {
    console.error('Failed to load cart from storage', e);
    return [];
  }
}

export function saveStoredCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('rynochi-cart-updated'));
  } catch (e) {
    console.error('Failed to save cart to storage', e);
  }
}

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return SAMPLE_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SAMPLE_ORDERS));
      return SAMPLE_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return SAMPLE_ORDERS;
  }
}

export function saveStoredOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('rynochi-orders-updated'));
  } catch (e) {
    console.error('Failed to save orders to storage', e);
  }
}

function sanitizeProduct(p: any): Product {
  let images: string[] = ['/images/products-optimized/1.png'];
  if (Array.isArray(p?.images) && p.images.length > 0) {
    images = p.images.filter((img: any) => typeof img === 'string' && img.trim().length > 0);
  } else if (typeof p?.images === 'string' && p.images.trim().length > 0) {
    try {
      const parsed = JSON.parse(p.images);
      if (Array.isArray(parsed)) {
        images = parsed.filter((img: any) => typeof img === 'string' && img.trim().length > 0);
      } else {
        images = [p.images.trim()];
      }
    } catch {
      images = [p.images.trim()];
    }
  }
  if (images.length === 0) {
    images = ['/images/products-optimized/1.png'];
  }

  return {
    ...p,
    id: p?.id || `prod_${Date.now()}`,
    name: p?.name || 'Personalized Luxury Item',
    slug: p?.slug || 'product',
    sku: p?.sku || 'RYN-ITEM',
    shortDescription: p?.shortDescription || '',
    description: p?.description || '',
    categoryId: p?.categoryId || 'cat-keychain',
    categoryName: p?.categoryName || 'Keychain',
    basePrice: Number(p?.basePrice) || 999,
    discountPrice: p?.discountPrice ? Number(p?.discountPrice) : undefined,
    stock: Number(p?.stock) || 50,
    minOrderQty: Number(p?.minOrderQty) || 1,
    isCustomizable: Boolean(p?.isCustomizable !== false),
    isFeatured: Boolean(p?.isFeatured),
    isBestseller: Boolean(p?.isBestseller),
    isNewArrival: Boolean(p?.isNewArrival),
    isActive: Boolean(p?.isActive !== false),
    images,
  };
}

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return PRODUCTS;
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(PRODUCTS));
      return PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return PRODUCTS;
    return parsed.map(sanitizeProduct);
  } catch (e) {
    return PRODUCTS;
  }
}

export function saveStoredProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('rynochi-products-updated'));
  } catch (e) {
    console.error('Failed to save products to storage', e);
  }
}

export function getStoredCategories(): Category[] {
  if (typeof window === 'undefined') return CATEGORIES;
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(CATEGORIES));
      return CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.some((c: any) => c?.id === 'cat-keychain' || c?.slug === 'keychain')) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(CATEGORIES));
      return CATEGORIES;
    }
    return parsed.map((c: any) => ({
      id: c?.id || `cat-${Date.now()}`,
      name: c?.name || 'Collection',
      slug: c?.slug || 'collection',
      description: c?.description || '',
      imageUrl: c?.imageUrl || '/images/products-optimized/1.png',
      productCount: Number(c?.productCount || 0),
      displayOrder: Number(c?.displayOrder || 0),
      isActive: Boolean(c?.isActive !== false),
    }));
  } catch (e) {
    return CATEGORIES;
  }
}

export function saveStoredCategories(categories: Category[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event('rynochi-categories-updated'));
  } catch (e) {
    console.error('Failed to save categories to storage', e);
  }
}

export function getStoredSettings(): WebsiteSettings {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return INITIAL_SETTINGS;
    return {
      ...INITIAL_SETTINGS,
      ...parsed,
      socialLinks: {
        ...INITIAL_SETTINGS.socialLinks,
        ...((parsed && parsed.socialLinks) || {}),
      },
    };
  } catch (e) {
    return INITIAL_SETTINGS;
  }
}

export function saveStoredSettings(settings: WebsiteSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('rynochi-settings-updated'));
  } catch (e) {
    console.error('Failed to save settings to storage', e);
  }
}

// React Hook for Cart
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setItems(getStoredCart());
    setIsLoaded(true);

    const handleUpdate = () => {
      setItems(getStoredCart());
    };

    window.addEventListener('rynochi-cart-updated', handleUpdate);
    return () => window.removeEventListener('rynochi-cart-updated', handleUpdate);
  }, []);

  const addItem = (item: CartItem) => {
    const current = getStoredCart();
    // Check if exact item with same customization already exists
    const existingIndex = current.findIndex(
      (i) =>
        i.productId === item.productId &&
        i.variantId === item.variantId &&
        JSON.stringify(i.customization) === JSON.stringify(item.customization)
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...current];
      updated[existingIndex].quantity += item.quantity;
      updated[existingIndex].totalPrice =
        (updated[existingIndex].unitPrice + updated[existingIndex].customizationCharges) *
        updated[existingIndex].quantity;
    } else {
      updated = [item, ...current];
    }

    saveStoredCart(updated);
    setItems(updated);
    setIsOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    const current = getStoredCart();
    const updated = current
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...item,
            quantity: newQty,
            totalPrice: (item.unitPrice + item.customizationCharges) * newQty,
          };
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    saveStoredCart(updated);
    setItems(updated);
  };

  const removeItem = (id: string) => {
    const current = getStoredCart();
    const updated = current.filter((i) => i.id !== id);
    saveStoredCart(updated);
    setItems(updated);
  };

  const clearCart = () => {
    saveStoredCart([]);
    setItems([]);
  };

  const subtotal = (items || []).reduce(
    (sum, item) => sum + (Number(item?.unitPrice) || 0) * (Number(item?.quantity) || 1),
    0
  );
  const customizationTotal = (items || []).reduce(
    (sum, item) => sum + (Number(item?.customizationCharges) || 0) * (Number(item?.quantity) || 1),
    0
  );
  const totalItemCount = (items || []).reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);

  const shippingFee = subtotal >= 999 || items.length === 0 ? 0 : 99;
  const taxAmount = Math.round((subtotal + customizationTotal) * 0.18);
  const finalTotal = subtotal + customizationTotal + shippingFee;

  return {
    items,
    isLoaded,
    isOpen,
    setIsOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    customizationTotal,
    shippingFee,
    taxAmount,
    finalTotal,
    totalItemCount,
  };
}

// -------------------------------------------------------------
// Realtime Storefront Hooks Powered by Supabase & Local Store
// -------------------------------------------------------------

export function useLiveProducts(filterCategory?: string) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. Initial local store load
    setProducts(getStoredProducts());

    // 2. Refresh from Supabase API
    const fetchLatest = () => {
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => {
          if (data.products && Array.isArray(data.products) && data.products.length > 0) {
            const sanitized = data.products.map(sanitizeProduct);
            setProducts(sanitized);
            saveStoredProducts(sanitized);
          }
        })
        .catch((err) => console.warn('Live products fetch error:', err));
    };

    fetchLatest();

    // 3. Local tab sync
    const handleUpdate = () => {
      setProducts(getStoredProducts());
    };
    window.addEventListener('rynochi-products-updated', handleUpdate);

    // 4. Supabase Realtime WebSocket subscription for live multi-device updates
    let channel: any = null;
    try {
      const channelId = `storefront-products-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          () => {
            fetchLatest();
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Realtime products subscription skipped:', e);
    }

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

  const filtered = useMemo(() => {
    if (!filterCategory || filterCategory === 'all') return products;
    return products.filter((p) => p.categoryId === filterCategory);
  }, [products, filterCategory]);

  return {
    products: filtered,
    allProducts: products,
    isLoading,
  };
}

export function useLiveProduct(slugOrId: string, initialProduct?: Product) {
  const [product, setProduct] = useState<Product | null>(
    initialProduct || PRODUCTS.find((p) => p.slug === slugOrId || p.id === slugOrId) || null
  );

  useEffect(() => {
    if (!slugOrId) return;

    const findAndSet = () => {
      const list = getStoredProducts();
      const match = list.find((p) => p.slug === slugOrId || p.id === slugOrId);
      if (match) setProduct(match);
    };

    findAndSet();

    // Fetch live from API
    fetch(`/api/products/${encodeURIComponent(slugOrId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          const sanitized = sanitizeProduct(data.product);
          setProduct(sanitized);
          const list = getStoredProducts();
          const updated = list.map((p) =>
            p.id === sanitized.id || p.slug === sanitized.slug ? sanitized : p
          );
          if (!updated.some((p) => p.id === sanitized.id)) {
            updated.push(sanitized);
          }
          saveStoredProducts(updated);
        }
      })
      .catch((err) => console.warn('Live product detail fetch error:', err));

    const handleUpdate = () => findAndSet();
    window.addEventListener('rynochi-products-updated', handleUpdate);

    // Supabase Realtime channel
    let channel: any = null;
    try {
      const channelId = `product-${slugOrId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          () => {
            fetch(`/api/products/${encodeURIComponent(slugOrId)}`)
              .then((res) => res.json())
              .then((data) => {
                if (data.product) setProduct(sanitizeProduct(data.product));
              })
              .catch((err) => console.warn('Realtime product update error:', err));
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Realtime product detail subscription skipped:', e);
    }

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
  }, [slugOrId]);

  return { product };
}

export function useLiveCategories() {
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  useEffect(() => {
    setCategories(getStoredCategories());

    const fetchCategories = () => {
      supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped: Category[] = data.map((c) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              description: c.description || '',
              imageUrl: c.image_url || '/images/products-optimized/1.png',
              productCount: c.product_count || 0,
              displayOrder: Number(c.display_order || 0),
              isActive: Boolean(c.is_active !== false),
            }));
            setCategories(mapped);
            saveStoredCategories(mapped);
          }
        });
    };

    fetchCategories();

    const handleUpdate = () => setCategories(getStoredCategories());
    window.addEventListener('rynochi-categories-updated', handleUpdate);

    let channel: any = null;
    try {
      const channelId = `categories-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'categories' },
          () => {
            fetchCategories();
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Realtime categories subscription skipped:', e);
    }

    return () => {
      window.removeEventListener('rynochi-categories-updated', handleUpdate);
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          console.warn('Realtime channel cleanup skipped:', e);
        }
      }
    };
  }, []);

  return { categories };
}

export function useLiveSettings() {
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);

  useEffect(() => {
    setSettings(getStoredSettings());

    const fetchSettings = () => {
      supabase
        .from('store_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data) {
            const mapped: WebsiteSettings = {
              businessName: data.business_name || 'RYNOCHI',
              logoUrl: data.logo_url || '/images/brand/rynochi-gold-logo.png',
              announcementText: data.announcement_text || '',
              announcementActive: data.announcement_active !== false,
              whatsappNumber: data.whatsapp_number || '917277338436',
              supportEmail: data.support_email || 'rynochioffice@gmail.com',
              supportPhone: data.support_phone || '+91 72773 38436',
              officeAddress: data.office_address || '',
              shippingFee: Number(data.shipping_fee || 99),
              freeShippingThreshold: Number(data.free_shipping_threshold || 999),
              taxRatePercent: Number(data.tax_rate_percent || 18),
              razorpayEnabled: data.razorpay_enabled !== false,
              codEnabled: data.cod_enabled !== false,
              socialLinks: data.social_links || INITIAL_SETTINGS.socialLinks,
            };
            setSettings(mapped);
            saveStoredSettings(mapped);
          }
        });
    };

    fetchSettings();

    const handleUpdate = () => setSettings(getStoredSettings());
    window.addEventListener('rynochi-settings-updated', handleUpdate);

    let channel: any = null;
    try {
      const channelId = `settings-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'store_settings' },
          () => {
            fetchSettings();
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Realtime settings subscription skipped:', e);
    }

    return () => {
      window.removeEventListener('rynochi-settings-updated', handleUpdate);
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          console.warn('Realtime channel cleanup skipped:', e);
        }
      }
    };
  }, []);

  return { settings };
}

