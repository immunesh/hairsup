'use client';

// The pieces every product listing shares (shop, women, men, search):
// a collection header, a subcategory bar, the toolbar, the filter drawer,
// and honest loading and empty states.

import { useEffect, useRef, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, LayoutGrid, List, SearchX, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Collection header ─────────────────────────────────────────────── */

export function CollectionHeader({
  crumb,
  title,
  lead,
  note,
  image,
  imageAlt = '',
  slot,
}: {
  crumb?: string;
  title: string;
  lead: string;
  /** One quiet line under the lead: what the collection holds. */
  note?: string;
  image?: string;
  imageAlt?: string;
  slot?: string;
}) {
  return (
    <header className="border-b border-rule bg-paper">
      <div
        className={cn(
          'container-custom grid gap-8 py-10 lg:py-14 items-end',
          image ? 'lg:grid-cols-12' : ''
        )}
      >
        <div className={image ? 'lg:col-span-7' : 'max-w-3xl'}>
          {crumb && (
            <nav aria-label="Breadcrumb" className="mb-5 text-[0.9375rem] text-ink-muted">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="hover:text-ink underline-offset-4 hover:underline rounded-sm">Home</Link></li>
                <li aria-hidden className="text-rule">/</li>
                <li aria-current="page" className="text-ink">{crumb}</li>
              </ol>
            </nav>
          )}
          <h1 className="font-display text-[length:var(--text-display-s)] leading-[1.02] tracking-[var(--tracking-display)] text-ink">
            {title}
          </h1>
          <p className="lead mt-4 max-w-[46ch]">{lead}</p>
          {note && <p className="text-[0.9375rem] text-ink-muted mt-3">{note}</p>}
        </div>
        {image && (
          <div
            data-slot={slot}
            className="relative lg:col-span-5 h-56 sm:h-64 lg:h-72 rounded-card overflow-hidden bg-paper-3"
          >
            <Image src={image} alt={imageAlt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover object-[50%_25%]" />
          </div>
        )}
      </div>
    </header>
  );
}

/* ── Subcategory bar ───────────────────────────────────────────────── */

export function SubcatBar<T extends string>({
  label,
  items,
  active,
  onSelect,
  variant = 'pill',
}: {
  label: string;
  items: ReadonlyArray<{ label: string; value: T }>;
  active: T;
  onSelect: (v: T) => void;
  variant?: 'pill' | 'tab';
}) {
  return (
    <div className="bg-paper/95 backdrop-blur-sm border-b border-rule sticky top-16 lg:top-20 z-30">
      <div
        role="group"
        aria-label={label}
        className={cn(
          'container-custom flex items-center overflow-x-auto scrollbar-hide',
          variant === 'pill' ? 'gap-2 py-3' : 'gap-1'
        )}
      >
        {items.map((it) => {
          const on = active === it.value;
          return (
            <button
              key={it.value || 'all'}
              type="button"
              onClick={() => onSelect(it.value)}
              aria-pressed={on}
              className={cn(
                'shrink-0 whitespace-nowrap text-[0.9375rem] transition-colors',
                variant === 'pill'
                  ? cn(
                      'min-h-[44px] px-5 rounded-full border',
                      on ? 'bg-ink text-paper border-ink' : 'bg-surface text-ink-soft border-rule hover:border-ink-muted hover:text-ink'
                    )
                  : cn(
                      'min-h-[52px] px-4 border-b-2 font-medium',
                      on ? 'border-accent text-ink' : 'border-transparent text-ink-muted hover:text-ink'
                    )
              )}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Toolbar ───────────────────────────────────────────────────────── */

const ctl =
  'min-h-[44px] border border-field bg-surface rounded-full text-[0.9375rem] text-ink hover:border-ink-soft transition-colors';

export function ListingToolbar({
  count,
  noun,
  loading,
  sort,
  onSort,
  sortOptions,
  viewMode,
  onViewMode,
  onOpenFilters,
  activeFilterCount = 0,
}: {
  count: number;
  noun: string;
  loading?: boolean;
  sort: string;
  onSort: (v: string) => void;
  sortOptions: ReadonlyArray<{ label: string; value: string }>;
  viewMode: 'grid' | 'list';
  onViewMode: (v: 'grid' | 'list') => void;
  onOpenFilters: () => void;
  activeFilterCount?: number;
}) {
  return (
    <div className="flex items-center gap-3 mb-6 flex-wrap">
      <p className="text-[0.9375rem] text-ink-muted mr-auto" aria-live="polite">
        {loading ? 'Loading styles' : <><span className="font-semibold text-ink">{count}</span> {noun}</>}
      </p>

      <button type="button" onClick={onOpenFilters} className={cn(ctl, 'lg:hidden inline-flex items-center gap-2 px-4')}>
        <SlidersHorizontal className="w-4 h-4" aria-hidden />
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-accent text-accent-ink text-[12px] rounded-full min-w-5 h-5 px-1 inline-flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      <div className="relative">
        <label htmlFor="listing-sort" className="visually-hidden">Sort by</label>
        <select
          id="listing-sort"
          value={sort}
          onChange={(e) => onSort(e.target.value)}
          className={cn(ctl, 'appearance-none pl-4 pr-10 cursor-pointer')}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted" aria-hidden />
      </div>

      <div role="group" aria-label="Layout" className="hidden sm:flex border border-field rounded-full overflow-hidden bg-surface">
        {(['grid', 'list'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onViewMode(m)}
            aria-pressed={viewMode === m}
            aria-label={m === 'grid' ? 'Grid view' : 'List view'}
            className={cn(
              'w-11 h-11 inline-flex items-center justify-center transition-colors',
              viewMode === m ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'
            )}
          >
            {m === 'grid' ? <LayoutGrid className="w-4 h-4" aria-hidden /> : <List className="w-4 h-4" aria-hidden />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Active filter chips ───────────────────────────────────────────── */

export function ActiveFilters({
  filters,
  onRemove,
  onClear,
}: {
  filters: Record<string, unknown>;
  onRemove: (key: string) => void;
  onClear: () => void;
}) {
  const entries = Object.entries(filters).filter(([, v]) => (Array.isArray(v) ? v.length : v));
  if (!entries.length) return null;
  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {entries.map(([key, val]) => {
        const text = (Array.isArray(val) ? val.join(', ') : String(val)).replace(/-/g, ' ');
        return (
          <button
            key={key}
            type="button"
            onClick={() => onRemove(key)}
            aria-label={`Remove filter ${text}`}
            className="inline-flex items-center gap-1.5 min-h-[36px] pl-3 pr-2 rounded-full bg-brand-50 text-brand-800 border border-brand-200 text-[0.875rem] hover:border-brand-400 transition-colors"
          >
            {text}
            <X className="w-3.5 h-3.5" aria-hidden />
          </button>
        );
      })}
      <button type="button" onClick={onClear} className="link-quiet text-[0.875rem] ml-1">Clear all</button>
    </div>
  );
}

/* ── Grid, loading and empty ───────────────────────────────────────── */

export function ProductGrid({ viewMode, children, wide = true }: { viewMode: 'grid' | 'list'; children: ReactNode; wide?: boolean }) {
  return (
    <ul
      className={cn(
        'grid gap-4 md:gap-6',
        viewMode === 'grid' ? cn('grid-cols-2 md:grid-cols-3', wide && 'xl:grid-cols-4') : 'grid-cols-1 sm:grid-cols-2'
      )}
    >
      {children}
    </ul>
  );
}

export function GridSkeleton({ n = 8 }: { n?: number }) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <li key={i} className="motion-safe:animate-pulse">
          <div className="bg-paper-3 aspect-product rounded-card mb-3" />
          <div className="bg-paper-3 h-4 rounded mb-2" />
          <div className="bg-paper-3 h-4 w-2/3 rounded" />
        </li>
      ))}
    </ul>
  );
}

export function EmptyState({
  title = 'Nothing matches those filters',
  body = 'Loosen a filter or two, or start again from the full collection.',
  action,
}: {
  title?: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="pt-6 pb-20 max-w-md">
      <SearchX className="w-8 h-8 text-ink-muted mb-5" strokeWidth={1.5} aria-hidden />
      <h2 className="font-display text-[length:var(--text-2xl)] text-ink leading-tight">{title}</h2>
      <p className="text-ink-muted mt-2 mb-6">{body}</p>
      {action}
    </div>
  );
}

/* ── Filter drawer (phones) ────────────────────────────────────────── */

export function FilterDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-ink/50 z-50" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
        className="fixed bottom-0 inset-x-0 bg-paper rounded-t-[20px] z-50 max-h-[85vh] overflow-y-auto p-5 motion-safe:animate-slide-up"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="filter-drawer-title" className="font-display text-[length:var(--text-xl)] text-ink">Filters</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="w-11 h-11 -mr-2 inline-flex items-center justify-center rounded-full hover:bg-paper-2 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>
        {children}
        <button type="button" onClick={onClose} className="btn-primary w-full mt-4">Show results</button>
      </div>
    </>
  );
}

export const SORT_BASE = [
  { label: 'Newest first', value: 'createdAt-desc' },
  { label: 'Price, low to high', value: 'price-asc' },
  { label: 'Price, high to low', value: 'price-desc' },
  { label: 'Best rated', value: 'rating-desc' },
] as const;
