'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Grid, List, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import FilterSidebar from '@/components/ui/FilterSidebar';
import { DEMO_PRODUCTS } from '@/lib/utils';
import { Product } from '@/types';
import Link from 'next/link';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Rating', value: 'rating-desc' },
  { label: 'Most Reviewed', value: 'reviews-desc' },
];

export default function AllProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Record<string, string | string[] | number | boolean | undefined>>({});
  const [sort, setSort] = useState('createdAt-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeGender, setActiveGender] = useState<'ALL' | 'WOMEN' | 'MEN'>('ALL');

  useEffect(() => {
    let filtered = [...DEMO_PRODUCTS] as unknown as Product[];
    const newArrival = searchParams.get('newArrival');
    const bestSeller = searchParams.get('bestSeller');
    const featured = searchParams.get('featured');
    const gender = searchParams.get('gender');

    if (newArrival === 'true') filtered = filtered.filter((p) => p.isNewArrival);
    if (bestSeller === 'true') filtered = filtered.filter((p) => p.isBestSeller);
    if (featured === 'true') filtered = filtered.filter((p) => p.isFeatured);
    if (gender) {
      filtered = filtered.filter((p) => p.gender === gender.toUpperCase());
      setActiveGender(gender.toUpperCase() as 'WOMEN' | 'MEN');
    }
    if (activeGender !== 'ALL') filtered = filtered.filter((p) => p.gender === activeGender);

    setProducts(filtered);
  }, [searchParams, activeGender]);

  const handleFilterChange = (key: string, value: string | string[] | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const clearFilters = () => { setFilters({}); };
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const GENDER_TABS = [
    { label: 'All Wigs', value: 'ALL' },
    { label: "Women's Wigs", value: 'WOMEN' },
    { label: "Men's Hair Systems", value: 'MEN' },
  ] as const;

  return (
    <div>
      {/* Page header */}
      <div className="page-hero py-10 text-center">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">All Wigs & Hair Systems</h1>
          <p className="text-white/70">Premium quality wigs for men and women</p>
        </div>
      </div>

      {/* Gender tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="container-custom flex gap-1 py-1 overflow-x-auto scrollbar-hide">
          {GENDER_TABS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveGender(value)}
              className={`px-5 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${activeGender === value ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <p className="text-sm text-gray-500 mr-auto">
                <span className="font-semibold text-gray-900">{products.length}</span> products
              </p>
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
                {activeFilterCount > 0 && <span className="bg-brand-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>}
              </button>
              <div className="relative">
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none bg-white cursor-pointer">
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
              </div>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}><Grid className="w-4 h-4" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}><List className="w-4 h-4" /></button>
              </div>
            </div>

            <div className={`grid gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>

            {products.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showFilters && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
            </div>
            <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
            <button onClick={() => setShowFilters(false)} className="btn-primary w-full mt-4">Apply Filters</button>
          </div>
        </>
      )}
    </div>
  );
}
