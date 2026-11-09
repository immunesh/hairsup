'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Zap } from 'lucide-react';
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

// Marketplace names run long ("AHS Bob Hair Wig for Women | Full Head …").
// The card shows the name a shop assistant would say; the full one stays in `title`.
const NAME_MAX = 46;
function shortName(name = '') {
  const head = name.split(/\s+[|–—]\s+|\s+-\s+/)[0].trim();
  if (head.length <= NAME_MAX) return head;
  const cut = head.slice(0, NAME_MAX);
  return cut.slice(0, cut.lastIndexOf(' ') > 20 ? cut.lastIndexOf(' ') : NAME_MAX).replace(/[,\s]+$/, '') + '…';
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
    <Link href={`/products/${product.slug}`} className="block h-full rounded-card">
      <div
        className={cn('card group flex flex-col h-full overflow-hidden', className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div className={cn('relative bg-paper-2 overflow-hidden', compact ? 'aspect-[4/4.5]' : 'aspect-product')}>
          {primaryImage && (
            <Image
              src={primaryImage?.url || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}

          {/* Badges. items-start keeps each badge to its own width. */}
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1 max-w-[58%]">
            {discountPct > 0 && (
              <span className={cn('badge badge-sale', compact && 'px-1.5 py-0.5 text-[11px]')}>-{discountPct}%</span>
            )}
            {product.isNewArrival && (
              <span className={cn('badge badge-new', compact && 'px-1.5 py-0.5 text-[11px]')}>New</span>
            )}
            {product.isBestSeller && (
              <span className={cn('badge badge-best', compact && 'px-1.5 py-0.5 text-[11px]')}>Best seller</span>
            )}
          </div>

          {/* Actions: shown on hover, and whenever a control inside has focus */}
          <div
            className={cn(
              'absolute inset-x-2 bottom-2 flex gap-1.5 transition-[opacity,transform] duration-200 ease-out',
              'focus-within:opacity-100 focus-within:translate-y-0',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            )}
          >
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              aria-busy={addingToCart}
              className={cn(
                'flex-1 min-w-0 min-h-[44px] whitespace-nowrap bg-surface/95 text-ink font-semibold rounded-full flex items-center justify-center gap-1.5 shadow-sm',
                'transition-colors duration-200 hover:bg-accent hover:text-accent-ink disabled:opacity-50 disabled:cursor-not-allowed',
                compact ? 'text-[12px] px-2' : 'text-[13px] px-3'
              )}
            >
              {product.stock === 0 ? 'Out of stock' : (
                <><ShoppingBag className={cn('hidden sm:block', compact ? 'w-3.5 h-3.5' : 'w-4 h-4')} aria-hidden /> {addingToCart ? 'Adding…' : 'Add to bag'}</>
              )}
            </button>
            <button
              type="button"
              onClick={handleWishlist}
              aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
              aria-pressed={isWishlisted}
              className={cn(
                'rounded-full flex items-center justify-center shadow-sm transition-colors duration-200 shrink-0',
                'w-11 h-11',
                isWishlisted ? 'bg-coral-600 text-white' : 'bg-surface/95 text-ink-soft hover:text-coral-600'
              )}
            >
              <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} aria-hidden />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className={cn('flex flex-col flex-1', compact ? 'p-3' : 'p-4')}>
          <p className={cn('text-ink-muted', compact ? 'text-[12px]' : 'text-[13px]')}>
            {product.category?.name}
            {product.gender && !/\b(wo)?men/i.test(product.category?.name || '') && (
              <> for {String(product.gender).toUpperCase() === 'WOMEN' ? 'women' : 'men'}</>
            )}
          </p>
          <h3
            className={cn(
              'font-sans font-semibold text-ink leading-snug tracking-normal line-clamp-2 mt-1 group-hover:text-accent transition-colors',
              compact ? 'text-[14px]' : 'text-[15px]'
            )}
            title={product.name}
          >
            {shortName(product.name)}
          </h3>

          {(product.texture || product.length) && (
            <p className={cn('text-ink-muted mt-1', compact ? 'text-[12px]' : 'text-[13px]')}>
              {[product.texture, product.length].filter(Boolean).join(', ')}
            </p>
          )}

          <div className="mt-auto pt-3">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center" role="img" aria-label={`Rated ${Math.round(product.rating)} out of 5`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    aria-hidden
                    className={cn(compact ? 'w-3 h-3' : 'w-3.5 h-3.5', s <= Math.round(product.rating) ? 'star-filled' : 'star-empty')}
                  />
                ))}
              </div>
              <span className={cn('text-ink-muted', compact ? 'text-[12px]' : 'text-[13px]')}>
                {product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 mt-2">
              <span className={cn('font-semibold text-ink', compact ? 'text-[15px]' : 'text-base')}>
                {formatPrice(product.salePrice || product.basePrice)}
              </span>
              {product.salePrice && (
                <span className={cn('text-ink-muted line-through', compact ? 'text-[12px]' : 'text-[13px]')}>
                  {formatPrice(product.basePrice)}
                </span>
              )}
              {discountPct > 0 && (
                <span className={cn('font-semibold text-coral-600', compact ? 'text-[12px]' : 'text-[13px]')}>
                  {discountPct}% off
                </span>
              )}
            </div>

            {/* Low stock sits under the price, never over the photograph. */}
            {product.stock > 0 && product.stock <= 5 && (
              <p className={cn('mt-1 font-semibold text-coral-600', compact ? 'text-[12px]' : 'text-[13px]')}>
                Only {product.stock} left
              </p>
            )}

            <p className={cn('flex items-center gap-1.5 font-medium text-accent mt-2', compact ? 'text-[12px]' : 'text-[13px]')}>
              <Zap className="w-3.5 h-3.5" aria-hidden />
              Try it on virtually
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
