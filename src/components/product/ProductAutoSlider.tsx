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
  const validImages: string[] = Array.isArray(images) && images.length > 0
    ? images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    : typeof images === 'string' && (images as string).trim().length > 0
    ? [(images as string).trim()]
    : ['/images/products-optimized/1.png'];

  const safeImages = validImages.length > 0 ? validImages : ['/images/products-optimized/1.png'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

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

  // Guard index bounds if product images update dynamically
  useEffect(() => {
    if (currentIndex >= safeImages.length) {
      setCurrentIndex(0);
    }
  }, [safeImages.length, currentIndex]);

  // Interval timer with visibility & hover/drag awareness
  useEffect(() => {
    if (safeImages.length <= 1 || isPaused || isDragging || !isVisible) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const stagger = (safeImages.length % 3) * 250;
    timerRef.current = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    }, intervalMs + stagger);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [safeImages.length, intervalMs, isPaused, isDragging, isVisible]);

  // Touch Swipe Handlers for Mobile Phones
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Check if horizontal swipe is intentional
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDragOffset(deltaX);
    }
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    setIsDragging(false);

    if (!touchStartRef.current) return;
    const deltaX = dragOffset;
    touchStartRef.current = null;
    setDragOffset(0);

    const threshold = 35; // px swipe threshold
    if (deltaX < -threshold) {
      // Swiped Left -> Next image
      setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    } else if (deltaX > threshold) {
      // Swiped Right -> Previous image
      setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    }
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const nextIndex = (currentIndex + 1) % safeImages.length;
  const prevIndex = (currentIndex - 1 + safeImages.length) % safeImages.length;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden group select-none touch-pan-y ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ transform: 'translate3d(0,0,0)' }}
    >
      {/* Horizontal Sliding Image Reel */}
      {safeImages.map((src, idx) => {
        // Render active and adjacent images for performance
        const shouldRender = idx === currentIndex || idx === nextIndex || idx === prevIndex;
        if (!shouldRender) return null;

        const offsetPercent = (idx - currentIndex) * 100;
        const isActive = idx === currentIndex;

        return (
          <div
            key={`${src}-${idx}`}
            className="absolute inset-0 w-full h-full flex items-center justify-center p-4 sm:p-5 will-change-transform"
            style={{
              transform: `translate3d(calc(${offsetPercent}% + ${isDragging ? dragOffset : 0}px), 0, 0)`,
              transition: isDragging
                ? 'none'
                : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease',
              opacity: isActive || Math.abs(offsetPercent) <= 100 ? 1 : 0,
            }}
          >
            <img
              src={src}
              alt={`${alt} - View ${idx + 1}`}
              className="w-full h-full max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105 pointer-events-none drop-shadow-sm"
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
            />
          </div>
        );
      })}

      {/* Manual Quick Next/Prev Arrows (Visible on card hover on desktop & subtle touch arrows on mobile) */}
      {safeImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#7A5C16] shadow-md flex items-center justify-center opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#7A5C16] shadow-md flex items-center justify-center opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Slide Dots Indicator */}
      {showDots && safeImages.length > 1 && (
        <div className="absolute bottom-2.5 left-0 right-0 z-10 flex items-center justify-center gap-1.5 pointer-events-auto">
          {safeImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => handleDotClick(e, idx)}
              aria-label={`Jump to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-5 bg-[#C9A24B] shadow-sm'
                  : 'w-1.5 bg-[#2A2620]/30 hover:bg-[#C9A24B]/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
