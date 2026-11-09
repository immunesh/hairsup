import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { getAllBlogs } from '@/lib/blog-api';
import { Crumbs } from '@/components/shop/Service';
import ShareButton from '@/components/shop/ShareButton';

const BLOG_CONTENT: Record<string, { title: string; author: string; date: string; readTime: string; tag: string; image: string; content: string }> = {
  'ultimate-guide-choosing-first-wig': {
    title: 'The Ultimate Guide to Choosing Your First Wig',
    author: 'Dr. Anita Sharma, Chief Trichologist',
    date: 'January 28, 2025',
    readTime: '8 min read',
    tag: 'Beginner Guide',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80',
    content: `
      <h2>Finding Your Perfect Wig</h2>
      <p>Choosing your first wig is an exciting but sometimes overwhelming experience. Whether you're experiencing hair loss due to medical reasons, wanting to switch up your style, or simply curious about wigs, this guide will walk you through everything you need to know.</p>

      <h3>Step 1: Know Your Reason</h3>
      <p>Understanding why you want a wig helps you choose the right type. Are you dealing with alopecia or chemotherapy-related hair loss? You'll want a soft, gentle cap with a breathable base. Want to experiment with styles? A synthetic wig with pre-styled curls is perfect and low-maintenance.</p>

      <h3>Step 2: Understand Cap Construction</h3>
      <p><strong>Lace Front Wigs:</strong> The lace extends across the front of the wig, creating a realistic-looking hairline. Perfect for wearing hair pulled back or in half-up styles.</p>
      <p><strong>Full Lace Wigs:</strong> The entire cap is made of lace, allowing you to part the hair in any direction and style it up completely. The most versatile option.</p>
      <p><strong>Monofilament Caps:</strong> Each hair strand is hand-tied to a mesh base, allowing it to move naturally. Ideal for sensitive scalps.</p>
      <p><strong>Basic/Machine-made Caps:</strong> The most affordable option, with hair sewn onto wefts. Less natural movement but durable and budget-friendly.</p>

      <h3>Step 3: Choose Your Hair Type</h3>
      <p><strong>Human Hair Wigs</strong> are the gold standard. They look, feel, and move like your natural hair. You can wash, colour, and heat-style them. They last 1–2 years with proper care. However, they require more maintenance and cost more.</p>
      <p><strong>Synthetic Wigs</strong> come pre-styled and are easier to maintain. They hold their style even after washing, making them great for busy lifestyles. Most can't be heat-styled unless labelled heat-resistant. They last 4–6 months.</p>

      <h3>Step 4: Get the Right Size</h3>
      <p>Measure the circumference of your head: starting at your forehead hairline, go around your head, and back to the start. The average head circumference is 53–58cm. Most wigs have adjustable straps to help achieve a snug fit.</p>

      <h3>Step 5: Use Virtual Try-On</h3>
      <p>Glamour Hair Studios's free virtual try-on technology lets you see exactly how any wig looks on your face before you buy. Visit our Try-On page and use your device's camera; no app download needed!</p>

      <h2>Common Mistakes to Avoid</h2>
      <ul>
        <li>Don't skip the cap size measurement: a poorly fitting wig is uncomfortable and looks unnatural</li>
        <li>Don't wash a human hair wig more than once every 8–10 wears</li>
        <li>Don't apply heat to synthetic wigs unless they're labelled as heat-resistant</li>
        <li>Don't store your wig without a wig stand; it helps maintain the shape</li>
      </ul>

      <h2>Ready to Take the Next Step?</h2>
      <p>Browse our collection of 280+ wigs for men and women, filter by your preferences, and use our 360° product viewer to see every angle before you buy. Our expert team is also available for a free virtual or in-store consultation.</p>
    `,
  },
  'how-to-maintain-human-hair-wig': {
    title: 'How to Maintain Your Human Hair Wig',
    author: 'Priya Mehta, Creative Director',
    date: 'January 20, 2025',
    readTime: '6 min read',
    tag: 'Care Tips',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200&q=80',
    content: `
      <h2>The Foundation of Wig Longevity</h2>
      <p>A premium human hair wig is an investment. With proper care, it can last 12–24 months and maintain its beauty throughout. Neglect it, and even the finest wig will dull and tangle within weeks. Here's the expert guide to keeping your wig flawless.</p>

      <h3>How Often Should You Wash?</h3>
      <p>Wash your human hair wig every 8–10 wears, or when you notice product buildup. Over-washing strips the hair of its natural oils, leading to dryness and breakage. Under-washing causes product buildup and odour.</p>

      <h3>The Right Way to Wash</h3>
      <ol>
        <li>Gently detangle with a wide-tooth comb before washing, starting from the tips and working up to the roots</li>
        <li>Fill a basin with cool to lukewarm water, never hot</li>
        <li>Add a sulphate-free, moisturising shampoo</li>
        <li>Submerge the wig and gently swish; do not scrub or wring</li>
        <li>Rinse thoroughly under running cool water</li>
        <li>Apply a deep conditioning mask from mid-lengths to ends, leave for 10–15 minutes</li>
        <li>Rinse out completely</li>
      </ol>

      <h3>Drying Your Wig</h3>
      <p>Pat gently with a microfibre towel; never rub. Place on a wig stand and allow to air dry completely. If you must blow dry, use the lowest heat setting with a diffuser attachment and a heat protectant spray. Never blow dry on high heat.</p>

      <h3>Styling Tips</h3>
      <p>Always use heat protectant before any heat styling. For human hair wigs, keep your flat iron or curling wand below 180°C. Avoid the roots and lace when applying heat. Deep condition after any heat styling session to restore moisture.</p>

      <h3>Daily Care Routine</h3>
      <p>Each morning, gently detangle with a wide-tooth comb or paddle brush. Spritz with a wig-specific leave-in conditioner for shine and moisture. When not wearing, store on a wig stand away from sunlight and humidity.</p>
    `,
  },
  'mens-hair-systems-breaking-stigma': {
    title: "Men's Hair Systems: Breaking the Stigma",
    author: 'Vikram Patel, Co-Founder & CEO',
    date: 'January 15, 2025',
    readTime: '5 min read',
    tag: "Men's Hair",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=80',
    content: `
      <h2>The Conversation We've Been Avoiding</h2>
      <p>Hair loss affects approximately 50% of Indian men by the age of 50. Yet, in a culture where a man's appearance is intrinsically linked to his confidence and professional image, we barely talk about it. And when we do, the conversation is often filled with shame, silence, or bad jokes.</p>
      <p>It's time to change that narrative.</p>

      <h3>Modern Hair Systems Are Nothing Like Your Grandfather's Toupee</h3>
      <p>The word "toupee" conjures images of obvious, unconvincing hairpieces, the butt of countless jokes. But today's hair systems bear no resemblance to those relics. Swiss lace technology, pioneered in the high-end theatre industry and refined for everyday wear, creates a base so thin it becomes invisible on your scalp.</p>
      <p>At Glamour Hair Studios, our flagship Swiss Lace Hair System uses a base that is 0.03mm thick, thinner than a human hair. The hair is individually hand-tied using the same method as professional hair extensions, creating movement that is completely indistinguishable from natural hair growth.</p>

      <h3>Who Wears Hair Systems?</h3>
      <p>The reality might surprise you. Actors, executives, athletes, teachers, and doctors: men from every walk of life are using hair systems to present their best selves. Our customers include a Supreme Court judge, three IPL cricketers, and several prominent Bollywood actors.</p>
      <p>The difference? They chose to keep it private, because a great hair system means nobody knows.</p>

      <h3>The Confidence Multiplier</h3>
      <p>A study published in the British Journal of Dermatology found that hair loss significantly impacts men's self-esteem, social confidence, and professional performance. Many men report avoiding networking events, dates, and photographs due to hair loss anxiety.</p>
      <p>Our customer surveys show that 94% of men report a measurable improvement in confidence within 30 days of starting a hair system. 78% report better professional performance. 86% say their social life improved.</p>

      <h3>The Glamour Hair Studios Approach</h3>
      <p>We don't just sell a hairpiece. We offer a comprehensive consultation where our trichologists analyse your hair loss pattern, natural hair colour, texture, and scalp characteristics to recommend the perfect system and colour match. We then teach you the proper attachment technique and ongoing care routine.</p>
      <p>The result is a hair system that moves with you, survives workouts, swimming, and intimacy, and that nobody will detect unless you choose to tell them.</p>
    `,
  },
};

