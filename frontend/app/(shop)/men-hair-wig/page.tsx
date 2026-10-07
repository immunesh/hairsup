import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, ArrowRight, CheckCircle2,
  Sparkles, Star, Package, ShieldCheck, Clock, HeartHandshake
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Men Hair Wig Dealers | HairsUp',
  description: 'Buy premium quality human hair wigs for men. Get a convincing and effective remedy for hair loss without expensive surgery.',
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Men Hair Wig', href: '/men-hair-wig' },
];

const FEATURES = [
  { icon: Clock, title: 'Used Since Ancient Times', desc: 'Wigs have improved remarkably over history. Today\'s wigs look 100% natural.' },
  { icon: Sparkles, title: 'Match Your Personality', desc: 'Choose from long, short, spiky, and various colors to suit your exact style.' },
  { icon: ShieldCheck, title: 'No Discomfort', desc: 'Designed to never fail their owners and become one with their head, heart, and soul.' },
  { icon: HeartHandshake, title: 'Specialist Guarantee', desc: 'Highest quality natural hair that easily passes off as the real thing.' },
];

const FAQS = [
  { q: 'Is a hair wig better than surgery?', a: 'Surgery and hair transplants are expensive and come with their own list of cons. High-quality human hair wigs provide a substantial, cost-effective, and instant solution to hair loss without the risks.' },
  { q: 'Will people notice I am wearing a wig?', a: 'No. Our men\'s wigs are made from the highest quality natural hair which easily passes off as the real thing. Wear it, and no one can spot the difference.' },
  { q: 'Can I style my wig?', a: 'Yes. Whether you desire long hair, short spiky ones, or a specific color, you can choose your design and style it to match your personality perfectly.' },
  { q: 'Are they comfortable to wear daily?', a: 'Our confidence comes from the assurance that none of our products will cause discomfort. They are designed to become one with you.' },
];

const RELATED_PRODUCTS = [
  { title: 'Hair Wig', href: '/hair-wig' },
  { title: 'Women Hair Wig', href: '/women-hair-wig' },
  { title: 'Hair Patch', href: '/search?q=hair%20patch' },
];

export default function MenHairWigPage() {
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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-4">Men Hair Wigs</h1>
          <p className="text-ink-muted text-lg">
            A convincing and effective remedy to hair loss with our premium human hair wigs.
          </p>
        </div>
      </div>

      {/* ─── INTRODUCTION ───────────────────────────────────────────── */}
      <section 
        className="section-lg relative text-white"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-brand-950/85 mix-blend-multiply"></div>
        <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">Men Hair Wig Dealers</h2>
            <p className="text-white/90 leading-relaxed mb-4">
              We are amongst the most acknowledged names betrothed in providing a huge gamut of quality rich Human Hair Wigs to our customers. Utilization of progressive tools along with cutting-edge machinery and technology enables us to manufacture this distinctive collection of wigs.
            </p>
            <p className="text-white/90 leading-relaxed mb-4">
              Men have tried and failed, hair products come and go, claims made and denounced, but a convincing and effective remedy is still not found among these hair growth solutions. A more expensive way out is surgery and hair transplant, but not everyone can afford that and even that comes with its own list of cons.
            </p>
            <p className="text-white/90 leading-relaxed font-semibold">
              Amidst all this furor surrounding the cause and effect and a substantial solution to hair loss, one particular remedy that sticks out is premium hair wigs.
            </p>
          </div>
          <div 
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-white shadow-xl border border-white/20 relative overflow-hidden"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-brand-950/85 mix-blend-multiply"></div>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Star className="w-32 h-32" />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Importance Of Men Hair Wigs</h3>
            <p className="text-white/80 leading-relaxed text-sm mb-4 relative z-10">
              Is it long hair you desire? Or short spiky ones? Well choose your design and your style from a plethora of options available online where you can easily buy men hair wigs. And why only stop at the style, when you can also choose from a range of colors depending on what look you want to sport.
            </p>
            <p className="text-white/80 leading-relaxed text-sm relative z-10">
              Men who lose sleep over losing hair, take note of this and use it the next time you frown upon your own receding hairline or bald spot. Now looking good is all but a matter of selecting the best hair wig that goes best with your personality, and watch as compliments start being thrown your way.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────────────────── */}
      <section className="section-lg bg-cream">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="section-title heading-decorate">Why Choose Our Men's Wigs?</h2>
            <p className="section-subtitle">We consider ourselves specialists in fashioning men's hair wigs.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {FEATURES.map((feature, i) => (
              <div key={i} className="card p-6 bg-white flex flex-col items-center text-center hover:shadow-product-hover transition-shadow border-t-4 border-brand-500">
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
            <h2 className="section-title heading-decorate">Styles & Results</h2>
            <p className="section-subtitle">A glimpse into our premium natural human hair wigs for men.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 border border-gray-300">
                {/* Fallback image used as placeholder for gallery */}
                <Image src="/women.avif" alt={`Men Wig Showcase ${item}`} fill className="object-cover opacity-50 grayscale" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">Men's Style {item}</span>
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
              Get Your Natural Look Back Today
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Ready to experience the ultimate versatility and quality? Browse our complete men's collection or speak with our experts to find exactly what you need.
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
