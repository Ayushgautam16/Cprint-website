'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ShoppingBag,
  Zap,
  ArrowRight,
  Upload,
  RotateCw,
  Eye,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';
import { PRODUCTS } from '@/lib/mockData';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/lib/store';
import EngravingPreviewCanvas from '@/components/product/EngravingPreviewCanvas';

export default function CustomizerStudioPage() {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [engravedName, setEngravedName] = useState('Saurabh Kumar');
  const [secondaryText, setSecondaryText] = useState('RYNOCHI');
  const [selectedFont, setSelectedFont] = useState('Great Vibes');
  const [laserTone, setLaserTone] = useState<'gold' | 'silver' | 'charcoal'>('gold');
  const [placement, setPlacement] = useState('Center Brass Nameplate');
  const [quantity, setQuantity] = useState(1);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // File upload to /api/upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();
      if (result.success && result.url) {
        setUploadedLogoUrl(result.url);
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProductSwitch = (prod: Product) => {
    setSelectedProduct(prod);
    if (prod.sku.includes('DIA') || prod.sku.includes('SET')) {
      setPlacement('Center Brass Nameplate');
    } else {
      setPlacement('Pen Barrel Center');
    }
  };

  const unitPrice = selectedProduct.discountPrice || selectedProduct.basePrice;
  const logoSetupFee = uploadedLogoUrl ? 150 : 0;
  const totalPrice = (unitPrice + logoSetupFee) * quantity;

  const handleAddToCart = (buyNow: boolean = false) => {
    addItem({
      id: `${selectedProduct.id}-${Date.now()}`,
      productId: selectedProduct.id,
      product: selectedProduct,
      quantity,
      unitPrice,
      customizationCharges: logoSetupFee,
      customization: {
        customerName: engravedName,
        customText: engravedName,
        fontName: selectedFont,
        fontColor: laserTone === 'gold' ? 'Metallic Brass Gold' : 'Laser Chrome',
        placement,
        artworkUrl: uploadedLogoUrl || undefined,
        artworkFileName: uploadedLogoUrl ? 'uploaded-insignia.png' : undefined,
      },
      totalPrice,
    });

    if (buyNow) {
      router.push('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-[#070C1E] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-navy-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111C3A] border border-[#D4AF37]/30 text-xs font-semibold uppercase tracking-widest text-[#F3E5AB] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Real-Time Laser Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Bespoke Engraving Studio
            </h1>
          </div>

          <Link
            href="/shop"
            className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>
        </div>

        {/* 1. Pick A Canvas Product Carousel */}
        <div className="space-y-3">
          <label className="text-xs font-serif font-bold uppercase tracking-wider text-gray-300 block">
            Step 1: Choose Your Item to Personalize
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PRODUCTS.slice(0, 4).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProductSwitch(p)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  selectedProduct.id === p.id
                    ? 'border-[#D4AF37] bg-[#101B3B] ring-1 ring-[#D4AF37] shadow-xl'
                    : 'border-navy-800 bg-[#091126] text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-navy-900 flex-shrink-0">
                  <Image src={p.images[0]} alt={p.name} fill className="object-contain p-1" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                  <span className="text-[11px] font-serif text-[#D4AF37]">
                    {formatCurrency(p.discountPrice || p.basePrice)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Customization Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Canvas Preview (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <EngravingPreviewCanvas
              productImage={selectedProduct.images[0]}
              productName={selectedProduct.name}
              engravedText={engravedName}
              secondaryText={secondaryText}
              selectedFont={selectedFont}
              placement={placement}
              uploadedLogoUrl={uploadedLogoUrl}
              sku={selectedProduct.sku}
            />

            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 text-xs text-gray-400 flex items-center justify-between">
              <span>Laser Mark Tolerance: 0.02mm</span>
              <span className="text-emerald-400 font-semibold">✓ Permanent Metallic Contrast</span>
            </div>
          </div>

          {/* Right Inputs (6 Cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#091126] border border-[#D4AF37]/30 shadow-xl space-y-6">
            <h2 className="text-lg font-serif font-bold text-white border-b border-navy-800 pb-3">
              Step 2: Enter Engraving Details
            </h2>

            {/* Inscription Name */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-gray-300">
                <label className="font-semibold text-white">
                  Recipient Name / Inscription <span className="text-[#D4AF37]">*</span>
                </label>
                <span className="text-gray-500">{engravedName.length} / 25 characters</span>
              </div>
              <input
                type="text"
                maxLength={25}
                value={engravedName}
                onChange={(e) => setEngravedName(e.target.value)}
                placeholder="e.g. Saurabh Kumar"
                className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-[#D4AF37]/40 text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>

            {/* Typography Selection */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-gray-300 block">Typography Font Style:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Great Vibes', name: 'Calligraphy', style: "'Great Vibes', cursive" },
                  { id: 'Cinzel', name: 'Serif Roman', style: "'Cinzel', serif" },
                  { id: 'Playfair Display', name: 'Editorial', style: "'Playfair Display', serif" },
                  { id: 'Montserrat', name: 'Modern Sans', style: "'Montserrat', sans-serif" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFont(f.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedFont === f.id
                        ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#F3E5AB] ring-1 ring-[#D4AF37]'
                        : 'border-navy-800 bg-navy-950 text-gray-400'
                    }`}
                  >
                    <span className="text-xs text-white block truncate" style={{ fontFamily: f.style }}>
                      {f.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Upload */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-gray-300 block">
                Upload Insignia / Corporate Logo (Optional):
              </label>
              <label className="flex items-center justify-center p-3 border border-dashed border-navy-700 hover:border-[#D4AF37] rounded-xl cursor-pointer bg-navy-950/60 transition-colors">
                <span className="text-gray-400 text-xs">
                  {isUploading
                    ? 'Uploading vector...'
                    : uploadedLogoUrl
                    ? '✓ Logo Uploaded & Integrated on Canvas'
                    : 'Upload PNG, SVG, or PDF Logo (+₹150)'}
                </span>
                <input
                  type="file"
                  accept=".png,.svg,.jpg,.jpeg,.pdf"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quantity & Summary */}
            <div className="pt-4 border-t border-navy-800 flex items-center justify-between text-xs">
              <div className="flex items-center border border-navy-700 bg-navy-950 rounded-xl">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-gray-400 hover:text-white"
                >
                  -
                </button>
                <span className="px-3 py-1.5 font-bold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-gray-400 hover:text-white"
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <span className="text-gray-400 block text-[11px]">Total with Customization:</span>
                <span className="text-xl font-serif font-bold text-[#D4AF37]">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleAddToCart(false)}
                className="btn-luxury-gold w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs text-navy-950 shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center gap-2 group/btn"
              >
                <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
                <span>Add Custom Creation</span>
              </button>

              <button
                type="button"
                onClick={() => handleAddToCart(true)}
                className="btn-luxury-ghost w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 group/btn"
              >
                <Zap className="w-4 h-4 text-[#D4AF37] group-hover/btn:scale-110 transition-transform duration-300" />
                <span>Instant Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
