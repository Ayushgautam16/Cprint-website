'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Truck,
  MessageCircle,
  HelpCircle,
  AlertCircle,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import { Product, ProductVariant, CustomizationDetails } from '@/lib/types';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/lib/store';
import EngravingPreviewCanvas from './EngravingPreviewCanvas';

interface CustomizationEngineProps {
  product: Product;
}

export const CustomizationEngine: React.FC<CustomizationEngineProps> = ({ product }) => {
  const router = useRouter();
  const { addItem } = useCart();

  const safeSku = product?.sku || '';

  // Selected variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0]
  );

  // Customization Form State
  const [primaryText, setPrimaryText] = useState('Saurabh Kumar');
  const [secondaryText, setSecondaryText] = useState('');
  const [selectedFont, setSelectedFont] = useState('Great Vibes');
  const [selectedPlacement, setSelectedPlacement] = useState(
    safeSku.includes('DIA') || safeSku.includes('SET')
      ? 'Center Brass Nameplate'
      : 'Pen Barrel Center'
  );
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [uploadedLogo, setUploadedLogo] = useState<{
    file: File | null;
    previewUrl: string | null;
    name: string;
  }>({ file: null, previewUrl: null, name: '' });
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Quantity
  const [quantity, setQuantity] = useState(product.minOrderQty || 1);
  const [activeTab, setActiveTab] = useState<'preview' | 'specs'>('preview');

  // Handle Logo Upload with validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Allowed MIME types: PNG, JPEG, SVG, PDF
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload an image file (PNG, JPG, SVG) or PDF artwork.');
      return;
    }

    // Size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Artwork file size must be under 10MB.');
      return;
    }

    const objectUrl = file.type === 'application/pdf' ? null : URL.createObjectURL(file);
    setUploadedLogo({
      file,
      previewUrl: objectUrl,
      name: file.name,
    });
  };

  // Pricing calculations
  const variantPriceAdjustment = selectedVariant?.priceAdjustment || 0;
  const currentBasePrice = (product.discountPrice || product.basePrice) + variantPriceAdjustment;
  const logoExtraCharge = uploadedLogo.file ? 150 : 0;
  const unitCustomizationCharge = product.additionalCustomizationFee + logoExtraCharge;
  const finalUnitPrice = currentBasePrice + unitCustomizationCharge;
  const totalPrice = finalUnitPrice * quantity;

  const discountPercent = calculateDiscountPercentage(
    product.basePrice + variantPriceAdjustment,
    currentBasePrice
  );

  // Cart addition
  const handleAddToCart = (buyNow: boolean = false) => {
    const customizationData: CustomizationDetails = {
      customerName: primaryText.trim() || undefined,
      customText: primaryText.trim() || undefined,
      fontName: selectedFont,
      fontColor: 'Metallic Brass Gold',
      placement: selectedPlacement,
      artworkUrl: uploadedLogo.previewUrl || undefined,
      artworkFileName: uploadedLogo.name || undefined,
      specialInstructions: specialInstructions.trim() || undefined,
      extraCharges: logoExtraCharge,
    };

    addItem({
      id: `${product.id}-${selectedVariant?.id || 'default'}-${Date.now()}`,
      productId: product.id,
      product,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      quantity,
      unitPrice: currentBasePrice,
      customizationCharges: unitCustomizationCharge,
      customization: customizationData,
      totalPrice,
    });

    if (buyNow) {
      router.push('/checkout');
    }
  };

  // WhatsApp Enquiry Link Generator
  const generateWhatsAppLink = () => {
    const businessPhone = '917277338436';
    const text = encodeURIComponent(
      `Hello RYNOCHI Team! I'm interested in personalizing:\n\n*Product:* ${product.name} (SKU: ${product.sku})\n*Engraved Name:* ${primaryText || 'Not specified'}\n*Quantity:* ${quantity}\n*Variant:* ${selectedVariant?.name || 'Standard'}\n\nPlease share design assistance and delivery estimates.`
    );
    return `https://wa.me/${businessPhone}?text=${text}`;
  };

  return (
    <div id="customization-form" className="flex flex-col gap-8 w-full scroll-mt-24">
      {/* Title & Pricing Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-gold-400/20 text-[#D4AF37] border border-gold-400/30">
            {product.categoryName}
          </span>
          <span className="text-xs text-[#6E675A]">SKU: {selectedVariant?.sku || product.sku}</span>
          {product.stock > 0 ? (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              In Stock (Ships in 24h)
            </span>
          ) : (
            <span className="text-xs text-rose-400 font-medium">Out of Stock</span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2A2620] tracking-tight leading-snug">
          {product.name}
        </h1>

        <div className="flex items-baseline gap-3 mt-3">
          <span className="text-3xl font-bold text-[#D4AF37] font-serif">
            {formatCurrency(finalUnitPrice)}
          </span>
          {product.discountPrice && (
            <>
              <span className="text-lg text-gray-500 line-through">
                {formatCurrency(product.basePrice + variantPriceAdjustment)}
              </span>
              <span className="px-2 py-0.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded">
                Save {discountPercent}%
              </span>
            </>
          )}
          <span className="text-xs text-[#6E675A] font-sans">Inclusive of all taxes & engraving</span>
        </div>
      </div>

      {/* Interactive Mockup Canvas on Mobile or Tablet */}
      <div className="lg:hidden w-full">
        <EngravingPreviewCanvas
          productImage={selectedVariant?.imageUrl || product?.images?.[0] || '/images/products-optimized/1.png'}
          productName={product?.name || 'Personalized Gift'}
          engravedText={primaryText}
          secondaryText={secondaryText}
          selectedFont={selectedFont}
          placement={selectedPlacement}
          uploadedLogoUrl={uploadedLogo.previewUrl}
          sku={safeSku}
        />
      </div>

      {/* Color / Variant Selection */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#5B5444]">
            Select Color / Finish: <span className="text-[#D4AF37]">{selectedVariant?.colorName}</span>
          </label>
          <div className="flex items-center gap-3">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                  selectedVariant?.id === v.id
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white ring-1 ring-[#D4AF37]'
                    : 'border-[#EBDDB4] bg-white text-[#6E675A] hover:border-gray-600'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-sm"
                  style={{ backgroundColor: v.colorCode }}
                />
                {v.colorName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Personalization Engine Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111C3A] to-[#0A1128] border border-[#D4AF37]/30 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#EBDDB4] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-base font-serif font-bold text-white tracking-wide">
              Laser Engraving Studio
            </h2>
          </div>
          <span className="text-xs text-[#C5A059] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20">
            Complimentary Preview
          </span>
        </div>

        {/* 1. Enter Engraving Name */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-gray-200">
              Personalized Name or Text to Engrave <span className="text-[#D4AF37]">*</span>
            </label>
            <span className="text-[#6E675A]">{primaryText.length} / 25 chars</span>
          </div>
          <input
            type="text"
            maxLength={25}
            value={primaryText}
            onChange={(e) => setPrimaryText(e.target.value)}
            placeholder="e.g. Saurabh Kumar"
            className="w-full px-4 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#D4AF37]/40 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all text-sm tracking-wide"
          />
          <p className="text-[11px] text-[#6E675A]">
            Precision laser-etched in enduring metallic golden brass.
          </p>
        </div>

        {/* 2. Secondary Text (e.g. Pen cap or designation) */}
        {product.sku.includes('PEN') && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-gray-200">
                Designation / Organization for Cap (Optional)
              </label>
              <span className="text-[#6E675A]">{secondaryText.length} / 20 chars</span>
            </div>
            <input
              type="text"
              maxLength={20}
              value={secondaryText}
              onChange={(e) => setSecondaryText(e.target.value)}
              placeholder="e.g. CEO / BJP / TechCorp"
              className="w-full px-4 py-2 rounded-xl bg-[#FFFDF8]/80 border border-[#D9C48C] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all text-sm"
            />
          </div>
        )}

        {/* 3. Typography Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-200 block">
            Choose Typography Style:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'Great Vibes', name: 'Great Vibes', sample: 'Calligraphy', style: "'Great Vibes', cursive" },
              { id: 'Cinzel', name: 'Cinzel', sample: 'CLASSIC SERIF', style: "'Cinzel', serif" },
              { id: 'Playfair Display', name: 'Playfair', sample: 'Editorial', style: "'Playfair Display', serif" },
              { id: 'Montserrat', name: 'Montserrat', sample: 'MODERN SANS', style: "'Montserrat', sans-serif" },
            ].map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => setSelectedFont(font.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                  selectedFont === font.id
                    ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#7A5C16] shadow-md ring-1 ring-[#D4AF37]'
                    : 'border-[#EBDDB4] bg-white/60 text-[#6E675A] hover:border-[#D9C48C]'
                }`}
              >
                <span className="text-xs text-white truncate max-w-full" style={{ fontFamily: font.style }}>
                  {font.sample}
                </span>
                <span className="text-[10px] text-[#6E675A] mt-1">{font.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Placement Option */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-200 block">
            Engraving Placement:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              product.sku.includes('DIA') || product.sku.includes('SET')
                ? 'Center Brass Nameplate'
                : 'Pen Barrel Center',
              product.sku.includes('SET') ? 'Both Diary & Pen' : 'Pen Clip Top Section',
            ].map((place) => (
              <button
                key={place}
                type="button"
                onClick={() => setSelectedPlacement(place)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  selectedPlacement === place
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#7A5C16]'
                    : 'border-[#EBDDB4] text-[#6E675A] hover:border-gray-700'
                }`}
              >
                {place}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Logo / Artwork Upload (Optional for corporate) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-semibold text-gray-200 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
              Upload Corporate Logo or Monogram (Optional)
            </label>
            <span className="text-[#C5A059]">+₹150 for setup</span>
          </div>

          <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-[#D9C48C] hover:border-[#D4AF37]/50 rounded-xl cursor-pointer bg-white transition-colors">
            <span className="text-xs text-[#5B5444]">
              {uploadedLogo.name ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {uploadedLogo.name}
                </span>
              ) : (
                'Click to upload PNG, SVG, JPG or PDF artwork'
              )}
            </span>
            <span className="text-[10px] text-gray-500 mt-0.5">Max size 10MB</span>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.svg,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {uploadError && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {uploadError}
            </p>
          )}
        </div>

        {/* 6. Special Instructions */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-200 block">
            Special Instructions for Craftsman (Optional):
          </label>
          <textarea
            rows={2}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="Any specific engraving alignment or capitalization notes..."
            className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] border border-[#EBDDB4] text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
        </div>
      </div>

      {/* Quantity & Order Actions */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#5B5444] block">Quantity:</label>
            <div className="flex items-center border border-[#D9C48C] bg-white rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(product.minOrderQty || 1, quantity - 1))}
                className="px-3 py-2 text-[#6E675A] hover:text-white hover:bg-[#F8F2E3] transition-colors font-bold"
              >
                -
              </button>
              <span className="px-4 py-2 text-sm font-semibold text-white min-w-[2.5rem] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-[#6E675A] hover:text-white hover:bg-[#F8F2E3] transition-colors font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <span className="text-xs text-[#6E675A]">Total Payable Amount:</span>
            <div className="text-2xl font-bold text-white font-serif">
              {formatCurrency(totalPrice)}
            </div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleAddToCart(false)}
            className="btn-luxury-gold w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide text-navy-950 shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center gap-2 group/btn"
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
            <span>Add To Cart</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddToCart(true)}
            className="btn-luxury-ghost w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 group/btn"
          >
            <Zap className="w-4 h-4 text-[#D4AF37] group-hover/btn:scale-110 transition-transform duration-300" />
            <span>Buy Now</span>
          </button>
        </div>

        {/* Alternative: WhatsApp Enquiry CTA */}
        <a
          href={generateWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400 flex items-center justify-center gap-2 transition-all duration-300 shadow-md active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Enquire or Order via WhatsApp (Instant Support)</span>
        </a>
      </div>

      {/* Trust & Guarantee Badges */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#EBDDB4] text-center">
        <div className="flex flex-col items-center gap-1 text-[11px] text-[#6E675A]">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
          <span>Permanent Laser Etch Guarantee</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[11px] text-[#6E675A]">
          <Truck className="w-5 h-5 text-[#D4AF37]" />
          <span>Express 24-48h Dispatch</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[11px] text-[#6E675A]">
          <HelpCircle className="w-5 h-5 text-[#D4AF37]" />
          <span>100% Free Defect Replacement</span>
        </div>
      </div>
    </div>
  );
};

export default CustomizationEngine;

