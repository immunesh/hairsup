'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';
import FilterSidebar from '@/components/ui/FilterSidebar';
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
  { label: 'Most reviewed', value: 'reviews-desc' },
];

export default function AllProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <AllProductsContent />
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

function AllProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Record<string, string | string[] | number | boolean | undefined>>(() => {
    const category = searchParams.get('category');
    return category ? { category } : {};
  });
  const [sort, setSort] = useState('createdAt-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeGender, setActiveGender] = useState<'ALL' | 'WOMEN' | 'MEN'>('ALL');
  const [loading, setLoading] = useState(true);
const loadProducts = async () => {
  try {
    const { data } = await productsApi.getAll();

let filtered: Product[] = data.data || [];

// Gender filter
if (activeGender !== "ALL") {
  filtered = filtered.filter(
    (p: Product) =>
      String(p.gender || "")
        .trim()
        .toUpperCase() === activeGender
  );
}

// Category filter
if (filters.category) {
  filtered = filtered.filter(
    (p: Product) => p.category?.slug === filters.category
  );
}

// Material filter
if (filters.material) {
  const materialMap: Record<string, string> = {
    "human-hair": "human hair",
    synthetic: "synthetic",
    blend: "blend",
  };

 const target =
  materialMap[String(filters.material)];

if (target) {
  filtered = filtered.filter((p) =>
    String(p.material || "")
      .toLowerCase()
      .includes(target)
  );
}
}

// Texture filter
if (filters.texture) {
  const selected = Array.isArray(filters.texture)
    ? filters.texture
    : [filters.texture];

  filtered = filtered.filter((p) =>
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
// Length filter
if (filters.length) {
  filtered = filtered.filter((p: Product) => {
    const inches = parseInt(
      String(p.length || "0")
    );

    switch (filters.length) {
      case "short":
        return inches <= 12;

      case "medium":
        return inches > 12 && inches <= 18;

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

  filtered = filtered.filter((p) => {
    const price =
      p.salePrice || p.basePrice;

    return (
      price >= min &&
      price <= max
    );
  });
}
if (filters.color) {
  filtered = filtered.filter((p) =>
    String(p.color || "")
      .toLowerCase()
      .includes(
        String(filters.color)
          .toLowerCase()
      )
  );
}

if (filters.collection) {
  const selected = Array.isArray(
    filters.collection
  )
    ? filters.collection
    : [filters.collection];

  filtered = filtered.filter((p) => {
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


    setProducts(filtered);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  loadProducts();
}, [activeGender, filters]);

const handleFilterChange = (
  key: string,
  value: string | string[] | undefined
) => {


  setFilters((prev) => ({
    ...prev,
    [key]: value,
  }));
};


  const clearFilters = () => { setFilters({}); };
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
      (a, b) =>
      (b.rating || 0) - (a.rating || 0)
    );
    break;

  case "reviews-desc":
    sortedProducts.sort(
      (a, b) =>
       (b.reviewCount || 0) - (a.reviewCount || 0)
    );
    break;

  default:
    sortedProducts.sort(
      (a, b) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    );
}

  const GENDER_TABS = [
    { label: 'All wigs', value: 'ALL' },
    { label: "Women's wigs", value: 'WOMEN' },
    { label: "Men's hair systems", value: 'MEN' },
  ] as const;

  return (
    <div>
      <CollectionHeader
        crumb="All wigs"
        title="All wigs and hair systems"
        lead="Premium quality wigs for men and women"
      />

      <SubcatBar label="Shop by" items={GENDER_TABS} active={activeGender} onSelect={setActiveGender} variant="tab" />

      <div className="container-custom py-10">
        <div className="flex gap-10">
          <aside className="hidden lg:block w-64 shrink-0" aria-label="Filters">
            <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
          </aside>

          <div className="flex-1 min-w-0">
            <ListingToolbar
              count={products.length}
              noun={products.length === 1 ? 'style' : 'styles'}
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
              <EmptyState
                title="No products found"
                action={<button type="button" onClick={clearFilters} className="btn-primary">Clear filters</button>}
              />
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
