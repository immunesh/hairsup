'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';
import FilterSidebar from '@/components/ui/FilterSidebar';
import { DEMO_PRODUCTS } from '@/lib/utils';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import {
  CollectionHeader, SubcatBar, ListingToolbar, ActiveFilters, ProductGrid, GridSkeleton, EmptyState, FilterDrawer,
} from '@/components/shop/Listing';

const SORT_OPTIONS = [
  { label: 'Newest first', value: 'createdAt-desc' },
  { label: 'Price, low to high', value: 'price-asc' },
  { label: 'Price, high to low', value: 'price-desc' },
  { label: 'Best rated', value: 'rating-desc' },
  { label: 'Most popular', value: 'reviews-desc' },
];

const SUBCATEGORIES = [
  { label: 'All', value: '', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&q=80' },
  { label: 'Human Hair', value: 'human-hair', image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=200&q=80' },
  { label: 'Synthetic', value: 'synthetic', image: 'https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=200&q=80' },
  { label: 'Lace Front', value: 'lace-front', image: 'https://images.unsplash.com/photo-1519699047748-de8e44489ece?w=200&q=80' },
  { label: 'Curly', value: 'curly', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80' },
  { label: 'Straight', value: 'straight', image: 'https://images.unsplash.com/photo-1571512599285-9494e11d9e72?w=200&q=80' },
];

export default function WomenPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <WomenContent />
    </Suspense>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="container-custom py-8">
      <GridSkeleton />
    </div>
  );
}

function WomenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Record<string, string | string[] | number | boolean | undefined>>({});
  const [sort, setSort] = useState('createdAt-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeSubcat, setActiveSubcat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await productsApi.getAll();
        let list = (res.data.data || []) as Product[];
list = list.filter((p) => {
  const gender =
    String(p.gender || "")
      .trim()
      .toUpperCase();

  const category =
    String(p.category?.name || "")
      .toLowerCase();

  return (
    gender === "WOMEN" ||
    category.includes("women")
  );
});
     // filter women FIRST
list = list.filter(
  (p) =>
    String(p.gender || "")
      .trim()
      .toUpperCase() === "WOMEN"
);


        // apply active subcategory heuristics
        if (activeSubcat) {
          const val = activeSubcat;
          if (val === 'human-hair') list = list.filter((p) => String(p.material || '').toLowerCase().includes('human'));
          else if (val === 'synthetic') list = list.filter((p) => String(p.material || '').toLowerCase().includes('synthetic'));
          else if (val === 'lace-front') list = list.filter((p) => String(p.name || '').toLowerCase().includes('lace') || String(p.description || '').toLowerCase().includes('lace'));
          else if (val === 'curly') list = list.filter((p) => String(p.texture || '').toLowerCase().includes('curly'));
          else if (val === 'straight') list = list.filter((p) => String(p.texture || '').toLowerCase().includes('straight'));
        }
  if (filters.material) {
  const materialMap: Record<string, string> = {
    "human-hair": "human hair",
    "synthetic": "synthetic",
    "blend": "blend",
  };

  const target =
    materialMap[String(filters.material)];

  list = list.filter((p) =>
    String(p.material || "")
      .toLowerCase()
      .includes(target)
  );
}

if (filters.texture) {
  const selected = Array.isArray(filters.texture)
    ? filters.texture
    : [filters.texture];

  list = list.filter((p) =>
    selected.some((t) =>
      String(p.texture || "")
        .toLowerCase()
        .includes(
          String(t)
            .replace("-", " ")
            .toLowerCase()
        )
    )
  );
}
if (filters.length) {
  list = list.filter((p) => {
    const inches = parseInt(
      String(p.length || "").replace(/\D/g, "")
    );

    if (isNaN(inches)) return false;

    switch (filters.length) {
      case "short":
        return inches < 12;

      case "medium":
        return inches >= 12 && inches <= 18;

      case "long":
        return inches > 18 && inches <= 24;

      case "extra-long":
        return inches > 24;

      default:
        return true;
    }
  });
}
if (filters.price) {
  const [min, max] = String(filters.price)
    .split("-")
    .map(Number);

  list = list.filter((p) => {
    const price =
      p.salePrice || p.basePrice;

    return price >= min && price <= max;
  });
}
if (filters.collection) {
  const selected = Array.isArray(filters.collection)
    ? filters.collection
    : [filters.collection];

  list = list.filter((p) => {
    if (
      selected.includes("featured") &&
      p.isFeatured
    )
      return true;

    if (
      selected.includes("best") &&
      p.isBestSeller
    )
      return true;

    if (
      selected.includes("new") &&
      p.isNewArrival
    )
      return true;

    if (
      selected.includes("sale") &&
      p.salePrice
    )
      return true;

    return false;
  });
}

if (filters.color) {
  list = list.filter((p) =>
    String(p.color || "")
      .toLowerCase()
      .includes(
        String(filters.color)
          .toLowerCase()
      )
  );
}

        if (mounted) setProducts(list);
      } catch (e) {
        // fallback to demo products
        const womenProducts = DEMO_PRODUCTS.filter((p) => p.gender === 'WOMEN') as unknown as Product[];
        if (mounted) setProducts(womenProducts);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
 }, [activeSubcat, filters]);

  const handleFilterChange = (key: string, value: string | string[] | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setActiveSubcat('');
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
let sortedProducts = [...products];

switch (sort) {
  case "price-asc":
    sortedProducts.sort(
      (a, b) =>
        (a.salePrice || a.basePrice) -
        (b.salePrice || b.basePrice)
    );
    break;

  case "price-desc":
    sortedProducts.sort(
      (a, b) =>
        (b.salePrice || b.basePrice) -
        (a.salePrice || a.basePrice)
    );
    break;

  case "rating-desc":
    sortedProducts.sort(
      (a, b) => b.rating - a.rating
    );
    break;

  case "reviews-desc":
    sortedProducts.sort(
      (a, b) => b.reviewCount - a.reviewCount
    );
    break;

  case "createdAt-desc":
  default:
    sortedProducts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
    break;
}
  return (
    <div>
      <CollectionHeader
        crumb="Women's wigs"
        title="Women's wigs"
        lead="Premium hair wigs for every occasion, from everyday elegance to glamorous special events."
        note="Human hair, synthetic and lace front, in 200+ styles."
        image="/women.avif"
        imageAlt="A woman with long, softly waved hair"
        slot="women-header"
      />

      <SubcatBar label="Women's styles" items={SUBCATEGORIES} active={activeSubcat} onSelect={setActiveSubcat} />

      <div className="container-custom py-10">
        <div className="flex gap-10">
          <aside className="hidden lg:block w-64 shrink-0" aria-label="Filters">
            <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
          </aside>

          <div className="flex-1 min-w-0">
            <ListingToolbar
              count={products.length}
              noun="women's wigs"
              loading={loading}
              sort={sort}
              onSort={setSort}
              sortOptions={SORT_OPTIONS}
              viewMode={viewMode}
              onViewMode={setViewMode}
              onOpenFilters={() => setShowFilters(true)}
              activeFilterCount={activeFilterCount}
            />

            <ActiveFilters filters={filters} onRemove={(k) => handleFilterChange(k, undefined)} onClear={clearFilters} />

            {loading ? (
              <GridSkeleton />
            ) : products.length === 0 ? (
              <EmptyState action={<button type="button" onClick={clearFilters} className="btn-primary">Clear filters</button>} />
            ) : (
              <ProductGrid viewMode={viewMode}>
                {sortedProducts.map((product) => (
                  <li key={product.id}><ProductCard product={product} /></li>
                ))}
              </ProductGrid>
            )}
          </div>
        </div>
      </div>

      <FilterDrawer open={showFilters} onClose={() => setShowFilters(false)}>
        <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
      </FilterDrawer>
    </div>
  );
}
