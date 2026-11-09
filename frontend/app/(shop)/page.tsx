'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Pause, Play, Plus } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { DEMO_PRODUCTS, cn } from '@/lib/utils';

import { Category, Product } from '@/types';
import { productsApi, blogApi } from '@/lib/api';
import { getCategories } from '@/lib/category-api';
import { getHeroSlides } from '@/lib/hero-api';

const FALLBACK_CATEGORY_IMAGE = '/women.avif';

const GENDER_BADGE: Record<string, string> = {
  WOMEN: "Women's",
  MEN: "Men's",
  UNISEX: 'Unisex',
};

// Shown until the CMS slides load, and whenever it has none. The photographs
// are stand-ins: the salon's own pictures replace them in the hero admin.
const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    headline: 'Transform Your Look',
    subheadline: 'with Premium Human Hair Wigs',
    description: "India's finest collection of 100% human hair wigs and hair systems. Look naturally stunning every day.",
    cta: "Shop Women's Collection",
    ctaLink: '/women',
    ctaSecondary: 'Try On Virtually',
    ctaSecondaryLink: '/try-on',
    badge: 'New Season Collection',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
  },
  {
    id: 2,
    headline: 'Confidence Starts',
    subheadline: "from the Top: Men's Hair Systems",
    description: 'Advanced Swiss lace hair systems engineered for an undetectable, natural look. Reclaim your confidence.',
    cta: "Shop Men's Collection",
    ctaLink: '/men',
    ctaSecondary: 'Book a Consultation',
    ctaSecondaryLink: '/contact',
    badge: 'Clinically Endorsed',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=80',
  },
  {
    id: 3,
    headline: 'See It Before',
    subheadline: 'You Buy It, with Virtual Try-On',
    description: 'Experience the future of wig shopping. Use our AI-powered virtual try-on to find your perfect match.',
    cta: 'Try On Now, Free',
    ctaLink: '/try-on',
    ctaSecondary: 'How It Works',
    ctaSecondaryLink: '/blog/virtual-try-on',
    badge: 'AI-Powered Technology',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80',
  },
];

// Claims carried over from the previous site. Each needs a source before
// launch; see the handoff notes.
const STATS = [
  { value: '10L+', label: 'Happy customers' },
  { value: '4.8★', label: 'Average rating' },
  { value: '50+', label: 'Stores pan India' },
  { value: '280+', label: 'Wig styles' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'I was skeptical at first, but Glamour Hair Studios completely changed my life! The lace front wig looks so natural, nobody can tell! The virtual try-on helped me pick the perfect style.',
    product: 'Silky Straight Lace Front Wig',
  },
  {
    name: 'Rajesh Kumar',
    location: 'Delhi',
    rating: 5,
    text: "After years of hair loss, I finally found a solution that works. The Swiss lace hairpiece is completely undetectable. My colleagues don't even know! Best investment I've ever made.",
    product: "Men's Natural System Hairpiece",
  },
  {
    name: 'Ananya Patel',
    location: 'Bangalore',
    rating: 5,
    text: 'The body wave wig is absolutely stunning! High quality, natural looking, and the 360° view on the website helped me see every detail before buying. Delivery was super fast too!',
    product: 'Goddess Waves Body Wave Wig',
  },
];

const HOME_FAQS = [
  {
    question: 'What types of wigs do you offer?',
    answer: "We offer human hair wigs, synthetic wigs, men's hair systems, women's wigs, and hair patches in a range of styles and colours.",
  },
  {
    question: 'Is shipping free on every order?',
    answer: 'Yes. Standard shipping is free on every order within India. Express delivery may be available for an additional fee.',
  },
  {
    question: 'Can I try a wig before buying it?',
    answer: 'Yes. Use our virtual try-on to preview selected styles with your camera, or visit one of our stores for an in-person consultation.',
  },
  {
    question: 'How do I choose the right wig size?',
    answer: 'Measure around your natural hairline and compare the result with the size guide on each product page. Our adjustable caps provide a secure fit.',
  },
  {
    question: 'Can I return or exchange my order?',
    answer: 'Unused products in their original condition can be returned or exchanged within 7 days of delivery. Custom-made products are non-returnable.',
  },
];

const SLIDE_MS = 6000;

