import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, ArrowRight, HeartHandshake, ShieldCheck,
  Zap, Scissors, Star, Droplet
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hair Extensions | HairsUp',
  description: 'Premium quality hair extensions to instantly add length, volume, and color. Transform your look flawlessly.',
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/contact' },
  { label: 'Hair Extensions', href: '/hair-extensions' },
];

const BENEFITS = [
  { icon: Scissors, title: 'Instant Length & Volume', desc: 'Achieve your dream hair instantly.' },
  { icon: ShieldCheck, title: 'Damage-Free', desc: 'Safe application methods protecting natural hair.' },
  { icon: Zap, title: 'Style Versatility', desc: 'Color, cut, and style just like your own hair.' },
  { icon: Droplet, title: 'Natural Integration', desc: 'Seamlessly blends with your natural texture.' },
];

const FAQS = [
  { q: 'How long do hair extensions last?', a: 'Depending on the type of extensions and maintenance, they can last anywhere from 3 to 6 months with proper care.' },
  { q: 'Can I wash and style them?', a: 'Yes, our 100% human hair extensions can be washed, heat-styled, and colored just like your natural hair.' },
  { q: 'Will extensions damage my natural hair?', a: 'No. When applied and removed professionally by our experts, hair extensions are completely safe and will not damage your natural hair.' },
];

const RELATED_SERVICES = [
  { title: 'Hair Bonding', href: '/hair-bonding' },
  { title: 'Hair Weaving', href: '/hair-weaving' },
  { title: 'Hair Fixing', href: '/hair-fixing' },
];

export default function HairExtensionsPage() {
  return (
    <div>
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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-4">Hair Extensions</h1>
          <p className="text-ink-muted text-lg">
            Instantly add length, volume, and color with our premium 100% human hair extensions.
          </p>
        </div>
      </div>

      <section 
        className="section-lg relative text-white"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-brand-950/85 mix-blend-multiply"></div>
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Transform Your Look</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                Hair extensions are a phenomenal way to instantly add length, volume, and even chemical-free color dimension to your natural hair. At HairsUp, we specialize in seamless integration that looks and feels entirely natural.
              </p>
              <p className="text-white/90 leading-relaxed font-semibold">
                Our extensions are crafted from 100% premium human hair, ensuring they can be washed, heat-styled, and treated exactly like your own hair.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-white shadow-xl border border-white/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Star className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Premium Quality Guaranteed</h3>
                <p className="text-white/80 leading-relaxed text-sm">
                  We believe in providing only the finest quality human hair. Our application techniques are advanced, ensuring that the extensions sit flat against the head, remaining undetectable and comfortable for daily wear.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-lg bg-cream">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="section-title heading-decorate">Why Choose Our Extensions?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {BENEFITS.map((feature, i) => (
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

      <section className="section-lg">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-brand-950 to-brand-800 rounded-3xl p-10 md:p-16 text-center text-white border border-brand-900 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Get Your Dream Hair Today
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Ready for long, voluminous hair? Book a free consultation with our experts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 px-8 py-3.5">
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
