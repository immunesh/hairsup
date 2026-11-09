"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Heart,
  Share2,
  Check,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Minus,
  Plus,
  Zap,
  Award,
  Info,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Product360View from "@/components/features/Product360View";
import ProductCard from "@/components/ui/ProductCard";
import StarRating from "@/components/ui/StarRating";
import { formatPrice, getDiscountPercent, formatDate } from "@/lib/utils";
import { Product } from "@/types";
import {
  useCartStore,
  useWishlistStore,
  useAuthStore,
  useUIStore,
} from "@/lib/store";
import { cartApi, wishlistApi, productsApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { reviewsApi } from "@/lib/api";
import { API_URL } from "@/lib/config";
const PRODUCT_TABS = ["Description", "Care Guide", "Reviews", "FAQ"];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("Description");
  const [selectedVariant, setSelectedVariant] = useState<
    Record<string, string>
  >({});
  const [addingToCart, setAddingToCart] = useState(false);
  const [viewMode, setViewMode] = useState<"gallery" | "360">("gallery");
  const [activeImage, setActiveImage] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const { isAuthenticated } = useAuthStore();
  const { addItem: addToCart } = useCartStore();
  const {
    items: wishlistItems,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
  } = useWishlistStore();
  const { showToast } = useUIStore();

  const loadProduct = async () => {
    setLoadError(null);
    try {
      const response = await productsApi.getById(productId);
      const productData = response.data.data;

      setProduct(productData);
      setActiveImage(0);
      try {
        const reviewResponse = await reviewsApi.getByProduct(productData.id);

        setReviews(reviewResponse.data.data || []);
      } catch (error) {
        console.error("Review Error:", error);
      }

      const relatedResponse = await productsApi.getRelated(productData.id);
      setRelatedProducts(relatedResponse.data.data.slice(0, 4));
    } catch (err: any) {
      // Log full error for developer debugging and show a friendly message
      console.error("Failed to load product (axios)", err);
      const axiosMsg =
        err?.response?.data?.message || err?.message || "Network Error";
      // Try a plain fetch fallback to see if axios-specific behavior or CORS is the problem
      try {
        const fallbackRes = await fetch(`${API_URL}/products/${productId}`);
        const text = await fallbackRes.text();
        if (fallbackRes.ok) {
          // parse JSON and set product if possible
          try {
            const parsed = JSON.parse(text);
            const productData = parsed.data;
            setProduct(productData);
            setActiveImage(0);
            // try related via fetch too
            try {
              const relRes = await fetch(
                `${API_URL}/products/${productData.id}/related`,
              );
              if (relRes.ok) {
                const relParsed = await relRes.json();
                setRelatedProducts(relParsed.data.slice(0, 4));
              }
            } catch (e) {
              console.warn("Related fetch fallback failed", e);
            }
            return;
          } catch (parseErr) {
            console.warn("Fallback response not JSON", parseErr, text);
          }
        } else {
          console.warn("Fallback fetch failed", fallbackRes.status, text);
        }
        setLoadError(
          `Network Error: ${axiosMsg} (fallback status: ${fallbackRes.status})`,
        );
      } catch (fetchErr) {
        console.error("Fallback fetch also failed", fetchErr);
        setLoadError(axiosMsg || "Unable to load product details.");
      }
    }
  };

  useEffect(() => {
    if (productId) loadProduct();
  }, [productId]);

  if (!product) {
    return (
      <div className="container-custom py-12">
        {loadError ? (
          <div className="max-w-md py-12" role="alert">
            <h1 className="font-display text-[length:var(--text-2xl)] text-ink leading-tight">We couldn&apos;t load this wig</h1>
            <p className="text-ink-muted mt-2 mb-6 break-words">{loadError}</p>
            <button type="button" onClick={() => loadProduct()} className="btn-primary">
              Retry
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 motion-safe:animate-pulse" aria-busy="true" aria-label="Loading product">
            <div className="bg-paper-3 aspect-product rounded-card" />
            <div className="space-y-4 pt-4">
              <div className="bg-paper-3 h-4 w-32 rounded" />
              <div className="bg-paper-3 h-10 w-4/5 rounded" />
              <div className="bg-paper-3 h-8 w-40 rounded" />
              <div className="bg-paper-3 h-24 w-full rounded" />
            </div>
          </div>
        )}
      </div>
    );
  }

  const isWishlisted = wishlistItems.some((i) => i.productId === product.id);
  const sortedImages = (product.images || [])
    .slice()
    .sort((a, b) => a.angle - b.angle);
  const primaryImage = sortedImages.find((i) => i.isPrimary) || sortedImages[0];
  const discountPct = product.salePrice
    ? getDiscountPercent(product.basePrice, product.salePrice)
    : 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast("Please sign in to add to cart", "error");
      return;
    }
    setAddingToCart(true);
    try {
      const { data } = await cartApi.add(product.id, quantity, selectedVariant);
      addToCart(data.data);
      useCartStore.getState().toggleCart();
      showToast(`${product.name} added to bag!`);
    } catch {
      showToast("Failed to add to cart", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      showToast("Please sign in", "error");
      return;
    }
    try {
      if (isWishlisted) {
        await wishlistApi.remove(product.id);
        removeFromWishlist(product.id);
        showToast("Removed from wishlist");
      } else {
        const { data } = await wishlistApi.add(product.id);
        addToWishlist(data.data);
        showToast("Saved to wishlist!");
      }
    } catch {
      showToast("Something went wrong", "error");
    }
  };

  const totalReviews = reviews.length;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((review) => review.rating === star).length;

    return {
      star,
      pct: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
    };
  });

  const handleSubmitReview = async () => {
    try {
      if (!userRating) {
        alert("Please select rating");
        return;
      }

      if (!reviewText.trim()) {
        alert("Please write review");
        return;
      }

      await reviewsApi.create({
        productId: product.id,
        rating: userRating,
        body: reviewText,
      });

      alert("Review submitted!");

      setReviewText("");
      setUserRating(0);
    } catch (error) {
      console.error(error);
    }
  };
  const specs = [
    { label: "Material", value: product.material },
    { label: "Length", value: product.length || product.capSize },
    { label: "Density", value: product.density },
    { label: "Texture", value: product.texture },
    { label: "Colour", value: product.color },
    { label: "SKU", value: product.sku },
  ].filter((spec) => spec.value);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const iconBtn =
    "w-12 h-12 shrink-0 inline-flex items-center justify-center rounded-full border transition-colors";

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container-custom pt-6 pb-4">
        <nav aria-label="Breadcrumb" className="text-[0.9375rem] text-ink-muted">
          <ol className="flex items-center gap-2 min-w-0">
            <li className="shrink-0">
              <Link href="/" className="hover:text-ink hover:underline underline-offset-4 rounded-sm">
                Home
              </Link>
            </li>
            <li aria-hidden className="shrink-0"><ChevronRight className="w-3.5 h-3.5" /></li>
            <li className="shrink-0">
              <Link
                href={`/${product.gender.toLowerCase()}`}
                className="hover:text-ink hover:underline underline-offset-4 rounded-sm"
              >
                {product.gender === "WOMEN" ? "Women's wigs" : "Men's hair systems"}
              </Link>
            </li>
            <li aria-hidden className="shrink-0"><ChevronRight className="w-3.5 h-3.5" /></li>
            <li aria-current="page" className="text-ink truncate min-w-0">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="container-custom pb-20">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 xl:gap-16">
          {/* Pictures */}
          <div className="space-y-4 lg:sticky lg:top-24 self-start">
            <div role="group" aria-label="Picture view" className="inline-flex border border-rule rounded-full overflow-hidden bg-surface">
              <button
                type="button"
                onClick={() => setViewMode("gallery")}
                aria-pressed={viewMode === "gallery"}
                className={cn(
                  "min-h-[44px] px-5 text-[0.9375rem] transition-colors",
                  viewMode === "gallery" ? "bg-ink text-paper" : "text-ink-muted hover:text-ink",
                )}
              >
                Gallery
              </button>
              <button
                type="button"
                onClick={() => setViewMode("360")}
                aria-pressed={viewMode === "360"}
                className={cn(
                  "min-h-[44px] px-5 text-[0.9375rem] transition-colors inline-flex items-center gap-1.5",
                  viewMode === "360" ? "bg-ink text-paper" : "text-ink-muted hover:text-ink",
                )}
              >
                <RotateCcw className="w-4 h-4" aria-hidden /> 360° view
              </button>
            </div>

            {viewMode === "360" ? (
              <Product360View
                images={
                  sortedImages.length > 0
                    ? sortedImages
                    : [
                        {
                          id: "fallback",
                          url: primaryImage?.url || "",
                          angle: 0,
                          isPrimary: true,
                        },
                      ]
                }
                productName={product.name}
              />
            ) : (
              <div className="space-y-3">
                <div data-slot="product-photo" className="relative rounded-card overflow-hidden bg-paper-2 w-full aspect-product">
                  {sortedImages[activeImage] && (
                    <Image
                      src={sortedImages[activeImage].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  )}
                  <div className="absolute top-4 left-4 flex flex-col items-start gap-1.5">
                    {discountPct > 0 && <span className="badge badge-sale">-{discountPct}%</span>}
                    {product.isNewArrival && <span className="badge badge-new">New arrival</span>}
                  </div>
                </div>
                {sortedImages.length > 1 && (
                  <ul className="flex gap-2 overflow-x-auto scrollbar-hide" aria-label="More pictures">
                    {sortedImages.map((img, idx) => (
                      <li key={img.id} className="shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveImage(idx)}
                          aria-label={`Show picture ${idx + 1}`}
                          aria-current={activeImage === idx}
                          className={cn(
                            "relative block w-16 h-20 md:w-20 md:h-24 rounded-[10px] overflow-hidden border-2 transition-colors",
                            activeImage === idx ? "border-accent" : "border-transparent hover:border-rule",
                          )}
                        >
                          <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Try-on */}
            <Link
              href={`/try-on?wig=${product.id}`}
              className="flex items-center justify-center gap-2 min-h-[52px] bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-800 font-semibold rounded-full px-5 transition-colors"
            >
              <Zap className="w-4 h-4" aria-hidden /> Try this wig on virtually, free
            </Link>
          </div>

          {/* What it is, what it costs, how to buy it */}
          <div>
            <p className="text-[0.9375rem] text-ink-muted">
              {product.category?.name || (product.gender === "WOMEN" ? "For women" : "For men")}
            </p>

            <h1 className="font-display text-[length:var(--text-2xl)] leading-[1.15] tracking-[var(--tracking-display)] text-ink mt-2 [overflow-wrap:break-word]">
              {product.name}
            </h1>

            {(product.isBestSeller || product.isNewArrival) && (
              <div className="flex items-center gap-2 mt-4">
                {product.isBestSeller && <span className="badge badge-best">Best seller</span>}
                {product.isNewArrival && <span className="badge badge-new">New arrival</span>}
              </div>
            )}

            <div className="flex items-center gap-4 mt-4">
              <StarRating rating={product.rating} count={product.reviewCount} size="md" />
              <Link
                href="#reviews"
                onClick={() => setSelectedTab("Reviews")}
                className="link-quiet text-[0.9375rem]"
              >
                Read reviews
              </Link>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap mt-6 pt-6 border-t border-rule">
              <span className="font-display text-[length:var(--text-3xl)] leading-none text-ink">
                {formatPrice(product.salePrice || product.basePrice)}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-lg text-ink-muted line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                  <span className="font-semibold text-coral-600">{discountPct}% off</span>
                </>
              )}
            </div>

            {/* Stock */}
            <p className="flex items-center gap-2 mt-3 text-[0.9375rem]">
              {product.stock > 0 ? (
                <>
                  <Check className="w-4 h-4 text-accent" aria-hidden />
                  <span className="text-ink-soft font-medium">In stock</span>
                  {product.stock <= 10 && (
                    <span className="text-coral-600 font-semibold ml-2">Only {product.stock} left</span>
                  )}
                </>
              ) : (
                <span className="text-coral-600 font-semibold">Out of stock</span>
              )}
            </p>

            {/* Quantity and actions */}
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <div role="group" aria-label="Quantity" className="flex items-center border border-rule rounded-full bg-surface">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="One fewer"
                  className="w-12 h-12 inline-flex items-center justify-center rounded-full text-ink-soft hover:text-ink hover:bg-paper-2 transition-colors"
                >
                  <Minus className="w-4 h-4" aria-hidden />
                </button>
                <span className="min-w-[2.5rem] text-center font-semibold text-ink" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  aria-label="One more"
                  className="w-12 h-12 inline-flex items-center justify-center rounded-full text-ink-soft hover:text-ink hover:bg-paper-2 transition-colors"
                >
                  <Plus className="w-4 h-4" aria-hidden />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                aria-busy={addingToCart}
                className="flex-1 min-w-[12rem] btn-primary min-h-[48px] inline-flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" aria-hidden />
                {product.stock === 0 ? "Out of stock" : addingToCart ? "Adding…" : "Add to bag"}
              </button>
              <button
                type="button"
                onClick={handleWishlist}
                aria-pressed={isWishlisted}
                aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
                className={cn(
                  iconBtn,
                  isWishlisted
                    ? "border-coral-600 bg-coral-600 text-white"
                    : "border-rule bg-surface text-ink-soft hover:border-coral-600 hover:text-coral-600",
                )}
              >
                <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() =>
                  navigator.share?.({
                    title: product.name,
                    url: window.location.href,
                  })
                }
                aria-label="Share"
                className={cn(iconBtn, "border-rule bg-surface text-ink-soft hover:border-ink-muted hover:text-ink")}
              >
                <Share2 className="w-5 h-5" aria-hidden />
              </button>
            </div>

            {/* Specs, as a ledger */}
            {specs.length > 0 && (
              <dl className="grid grid-cols-2 mt-8 border-t border-rule">
                {specs.map(({ label, value }) => (
                  <div key={label} className="py-3 border-b border-rule pr-4">
                    <dt className="text-[0.875rem] text-ink-muted">{label}</dt>
                    <dd className="text-[0.9375rem] font-semibold text-ink mt-0.5 break-words">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Delivery and returns */}
            {product.features && product.features.length > 0 && (
              <ul className="mt-6 space-y-3">
                {product.features.map((feature, index) => {
                  const Icon = [Truck, RotateCcw, Shield][index] || Shield;
                  return (
                    <li key={feature.id} className="flex items-start gap-3">
                      <Icon className="w-5 h-5 mt-0.5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
                      <p className="text-[0.9375rem]">
                        <span className="font-semibold text-ink">{feature.title}</span>
                        {feature.subtitle && <span className="text-ink-muted">, {feature.subtitle}</span>}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}

            {product.highlights && product.highlights.length > 0 && (
              <div className="flex items-start gap-3 mt-6 pt-6 border-t border-rule">
                <Award className="w-5 h-5 mt-0.5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
                <ul className="flex flex-wrap gap-2">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="text-[0.875rem] text-ink-soft bg-paper-2 rounded-full px-3 py-1">
                      {h.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Details tabs */}
        <section className="mt-20" id="details" aria-label="Product details">
          <div role="tablist" aria-label="Product details" className="flex gap-1 border-b border-rule overflow-x-auto scrollbar-hide">
            {PRODUCT_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                id={`tab-${tab}`}
                aria-selected={selectedTab === tab}
                aria-controls="product-tabpanel"
                onClick={() => setSelectedTab(tab)}
                className={cn(
                  "min-h-[52px] px-5 text-[0.9375rem] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
                  selectedTab === tab
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-muted hover:text-ink",
                )}
              >
                {tab === "Care Guide" ? "Care guide" : tab}
              </button>
            ))}
          </div>

          <div id="product-tabpanel" role="tabpanel" aria-labelledby={`tab-${selectedTab}`} className="py-10">
            {selectedTab === "Description" && (
              <div className="grid lg:grid-cols-12 gap-10">
                <p className="lg:col-span-7 text-[1.0625rem] text-ink-soft leading-relaxed max-w-[64ch] whitespace-pre-line">
                  {product.description}
                </p>
                <div className="lg:col-span-5 space-y-8">
                  {product.includedItems && product.includedItems.length > 0 && (
                    <div>
                      <h2 className="font-display text-[length:var(--text-xl)] text-ink mb-3">What&apos;s included</h2>
                      <ul className="space-y-2">
                        {product.includedItems.map((item) => (
                          <li key={item.id} className="flex items-start gap-2 text-ink-soft">
                            <Check className="w-4 h-4 mt-1 text-accent shrink-0" aria-hidden />
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <h2 className="font-display text-[length:var(--text-xl)] text-ink mb-3">Tags</h2>
                      <ul className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <li key={tag} className="bg-paper-2 text-ink-soft text-[0.875rem] px-3 py-1 rounded-full">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === "Care Guide" && (
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                {product.careGuides?.map((guide) => (
                  <div key={guide.id}>
                    <h2 className="font-display text-[length:var(--text-xl)] text-ink pb-3 mb-4 border-b border-rule">
                      {guide.title}
                    </h2>
                    <ol className="space-y-3 list-decimal pl-5 marker:text-ink-muted">
                      {guide.steps.split("|").map((step: string, index: number) => (
                        <li key={index} className="text-ink-soft pl-1">
                          {step.trim()}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === "Reviews" && (
              <div id="reviews">
                <div className="grid md:grid-cols-12 gap-8 mb-10 pb-10 border-b border-rule">
                  <div className="md:col-span-4">
                    <p className="font-display text-[length:var(--text-display-s)] leading-none text-ink">
                      {averageRating}
                    </p>
                    <div className="mt-3">
                      <StarRating rating={product.rating} size="lg" />
                    </div>
                    <p className="text-[0.9375rem] text-ink-muted mt-2">
                      {reviews.length} verified {reviews.length === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                  <ul className="md:col-span-8 space-y-2.5 self-center" aria-label="Ratings by star">
                    {ratingBreakdown.map(({ star, pct }) => (
                      <li key={star} className="flex items-center gap-3">
                        <span className="text-[0.875rem] text-ink-soft w-12 shrink-0">{star} star</span>
                        <div className="flex-1 h-2 bg-paper-3 rounded-full overflow-hidden" aria-hidden>
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[0.875rem] text-ink-muted w-10 text-right tabular-nums">{pct}%</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {reviews.length === 0 && (
                  <p className="text-ink-muted">No reviews yet. Be the first to tell others how it wears.</p>
                )}

                <ul className="divide-y divide-rule">
                  {reviews.map((review) => (
                    <li key={review.id} className="py-6 first:pt-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-800 font-semibold text-[0.875rem]"
                            aria-hidden
                          >
                            {review.user.firstName[0]}
                            {review.user.lastName[0]}
                          </span>
                          <div>
                            <p className="font-semibold text-ink text-[0.9375rem]">
                              {review.user.firstName} {review.user.lastName}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <StarRating rating={review.rating} size="sm" />
                              {review.isVerified && (
                                <span className="text-[0.8125rem] text-accent inline-flex items-center gap-1">
                                  <Check className="w-3 h-3" aria-hidden /> Verified purchase
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-[0.8125rem] text-ink-muted shrink-0">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                      {review.title && <p className="font-semibold text-ink mb-1">{review.title}</p>}
                      <p className="text-ink-soft leading-relaxed max-w-[68ch]">{review.body}</p>
                      <div className="flex items-center gap-1 mt-3 text-[0.8125rem]">
                        <span className="text-ink-muted mr-2">Helpful? ({review.helpfulCount})</span>
                        <button type="button" className="min-h-[36px] px-3 rounded-full inline-flex items-center gap-1.5 text-ink-soft hover:text-ink hover:bg-paper-2 transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" aria-hidden /> Yes
                        </button>
                        <button type="button" className="min-h-[36px] px-3 rounded-full inline-flex items-center gap-1.5 text-ink-muted hover:text-ink hover:bg-paper-2 transition-colors">
                          <ThumbsDown className="w-3.5 h-3.5" aria-hidden /> No
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {isAuthenticated && (
                  <div className="mt-10 max-w-2xl bg-paper-2 rounded-card p-6 md:p-8">
                    <h2 className="font-display text-[length:var(--text-xl)] text-ink mb-4">Write a review</h2>
                    <div className="mb-4">
                      <p className="text-[0.9375rem] text-ink-soft mb-2" id="your-rating">Your rating</p>
                      <StarRating rating={userRating} size="lg" interactive onRate={setUserRating} />
                    </div>
                    <label htmlFor="review-text" className="block text-[0.9375rem] text-ink-soft mb-2">Your review</label>
                    <textarea
                      id="review-text"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="input-field resize-none h-28 mb-4"
                    />
                    <button type="button" onClick={handleSubmitReview} className="btn-primary">
                      Submit review
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedTab === "FAQ" && (
              <dl className="max-w-3xl divide-y divide-rule border-y border-rule">
                {product.faqs?.map((faq) => (
                  <div key={faq.id} className="py-5">
                    <dt className="font-semibold text-ink flex items-start gap-2">
                      <Info className="w-4 h-4 text-accent shrink-0 mt-1" aria-hidden />
                      {faq.question}
                    </dt>
                    <dd className="text-ink-soft leading-relaxed pl-6 mt-2">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-rule" aria-labelledby="related-heading">
            <h2 id="related-heading" className="font-display text-[length:var(--text-2xl)] text-ink mb-6">
              You may also like
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
