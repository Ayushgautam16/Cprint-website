'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ProductAutoSliderProps {
  images: string[];
  alt: string;
  intervalMs?: number;
  className?: string;
  showDots?: boolean;
}

export default function ProductAutoSlider({
  images,
  alt,
  intervalMs = 3800,
  className = '',
  showDots = true,
}: ProductAutoSliderProps) {
  const validImages = images && images.length > 0 ? images : ['/images/products-optimized/1.png'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Viewport Observer: Only run carousel when card is actually visible on screen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Interval timer with visibility & hover awareness
  useEffect(() => {
    if (validImages.length <= 1 || isPaused || !isVisible) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Stagger slightly based on images count & index
    const stagger = (validImages.length % 3) * 250;
    timerRef.current = setInterval(() => {
      // Check document visibility
      if (typeof document !== 'undefined' && document.hidden) return;
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, intervalMs + stagger);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [validImages.length, intervalMs, isPaused, isVisible]);

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  // Only render active image and immediate neighbors to save DOM and VRAM
  const nextIndex = (currentIndex + 1) % validImages.length;
  const prevIndex = (currentIndex - 1 + validImages.length) % validImages.length;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden group select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{ transform: 'translate3d(0,0,0)' }}
    >
      {/* Optimized cross-fade images */}
      {validImages.map((src, idx) => {
        // Render only if currently active or adjacent to minimize memory load
        const shouldRender = idx === currentIndex || idx === nextIndex || idx === prevIndex;
        if (!shouldRender) return null;

        const isActive = idx === currentIndex;

        return (
          <div
            key={src}
            className={`absolute inset-0 w-full h-full flex items-center justify-center p-3 transition-opacity duration-700 ease-out will-change-[opacity] ${
              isActive ? 'opacity-100 z-1' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={src}
              alt={`${alt} - View ${idx + 1}`}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        );
      })}

      {/* Manual Quick Next/Prev on Card Hover */}
      {validImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#7A5C16] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#7A5C16] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Slide Dots Indicator */}
      {showDots && validImages.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 z-10 flex items-center justify-center gap-1.5 pointer-events-auto">
          {validImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleDotClick(e, idx)}
              aria-label={`Jump to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-5 bg-[#C9A24B]'
                  : 'w-1.5 bg-[#2A2620]/25 hover:bg-[#C9A24B]/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
