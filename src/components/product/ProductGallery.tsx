'use client';

import React, { useState, useRef } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [dragDelta, setDragDelta] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleNext = () => {
    if (images.length <= 1) return;
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length <= 1) return;
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch Swipe for mobile phones
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragDelta(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    const deltaX = dragDelta;
    touchStartRef.current = null;
    setDragDelta(0);

    if (deltaX < -35) {
      handleNext();
    } else if (deltaX > 35) {
      handlePrev();
    }
  };

  const activeImage = images[selectedIndex] || images[0] || '/images/products-optimized/1.png';

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      {/* Main Image Display with Touch Swipe and Hover Zoom */}
      <div
        className="relative aspect-square w-full border border-[#EBDDB4] bg-[radial-gradient(circle_at_50%_40%,#FFFFFF_0%,#F8F2E3_100%)] cursor-crosshair group shadow-md overflow-hidden flex items-center justify-center p-6 touch-pan-y"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={activeImage}
          alt={`${productName} view ${selectedIndex + 1}`}
          className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-200 pointer-events-none ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : dragDelta !== 0
              ? {
                  transform: `translateX(${dragDelta * 0.3}px)`,
                }
              : undefined
          }
          draggable={false}
        />

        {/* Mobile Swipe / Click Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#7A5C16] shadow-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#7A5C16] shadow-md flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter Badge for Mobile */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 text-[11px] font-bold bg-white/90 backdrop-blur-md text-[#7A5C16] px-2.5 py-1 border border-[#EBDDB4] rounded-full shadow-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        {/* Hover Hint */}
        <div className="hidden sm:block absolute bottom-3 right-3 text-[11px] bg-white/90 backdrop-blur-md text-[#7A5C16] px-2.5 py-1 border border-[#EBDDB4] opacity-0 group-hover:opacity-100 transition-opacity">
          Hover to zoom
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 flex-shrink-0 border-2 transition-all p-1 bg-white rounded-lg ${
                selectedIndex === idx
                  ? 'border-[#C9A24B] shadow-md scale-105'
                  : 'border-[#EBDDB4] opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
