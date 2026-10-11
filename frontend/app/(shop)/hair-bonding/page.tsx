import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, ArrowRight, CheckCircle2, Shield,
  Scissors, HeartHandshake, Smile, RefreshCw, Star
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hair Bonding Service | HairsUp',
  description: 'Learn about hair bonding, available options, the process, benefits, maintenance, and how to book a consultation with our hair experts.',
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/contact' },
  { label: 'Hair Bonding', href: '/hair-bonding' },
];

const WHO_MAY_CONSIDER = [
  { icon: Scissors, title: 'Patchy Hair Loss', desc: 'Effectively cover specific areas of thinning or bald patches.' },
  { icon: HeartHandshake, title: 'Thinning Hair', desc: 'Add volume and density to areas with sparse hair seamlessly.' },
  { icon: Smile, title: 'Receding Hairline', desc: 'Restore a natural-looking frontal hairline.' },
  { icon: Shield, title: 'Visible Scalp', desc: 'Create the appearance of a fuller, denser head of hair.' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Consultation', desc: 'Initial discussion to understand your needs and lifestyle.' },
  { step: '02', title: 'Hair & Scalp Assessment', desc: 'Examining the affected area for the best bonding approach.' },
  { step: '03', title: 'Selection', desc: 'Choosing the suitable hair system and materials.' },
  { step: '04', title: 'Color Matching', desc: 'Ensuring a perfect blend with your natural hair texture and color.' },
  { step: '05', title: 'Preparation', desc: 'Preparing the scalp area for optimal adhesion.' },
  { step: '06', title: 'Application', desc: 'Professional and secure bonding of the hair system.' },
  { step: '07', title: 'Styling', desc: 'Cutting and styling the bonded hair to your preference.' },
  { step: '08', title: 'Maintenance Guide', desc: 'Learning how to care for your new hair system.' },
];

const FAQS = [
  { q: 'What is hair bonding?', a: 'Hair bonding is a non-surgical hair replacement solution that involves attaching a suitable hair system to the existing hair or scalp to create a natural-looking appearance.' },
  { q: 'Is hair bonding suitable for thinning hair?', a: 'Yes, it is an excellent option for adding volume and density to thinning areas without the need for surgery.' },
  { q: 'How long does hair bonding last?', a: 'The duration depends on the hair system, adhesive type, your lifestyle, and maintenance routine. Typically, it requires professional adjustment every few weeks.' },
  { q: 'Can I wash my hair after bonding?', a: 'Yes, you can wash your hair, but you should follow the specific maintenance instructions provided by our specialists to ensure the bond remains secure.' },
  { q: 'Is a consultation required before hair bonding?', a: 'Yes, a professional consultation is essential to assess your hair and scalp, understand your goals, and select the best bonding option for you.' },
];

const RELATED_SERVICES = [
  { title: 'Hair Replacement', href: '/contact?service=hair-replacement' },
  { title: 'Hair Weaving', href: '/contact?service=hair-weaving' },
  { title: 'Hair Extensions', href: '/contact?service=hair-extensions' },
  { title: 'Hair Fixing', href: '/contact?service=hair-fixing' },
];

export default function HairBondingPage() {
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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-4">Hair Bonding</h1>
          <p className="text-ink-muted text-lg">
            A non-surgical hair replacement solution designed to improve the appearance of thinning hair, bald patches, and hair loss.
          </p>
        </div>
      </div>

      {/* ─── INTRODUCTION ───────────────────────────────────────────── */}
      <section
        className="section-lg relative text-center text-white"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-brand-950/85 mix-blend-multiply"></div>
        <div className="container-custom max-w-3xl mx-auto relative z-10">
          <p className="text-brand-300 font-semibold tracking-wider uppercase text-sm mb-2">Discover</p>
          <h2 className="text-3xl font-display font-bold mb-6">What is Hair Bonding?</h2>
          <p className="lead text-white/90 leading-relaxed mb-4">
            Hair bonding is an effective, non-surgical hair enhancement technique. It involves attaching a suitable hair system or hair extension to your existing hair or scalp area. The result is a seamless, natural-looking appearance that blends flawlessly with your own hair.
          </p>
          <p className="text-white/70 mt-4 text-sm">
            Whether you are experiencing reduced hair density or simply need a fuller-looking hairstyle, hair bonding can provide an immediate visual change tailored to your needs.
          </p>
        </div>
      </section>

      {/* ─── WHO MAY CONSIDER ───────────────────────────────────────── */}
      <section className="section-lg bg-cream">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="section-title heading-decorate">Who May Consider Hair Bonding?</h2>
            <p className="section-subtitle">Common situations where hair bonding is a suitable solution.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHO_MAY_CONSIDER.map((item) => (
              <div key={item.title} className="card p-6 bg-white text-center hover:shadow-product-hover transition-shadow">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-600">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OPTIONS ────────────────────────────────────────────────── */}
      <section className="section-lg container-custom">
        <div className="text-center mb-10">
          <p className="section-eyebrow">Tailored Solutions</p>
          <h2 className="section-title heading-decorate">Hair Bonding Options</h2>
          <p className="section-subtitle">The suitable option depends on your hair condition, lifestyle, and a professional consultation.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card p-8 border-t-4 border-t-brand-400">
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">Soft Hair Bonding</h3>
            <p className="text-gray-600 leading-relaxed">
              Soft hair bonding utilizes specially formulated, skin-friendly tapes or gentle adhesives to secure the hair system. This method is often preferred for its comfort and flexibility, allowing the system to rest securely while being gentle on the scalp. It is an excellent choice for individuals with sensitive skin or those looking for a temporary, easily adjustable solution.
            </p>
          </div>
          <div className="card p-8 border-t-4 border-t-brand-700">
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">Hard Hair Bonding</h3>
            <p className="text-gray-600 leading-relaxed">
              Hard hair bonding involves the use of a stronger liquid adhesive or bonding glue to attach the hair system. This option provides a very secure and long-lasting hold, making it suitable for active lifestyles. The process requires careful application by a professional to ensure a flawless finish and a durable bond that withstands daily activities.
            </p>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────── */}
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

      {/* ─── BENEFITS & COMPARISON ──────────────────────────────────── */}
      <section className="section-lg container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">Benefits of Hair Bonding</h2>
            <ul className="space-y-4">
              {[
                'Natural-looking appearance and seamless blend',
                'Adds the immediate appearance of hair density',
                'Non-surgical and painless cosmetic solution',
                'Customized according to your natural hair color and texture',
                'Suitable for different styling preferences',
                'Can be maintained or adjusted by professionals easily'
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-brand-950 p-6 text-center">
              <h3 className="text-xl font-bold text-white">Hair Bonding vs Other Solutions</h3>
              <p className="text-sm text-white/70 mt-1">There is no universally "better" option; the right choice depends on your needs.</p>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="p-4 grid grid-cols-[1fr_2fr] gap-4 hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900">Hair Patches / Systems</span>
                <span className="text-sm text-gray-600">Often used interchangeably with bonding, systems can be attached using clips, tapes, or bonding glue.</span>
              </div>
              <div className="p-4 grid grid-cols-[1fr_2fr] gap-4 hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900">Wigs</span>
                <span className="text-sm text-gray-600">Cover the entire head and are removable daily. Bonding targets specific areas or provides a semi-permanent hold.</span>
              </div>
              <div className="p-4 grid grid-cols-[1fr_2fr] gap-4 hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900">Hair Extensions</span>
                <span className="text-sm text-gray-600">Primarily add length and volume to existing hair, while bonding is often used to cover balding areas.</span>
              </div>
              <div className="p-4 grid grid-cols-[1fr_2fr] gap-4 hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900">Hair Transplantation</span>
                <span className="text-sm text-gray-600">A surgical, permanent procedure. Bonding is non-surgical and provides immediate cosmetic results.</span>
              </div>
            </div>
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

      {/* ─── CARE & MAINTENANCE ─────────────────────────────────────── */}
      <section className="section-md container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <RefreshCw className="w-10 h-10 text-brand-600 mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-6">Care & Maintenance</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            <div className="card p-5">
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5" /> Follow professional maintenance instructions</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5" /> Keep the hair system and application area clean</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5" /> Use only recommended hair-care products</li>
              </ul>
            </div>
            <div className="card p-5">
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5" /> Avoid excessive pulling or rough handling</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5" /> Schedule maintenance and re-adjustment when required</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5" /> Consult your professional if there is any irritation</li>
              </ul>
            </div>
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
              <details key={i} className="group bg-white border border-gray-200 rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-5 font-semibold text-gray-900 cursor-pointer">
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
              Looking for a Hair Bonding Solution?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Speak with our certified hair experts to understand the available hair bonding options and find a solution based on your hair condition, appearance goals, and lifestyle.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 px-8 py-3.5">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RELATED SERVICES ───────────────────────────────────────── */}
      <section className="section-md container-custom">
        <h3 className="font-display font-bold text-2xl text-center mb-8">Explore Related Services</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {RELATED_SERVICES.map((service) => (
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
