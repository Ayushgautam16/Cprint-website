'use client';

import { useState, useEffect } from 'react';
import { Product, Category, Order, CartItem, WebsiteSettings, OrderStatus, PaymentStatus } from './types';
import { PRODUCTS, CATEGORIES, SAMPLE_ORDERS, INITIAL_SETTINGS } from './mockData';

const CART_STORAGE_KEY = 'rynochi_cart_items_v1';
const ORDERS_STORAGE_KEY = 'rynochi_orders_v1';
const PRODUCTS_STORAGE_KEY = 'rynochi_products_v1';
const CATEGORIES_STORAGE_KEY = 'rynochi_categories_v1';
const SETTINGS_STORAGE_KEY = 'rynochi_settings_v1';

export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
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

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return PRODUCTS;
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(PRODUCTS));
      return PRODUCTS;
    }
    return JSON.parse(raw);
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
    return JSON.parse(raw);
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
    return JSON.parse(raw);
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

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const customizationTotal = items.reduce(
    (sum, item) => sum + (item.customizationCharges || 0) * item.quantity,
    0
  );
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

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

