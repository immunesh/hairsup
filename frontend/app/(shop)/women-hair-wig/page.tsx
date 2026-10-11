import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, ArrowRight, Heart,
  Sparkles, Star, Package, Activity, Droplet
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Women Hair Wig Wholesaler | HairsUp',
  description: 'Premium quality women hair wigs to solve hair loss gracefully. Natural looking parting, 100% human hair, handmade for maximum natural look.',
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Women Hair Wig', href: '/women-hair-wig' },
];

const FEATURES = [
  { icon: Heart, title: 'Sensitive & Caring', desc: 'We understand women\'s hair loss is delicate and support our customers deeply.' },
  { icon: Sparkles, title: '100% Human Hair', desc: 'Made with 100% Nature Human hair that looks and styles like your own.' },
  { icon: Activity, title: 'Natural Parting', desc: 'Full hand-tied monofilament top allows you to change parting for different looks.' },
  { icon: Droplet, title: 'Smoothness & Comfort', desc: 'Handmade wigs ensuring softness, comfort, and fitting close to the head.' },
];

const FAQS = [
  { q: 'What causes female hair loss?', a: 'Women lose hair due to age, hormonal changes, medical conditions, stress, genetics, and chronic alopecia, which can advance to Female Pattern Baldness.' },
  { q: 'Do the wigs look natural?', a: 'Yes. Our monofilament top makes a natural-looking parting. They are handmade from 100% Nature Human hair and fit really close to the head for a maximum natural look.' },
  { q: 'Can I wash the women\'s patch?', a: 'Yes, you can wash it in cold water by hand. However, do not use a hair comb.' },
  { q: 'Are these affordable?', a: 'We offer the lowest rates on the market. Every size is available at very cheap prices without compromising on Remy human hair quality.' },
];

const RELATED_PRODUCTS = [
  { title: 'Hair Wig', href: '/hair-wig' },
  { title: 'Men Hair Wig', href: '/men-hair-wig' },
  { title: 'Hair Patch', href: '/search?q=hair%20patch' },
];

export default function WomenHairWigPage() {
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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-4">Women Hair Wigs</h1>
          <p className="text-ink-muted text-lg">
            Solve hair loss gracefully and win back your confidence with our premium handmade wigs.
          </p>
        </div>
      </div>

      {/* ─── INTRODUCTION ───────────────────────────────────────────── */}
      <section 
        className="section-lg relative text-white"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-brand-950/85 mix-blend-multiply"></div>
        <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">Women Hair Wig Wholesaler</h2>
            <p className="text-white/90 leading-relaxed mb-4">
              Women lose their hair due to various reasons and it starts with hair thinning out and then the hair parting becoming bigger, finally advancing to "Female Pattern Baldness". Many reasons are attributed to this—age, hormonal changes, medical conditions, stress, skin conditions, genetics, and chronic alopecia.
            </p>
            <p className="text-white/90 leading-relaxed mb-4 font-semibold">
              At HairsUp, we understand "Women's Hair Loss" is a very delicate and sensitive matter that affects overall looks and personality. We support our customers to solve this problem and help them get their looks and confidence back!
            </p>
            <p className="text-white/90 leading-relaxed">
              We also provide women wigs and ladies patches that cover your bald area at the lowest rate on the market. Our patches are prepared from Remy human hair, providing a completely natural scalp.
            </p>
          </div>
          <div 
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-white shadow-xl border border-white/20 relative overflow-hidden"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-brand-950/85 mix-blend-multiply"></div>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Heart className="w-32 h-32" />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Premium Monofilament Quality</h3>
            <p className="text-white/80 leading-relaxed text-sm mb-4 relative z-10">
              We provide a wide variety of Women's wigs in different lengths. The monofilament top makes a natural-looking parting. This is a handmade women's wig that gives a natural form.
            </p>
            <p className="text-white/80 leading-relaxed text-sm relative z-10">
              The full hand-tied monofilament top allows you to change the parting for different looks. This ladies' wig is all about smoothness and comfort. Made with 100% Nature Human hair, it looks very soft, styles like your own hair, and fits really close to the head for the maximum natural look.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────────────────── */}
      <section className="section-lg bg-cream">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="section-title heading-decorate">Why Choose Our Women's Wigs?</h2>
            <p className="section-subtitle">Delicate care combined with premium, natural-looking materials.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {FEATURES.map((feature, i) => (
              <div key={i} className="card p-6 bg-white flex flex-col items-center text-center hover:shadow-product-hover transition-shadow border-t-4 border-brand-400">
                <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center mb-5 text-brand-600">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GALLERY ────────────────────────────────────────────────── */}
      <section className="section-lg bg-mist">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="section-title heading-decorate">Premium Collections</h2>
            <p className="section-subtitle">A glimpse into our natural human hair wigs for women.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 border border-gray-300">
                {/* Fallback image used as placeholder for gallery */}
                <Image src="/women.avif" alt={`Women Wig Showcase ${item}`} fill className="object-cover opacity-50 grayscale" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">Women's Style {item}</span>
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
            <Heart className="w-10 h-10 text-brand-300 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Win Back Your Confidence
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Ready to experience a completely natural look with our premium handmade wigs? Browse our collection or speak with our sensitive and caring experts today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 px-8 py-3.5">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RELATED PRODUCTS ───────────────────────────────────────── */}
      <section className="section-md container-custom border-t border-gray-100">
        <h3 className="font-display font-bold text-2xl text-center mb-8">Explore Related Products</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {RELATED_PRODUCTS.map((product) => (
            <Link key={product.title} href={product.href} className="card bg-white px-6 py-4 flex items-center gap-2 hover:shadow-product-hover transition-all group">
              <span className="font-semibold text-gray-800 group-hover:text-brand-600 transition-colors">{product.title}</span>
              <ArrowRight className="w-4 h-4 text-brand-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
