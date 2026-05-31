'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { RotateCcw, ZoomIn, ZoomOut, Play, Pause, Expand } from 'lucide-react';
import { ProductImage } from '@/types';
import { cn } from '@/lib/utils';

interface Product360ViewProps {
  images: ProductImage[];
  productName: string;
}

export default function Product360View({ images, productName }: Product360ViewProps) {
  const sortedImages = [...images].sort((a, b) => a.angle - b.angle);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(((index % sortedImages.length) + sortedImages.length) % sortedImages.length);
  }, [sortedImages.length]);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
    }, 120);
    setIsAutoPlaying(true);
  }, [sortedImages.length]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsAutoPlaying(false);
  }, []);

  const toggleAutoPlay = () => {
    if (isAutoPlaying) stopAutoPlay();
    else startAutoPlay();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    stopAutoPlay();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX;
    if (Math.abs(delta) > 10) {
      const direction = delta > 0 ? -1 : 1;
      goToIndex(currentIndex + direction);
      setDragStartX(e.clientX);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
    stopAutoPlay();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const delta = e.touches[0].clientX - dragStartX;
    if (Math.abs(delta) > 8) {
      const direction = delta > 0 ? -1 : 1;
      goToIndex(currentIndex + direction);
      setDragStartX(e.touches[0].clientX);
    }
  };

  const currentImage = sortedImages[currentIndex];
  const progress = ((currentIndex + 1) / sortedImages.length) * 100;

  if (!currentImage) return null;

  return (
    <div className={cn('relative', isFullscreen && 'fixed inset-0 z-50 bg-black')}>
      <div
        ref={containerRef}
        className={cn(
          'relative select-none overflow-hidden rounded-2xl bg-gray-50',
          isFullscreen ? 'w-full h-full rounded-none' : 'aspect-square',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => {}}
      >
        {/* Main image */}
        <div
          className="w-full h-full transition-transform duration-100"
          style={{ transform: `scale(${zoom})` }}
        >
          <Image
            src={currentImage.url}
            alt={`${productName} — ${currentImage.angle}°`}
            fill
            className="object-cover pointer-events-none"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            draggable={false}
          />
        </div>

        {/* 360° badge */}
        <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> 360°
        </div>

        {/* Angle indicator */}
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
          {currentImage.angle}°
        </div>

        {/* Drag hint */}
        {!isDragging && currentIndex === 0 && (
          <div className="absolute inset-x-0 bottom-14 flex justify-center pointer-events-none">
            <div className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm animate-pulse-soft flex items-center gap-2">
              <span>←</span> Drag to rotate <span>→</span>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
          <div
            className="h-full bg-brand-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mt-3 px-1">
        {/* Frame indicator */}
        <span className="text-xs text-gray-500 mr-auto">
          {currentIndex + 1} / {sortedImages.length} frames
        </span>

        {/* Zoom out */}
        <button
          onClick={() => setZoom(Math.max(1, zoom - 0.25))}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-40"
          disabled={zoom <= 1}
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Zoom in */}
        <button
          onClick={() => setZoom(Math.min(3, zoom + 0.25))}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-40"
          disabled={zoom >= 3}
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Auto-rotate */}
        <button
          onClick={toggleAutoPlay}
          className={cn(
            'p-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium px-3',
            isAutoPlaying ? 'bg-brand-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          )}
        >
          {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isAutoPlaying ? 'Stop' : 'Auto-rotate'}
        </button>

        {/* Reset */}
        {zoom !== 1 && (
          <button onClick={() => setZoom(1)} className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Fullscreen */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Expand className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
        {sortedImages.map((img, i) => (
          <button
            key={img.id}
            onClick={() => goToIndex(i)}
            className={cn(
              'relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all',
              i === currentIndex ? 'border-brand-500 scale-105' : 'border-gray-200 hover:border-brand-300'
            )}
          >
            <Image src={img.url} alt={`${img.angle}°`} fill className="object-cover" sizes="56px" />
            <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] text-center py-0.5">
              {img.angle}°
            </span>
          </button>
        ))}
      </div>

      {/* Fullscreen close */}
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-colors z-10"
        >
          ✕
        </button>
      )}
    </div>
  );
}
