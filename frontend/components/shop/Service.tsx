// The pieces every service page shares (bonding, fixing, patch, weaving,
// extensions, replacement and the three wig pages). Server components: the
// FAQ opens with <details>, so nothing here needs scripting.

import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, ChevronRight, Plus, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Crumb = { label: string; href: string };

const h2 = 'font-display text-[length:var(--text-3xl)] leading-[1.08] text-ink [overflow-wrap:break-word] min-w-0';

/* ── Hero ──────────────────────────────────────────────────────────── */

export const headingClass = h2;

export function Crumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-[0.9375rem] text-ink-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.label} className="flex items-center gap-2 min-w-0">
              {last ? (
                <span aria-current="page" className="text-ink">{c.label}</span>
              ) : (
                <>
                  <Link href={c.href} className="hover:text-ink hover:underline underline-offset-4 rounded-sm">{c.label}</Link>
                  <span aria-hidden className="text-rule">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** A page's first screen: crumbs, a display head, one sentence, actions, and an optional picture. */
export function PageHero({
  crumbs,
  title,
  lead,
  actions,
  image,
  imageAlt = '',
  slot,
  children,
}: {
  crumbs?: Crumb[];
  title: string;
  lead?: ReactNode;
  actions?: ReactNode;
  image?: string;
  imageAlt?: string;
  slot?: string;
  children?: ReactNode;
}) {
  return (
    <header className="bg-paper border-b border-rule">
      <div className={cn('container-custom grid gap-10 py-10 lg:py-16', image && 'lg:grid-cols-12 lg:items-center')}>
        <div className={image ? 'lg:col-span-6 min-w-0' : 'max-w-3xl min-w-0'}>
          {crumbs && <Crumbs crumbs={crumbs} />}
          <h1 className="font-display text-[length:var(--text-display-s)] leading-[1.02] tracking-[var(--tracking-display)] text-ink [overflow-wrap:break-word]">
            {title}
          </h1>
          {lead && <p className="lead mt-5 max-w-[44ch]">{lead}</p>}
          {actions && <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8">{actions}</div>}
          {children}
        </div>
        {image && (
          <div
            data-slot={slot}
            className="relative lg:col-span-6 h-64 sm:h-80 lg:h-[30rem] rounded-card overflow-hidden bg-paper-3"
          >
            <Image src={image} alt={imageAlt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </header>
  );
}

export function ServiceHero({
  crumbs,
  title,
  lead,
  image,
  imageAlt = '',
  slot,
  consultHref = '/contact',
}: {
  crumbs: Crumb[];
  title: string;
  lead: string;
  image?: string;
  imageAlt?: string;
  slot: string;
  consultHref?: string;
}) {
  return (
    <PageHero
      crumbs={crumbs}
      title={title}
      lead={lead}
      image={image}
      imageAlt={imageAlt}
      slot={slot}
      actions={
        <>
          <Link href={consultHref} className="btn-primary">Book a consultation</Link>
          <Link href="/products" className="link-quiet">Browse wigs and hair systems</Link>
        </>
      }
    />
  );
}

/* ── Intro: prose with a side note on a hairline ───────────────────── */

export function ServiceIntro({
  heading,
  children,
  aside,
}: {
  heading: string;
  children: ReactNode;
  aside?: { title: string; body: ReactNode };
}) {
  return (
    <section className="section-lg bg-paper">
      <div className="container-custom grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7 min-w-0">
          <h2 className={cn(h2, 'mb-6')}>{heading}</h2>
          <div className="space-y-4 text-[1.0625rem] leading-[1.7] text-ink-soft max-w-[62ch]">{children}</div>
        </div>
        {aside && (
          <aside className="lg:col-span-4 lg:col-start-9 border-t lg:border-t-0 lg:border-l border-rule pt-8 lg:pt-0 lg:pl-8 self-start">
            <h3 className="font-sans font-semibold text-ink text-[1.0625rem] tracking-normal mb-3">{aside.title}</h3>
            <div className="space-y-3 text-[0.9375rem] leading-[1.65] text-ink-soft">{aside.body}</div>
          </aside>
        )}
      </div>
    </section>
  );
}

/* ── Ledger: reasons, set in type between hairlines ────────────────── */

export function Ledger({
  heading,
  lead,
  items,
  tone = 'paper-2',
}: {
  heading: string;
  lead?: string;
  items: ReadonlyArray<{ icon: LucideIcon; title: string; desc?: string }>;
  tone?: 'paper' | 'paper-2';
}) {
  const compact = items.every((it) => !it.desc);
  return (
    <section className={cn('section-lg', tone === 'paper-2' ? 'bg-paper-2' : 'bg-paper')}>
      <div className="container-custom">
        <div className="max-w-2xl mb-10">
          <h2 className={h2}>{heading}</h2>
          {lead && <p className="lead mt-3">{lead}</p>}
        </div>
        <ul
          className={cn(
            'grid border-t border-rule',
            items.length % 4 === 0 ? 'sm:grid-cols-2 lg:grid-cols-4' : items.length === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {items.map(({ icon: Icon, title, desc }) => (
            <li key={title} className={cn('border-b border-rule pr-6', compact ? 'py-5' : 'py-7')}>
              <h3 className="flex items-start gap-2.5 font-sans font-semibold text-ink text-[1.0625rem] tracking-normal">
                <Icon className="w-[1.125rem] h-[1.125rem] mt-[0.2rem] shrink-0 text-accent" strokeWidth={1.75} aria-hidden />
                <span className="min-w-0">{title}</span>
              </h3>
              {desc && <p className="text-[0.9375rem] leading-[1.6] text-ink-soft mt-1.5 pl-7 max-w-[34ch]">{desc}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Two lists side by side (benefits and what to keep in mind) ────── */

export function TwoLists({
  heading,
  lists,
}: {
  heading?: string;
  lists: ReadonlyArray<{ title: string; items: ReadonlyArray<string> }>;
}) {
  return (
    <section className="section-lg bg-paper">
      <div className="container-custom">
        {heading && <h2 className={cn(h2, 'mb-10 max-w-2xl')}>{heading}</h2>}
        <div className="grid gap-12 md:grid-cols-2">
          {lists.map((l) => (
            <div key={l.title} className="min-w-0">
              <h3 className="font-sans font-semibold text-ink text-[1.125rem] tracking-normal pb-3 border-b border-ink">{l.title}</h3>
              <ul>
                {l.items.map((it) => (
                  <li key={it} className="py-3 border-b border-rule text-ink-soft leading-[1.6]">{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Numbered steps ────────────────────────────────────────────────── */

export function Steps({
  heading,
  lead,
  steps,
}: {
  heading: string;
  lead?: string;
  steps: ReadonlyArray<{ title: string; desc: string }>;
}) {
  return (
    <section className="section-lg bg-paper-2">
      <div className="container-custom grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4 min-w-0">
          <h2 className={h2}>{heading}</h2>
          {lead && <p className="lead mt-3">{lead}</p>}
        </div>
        <ol className="lg:col-span-8 grid sm:grid-cols-2 gap-x-10 border-t border-rule">
          {steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 py-5 border-b border-rule">
              <span className="font-display text-[length:var(--text-xl)] text-accent leading-none pt-0.5">{i + 1}</span>
              <div>
                <h3 className="font-sans font-semibold text-ink tracking-normal">{s.title}</h3>
                <p className="text-[0.9375rem] leading-[1.6] text-ink-soft mt-1">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Before and after: frames for the studio's own client photographs ── */

export function ResultSlots({
  heading = 'Before and after',
  note = 'Ask to see client results at your consultation.',
  pairs = 2,
  frames,
  slot,
}: {
  heading?: string;
  note?: string;
  pairs?: number;
  /** Single frames with these captions, in place of before-and-after pairs. */
  frames?: ReadonlyArray<string>;
  slot: string;
}) {
  return (
    <section className="section-lg bg-paper">
      <div className="container-custom">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h2 className={h2}>{heading}</h2>
          <p className="text-[0.9375rem] text-ink-muted max-w-[40ch]">{note}</p>
        </div>
        {frames ? (
          <ul className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]">
            {frames.map((cap, i) => (
              <li key={cap}>
                <figure className="m-0">
                  <div
                    data-slot={`${slot}-${i + 1}`}
                    className="aspect-[4/5] rounded-card bg-paper-3 border border-rule grid place-items-center"
                  >
                    <Camera className="w-6 h-6 text-ink-muted" strokeWidth={1.5} aria-hidden />
                  </div>
                  <figcaption className="text-[0.875rem] text-ink-muted mt-2">{cap}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: pairs }, (_, i) => (
            <li key={i} className="grid grid-cols-2 gap-1.5">
              {(['Before', 'After'] as const).map((side) => (
                <figure key={side} className="m-0">
                  <div
                    data-slot={`${slot}-${i + 1}-${side.toLowerCase()}`}
                    className="aspect-[4/5] rounded-card bg-paper-3 border border-rule grid place-items-center"
                  >
                    <Camera className="w-6 h-6 text-ink-muted" strokeWidth={1.5} aria-hidden />
                  </div>
                  <figcaption className="text-[0.875rem] text-ink-muted mt-2">{side}</figcaption>
                </figure>
              ))}
            </li>
          ))}
        </ul>
        )}
      </div>
    </section>
  );
}

/* ── FAQ ───────────────────────────────────────────────────────────── */

export function FaqList({
  heading = 'Questions people ask us',
  items,
}: {
  heading?: string;
  items: ReadonlyArray<{ q: string; a: string }>;
}) {
  return (
    <section className="section-lg bg-paper-2" id="faq">
      <div className="container-custom grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4 min-w-0">
          <h2 className={h2}>{heading}</h2>
          <p className="text-ink-soft mt-3">
            Something else on your mind? <Link href="/contact" className="link-quiet">Write to us</Link>.
          </p>
        </div>
        <FaqItems items={items} className="lg:col-span-8" />
      </div>
    </section>
  );
}

/** Hairline-ruled questions that open in place; no script needed. */
export function FaqItems({
  items,
  className,
}: {
  items: ReadonlyArray<{ q: string; a: string }>;
  className?: string;
}) {
  return (
    <div className={cn('border-t border-ink', className)}>
      {items.map((f) => (
        <details key={f.q} className="group border-b border-rule">
          <summary className="flex items-start justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-semibold text-ink text-[1.0625rem] leading-snug hover:text-accent transition-colors rounded-sm">
            {f.q}
            <Plus className="w-5 h-5 shrink-0 mt-0.5 text-ink-muted transition-transform duration-200 group-open:rotate-45" aria-hidden />
          </summary>
          <p className="pb-6 -mt-1 text-ink-soft leading-[1.7] max-w-[64ch]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ── Close: the deep-teal band, then where to go next ──────────────── */

export function ServiceClose({
  heading,
  body,
  related,
  relatedHeading = 'Related services',
  consultHref = '/contact',
}: {
  heading: string;
  body: string;
  related?: ReadonlyArray<{ title: string; href: string }>;
  relatedHeading?: string;
  consultHref?: string;
}) {
  return (
    <>
      <section className="bg-deep text-deep-ink">
        <div className="container-custom py-16 lg:py-20 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 min-w-0">
            <h2 className="font-display text-[length:var(--text-3xl)] leading-[1.08] text-white">{heading}</h2>
            <p className="text-[1.0625rem] leading-[1.65] text-deep-muted mt-4 max-w-[52ch]">{body}</p>
          </div>
          <div className="lg:col-span-5 flex flex-wrap gap-3 lg:justify-end">
            <Link href={consultHref} className="btn-primary !bg-mint !border-mint !text-ink hover:!bg-white hover:!border-white focus-visible:!outline-mint">
              Book a consultation
            </Link>
            <Link href="/products" className="btn-secondary !border-white/70 !text-white hover:!bg-white hover:!text-ink focus-visible:!outline-mint">
              Shop now
            </Link>
          </div>
        </div>
      </section>
      {related && related.length > 0 && (
        <nav aria-labelledby="related-heading">
          <div className="container-custom py-16 lg:py-20">
            <h2 id="related-heading" className="font-sans font-semibold text-ink text-[1.0625rem] tracking-normal mb-4">{relatedHeading}</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-4 border-t border-rule">
              {related.map((r) => (
                <li key={r.title} className="border-b border-rule sm:[&:nth-child(odd)]:pr-6 lg:pr-6">
                  <Link
                    href={r.href}
                    className="group flex items-center justify-between gap-3 min-h-[56px] text-ink font-medium hover:text-accent transition-colors rounded-sm"
                  >
                    {r.title}
                    <ChevronRight className="w-4 h-4 text-ink-muted transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </>
  );
}
