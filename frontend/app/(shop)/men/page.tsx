'use client';

import { useState, useEffect } from 'react';
import { Microscope, Droplets, Palette, HeartHandshake } from 'lucide-react';
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
];

const SUBCATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Hair Systems', value: 'hair-system' },
  { label: 'Toupees', value: 'toupee' },
  { label: 'Full Cap', value: 'full-cap' },
  { label: 'Crown Cover', value: 'crown' },
  { label: 'Sports Active', value: 'sports' },
  { label: 'Human Hair', value: 'human-hair' },
];

const WHY_HAIRSUP_MEN = [
  { Icon: Microscope, title: 'Swiss lace', desc: 'Ultra-thin lace that disappears on your scalp' },
  { Icon: Droplets, title: 'Sweat and water resistant', desc: 'Live an active life without worry' },
  { Icon: Palette, title: 'Custom colour matching', desc: 'Match your exact natural hair colour' },
  { Icon: HeartHandshake, title: 'Professional fitting', desc: 'Expert stylists at 50+ stores nationwide' },
];

export default function MenPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Record<string, string | string[] | number | boolean | undefined>>({});
  const [sort, setSort] = useState('createdAt-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeSubcat, setActiveSubcat] = useState('');
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const loadProducts = async () => {
    try {
      const res = await productsApi.getAll();

      let list = res.data.data || [];


      // MEN PRODUCTS
      list = list.filter(
        (p: any) =>
          String(p.gender || "").toUpperCase() === "MEN"
      );

      // SUB CATEGORY FILTERS
    // SUB CATEGORY FILTERS
if (activeSubcat === "human-hair") {
  list = list.filter((p: any) =>
    String(p.material || "")
      .toLowerCase()
      .includes("human")
  );
}

if (activeSubcat === "hair-system") {
  list = list.filter(
    (p: any) =>
      String(p.name || "")
        .toLowerCase()
        .includes("system") ||
      String(p.description || "")
        .toLowerCase()
        .includes("system")
  );
}

if (activeSubcat === "toupee") {
  list = list.filter((p: any) =>
    String(p.name || "")
      .toLowerCase()
      .includes("toupee")
  );
}

if (activeSubcat === "full-cap") {
  list = list.filter((p: any) =>
    String(p.name || "")
      .toLowerCase()
      .includes("full")
  );
}

if (activeSubcat === "crown") {
  list = list.filter((p: any) =>
    String(p.name || "")
      .toLowerCase()
      .includes("crown")
  );
}

// PRICE FILTER
if (filters.price) {
  const [min, max] = String(filters.price)
    .split("-")
    .map(Number);

  list = list.filter((p: any) => {
    const price = p.salePrice || p.basePrice;
    return price >= min && price <= max;
  });
}

// MATERIAL FILTER
if (filters.material) {
  const material = String(filters.material);

  if (material === "human-hair") {
    list = list.filter((p: any) =>
      String(p.material || "")
        .toLowerCase()
        .includes("human")
    );
  }

  if (material === "synthetic") {
    list = list.filter((p: any) =>
      String(p.material || "")
        .toLowerCase()
        .includes("synthetic")
    );
  }

  if (material === "blend") {
    list = list.filter((p: any) =>
      String(p.material || "")
        .toLowerCase()
        .includes("blend")
    );
  }
}

// TEXTURE FILTER
if (filters.texture) {
  const textures = Array.isArray(filters.texture)
    ? filters.texture
    : [filters.texture];

  list = list.filter((p: any) =>
    textures.some((t) =>
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
  list = list.filter((p: any) => {
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
// COLLECTION FILTER
if (filters.collection) {
  const collections = Array.isArray(filters.collection)
    ? filters.collection
    : [filters.collection];

  list = list.filter((p: any) => {
    if (collections.includes("featured") && p.isFeatured)
      return true;

    if (collections.includes("best") && p.isBestSeller)
      return true;

    if (collections.includes("new") && p.isNewArrival)
      return true;

    if (collections.includes("sale") && p.salePrice)
      return true;

    return false;
  });
} 

if (sort === "price-asc") {
  list.sort(
    (a: any, b: any) =>
      (a.salePrice || a.basePrice) -
      (b.salePrice || b.basePrice)
  );
}

if (sort === "price-desc") {
  list.sort(
    (a: any, b: any) =>
      (b.salePrice || b.basePrice) -
      (a.salePrice || a.basePrice)
  );
}

if (sort === "rating-desc") {
  list.sort(
    (a: any, b: any) =>
      (b.rating || 0) -
      (a.rating || 0)
  );
}
      setProducts(list);
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  loadProducts();
}, [activeSubcat, filters, sort]);

  const handleFilterChange = (key: string, value: string | string[] | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => { setFilters({}); setActiveSubcat(''); };
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div>
      <CollectionHeader
        crumb="Men's hair systems"
        title="Men's hair systems"
        lead="Advanced hair systems engineered for discretion, comfort, and natural appearance. Designed for modern men who refuse to compromise."
        note="Swiss lace and 100% human hair, undetectable, in 80+ styles."
        image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1400&q=80"
        imageAlt="A man with a short, natural hairline"
        slot="men-header"
      />

      {/* What the systems are made of: a quiet ledger between hairlines */}
      <section aria-label="Why Glamour Hair Studios for men" className="border-b border-rule bg-paper-2">
        <ul className="container-custom grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_HAIRSUP_MEN.map(({ Icon, title, desc }, i) => (
            <li
              key={title}
              className={`flex items-start gap-3 py-6 pr-4 border-rule ${i > 0 ? 'border-t sm:border-t-0' : ''} ${i % 2 === 1 ? 'sm:pl-6 sm:border-l' : ''} ${i === 2 ? 'sm:border-t lg:border-t-0 lg:pl-6 lg:border-l' : ''} ${i === 3 ? 'sm:border-t lg:border-t-0' : ''}`}
            >
              <Icon className="w-5 h-5 mt-0.5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
              <div>
                <p className="font-semibold text-ink text-[0.9375rem]">{title}</p>
                <p className="text-[0.875rem] text-ink-muted mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <SubcatBar label="Men's styles" items={SUBCATEGORIES} active={activeSubcat} onSelect={setActiveSubcat} />

      <div className="container-custom py-10">
        <div className="flex gap-10">
          <aside className="hidden lg:block w-64 shrink-0" aria-label="Filters">
            <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
          </aside>

          <div className="flex-1 min-w-0">
            <ListingToolbar
              count={products.length}
              noun="men's hair systems"
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
              <GridSkeleton n={6} />
            ) : products.length === 0 ? (
              <EmptyState action={<button type="button" onClick={clearFilters} className="btn-primary">Clear filters</button>} />
            ) : (
              <ProductGrid viewMode={viewMode} wide={false}>
                {products.map((product) => (
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
