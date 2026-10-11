import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, ArrowRight, UserCheck, CheckCircle2,
  Star, Clock, HeartHandshake, Zap, ShieldCheck, Scissors, AlertCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hair Patch Service | HairsUp',
  description: 'Trusted hair patch services for partial baldness. Non-surgical, comfortable, durable, and affordable with a completely natural appearance.',
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Hair Patch', href: '/hair-patch' },
];

const WHY_CHOOSE_US = [
  { icon: UserCheck, title: 'Natural Appearance', desc: 'Our patches blend effortlessly with your existing hair.' },
  { icon: Star, title: 'Affordable Prices', desc: 'Premium quality services at competitive rates.' },
  { icon: Zap, title: 'Quick Application', desc: 'Enjoy a hassle-free, non-surgical process.' },
  { icon: HeartHandshake, title: 'Expert Team', desc: 'Highly skilled professionals committed to customer satisfaction.' },
];

const BENEFITS = [
  'Low-cost technique',
  'Desired hairstyle achieved',
  'Painless procedure',
  'Can wear or remove when needed',
  'No suture or cut is required',
  'Application just takes 1-2 hrs',
];

const GUIDELINES = [
  'Give preference to sieve hair patch; sweating is less.',
  'Maintain hygienic condition well.',
  'Avoid stretching or pulling of hair patch.',
  'Do not use heavy cosmetics directly on the patch.',
  'Do regular shampoo to avoid dirt/dust in the scalp.',
  'Apply conditioner and serum to maintain quality.',
];

const FAQS = [
  { q: 'What is the difference between a hair wig and a patch?', a: 'A hair wig covers the entire scalp, often requiring natural hair to be completely removed. A hair patch covers only a small bald area. When applying a patch, natural hair is not removed, though some minor cutting might be done to blend it perfectly.' },
  { q: 'How is a hair patch applied?', a: 'Before applying, the patch is cut according to the bald area. The scalp is cleaned, and the patch is applied using either skin-friendly glue and tape, or small clips and tapes on the sides. It is highly comfortable and easy to manage at home.' },
  { q: 'What colors and shapes are available?', a: 'Our hair patches are available in many shapes based on the scalp size. They come in 3 primary colors: Light Brown, Dark Brown, and Black.' },
  { q: 'Is it safe for sensitive skin?', a: 'Usually, hair patch application does not create any problems. The adhesives are skin-friendly, and the probability of allergy is extremely low even for highly sensitive skin.' },
];

const RELATED_PRODUCTS = [
  { title: 'Hair Wig', href: '/hair-wig' },
  { title: 'Men Hair Wig', href: '/men-hair-wig' },
  { title: 'Women Hair Wig', href: '/women-hair-wig' },
];

export default function HairPatchPage() {
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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-4">Hair Patch Service</h1>
          <p className="text-ink-muted text-lg">
            A customized, non-surgical solution for partial baldness with a natural, seamless look.
          </p>
        </div>
      </div>

      {/* ─── INTRODUCTION ───────────────────────────────────────────── */}
      <section 
        className="section-lg relative text-white"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1600948836101-f9ff16016c02?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-brand-950/85 mix-blend-multiply"></div>
        <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">Restore Your Confidence</h2>
            <p className="text-white/90 leading-relaxed mb-4">
              Are you struggling with hair loss and searching for a non-surgical solution? Look no further than HairsUp, the trusted name for hair patches. Our customized hair patches are designed to restore your confidence with a natural, seamless look.
            </p>
            <p className="text-white/90 leading-relaxed mb-4">
              Whether you are experiencing partial baldness or need a full hair restoration, our services are tailored to meet your needs. Our hair patch service ensures comfort, durability, and affordability.
            </p>
            <p className="text-white/90 leading-relaxed font-semibold">
              The patches are made from high-quality, skin-friendly materials, providing a breathable and lightweight experience. We focus on delivering personalized solutions, ensuring each hair patch matches your hair texture, color, and style perfectly.
            </p>
          </div>
          <div 
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-white shadow-xl border border-white/20 relative overflow-hidden"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1600948836101-f9ff16016c02?auto=format&fit=crop&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-brand-950/85 mix-blend-multiply"></div>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Scissors className="w-32 h-32" />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Why Choose Us?</h3>
            <ul className="space-y-4 relative z-10">
              {WHY_CHOOSE_US.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 bg-white/10 p-1.5 rounded-lg flex-shrink-0">
                    <item.icon className="w-4 h-4 text-brand-300" />
                  </div>
                  <div>
                    <strong className="block text-brand-100">{item.title}</strong>
                    <span className="text-white/80 text-sm">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>
      </section>

      {/* ─── BENEFITS & GUIDELINES ──────────────────────────────────── */}
      <section className="section-lg bg-cream">
        <div className="container-custom max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="card bg-white p-8 border-t-4 border-brand-500">
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-brand-600" /> Benefits Of Hair Patches
            </h3>
            <ul className="space-y-3">
              {BENEFITS.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card bg-white p-8 border-t-4 border-coral-500">
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center gap-3">
              <AlertCircle className="w-7 h-7 text-coral-600" /> Things To Keep In Mind
            </h3>
            <ul className="space-y-3">
              {GUIDELINES.map((guide, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <ArrowRight className="w-4 h-4 text-coral-500 mt-1 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{guide}</span>
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
            <h2 className="section-title heading-decorate">Before & After</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 border border-gray-300">
                <Image src="/ba-2.png" alt={`Result Showcase ${item}`} fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">Result {item}</span>
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
              Ready for a Full Head of Hair?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Say goodbye to hair loss worries and hello to renewed confidence. Contact us today and take the first step towards a seamless, natural look.
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
        <h3 className="font-display font-bold text-2xl text-center mb-8">Explore Related Services</h3>
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
