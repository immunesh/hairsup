import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Camera } from 'lucide-react';
import { getAllBlogs } from "@/lib/blog-api";
import { PageHero, headingClass } from '@/components/shop/Service';

export const metadata: Metadata = {
  title: 'Hair Care Blog & Style Guides | Glamour Hair Studios',
  description: 'Expert hair care tips, styling guides, and inspiration from the Glamour Hair Studios team. Everything you need to know about wigs and hair systems.',
};

const TAG_COLORS: Record<string, string> = {
  'Beginner Guide': 'bg-green-100 text-green-700',
  'Care Tips': 'bg-mist text-ink-soft',
  "Men's Hair": 'bg-gray-100 text-gray-700',
  'Style Guide': 'bg-cream text-ink-soft',
  'Buying Guide': 'bg-amber-100 text-amber-700',
  'Medical': 'bg-red-100 text-red-700',
};

const CATEGORIES = ['All', 'Beginner Guide', 'Care Tips', "Men's Hair", 'Style Guide', 'Buying Guide', 'Medical'];

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  image?: string;
  author?: string;
  createdAt?: string;
};

const formatDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

/** The post's picture, or a named slot when it has none. */
function Cover({ post, sizes, priority, className }: { post: Post; sizes: string; priority?: boolean; className: string }) {
  return (
    <div data-slot={`blog-cover-${post.slug}`} className={`relative overflow-hidden rounded-card bg-paper-3 ${className}`}>
      {post.image ? (
        <Image src={post.image} alt="" fill priority={priority} sizes={sizes} className="object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <Camera className="w-6 h-6 text-ink-muted" strokeWidth={1.5} aria-hidden />
        </div>
      )}
    </div>
  );
}

function Byline({ post }: { post: Post }) {
  return (
    <p className="text-[0.9375rem] text-ink-muted mt-4 flex flex-wrap gap-x-5 gap-y-1">
      {post.author && <span>{post.author}</span>}
      {post.createdAt && <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>}
    </p>
  );
}

export default async function BlogPage() {
  const fetchedBlogs = await getAllBlogs();
  // Placeholder posts until the CMS has more; their covers are slots.
  const fakeBlogs: Post[] = [
    {
      id: 'fake-1',
      slug: 'how-to-maintain-your-human-hair-wig',
      title: '5 Expert Tips to Maintain Your Human Hair Wig',
      excerpt: 'Learn the secrets to keeping your human hair wig looking natural, shiny, and tangle-free for months. Discover our expert maintenance routine.',
      createdAt: new Date().toISOString(),
      author: 'Glamour Hair Studios Expert Team'
    },
    {
      id: 'fake-2',
      slug: 'understanding-different-lace-types',
      title: 'Swiss Lace vs. HD Lace: Which is Right for You?',
      excerpt: 'Dive deep into the world of lace fronts. We compare the durability, invisibility, and comfort of different lace types to help you choose the best match.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      author: 'Glamour Hair Studios Expert Team'
    }
  ];

  const blogs: Post[] = [...fetchedBlogs, ...fakeBlogs];
  const [lead, ...rest] = blogs;

  return (
    <div>
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }]}
        title="Hair care blog and style guides"
        lead="Expert tips, styling guides, and inspiration from our certified trichologists and style directors."
      />

      {lead && (
        <section aria-label="Latest article" className="section-md bg-paper">
          <Link
            href={`/blog/${lead.slug}`}
            className="group container-custom grid gap-8 lg:grid-cols-12 lg:items-center rounded-card"
          >
            <Cover post={lead} priority sizes="(min-width: 1024px) 55vw, 100vw" className="lg:col-span-7 aspect-[3/2]" />
            <div className="lg:col-span-5 min-w-0">
              <h2 className={`${headingClass} group-hover:text-accent transition-colors`}>{lead.title}</h2>
              {lead.excerpt && <p className="text-ink-soft text-[1.0625rem] leading-[1.65] mt-4 max-w-[48ch]">{lead.excerpt}</p>}
              <Byline post={lead} />
              <span className="link-quiet inline-block mt-6">Read the article</span>
            </div>
          </Link>
        </section>
      )}

      {rest.length > 0 && (
        <section aria-labelledby="more-articles" className="section-lg border-t border-rule">
          <div className="container-custom">
            <h2 id="more-articles" className={`${headingClass} mb-10`}>More articles</h2>
            <ul className="grid gap-x-8 gap-y-12 grid-cols-[repeat(auto-fill,minmax(min(100%,20rem),1fr))]">
              {rest.map((post) => (
                <li key={post.id} className="min-w-0">
                  <Link href={`/blog/${post.slug}`} className="group block rounded-card">
                    <Cover post={post} sizes="(min-width: 1024px) 30vw, 100vw" className="aspect-[4/3]" />
                    <h3 className="font-display text-[length:var(--text-xl)] leading-snug text-ink mt-5 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && <p className="text-[0.9375rem] text-ink-soft leading-[1.6] mt-2 line-clamp-3">{post.excerpt}</p>}
                    <Byline post={post} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {blogs.length === 0 && (
        <section className="section-lg">
          <div className="container-custom max-w-xl">
            <h2 className={headingClass}>No articles yet</h2>
            <p className="text-ink-soft mt-3">New guides are on their way. Meanwhile, <Link href="/try-on" className="link-quiet">try a wig on virtually</Link>.</p>
          </div>
        </section>
      )}
    </div>
  );
}
