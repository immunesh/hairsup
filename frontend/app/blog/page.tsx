import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hair Care Blog & Style Guides | HairsUp',
  description: 'Expert hair care tips, styling guides, and inspiration from the HairsUp team. Everything you need to know about wigs and hair systems.',
};

const POSTS = [
  {
    title: 'The Ultimate Guide to Choosing Your First Wig',
    slug: 'ultimate-guide-choosing-first-wig',
    excerpt: 'Everything you need to know before buying your first wig — cap construction, hair types, sizing, and how to get the most natural look.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    author: 'Dr. Anita Sharma',
    readTime: '8 min read',
    tag: 'Beginner Guide',
    date: 'Jan 28, 2025',
    featured: true,
  },
  {
    title: 'How to Maintain Your Human Hair Wig',
    slug: 'how-to-maintain-human-hair-wig',
    excerpt: 'Expert tips to keep your human hair wig looking flawless for longer — washing, conditioning, drying, and styling the right way.',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80',
    author: 'Priya Mehta',
    readTime: '6 min read',
    tag: 'Care Tips',
    date: 'Jan 20, 2025',
    featured: true,
  },
  {
    title: "Men's Hair Systems: Breaking the Stigma",
    slug: 'mens-hair-systems-breaking-stigma',
    excerpt: "Hair loss affects 50% of Indian men by 50. Modern hair systems are undetectable — here's why it's time to embrace the solution.",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
    author: 'Vikram Patel',
    readTime: '5 min read',
    tag: "Men's Hair",
    date: 'Jan 15, 2025',
    featured: false,
  },
  {
    title: "5 Wig Styling Trends Dominating 2025",
    slug: '5-wig-styling-trends-2025',
    excerpt: 'From butter-blonde lace fronts to textured natural afros — the hottest wig styles that are everywhere this year.',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e44489ece?w=800&q=80',
    author: 'Priya Mehta',
    readTime: '4 min read',
    tag: 'Style Guide',
    date: 'Jan 10, 2025',
    featured: false,
  },
  {
    title: 'Synthetic vs. Human Hair Wigs: The Definitive Comparison',
    slug: 'synthetic-vs-human-hair-wigs',
    excerpt: "Budget, lifestyle, styling needs — we break down the differences to help you decide which type of wig is right for you.",
    image: 'https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=800&q=80',
    author: 'Dr. Anita Sharma',
    readTime: '7 min read',
    tag: 'Buying Guide',
    date: 'Jan 5, 2025',
    featured: false,
  },
  {
    title: "Wigs for Cancer Patients: A Compassionate Guide",
    slug: 'wigs-for-cancer-patients-guide',
    excerpt: 'Navigating hair loss during chemotherapy. Which wigs are most comfortable, how to get your wig prescribed, and emotional support resources.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
    author: 'Dr. Anita Sharma',
    readTime: '10 min read',
    tag: 'Medical',
    date: 'Dec 28, 2024',
    featured: false,
  },
];

const TAG_COLORS: Record<string, string> = {
  'Beginner Guide': 'bg-green-100 text-green-700',
  'Care Tips': 'bg-blue-100 text-blue-700',
  "Men's Hair": 'bg-gray-100 text-gray-700',
  'Style Guide': 'bg-pink-100 text-pink-700',
  'Buying Guide': 'bg-amber-100 text-amber-700',
  'Medical': 'bg-red-100 text-red-700',
};

const CATEGORIES = ['All', 'Beginner Guide', 'Care Tips', "Men's Hair", 'Style Guide', 'Buying Guide', 'Medical'];

export default function BlogPage() {
  const featured = POSTS.filter((p) => p.featured);
  const rest = POSTS.filter((p) => !p.featured);

  return (
    <div>
      {/* Hero */}
      <div className="page-hero py-16 text-center">
        <div className="container-custom max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Hair Care Blog & Style Guides
          </h1>
          <p className="text-white/75 text-lg">
            Expert tips, styling guides, and inspiration from our certified trichologists and style directors.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Category pills */}
        <div className="flex gap-2 mb-10 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${cat === 'All' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured posts */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {featured.map((post, i) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group card overflow-hidden">
              <div className="relative h-56 overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className={`badge text-xs mb-2 ${TAG_COLORS[post.tag] || 'bg-brand-100 text-brand-700'}`}>{post.tag}</span>
                  <h2 className="text-white font-display font-bold text-xl leading-tight">{post.title}</h2>
                </div>
                {i === 0 && <div className="absolute top-3 right-3 bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded-full">Featured</div>}
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <span className="text-brand-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All posts */}
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">More Articles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group card overflow-hidden">
              <div className="relative h-44 overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3">
                  <span className={`badge text-xs ${TAG_COLORS[post.tag] || 'bg-brand-100 text-brand-700'}`}>{post.tag}</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{post.date} · {post.readTime}</p>
                <h3 className="font-display font-bold text-gray-900 mb-2 leading-tight group-hover:text-brand-600 transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
