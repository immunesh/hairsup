'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Eye, Zap } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import { useCartStore, useWishlistStore, useAuthStore, useUIStore } from '@/lib/store';
import { cartApi, wishlistApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { API_ORIGIN } from '@/lib/config';

interface ProductCardProps {
  product: Product;
  className?: string;
  compact?: boolean;
}

export default function ProductCard({ product, className, compact = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { addItem: addToCart } = useCartStore();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { showToast } = useUIStore();
const primaryImage =
  product.images?.find((img) => img.isPrimary) ||
  product.images?.[0];

const hoverImage =
  product.images?.find((img) => !img.isPrimary) ||
  primaryImage;

const imageUrl = primaryImage?.url
  ? primaryImage.url.startsWith("http")
    ? primaryImage.url
    : `${API_ORIGIN}${primaryImage.url}`
  : "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800";

const hoverUrl = hoverImage?.url
  ? hoverImage.url.startsWith("http")
    ? hoverImage.url
    : `${API_ORIGIN}${hoverImage.url}`
  : imageUrl;
    const isWishlisted = wishlistItems.some((i) => i.productId === product.id);
  const discountPct = product.salePrice ? getDiscountPercent(product.basePrice, product.salePrice) : 0;

 const handleAddToCart = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
    if (!isAuthenticated) { showToast('Please sign in to add to cart', 'error'); return; }
    setAddingToCart(true);
   try {

  const { data } = await cartApi.add(product.id, 1);

      addToCart(data.data);
      showToast('Added to cart!', 'success');
   } catch (error: any) {
  console.error("ADD CART ERROR", error);
  console.error("RESPONSE", error?.response?.data);

  showToast(
    error?.response?.data?.message ||
    "Failed to add to cart",
    "error"
  );
}finally {
      setAddingToCart(false);
    }
  };

const handleWishlist = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
    if (!isAuthenticated) { showToast('Please sign in to save items', 'error'); return; }
    try {
      if (isWishlisted) {
        await wishlistApi.remove(product.id);
        removeFromWishlist(product.id);
        showToast('Removed from wishlist');
      } else {
        const { data } = await wishlistApi.add(product.id);
        addToWishlist(data.data);
        showToast('Added to wishlist!');
      }
    } catch {
      showToast('Something went wrong', 'error');
    }
  };
  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <div
        className={cn('card group cursor-pointer overflow-hidden flex flex-col h-full', className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image container */}
        <div className={cn("relative bg-gray-50 overflow-hidden", compact ? "aspect-[4/4.5]" : "aspect-product")}>
          {primaryImage && (
            <Image
  src={
    primaryImage?.url ||
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800"
  }
  alt={product.name}
  fill
  className="object-cover transition-transform duration-500 group-hover:scale-105"
  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
/>
          )}

          {/* Badges. items-start matters: a flex column stretches its children
              by default, which sized the short discount badge to the width of
              "Best Seller" and pushed it into the gender badge on narrow cards. */}
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1 max-w-[58%]">
            {discountPct > 0 && (
              <span className={cn("badge badge-sale", compact && "px-1.5 py-0.5 text-[9px]")}>-{discountPct}%</span>
            )}
            {product.isNewArrival && (
              <span className={cn("badge badge-new", compact && "px-1.5 py-0.5 text-[9px]")}>New</span>
            )}
            {product.isBestSeller && (
              <span className={cn("badge badge-best", compact && "px-1.5 py-0.5 text-[9px]")}>Best Seller</span>
            )}
          </div>

          {/* Gender badge. Hidden on the narrowest cards, where "Best Seller"
              on the left leaves no room — the category line directly beneath
              the image already reads "Women's Wigs" / "Men's Wigs". */}
          <div className="absolute top-2 right-2 max-w-[40%] hidden min-[420px]:block">
            <span className={cn(
              'badge',
              compact && 'px-1.5 py-0.5 text-[9px]',
              product.gender === 'WOMEN' ? 'bg-cream text-ink-soft' : 'bg-mist text-ink-soft'
            )}>
              {product.gender === 'WOMEN' ? 'Women' : 'Men'}
            </span>
          </div>

          {/* Action buttons on hover */}
          <div className={cn(
            'absolute inset-x-2 bottom-2 flex gap-1.5 transition-all duration-300',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className={cn(
                "flex-1 bg-white/95 hover:bg-brand-600 hover:text-white text-gray-800 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1 shadow-sm disabled:opacity-50",
                compact ? "text-[11px] py-1.5 px-2" : "text-xs py-2 px-3"
              )}
            >
              {product.stock === 0 ? 'Out of Stock' : (
                <><ShoppingBag className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} /> {addingToCart ? 'Adding…' : 'Add to Bag'}</>
              )}
            </button>
            <button
              onClick={handleWishlist}
              className={cn(
                'rounded-xl flex items-center justify-center shadow-sm transition-all duration-200',
                compact ? 'w-7 h-7' : 'w-9 h-9',
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white/95 hover:bg-red-500 hover:text-white text-gray-600'
              )}
            >
              <Heart className={cn(compact ? 'w-3.5 h-3.5' : 'w-4 h-4', isWishlisted && 'fill-current')} />
            </button>
          </div>

          {/* Quick View */}
          {isHovered && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Quick View
              </div>
            </div>
          )}

        </div>

        {/* Product info */}
        <div className={cn("flex flex-col flex-1", compact ? "p-2.5" : "p-3")}>
          <p className={cn("text-gray-400 font-medium uppercase tracking-wide", compact ? "text-[10px] mb-0.5" : "text-xs mb-0.5")}>
            {product.category?.name}
          </p>
          <h3 className={cn("font-semibold text-gray-900 leading-tight group-hover:text-brand-600 transition-colors line-clamp-2", compact ? "text-xs mb-1" : "text-sm mb-1")}>
            {product.name}
          </h3>

          {/* Specs */}
          <div className={cn("flex items-center gap-1.5 text-gray-500", compact ? "text-[11px] mb-1.5" : "text-xs mb-2")}>
            {product.texture && <span>{product.texture}</span>}
            {product.length && <><span>·</span><span>{product.length}</span></>}
          </div>

          <div className="mt-auto">
            {/* Rating */}
            <div className={cn("flex items-center gap-1", compact ? "mb-1" : "mb-2")}>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(compact ? 'w-2.5 h-2.5' : 'w-3 h-3', s <= Math.round(product.rating) ? 'star-filled' : 'star-empty')}
                />
              ))}
            </div>
            <span className={cn("text-gray-500", compact ? "text-[11px]" : "text-xs")}>({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center flex-wrap gap-1">
            <span className={cn("font-bold text-gray-900", compact ? "text-sm" : "text-base")}>
              {formatPrice(product.salePrice || product.basePrice)}
            </span>
            {product.salePrice && (
              <span className={cn("text-gray-400 line-through", compact ? "text-[11px]" : "text-xs")}>
                {formatPrice(product.basePrice)}
              </span>
            )}
            {discountPct > 0 && (
              <span className={cn("font-semibold text-green-600", compact ? "text-[11px]" : "text-xs")}>
                {discountPct}% off
              </span>
            )}
          </div>

          {/* Low stock warning. Sits under the price rather than over the
              photograph - the overlay bar cut straight across the model. */}
          {product.stock > 0 && product.stock <= 5 && (
            <p className={cn("mt-1 font-ui font-semibold text-coral-600", compact ? "text-[11px]" : "text-xs")}>
              Only {product.stock} left!
            </p>
          )}

          {/* Try-on hint */}
          <div className={cn("flex items-center gap-1 font-medium text-brand-600", compact ? "mt-1.5 text-[11px]" : "mt-2 text-xs")}>
            <Zap className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} />
            <span>Try it virtually</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);
}
