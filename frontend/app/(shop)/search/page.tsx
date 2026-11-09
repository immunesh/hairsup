'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { ProductGrid, GridSkeleton, EmptyState } from '@/components/shop/Listing';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ui/ProductCard';
import { DEMO_PRODUCTS } from '@/lib/utils';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';

const SUGGESTIONS = ['Lace Front', 'Human Hair', "Men's System", 'Curly Wig', 'Ombre', 'Body Wave', 'Synthetic', 'Short Bob', 'Afro', 'Straight'];

export default function SearchPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="container-custom py-8">
      <GridSkeleton n={4} />
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [localQuery, setLocalQuery] = useState(query);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLocalQuery(query);
    if (!query) { setResults([]); return; }
    let mounted = true;
    setLoading(true);
    const load = async () => {
      try {
        const res = await productsApi.getAll();
        const list = (res.data.data || []) as Product[];
        const q = query.toLowerCase();
        const matched = list.filter((p) =>
          String(p.name || '').toLowerCase().includes(q) ||
          String(p.description || '').toLowerCase().includes(q) ||
          String(p.texture || '').toLowerCase().includes(q) ||
          String(p.material || '').toLowerCase().includes(q) ||
          (p.tags || []).some((t: string) => t.toLowerCase().includes(q))
        ) as unknown as Product[];
        if (mounted) setResults(matched);
      } catch (e) {
        // fallback to demo search
        const q = query.toLowerCase();
        const matched = DEMO_PRODUCTS.filter((p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.texture?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        ) as unknown as Product[];
        if (mounted) setResults(matched);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    const t = setTimeout(load, 200);
    return () => { mounted = false; clearTimeout(t); };
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`);
  };

  return (
    <div>
      <header className="border-b border-rule bg-paper">
        <div className="container-custom py-10 lg:py-14">
          <h1 className="font-display text-[length:var(--text-display-s)] leading-[1.02] tracking-[var(--tracking-display)] text-ink">
            {query ? <>Results for &ldquo;{query}&rdquo;</> : 'Search Glamour Hair Studios'}
          </h1>
          <p className="lead mt-3 max-w-[46ch]">Find the perfect wig or hair system for you</p>

          <form onSubmit={handleSearch} role="search" className="max-w-2xl mt-8">
            <label htmlFor="search-q" className="visually-hidden">Search wigs and hair systems</label>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-muted pointer-events-none" aria-hidden />
              <input
                id="search-q"
                type="search"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search for wigs, hair systems, styles..."
                className="w-full min-h-[56px] pl-14 pr-14 border border-rule hover:border-ink-muted focus:border-accent rounded-full text-base text-ink bg-surface outline-none focus-visible:outline-2 focus-visible:outline-accent transition-colors [&::-webkit-search-cancel-button]:hidden"
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={() => setLocalQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center rounded-full text-ink-muted hover:text-ink hover:bg-paper-2 transition-colors"
                >
                  <X className="w-5 h-5" aria-hidden />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-[0.875rem] text-ink-muted mr-1">Try</span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setLocalQuery(s); router.push(`/search?q=${encodeURIComponent(s)}`); }}
                  aria-pressed={query === s}
                  className={cn(
                    'min-h-[36px] px-3.5 rounded-full border text-[0.875rem] transition-colors',
                    query === s ? 'bg-ink text-paper border-ink' : 'bg-surface text-ink-soft border-rule hover:border-ink-muted hover:text-ink'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </form>
        </div>
      </header>

      <div className="container-custom py-10">
        {query && (
          <>
            <p className={`text-[0.9375rem] text-ink-muted mb-6 ${!loading && results.length === 0 ? 'visually-hidden' : ''}`} aria-live="polite">
              {loading ? 'Searching' : <><span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? 'result' : 'results'}</>}
            </p>

            {loading ? (
              <GridSkeleton n={4} />
            ) : results.length === 0 ? (
              <EmptyState
                title="No results found"
                body="Try different keywords or explore our categories."
                action={
                  <div className="flex gap-3 flex-wrap">
                    <button type="button" onClick={() => { setLocalQuery('Human Hair'); router.push('/search?q=Human+Hair'); }} className="btn-primary">Human hair wigs</button>
                    <button type="button" onClick={() => { setLocalQuery("Men's"); router.push('/search?q=Men'); }} className="btn-secondary">Men&apos;s hair systems</button>
                  </div>
                }
              />
            ) : (
              <ProductGrid viewMode="grid">
                {results.map((product) => (
                  <li key={product.id}><ProductCard product={product} /></li>
                ))}
              </ProductGrid>
            )}
          </>
        )}
      </div>
    </div>
  );
}
