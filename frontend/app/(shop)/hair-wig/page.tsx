import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, ArrowRight, ShieldCheck,
  Sparkles, Star, Package, Scissors, CheckCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Quality Hair Wig Manufacturer | HairsUp',
  description: 'Buy the best quality natural hair wigs and designer wigs at reasonable prices. Explore our wide range of full lace, front lace, and silk base wigs.',
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Hair Wig', href: '/hair-wig' },
];

const WIG_TYPES = [
  {
    title: 'Hair Patch',
    desc: 'We offer a wide range of Hair Patches following exact customer needs. Recognized for optimum quality, durability, and effective usage at affordable rates.',
    icon: Package
  },
  {
    title: 'Natural Hair Wig',
    desc: 'Exclusive range for Men and Women. Made using supreme quality basic materials and rigorously inspected against diverse quality parameters for defect-free delivery.',
    icon: ShieldCheck
  },
  {
    title: 'Designer Hair Wig',
    desc: 'High qualitative Designer Hair Wigs that are easy to use and maintain. Prepared using the utmost quality natural human hair and thoroughly checked for smoothness and silkiness.',
    icon: Scissors
  }
];

const FOUNDATIONS = [
  'Full Lace Foundation',
  'Front Lace Foundation',
  'Silk Base Foundation',
  'Mono-Filament Base'
];

const FAQS = [
  { q: 'Are your wigs made from natural hair?', a: 'Yes, we sell good quality natural hair wigs made utilizing supreme quality basic materials and natural human hair.' },
  { q: 'Can I style a natural hair wig?', a: 'Absolutely. Because they are made from natural human hair, our wigs can be colored or ironed to make stylish looks like wavy, curly, or straight without harming the wig.' },
  { q: 'Are these wigs just for covering baldness?', a: 'No, our hair wigs are not simply worn to hide up baldness. Many actors, actresses, and fashion enthusiasts use them to change their hairstyle regularly without causing side effects to their natural hair.' },
  { q: 'What sizes and colors are available?', a: 'Our wig shop offers the best quality hair wigs in different sizes, colors, and various wig cap foundations to perfectly match your requirements.' },
];

const RELATED_PRODUCTS = [
  { title: 'Men Hair Wig', href: '/products?category=men-wigs' },
  { title: 'Women Hair Wig', href: '/products?category=women-wigs' },
  { title: 'Hair Patch', href: '/search?q=hair%20patch' },
  { title: 'Shop All Products', href: '/products' },
];

export default function HairWigPage() {
  return (
    <div>
      {/* ─── HERO / BREADCRUMB ──────────────────────────────────────── */}
      <div className="page-hero py-14 text-center bg-mist border-b border-gray-100">
        <div className="container-custom max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
            {BREADCRUMBS.map((b, i) => (
              <span key={b.label} className="flex items-center gap-2">
                <Link href={b.href} className="hover:text-brand-600 transition-colors">{b.label}</Link>
                {i < BREADCRUMBS.length - 1 && <ChevronRight className="w-3 h-3" />}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-4">Hair Wig Manufacturer</h1>
          <p className="text-ink-muted text-lg">
            Buy the best quality natural and designer hair wigs at reasonable prices.
          </p>
        </div>
      </div>

      {/* ─── INTRODUCTION ───────────────────────────────────────────── */}
      <section 
        className="section-lg relative text-center text-white"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-brand-950/85 mix-blend-multiply"></div>
        <div className="container-custom max-w-3xl mx-auto relative z-10">
          <Sparkles className="w-10 h-10 text-brand-300 mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold mb-6">Best Quality Hair Wigs</h2>
          <p className="text-white/90 leading-relaxed mb-4">
            We sell good quality Hair Wigs which are the best product all over the region. Our house offers the best quality hair wigs or artificial scalps at low prices. A hair wig is a thoroughly diverse product than partial hair wigs, silicon systems, or membrane artificial skin.
          </p>
          <p className="text-white/90 leading-relaxed">
            Hair wigs are not simply worn to hide up baldness, but many people want to change their hairstyle every day. A hair wig is the best option to get the latest hairstyle on a regular basis without harming natural existing hair by coloring or ironing.
          </p>
        </div>
      </section>

      {/* ─── WIG TYPES ──────────────────────────────────────────────── */}
      <section className="section-lg bg-cream">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="section-title heading-decorate">Our Specialized Products</h2>
            <p className="section-subtitle">Explore our diverse range of high-quality hair replacement options.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {WIG_TYPES.map((type, i) => (
              <div key={i} className="card p-8 bg-white border-t-4 border-t-brand-500 hover:shadow-product-hover transition-shadow text-center">
                <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-5 text-brand-600">
                  <type.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOUNDATIONS ────────────────────────────────────────────── */}
      <section className="section-md container-custom">
        <div className="bg-brand-950 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-1/2">
            <h3 className="text-3xl font-display font-bold mb-4">Wig Cap Foundations</h3>
            <p className="text-white/80 leading-relaxed mb-6">
              Our shop offers different types of hair wigs in different sizes, colors, and various high-quality wig cap foundations to ensure maximum comfort and a natural look.
            </p>
            <Link href="/products" className="inline-flex items-center gap-2 text-brand-300 font-semibold hover:text-brand-200 transition-colors">
              Explore our collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="md:w-1/2 w-full">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FOUNDATIONS.map((foundation, i) => (
                <li key={i} className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  <span className="font-medium text-sm">{foundation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── GALLERY ────────────────────────────────────────────────── */}
      <section className="section-lg bg-mist">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="section-title heading-decorate">Product Showcase</h2>
            <p className="section-subtitle">A glimpse into our premium natural human hair wigs.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200">
                {/* Fallback image used as placeholder for gallery */}
                <Image src="/women.avif" alt={`Hair Wig Showcase ${item}`} fill className="object-cover opacity-50 grayscale" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">Premium Wig {item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ────────────────────────────────────────────────────── */}
      <section className="section-lg bg-cream">
        <div className="container-custom max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title heading-decorate">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden shadow-sm">
                <summary className="flex items-center justify-between p-5 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 rounded-2xl transition-colors">
                  {faq.q}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                  <p className="mt-4">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────── */}
      <section className="section-lg">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-brand-950 to-brand-800 rounded-3xl p-10 md:p-16 text-center text-white border border-brand-900 shadow-xl">
            <Star className="w-10 h-10 text-brand-300 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Find Your Perfect Style Today
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Ready to experience the ultimate versatility and quality? Browse our complete collection or speak with our experts to find exactly what you need.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 px-8 py-3.5">
                Shop Collection
              </Link>
              <Link href="/contact" className="border border-white/30 hover:border-white hover:bg-white/10 text-white font-semibold rounded-full px-8 py-3.5 transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RELATED SERVICES/PRODUCTS ─────────────────────────────── */}
      <section className="section-md container-custom border-t border-gray-100">
        <h3 className="font-display font-bold text-2xl text-center mb-8">Explore Related Products</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {RELATED_PRODUCTS.map((service) => (
            <Link key={service.title} href={service.href} className="card bg-white px-6 py-4 flex items-center gap-2 hover:shadow-product-hover transition-all group">
              <span className="font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">{service.title}</span>
              <ArrowRight className="w-4 h-4 text-brand-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
