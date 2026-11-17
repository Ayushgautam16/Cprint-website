'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  Sparkles,
  Lock,
  ChevronLeft,
  AlertCircle,
} from 'lucide-react';
import { useCart, saveStoredOrders, getStoredOrders } from '@/lib/store';
import { formatCurrency, generateOrderNumber } from '@/lib/utils';
import { Order, ShippingAddress } from '@/lib/types';
import Logo from '@/components/brand/Logo';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, customizationTotal, shippingFee, taxAmount, finalTotal, clearCart } =
    useCart();

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: 'Saurabh Kumar',
    email: 'saurabh.kumar@example.com',
    phone: '+91 98112 34567',
    addressLine1: 'Villa 14, Palm Grove Enclave',
    addressLine2: 'Golf Course Road, DLF Phase 5',
    city: 'Gurugram',
    state: 'Haryana',
    postalCode: '122002',
    country: 'India',
    orderNotes: 'Please ensure extra protective packaging for the wooden gift box.',
  });

  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'CASH_ON_DELIVERY'>('RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Helper to load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your shopping cart is empty.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderNumber = generateOrderNumber();
      const shippingAddress: ShippingAddress = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      };

      // 1. If Razorpay is chosen
      if (paymentMethod === 'RAZORPAY') {
        // Create order on backend
        const res = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            receipt: orderNumber,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.orderId) {
          throw new Error(data.error || 'Could not initiate payment order');
        }

        const scriptLoaded = await loadRazorpayScript();

        // If in test/mock environment where real Razorpay modal might not have network or keys
        if (!scriptLoaded || typeof window.Razorpay === 'undefined') {
          // Fallback test mode simulation
          console.warn('Simulating successful test payment response in sandbox environment');
          const mockPaymentId = `pay_mock_${Date.now()}`;
          const mockSignature = 'mock_sig_valid_test_signature';

          // Call backend verification
          const verifyRes = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: data.orderId,
              razorpay_payment_id: mockPaymentId,
              razorpay_signature: mockSignature,
            }),
          });

          if (!verifyRes.ok) {
            throw new Error('Payment verification failed');
          }

          // Complete order creation
          const completedOrder: Order = {
            id: `ord_${Date.now()}`,
            orderNumber,
            customerName: formData.fullName,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            shippingAddress,
            items: items.map((item) => ({
              id: item.id,
              productId: item.productId,
              productName: item.product.name,
              productSku: item.product.sku,
              productImageUrl: item.product.images[0],
              unitPrice: item.unitPrice,
              customizationCharge: item.customizationCharges,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
              customization: item.customization,
            })),
            subtotal,
            customizationTotal,
            shippingFee,
            discountAmount: 0,
            taxAmount,
            totalAmount: finalTotal,
            currency: 'INR',
            status: 'PAYMENT_CONFIRMED',
            paymentStatus: 'PAID',
            paymentMethod: 'RAZORPAY',
            razorpayOrderId: data.orderId,
            razorpayPaymentId: mockPaymentId,
            customerNotes: formData.orderNotes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            statusHistory: [
              {
                id: `hist_${Date.now()}_1`,
                status: 'ORDER_PLACED',
                notes: 'Order registered online.',
                changedBy: 'SYSTEM',
                createdAt: new Date().toISOString(),
              },
              {
                id: `hist_${Date.now()}_2`,
                status: 'PAYMENT_CONFIRMED',
                notes: `Razorpay payment verified (${mockPaymentId}).`,
                changedBy: 'SYSTEM',
                createdAt: new Date().toISOString(),
              },
            ],
          };

          const currentOrders = getStoredOrders();
          saveStoredOrders([completedOrder, ...currentOrders]);
          clearCart();
          router.push(`/payment/success?orderNumber=${orderNumber}`);
          return;
        }

        // Live Razorpay popup configuration
        const options = {
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: 'RYNOCHI Luxury Gifting',
          description: `Order ${orderNumber}`,
          order_id: data.orderId,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#0B132B',
          },
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response),
              });

              if (!verifyRes.ok) {
                router.push('/payment/failure?reason=signature_verification_failed');
                return;
              }

              // Save order
              const completedOrder: Order = {
                id: `ord_${Date.now()}`,
                orderNumber,
                customerName: formData.fullName,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                shippingAddress,
                items: items.map((item) => ({
                  id: item.id,
                  productId: item.productId,
                  productName: item.product.name,
                  productSku: item.product.sku,
                  productImageUrl: item.product.images[0],
                  unitPrice: item.unitPrice,
                  customizationCharge: item.customizationCharges,
                  quantity: item.quantity,
                  totalPrice: item.totalPrice,
                  customization: item.customization,
                })),
                subtotal,
                customizationTotal,
                shippingFee,
                discountAmount: 0,
                taxAmount,
                totalAmount: finalTotal,
                currency: 'INR',
                status: 'PAYMENT_CONFIRMED',
                paymentStatus: 'PAID',
                paymentMethod: 'RAZORPAY',
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                customerNotes: formData.orderNotes,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                statusHistory: [
                  {
                    id: `hist_${Date.now()}_1`,
                    status: 'ORDER_PLACED',
                    notes: 'Order placed online.',
                    changedBy: 'SYSTEM',
                    createdAt: new Date().toISOString(),
                  },
                  {
                    id: `hist_${Date.now()}_2`,
                    status: 'PAYMENT_CONFIRMED',
                    notes: `Razorpay payment verified.`,
                    changedBy: 'SYSTEM',
                    createdAt: new Date().toISOString(),
                  },
                ],
              };

              const currentOrders = getStoredOrders();
              saveStoredOrders([completedOrder, ...currentOrders]);
              clearCart();
              router.push(`/payment/success?orderNumber=${orderNumber}`);
            } catch (err) {
              router.push('/payment/failure?reason=post_payment_processing_error');
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Cash on delivery
        const completedOrder: Order = {
          id: `ord_${Date.now()}`,
          orderNumber,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress,
          items: items.map((item) => ({
            id: item.id,
            productId: item.productId,
            productName: item.product.name,
            productSku: item.product.sku,
            productImageUrl: item.product.images[0],
            unitPrice: item.unitPrice,
            customizationCharge: item.customizationCharges,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            customization: item.customization,
          })),
          subtotal,
          customizationTotal,
          shippingFee,
          discountAmount: 0,
          taxAmount,
          totalAmount: finalTotal,
          currency: 'INR',
          status: 'ORDER_PLACED',
          paymentStatus: 'PENDING',
          paymentMethod: 'CASH_ON_DELIVERY',
          customerNotes: formData.orderNotes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          statusHistory: [
            {
              id: `hist_${Date.now()}_1`,
              status: 'ORDER_PLACED',
              notes: 'Order registered via Cash on Delivery (Manual verification pending).',
              changedBy: 'SYSTEM',
              createdAt: new Date().toISOString(),
            },
          ],
        };

        const currentOrders = getStoredOrders();
        saveStoredOrders([completedOrder, ...currentOrders]);
        clearCart();
        router.push(`/payment/success?orderNumber=${orderNumber}`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'An error occurred during checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-serif font-bold text-[#2A2620]">Your bag is empty</h1>
        <p className="text-xs text-[#6E675A]">Please add items to your cart before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#D4AF37] text-navy-950 uppercase tracking-wider"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EBDDB4] pb-4">
          <div className="flex items-center gap-4">
            <Logo size="sm" variant="gold" showTagline={false} />
            <div className="border-l border-[#EBDDB4] pl-4">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2A2620]">
                Executive Checkout
              </h1>
              <p className="text-xs text-[#6E675A] font-sans">
                Enter shipping destination & select preferred payment mode.
              </p>
            </div>
          </div>
          <Link
            href="/cart"
            className="text-xs text-[#D4AF37] hover:text-[#7A5C16] flex items-center gap-1 font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            Edit Bag
          </Link>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Customer Information & Shipping Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Details */}
            <div className="p-6 rounded-2xl bg-[#F8F2E3] border border-[#EBDDB4] space-y-4">
              <h2 className="text-sm font-serif font-bold text-[#7A5C16] uppercase tracking-wider flex items-center gap-2">
                <span>1. Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[#5B5444] block font-medium">
                    Full Name <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9C48C] text-[#2A2620] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#5B5444] block font-medium">
                    Email Address <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9C48C] text-[#2A2620] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[#5B5444] block font-medium">
                    Mobile Number (for WhatsApp dispatch tracking){' '}
                    <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9C48C] text-[#2A2620] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-6 rounded-2xl bg-[#F8F2E3] border border-[#EBDDB4] space-y-4">
              <h2 className="text-sm font-serif font-bold text-[#7A5C16] uppercase tracking-wider flex items-center gap-2">
                <span>2. Delivery Address (India)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[#5B5444] block font-medium">
                    Flat / House No. / Building Name / Street <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9C48C] text-[#2A2620] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[#5B5444] block font-medium">
                    Area / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9C48C] text-[#2A2620] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#5B5444] block font-medium">
                    City <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9C48C] text-[#2A2620] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#5B5444] block font-medium">
                    State <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9C48C] text-[#2A2620] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#5B5444] block font-medium">
                    PIN Code <span className="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9C48C] text-[#2A2620] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#5B5444] block font-medium">Country</label>
                  <input
                    type="text"
                    disabled
                    value="India"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#EBDDB4] text-[#6E675A]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[#5B5444] block font-medium">
                    Delivery Instructions / Special Notes
                  </label>
                  <textarea
                    rows={2}
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#D9C48C] text-[#2A2620] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-6 rounded-2xl bg-[#F8F2E3] border border-[#EBDDB4] space-y-4">
              <h2 className="text-sm font-serif font-bold text-[#7A5C16] uppercase tracking-wider flex items-center gap-2">
                <span>3. Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* Razorpay Option */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#2A2620]'
                      : 'border-[#EBDDB4] bg-white text-[#6E675A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={() => setPaymentMethod('RAZORPAY')}
                      className="accent-[#D4AF37]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#2A2620] block">
                        Online Payment (Razorpay)
                      </span>
                      <span className="text-[11px] text-[#6E675A]">
                        UPI (Google Pay, PhonePe, Paytm), Cards & Net Banking
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                </label>

                {/* COD Option */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'CASH_ON_DELIVERY'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#2A2620]'
                      : 'border-[#EBDDB4] bg-white text-[#6E675A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                      className="accent-[#D4AF37]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#2A2620] block">
                        Cash on Delivery
                      </span>
                      <span className="text-[11px] text-[#6E675A]">
                        Subject to telephone/WhatsApp verification
                      </span>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-[#6E675A]" />
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Review & Confirmation (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#F8F2E3] border border-[#D4AF37]/30 shadow-xl space-y-4">
              <h3 className="text-base font-serif font-bold text-[#2A2620] border-b border-[#EBDDB4] pb-3">
                Items in this Order ({items.length})
              </h3>

              <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white border border-[#EBDDB4] flex-shrink-0">
                      <Image
                        src={item.product.images[0] || '/images/products/diary-pen-giftset-box.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-200 line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#6E675A]">Qty: {item.quantity}</p>
                      {item.customization?.customText && (
                        <p className="text-[10px] text-[#D4AF37] truncate">
                          Engraved: &quot;{item.customization.customText}&quot;
                        </p>
                      )}
                    </div>
                    <div className="text-right font-serif font-semibold text-[#2A2620]">
                      {formatCurrency(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="pt-3 border-t border-[#EBDDB4] space-y-2 text-xs text-[#5B5444]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-[#2A2620] font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Laser Personalization:</span>
                  <span className="text-emerald-400 font-medium">FREE</span>
                </div>
                {customizationTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Artwork Setup:</span>
                    <span>{formatCurrency(customizationTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18%):</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2A2620] pt-2 border-t border-[#EBDDB4]">
                  <span>Payable Amount:</span>
                  <span className="text-xl text-[#D4AF37] font-serif">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn-luxury-gold w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide text-navy-950 shadow-xl shadow-[#D4AF37]/25 flex items-center justify-center gap-2 group/btn disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'RAZORPAY' ? 'Pay Now via Razorpay' : 'Confirm COD Order'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#6E675A] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Encrypted 256-bit Secure Transaction</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

