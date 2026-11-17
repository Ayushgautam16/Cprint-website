'use client';

import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const activeImage = images[selectedIndex] || images[0] || '/images/products-catalog/1.png';

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image Display with Hover Zoom */}
      <div
        className="relative aspect-square w-full border border-[#EBDDB4] bg-[radial-gradient(circle_at_50%_40%,#FFFFFF_0%,#F8F2E3_100%)] cursor-crosshair group shadow-md overflow-hidden flex items-center justify-center p-6"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={activeImage}
          alt={`${productName} view ${selectedIndex + 1}`}
          className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-200 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
        />

        {/* Hover Hint */}
        <div className="absolute bottom-3 right-3 text-[11px] bg-white/90 backdrop-blur-md text-[#7A5C16] px-2.5 py-1 border border-[#EBDDB4] opacity-0 group-hover:opacity-100 transition-opacity">
          Hover to zoom
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 flex-shrink-0 border-2 transition-all p-1 bg-white ${
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