// A round control for rails and the hero. 44px target, instant focus ring.
const roundBtn =
  'w-11 h-11 rounded-full border border-rule bg-surface text-ink flex items-center justify-center ' +
  'transition-colors duration-200 hover:border-ink hover:bg-paper-2 ' +
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-rule disabled:hover:bg-surface';

function SectionHead({
  id,
  title,
  sub,
  children,
}: {
  id: string;
  title: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-10 lg:mb-12">
      <div>
        <h2 id={id} className="section-title measure-section">{title}</h2>
        {sub && <p className="text-ink-soft text-[1.0625rem] mt-3 max-w-[48ch]">{sub}</p>}
      </div>
      {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
}

export default function HomePage() {
  const [heroSlides, setHeroSlides] = useState<any[]>(DEFAULT_HERO_SLIDES);
  const [heroSlide, setHeroSlide] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [paused, setPaused] = useState(false); // the visitor's choice
  const [held, setHeld] = useState(false); // hover or focus inside the hero
  const [blogs, setBlogs] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [canScrollLeftArrivals, setCanScrollLeftArrivals] = useState(false);
  const [canScrollRightArrivals, setCanScrollRightArrivals] = useState(true);
  const [arrivalsProgress, setArrivalsProgress] = useState(0);
  const [activeStory, setActiveStory] = useState(0);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const newArrivalsScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (dir: number) => {
    if (categoryScrollRef.current) {
      const scrollAmount = categoryScrollRef.current.offsetWidth * 0.8;
      categoryScrollRef.current.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollNewArrivals = (dir: number) => {
    if (newArrivalsScrollRef.current) {
      const scrollAmount = newArrivalsScrollRef.current.offsetWidth * 0.75;
      newArrivalsScrollRef.current.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
    }
  };

  const checkArrivalsScroll = () => {
    const el = newArrivalsScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeftArrivals(scrollLeft > 10);
    setCanScrollRightArrivals(scrollLeft < scrollWidth - clientWidth - 10);
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setArrivalsProgress(Math.min(100, Math.max(0, (scrollLeft / maxScroll) * 100)));
    } else {
      setCanScrollRightArrivals(false);
      setArrivalsProgress(0);
    }
  };

  useEffect(() => {
    const el = newArrivalsScrollRef.current;
    if (!el) return;
    checkArrivalsScroll();
    el.addEventListener('scroll', checkArrivalsScroll, { passive: true });
    window.addEventListener('resize', checkArrivalsScroll);
    return () => {
      el.removeEventListener('scroll', checkArrivalsScroll);
      window.removeEventListener('resize', checkArrivalsScroll);
    };
  }, [newArrivals]);

  useEffect(() => {
    const loadHeroSlides = async () => {
      try {
        const data = await getHeroSlides(true);
        if (Array.isArray(data) && data.length > 0) {
          setHeroSlides(data);
          setHeroSlide(0);
        }
      } catch (error) {
        console.error('Homepage hero slides error:', error);
      }
    };

    loadHeroSlides();
  }, []);

  // Visitors who ask for less motion get a still hero; they can still step
  // through the slides with the controls.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true);
  }, []);

  useEffect(() => {
    if (paused || held || heroSlides.length < 2) return;
    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => { setHeroSlide((s) => (s + 1) % heroSlides.length); setIsSliding(false); }, 220);
    }, SLIDE_MS);
    return () => clearInterval(interval);
  }, [heroSlides.length, paused, held]);

  const goSlide = (dir: number) => {
    setIsSliding(true);
    setTimeout(() => {
      setHeroSlide((s) => ((s + dir + heroSlides.length) % heroSlides.length));
      setIsSliding(false);
    }, 200);
  };

  const slide = heroSlides[heroSlide] || heroSlides[0];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('Homepage categories error:', error);
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await productsApi.getAll();

        const apiProducts = res?.data?.data || [];
        const list: Product[] = apiProducts.length > 0
          ? apiProducts
          : (DEMO_PRODUCTS as unknown as Product[]);

        const featured = list.filter((p: Product) => p.isFeatured);
        setFeaturedProducts((featured.length > 0 ? featured : list).slice(0, 8));

        const arrivals = list.filter((p: Product) => p.isNewArrival);
        setNewArrivals((arrivals.length >= 4 ? arrivals : list).slice(0, 16));
      } catch (error) {
        console.error('Homepage products error:', error);

        const fallbackProducts = DEMO_PRODUCTS as unknown as Product[];
        setFeaturedProducts(fallbackProducts.slice(0, 8));
        const fallbackArrivals = fallbackProducts.filter((p) => p.isNewArrival);
        setNewArrivals(
          (fallbackArrivals.length >= 4 ? fallbackArrivals : fallbackProducts).slice(0, 16)
        );
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      // Sample posts, kept from the previous homepage until the journal has
      // enough real ones.
      const fakeBlogs = [
        {
          id: 'fake-1',
          slug: 'how-to-maintain-your-human-hair-wig',
          title: '5 Expert Tips to Maintain Your Human Hair Wig',
          category: 'Hair Care',
          image: 'https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?w=800&q=80',
          excerpt: 'Learn the secrets to keeping your human hair wig looking natural, shiny, and tangle-free for months. Discover our expert maintenance routine.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'fake-2',
          slug: 'understanding-different-lace-types',
          title: 'Swiss Lace vs. HD Lace: Which is Right for You?',
          category: 'Style Guide',
          image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=800&q=80',
          excerpt: 'Dive deep into the world of lace fronts. We compare the durability, invisibility, and comfort of different lace types to help you choose the best match.',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ];

      try {
        const res = await blogApi.getAll();
        const blogList = res.data?.data || res.data?.blogs || [];
        setBlogs([...blogList, ...fakeBlogs]);
      } catch (error) {
        console.error('Blog fetch error', error);
        setBlogs(fakeBlogs);
      }
    };

    loadBlogs();
  }, []);

  const [leadPost, ...morePosts] = blogs;
  const story = TESTIMONIALS[activeStory];
  const postImage = (post: any) => post.featuredImage || post.image || '/placeholder-blog.jpg';
  const postDate = (post: any) =>
    post.createdAt
      ? new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : null;

  return (
    <div className="bg-paper">
      {/* ─── Hero: the copy on paper, the photograph beside it ─────────── */}
      <section
        aria-roledescription="carousel"
        aria-label="Featured collections"
        className="container-custom pt-8 pb-12 lg:pt-10 lg:pb-14"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false); }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div
            className={cn(
              'lg:col-span-6 xl:col-span-5 order-2 lg:order-1 transition-[opacity,transform] duration-200 ease-out',
              isSliding ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            )}
            aria-live={paused || held ? 'polite' : 'off'}
          >
            <h1 className="font-display text-[length:var(--text-display)] leading-[1.02] text-ink measure-display text-balance">
              {slide.headline}
            </h1>
            {slide.subheadline && (
              <p className="font-display text-[length:var(--text-2xl)] leading-tight text-accent mt-3 max-w-[24ch]">
                {slide.subheadline}
              </p>
            )}
            {slide.description && (
              <p className="lead text-ink-soft mt-6">{slide.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-7 gap-y-4 mt-8">
              {slide.cta && slide.ctaLink && (
                <Link href={slide.ctaLink} className="btn-primary">
                  {slide.cta}
                </Link>
              )}
              {slide.ctaSecondary && slide.ctaSecondaryLink && (
                <Link href={slide.ctaSecondaryLink} className="link-quiet font-semibold">
                  {slide.ctaSecondary}
                </Link>
              )}
            </div>
          </div>

          <figure className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2 m-0">
            <div
              data-slot="hero-photo"
              className={cn(
                'rounded-card aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:h-[min(560px,62vh)] transition-opacity duration-200 ease-out',
                isSliding ? 'opacity-0' : 'opacity-100'
              )}
            >
              {slide.image && (
                <Image
                  src={slide.image}
                  alt={slide.headline}
                  fill
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>

            <figcaption className="flex items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-4 min-w-0">
                {heroSlides.length > 1 && (
                  <div className="flex shrink-0" role="group" aria-label="Choose a slide">
                    {heroSlides.map((s: any, i: number) => (
                      <button
                        key={s.id ?? i}
                        type="button"
                        onClick={() => setHeroSlide(i)}
                        aria-label={`Slide ${i + 1}: ${s.headline}`}
                        aria-current={i === heroSlide}
                        className="group/dot w-9 h-11 flex items-center px-1"
                      >
                        <span
                          className={cn(
                            'block h-[3px] w-full rounded-full transition-colors duration-200',
                            i === heroSlide ? 'bg-ink' : 'bg-rule group-hover/dot:bg-ink-muted'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                )}
                <span className="text-[0.9375rem] text-ink-soft truncate">{slide.badge}</span>
              </div>

              {heroSlides.length > 1 && (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => goSlide(-1)} aria-label="Previous slide" className={roundBtn}>
                    <ChevronLeft className="w-5 h-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaused((p) => !p)}
                    aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                    aria-pressed={paused}
                    className={roundBtn}
                  >
                    {paused ? <Play className="w-4 h-4" aria-hidden /> : <Pause className="w-4 h-4" aria-hidden />}
                  </button>
                  <button type="button" onClick={() => goSlide(1)} aria-label="Next slide" className={roundBtn}>
                    <ChevronRight className="w-5 h-5" aria-hidden />
                  </button>
                </div>
              )}
            </figcaption>
          </figure>
        </div>

      </section>

      {/* ─── Categories ─────────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <section aria-labelledby="home-categories" className="section-md border-t border-rule">
          <div className="container-custom">
            <SectionHead
              id="home-categories"
              title="Shop by category"
              sub="Find the right wig for your lifestyle and personality."
            >
              <button type="button" onClick={() => scrollCategories(-1)} aria-label="Scroll categories back" className={roundBtn}>
                <ChevronLeft className="w-5 h-5" aria-hidden />
              </button>
              <button type="button" onClick={() => scrollCategories(1)} aria-label="Scroll categories forward" className={roundBtn}>
                <ChevronRight className="w-5 h-5" aria-hidden />
              </button>
            </SectionHead>

            <div
              ref={categoryScrollRef}
              className="flex gap-5 lg:gap-8 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide"
            >
              {categories.map((cat) => {
                const productCount = cat._count?.products ?? 0;
                const badge = cat.gender ? GENDER_BADGE[cat.gender] : undefined;

                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="group/card w-[72vw] sm:w-[calc(50%-10px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-24px)] shrink-0 snap-start rounded-card"
                  >
                    <div data-slot="category" className="rounded-card aspect-[4/5]">
                      <Image
                        src={cat.image || FALLBACK_CATEGORY_IMAGE}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 72vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.03]"
                      />
                    </div>
                    <h3 className="font-display text-[length:var(--text-title)] text-ink mt-4 group-hover/card:text-accent transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[0.9375rem] text-ink-muted mt-1">
                      {badge ? `${badge}, ` : ''}
                      {productCount} {productCount === 1 ? 'style' : 'styles'}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── Featured ───────────────────────────────────────────────────── */}
      <section aria-labelledby="home-featured" className="section-md bg-paper-2">
        <div className="container-custom">
          <SectionHead id="home-featured" title="Featured collection" sub="Handpicked by our style experts.">
            <Link href="/products" className="btn-secondary">View all products</Link>
          </SectionHead>

          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-8 lg:gap-y-12">
            {featuredProducts.map((product) => (
              <li key={product.id} className="min-w-0">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Figures band ───────────────────────────────────────────────── */}
      <section aria-labelledby="home-figures" className="bg-deep text-deep-ink">
        <div className="container-custom py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-end">
            <h2 id="home-figures" className="lg:col-span-4 font-display text-[length:var(--text-section)] leading-[1.05] text-white max-w-[14ch]">
              India&apos;s most trusted hair brand
            </h2>
            <dl className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-y-8">
              {STATS.map(({ value, label }, i) => (
                <div
                  key={label}
                  className={cn(
                    'flex flex-col-reverse pl-5 md:pl-6 border-l border-white/15',
                    i === 0 && 'border-l-0 pl-0',
                    i === 2 && 'border-l-0 pl-0 md:border-l md:pl-6'
                  )}
                >
                  <dt className="text-[0.9375rem] text-deep-muted mt-2">{label}</dt>
                  <dd className="font-display text-[length:var(--text-3xl)] lg:text-[3.25rem] leading-none text-white [font-variant-numeric:lining-nums]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ─── Try-on ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="home-tryon" className="section-lg">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div data-slot="try-on" className="lg:col-span-6 rounded-card aspect-[4/5] lg:aspect-[5/6]">
            <Image
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80"
              alt="A client in the salon chair, trying a new style"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <h2 id="home-tryon" className="section-title measure-section">Try before you buy</h2>
            <p className="lead text-ink-soft mt-6">
              Our virtual try-on overlays any wig on your live camera feed, so you see exactly how it
              sits before it reaches your bag.
            </p>
            <p className="text-ink-soft mt-4 max-w-[52ch]">
              Match a style to your face shape, compare lengths side by side, and rotate through
              360° product views, all without leaving home.
            </p>
            <Link href="/try-on" className="btn-primary mt-8">Try on free</Link>
          </div>
        </div>
      </section>

      {/* ─── New arrivals ───────────────────────────────────────────────── */}
      <section aria-labelledby="home-arrivals" className="section-md bg-paper-2">
        <div className="container-custom">
          <SectionHead id="home-arrivals" title="New arrivals" sub="Fresh styles, just landed.">
            <button
              type="button"
              aria-label="Previous new arrivals"
              onClick={() => scrollNewArrivals(-1)}
              disabled={!canScrollLeftArrivals}
              className={roundBtn}
            >
              <ChevronLeft className="w-5 h-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next new arrivals"
              onClick={() => scrollNewArrivals(1)}
              disabled={!canScrollRightArrivals}
              className={roundBtn}
            >
              <ChevronRight className="w-5 h-5" aria-hidden />
            </button>
            <Link href="/products?sort=newest" className="link-quiet font-semibold ml-3 hidden sm:inline">
              See all arrivals
            </Link>
          </SectionHead>

          <div
            ref={newArrivalsScrollRef}
            className="flex gap-4 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide"
          >
            {newArrivals.map((p) => (
              <div
                key={p.id}
                className="w-[58vw] sm:w-[220px] lg:w-[calc(20%-19.2px)] shrink-0 snap-start"
              >
                <ProductCard product={p} compact />
              </div>
            ))}
          </div>

          {newArrivals.length > 4 && (
            <div className="mt-8 h-[3px] w-48 bg-rule rounded-full overflow-hidden" aria-hidden>
              <div
                className="h-full w-full bg-ink origin-left transition-transform duration-200 ease-out"
                style={{ transform: `scaleX(${Math.max(0.2, arrivalsProgress / 100)})` }}
              />
            </div>
          )}

          <Link href="/products?sort=newest" className="link-quiet font-semibold mt-6 inline-block sm:hidden">
            See all arrivals
          </Link>
        </div>
      </section>

      {/* ─── Stories: one voice at a time ───────────────────────────────── */}
      <section aria-labelledby="home-stories" className="section-lg">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 id="home-stories" className="section-title measure-section">Real stories, real confidence</h2>
            <div role="tablist" aria-label="Customer stories" className="mt-8 flex lg:flex-col gap-2 overflow-x-auto scrollbar-hide">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  id={`story-tab-${i}`}
                  aria-selected={i === activeStory}
                  aria-controls="story-panel"
                  onClick={() => setActiveStory(i)}
                  className={cn(
                    'shrink-0 text-left min-h-[44px] px-4 py-2.5 rounded-input border transition-colors duration-200',
                    i === activeStory
                      ? 'border-ink bg-surface text-ink'
                      : 'border-transparent text-ink-soft hover:bg-paper-2 hover:text-ink'
                  )}
                >
                  <span className="font-semibold block">{t.name}</span>
                  <span className="text-[0.875rem] text-ink-muted">{t.location}</span>
                </button>
              ))}
            </div>
          </div>

          <figure
            id="story-panel"
            role="tabpanel"
            aria-labelledby={`story-tab-${activeStory}`}
            className="lg:col-span-7 lg:col-start-6 m-0 lg:pt-2"
          >
            <div className="flex items-center gap-1 text-ink" aria-label={`${story.rating} out of 5 stars`} role="img">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className={cn('w-5 h-5', s < story.rating ? 'star-filled' : 'star-empty')} aria-hidden />
              ))}
            </div>
            <blockquote className="font-display text-[length:var(--text-2xl)] lg:text-[2.25rem] leading-[1.25] text-ink mt-6">
              &ldquo;{story.text}&rdquo;
            </blockquote>
            <figcaption className="mt-8 text-[1.0625rem]">
              <span className="font-semibold text-ink">{story.name}</span>
              <span className="text-ink-muted">, {story.location}. Wears the {story.product}.</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ─── FAQ ────────────────────────────────────────────────────────── */}
      <section aria-labelledby="home-faq" className="section-md bg-paper-2">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          <div className="lg:col-span-7">
            <h2 id="home-faq" className="section-title measure-section">Questions we hear most</h2>
            <p className="text-ink-soft text-[1.0625rem] mt-3">Quick answers before you choose your style.</p>

            <div className="mt-10 border-t border-rule">
              {HOME_FAQS.map(({ question, answer }) => (
                <details key={question} className="group border-b border-rule">
                  <summary className="flex items-center justify-between gap-6 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden rounded-sm">
                    <span className="font-semibold text-ink text-[1.0625rem]">{question}</span>
                    <Plus className="w-5 h-5 shrink-0 text-ink-soft transition-transform duration-200 group-open:rotate-45" aria-hidden />
                  </summary>
                  <p className="text-ink-soft pb-6 pr-10 max-w-[60ch]">{answer}</p>
                </details>
              ))}
            </div>

            <Link href="/faq" className="btn-secondary mt-8">Read all FAQs</Link>
          </div>

          <div data-slot="faq-photo" className="lg:col-span-4 lg:col-start-9 rounded-card aspect-[4/5] lg:sticky lg:top-28">
            <Image
              src="/faq-barber.jpg"
              alt="A stylist fitting a hair system in the studio"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ─── Journal, with the letter folded in ─────────────────────────── */}
      {leadPost && (
        <section aria-labelledby="home-journal" className="section-lg">
          <div className="container-custom">
            <SectionHead id="home-journal" title="Hair care and style guides" sub="Advice from the people who fit our wigs.">
              <Link href="/blog" className="btn-secondary">All articles</Link>
            </SectionHead>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
              <Link href={`/blog/${leadPost.slug}`} className="group lg:col-span-7 rounded-card">
                <div data-slot="journal-lead" className="rounded-card aspect-[16/10]">
                  <Image
                    src={postImage(leadPost)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-[0.9375rem] text-ink-muted mt-5">
                  {leadPost.category || 'Journal'}
                  {postDate(leadPost) && <>, {postDate(leadPost)}</>}
                </p>
                <h3 className="font-display text-[length:var(--text-2xl)] leading-tight text-ink mt-2 group-hover:text-accent transition-colors max-w-[30ch]">
                  {leadPost.title}
                </h3>
                <p className="text-ink-soft mt-3 max-w-[60ch] line-clamp-2">
                  {leadPost.excerpt || leadPost.shortDescription || leadPost.content?.slice(0, 160)}
                </p>
              </Link>

              <div className="lg:col-span-4 lg:col-start-9 flex flex-col">
                <ul className="border-t border-rule">
                  {morePosts.map((post: any) => (
                    <li key={post.id} className="border-b border-rule">
                      <Link href={`/blog/${post.slug}`} className="group block py-4 rounded-sm">
                        <h3 className="font-display text-[length:var(--text-lg)] leading-snug text-ink group-hover:text-accent transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-[0.875rem] text-ink-muted mt-1">{post.category || 'Journal'}</p>
                      </Link>
                    </li>
                  ))}
                </ul>

                <form
                  className="mt-auto pt-10"
                  onSubmit={(e) => e.preventDefault()}
                  aria-labelledby="home-letter"
                >
                  <h3 id="home-letter" className="font-display text-[length:var(--text-xl)] text-ink">
                    Get exclusive offers and style tips
                  </h3>
                  <p className="text-ink-soft text-[0.9375rem] mt-2">
                    Join 2 lakh+ subscribers for first access to new arrivals. No spam; unsubscribe anytime.
                  </p>
                  <label htmlFor="home-email" className="visually-hidden">Email address</label>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <input
                      id="home-email"
                      type="email"
                      autoComplete="email"
                      placeholder="Your email address"
                      className="input-field flex-1"
                    />
                    <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Close: two doors ───────────────────────────────────────────── */}
      <section aria-label="Shop by who it's for" className="section-md border-t border-rule">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-8">
          {[
            {
              href: '/women',
              title: "Women's wigs",
              desc: 'From silky straight to glamorous curls: express every side of you.',
              image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
            },
            {
              href: '/men',
              title: "Men's hair systems",
              desc: 'Undetectable Swiss lace hair systems. Natural look, zero compromise.',
              image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=80',
            },
          ].map(({ href, title, desc, image }) => (
            <Link key={href} href={href} className="group rounded-card">
              <div data-slot="door" className="rounded-card aspect-[3/2]">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <h2 className="font-display text-[length:var(--text-section)] leading-none text-ink mt-6 group-hover:text-accent transition-colors">
                {title}
              </h2>
              <p className="text-ink-soft text-[1.0625rem] mt-3 max-w-[44ch]">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