type Article = {
  title: string;
  author: string;
  date: string;
  readTime: string;
  tag: string;
  image?: string;
  html?: string;
  paragraphs?: string[];
};

/** A static guide by slug, or a post published from the admin blog. */
async function findPost(slug: string): Promise<Article | null> {
  const local = BLOG_CONTENT[slug];
  if (local) return { ...local, html: local.content };
  const remote = (await getAllBlogs()).find((b: { slug?: string }) => b.slug === slug);
  if (!remote) return null;
  const text: string = remote.content || '';
  let tag = 'Blog';
  try {
    const tags = typeof remote.tags === 'string' ? JSON.parse(remote.tags) : remote.tags;
    if (Array.isArray(tags) && tags[0]) tag = String(tags[0]);
  } catch { /* tags stay "Blog" */ }
  return {
    title: remote.title,
    author: remote.author || 'Glamour Hair Studios',
    date: remote.createdAt
      ? new Date(remote.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : '',
    readTime: `${Math.max(1, Math.round(text.split(/\s+/).length / 200))} min read`,
    tag,
    image: remote.image,
    paragraphs: text.split(/\n{2,}/).map((p: string) => p.trim()).filter(Boolean),
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await findPost(params.slug);
  return {
    title: post ? `${post.title} | Glamour Hair Studios Blog` : 'Blog Post | Glamour Hair Studios',
    description: post ? `${post.author}, ${post.readTime}` : '',
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const fallback = BLOG_CONTENT['ultimate-guide-choosing-first-wig'];
  const post = (await findPost(params.slug)) || { ...fallback, html: fallback.content };

  const relatedPosts = Object.entries(BLOG_CONTENT)
    .filter(([slug]) => slug !== params.slug)
    .slice(0, 2);

  return (
    <div>
      <header className="bg-paper">
        <div className="container-custom pt-10 lg:pt-16 pb-10">
          <Crumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.title, href: `/blog/${params.slug}` }]} />
          <div className="max-w-3xl">
            <p className="text-[0.9375rem] font-medium text-accent">{post.tag}</p>
            <h1 className="font-display text-[length:var(--text-display-s)] leading-[1.05] tracking-[var(--tracking-display)] text-ink mt-3 [overflow-wrap:break-word]">
              {post.title}
            </h1>
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[0.9375rem]">
              <div className="flex gap-2"><dt className="text-ink-muted">By</dt><dd className="text-ink">{post.author}</dd></div>
              {post.date && <div className="flex gap-2"><dt className="text-ink-muted">Published</dt><dd className="text-ink">{post.date}</dd></div>}
              <div className="flex gap-2"><dt className="visually-hidden">Reading time</dt><dd className="text-ink-soft">{post.readTime}</dd></div>
            </dl>
          </div>
        </div>
        <div className="container-custom">
          <div data-slot={`blog-${params.slug}-cover`} className="relative aspect-[16/9] lg:aspect-[21/9] rounded-card overflow-hidden bg-paper-3">
            {post.image && (
              <Image src={post.image} alt="" fill priority sizes="(min-width: 1440px) 1312px, 100vw" className="object-cover" />
            )}
          </div>
        </div>
      </header>

      <div className="container-custom section-md grid gap-14 lg:grid-cols-12">
        <article className="lg:col-span-8 min-w-0">
          {post.html ? (
            <div className="article" dangerouslySetInnerHTML={{ __html: post.html }} />
          ) : (
            <div className="article">
              {post.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-rule flex items-center justify-between flex-wrap gap-4">
            <p className="text-[0.9375rem] text-ink-soft">
              Filed under <span className="text-ink font-medium">{post.tag}</span>
            </p>
            <div className="flex items-center gap-4">
              <button type="button" className="inline-flex items-center gap-2 min-h-[44px] px-1 text-[0.9375rem] text-ink-soft hover:text-accent transition-colors rounded-sm">
                <Heart className="w-4 h-4" aria-hidden /> Save
              </button>
              <ShareButton title={post.title} />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-[3.5rem_minmax(0,1fr)] gap-4 items-start">
            <span aria-hidden className="w-14 h-14 rounded-full bg-paper-3 grid place-items-center font-display text-[1.5rem] text-ink">
              {post.author[0]}
            </span>
            <div>
              <p className="font-semibold text-ink">{post.author}</p>
              <p className="text-[0.9375rem] text-ink-soft mt-1 leading-[1.6] max-w-[56ch]">
                Expert contributor at Glamour Hair Studios. All articles are reviewed by our certified trichologist team.
              </p>
            </div>
          </div>
        </article>

        <aside className="lg:col-span-4 lg:col-start-9 xl:col-span-3 xl:col-start-10 min-w-0 grid gap-10 content-start">
          <nav aria-labelledby="more-articles-h">
            <h2 id="more-articles-h" className="font-semibold text-ink text-[1.0625rem]">More articles</h2>
            <ul className="mt-3 border-t border-rule">
              {relatedPosts.map(([slug, p]) => (
                <li key={slug} className="border-b border-rule">
                  <Link href={`/blog/${slug}`} className="group grid grid-cols-[4rem_minmax(0,1fr)] gap-3 py-4 rounded-sm">
                    <span className="relative w-16 h-16 rounded-card overflow-hidden bg-paper-3">
                      <Image src={p.image} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.9375rem] font-medium text-ink leading-snug line-clamp-2 group-hover:text-accent transition-colors">{p.title}</span>
                      <span className="block text-[0.875rem] text-ink-muted mt-1">{p.readTime}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="bg-paper-2 rounded-card p-6">
            <h2 className="font-display text-[length:var(--text-xl)] text-ink leading-tight">Try on any wig, free</h2>
            <p className="text-[0.9375rem] text-ink-soft leading-[1.6] mt-2">See how any Glamour Hair Studios wig looks on you using our AI-powered virtual try-on tool.</p>
            <Link href="/try-on" className="btn-primary mt-5 w-full justify-center whitespace-nowrap">Launch Try-On</Link>
          </div>

          <div>
            <h2 className="font-display text-[length:var(--text-xl)] text-ink leading-tight">Get expert advice</h2>
            <p className="text-[0.9375rem] text-ink-soft leading-[1.6] mt-2">Not sure which wig is right for you? Book a free consultation with our certified hair specialists.</p>
            <Link href="/contact" className="btn-secondary mt-5 w-full justify-center whitespace-nowrap">Book Consultation</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
