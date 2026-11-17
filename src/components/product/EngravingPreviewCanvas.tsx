'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Sparkles, Eye, RotateCw } from 'lucide-react';

interface EngravingPreviewCanvasProps {
  productImage: string;
  productName: string;
  engravedText: string;
  secondaryText?: string;
  selectedFont: string;
  selectedColor?: string;
  placement: string;
  uploadedLogoUrl?: string | null;
  sku: string;
}

export const EngravingPreviewCanvas: React.FC<EngravingPreviewCanvasProps> = ({
  productImage,
  productName,
  engravedText,
  secondaryText,
  selectedFont,
  placement,
  uploadedLogoUrl,
  sku,
}) => {
  const [zoomActive, setZoomActive] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  // Typography font family mapping
  const getFontFamily = (fontName: string) => {
    switch (fontName) {
      case 'Great Vibes':
        return "'Great Vibes', cursive";
      case 'Cinzel':
        return "'Cinzel', Georgia, serif";
      case 'Playfair Display':
        return "'Playfair Display', serif";
      case 'Montserrat':
      default:
        return "'Montserrat', sans-serif";
    }
  };

  // Dynamic font sizing based on length to prevent text clipping
  const getDiaryTextSize = (text: string) => {
    if (text.length > 22) return 'text-[9px] sm:text-[10px] tracking-normal';
    if (text.length > 16) return 'text-[11px] sm:text-xs tracking-tight';
    return 'text-xs sm:text-sm tracking-wider';
  };

  const getPenTextSize = (text: string) => {
    if (text.length > 20) return 'text-[9px] sm:text-[10px] tracking-normal';
    if (text.length > 14) return 'text-[10px] sm:text-xs tracking-wider';
    return 'text-xs sm:text-sm tracking-widest';
  };

  // Determine mockup overlay coordinates based on product SKU / type
  const safeSku = sku || '';
  const isDiary = safeSku.includes('DIA') || safeSku.includes('SET');
  const isPen = safeSku.includes('PEN');
  const safeProductImage = productImage || '/images/products-optimized/1.png';
  const safeProductName = productName || 'Personalized Gift';

  return (
    <div className="relative w-full aspect-square max-h-[540px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#111C3A] to-[#070D1F] border border-[#D4AF37]/30 shadow-2xl flex items-center justify-center group select-none">
      {/* Background Product Image */}
      <div className="relative w-full h-full">
        <Image
          src={safeProductImage}
          alt={safeProductName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-contain transition-transform duration-500 ${
            zoomActive ? 'scale-125' : 'scale-100'
          }`}
        />

        {/* Live Laser Engraving Mockup Overlays */}
        {/* Case A: Diary Gold Brass Nameplate Overlay */}
        {isDiary && engravedText && (
          <div
            className="absolute transition-all duration-300 pointer-events-none"
            style={{
              bottom: '33%',
              left: '32%',
              transform: 'translate(-50%, 0)',
              width: '190px',
              maxWidth: '85%',
              textAlign: 'center',
            }}
          >
            <div className="relative px-3 py-1 bg-gradient-to-r from-[#DFBA6F]/90 via-[#F3E5AB]/95 to-[#C5A059]/90 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.5)] border border-[#AA8417]/80 flex flex-col items-center justify-center">
              <span
                className={`text-[#2A1805] font-semibold ${getDiaryTextSize(engravedText)} drop-shadow-[0_0.5px_0_rgba(255,255,255,0.8)]`}
                style={{
                  fontFamily: getFontFamily(selectedFont),
                }}
              >
                {engravedText}
              </span>
              {uploadedLogoUrl && (
                <div className="mt-0.5 w-6 h-6 relative opacity-90">
                  <Image
                    src={uploadedLogoUrl}
                    alt="Logo"
                    fill
                    className="object-contain filter contrast-125 brightness-75"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Case B: Pen Barrel Laser Engraving Overlay */}
        {isPen && engravedText && (
          <div
            className="absolute transition-all duration-300 pointer-events-none"
            style={{
              top: '59%',
              left: '52%',
              transform: 'translate(-50%, -50%) rotate(-1deg)',
              width: '200px',
              maxWidth: '85%',
              textAlign: 'center',
            }}
          >
            <div className="px-2 py-0.5 flex flex-col items-center justify-center">
              <span
                className={`text-[#F3E5AB] font-bold ${getPenTextSize(engravedText)} uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]`}
                style={{
                  fontFamily: getFontFamily(selectedFont),
                  textShadow: '0 0 3px rgba(243, 229, 171, 0.6), 0 1px 1px #000',
                }}
              >
                {engravedText}
              </span>
              {secondaryText && (
                <span
                  className="text-[#D4AF37] font-medium text-[9px] tracking-wider uppercase mt-0.5"
                  style={{ fontFamily: getFontFamily(selectedFont) }}
                >
                  {secondaryText}
                </span>
              )}
              {uploadedLogoUrl && (
                <div className="mt-1 w-6 h-6 relative">
                  <Image
                    src={uploadedLogoUrl}
                    alt="Logo"
                    fill
                    className="object-contain filter invert sepia hue-rotate-15"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Live Preview Watermark & Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-950/80 backdrop-blur-md border border-[#D4AF37]/40 shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
        <span className="text-[11px] font-medium tracking-wider text-[#F3E5AB] uppercase">
          Live Laser Mockup
        </span>
      </div>

      {/* Floating Control Pill */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setZoomActive(!zoomActive)}
          className="p-2 rounded-xl bg-navy-900/80 backdrop-blur-md text-[#F3E5AB] hover:text-white border border-[#D4AF37]/30 transition-all shadow-lg hover:border-[#D4AF37]"
          title="Toggle Zoom"
          aria-label="Toggle Zoom"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setIsRotating(true);
            setTimeout(() => setIsRotating(false), 500);
          }}
          className={`p-2 rounded-xl bg-navy-900/80 backdrop-blur-md text-[#F3E5AB] hover:text-white border border-[#D4AF37]/30 transition-all shadow-lg hover:border-[#D4AF37] ${
            isRotating ? 'rotate-180 transition-transform duration-500' : ''
          }`}
          title="Refresh Angles"
          aria-label="Refresh Angles"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Precision Proof Notice */}
      <div className="absolute bottom-3 left-4 z-20 text-[10px] text-gray-400 bg-navy-950/80 px-2.5 py-1 rounded border border-navy-800">
        Placement: <span className="text-[#D4AF37]">{placement}</span>
      </div>
    </div>
  );
};

export default EngravingPreviewCanvas;

