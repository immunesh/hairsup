import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, ArrowRight, CheckCircle2,
  Zap, IndianRupee, Layers, HeartHandshake, Shield, Sparkles, Smile, Droplet, Users
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hair Fixing Service | HairsUp',
  description: 'Restore your health and confidence with top-class hair fixing. A painless, non-surgical method using skin-friendly adhesive.',
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/contact' },
  { label: 'Hair Fixing', href: '/hair-fixing' },
];

const FEATURES = [
  { icon: Layers, title: 'Non-surgical technique' },
  { icon: Zap, title: 'Quick results in no time' },
  { icon: IndianRupee, title: 'Low Cost & Affordable Fees' },
  { icon: Droplet, title: 'Skin friendly tapes/adhesives' },
  { icon: Smile, title: 'Various colors & textures' },
  { icon: Users, title: 'Done by professionals' },
  { icon: Shield, title: 'Quality Service & Low Maintenance' },
  { icon: HeartHandshake, title: 'Personalized Customer Support' },
];

const FAQS = [
  { q: 'What is hair fixing?', a: 'Hair fixing is an advanced non-surgical hair replacement method to cover baldness. It involves attaching a high-quality hair patch using skin-friendly silicon adhesive.' },
  { q: 'Is the hair fixing process painful?', a: 'No, the hair fixing process is completely non-surgical and painless.' },
  { q: 'Can I do regular activities like swimming with hair fixing?', a: 'Absolutely. We use the best quality and skin-friendly silicon adhesives. After this treatment, you can travel in open vehicles, swim, and shampoo your hair regularly without restrictions.' },
  { q: 'How much does hair fixing cost?', a: 'The price of hair fixing is fully based on the quality of hair and the specific customized options you select. We offer market-leading prices tailored to your budget.' },
];

const RELATED_SERVICES = [
  { title: 'Hair Weaving', href: '/hair-weaving' },
  { title: 'Hair Bonding', href: '/hair-bonding' },
  { title: 'Hair Extensions', href: '/hair-extensions' },
  { title: 'Hair Replacement', href: '/hair-replacement' },
];

export default function HairFixingPage() {
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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-4">Hair Fixing</h1>
          <p className="text-ink-muted text-lg">
            Say goodbye to your hair problems forever. Restore your confidence with our top-class hair fixing solutions.
          </p>
        </div>
      </div>

      {/* ─── INTRODUCTION ───────────────────────────────────────────── */}
      <section 
        className="section-lg relative text-white"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-brand-950/85 mix-blend-multiply"></div>
        <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">Restore Your Health & Confidence</h2>
            <p className="text-white/90 leading-relaxed mb-4">
              Hair is the most important feature of our personality. Because of modern lifestyle and genetic reasons, hair loss becomes a major problem among people of all age groups. By the age of 30, most men start balding and women also experience hair loss.
            </p>
            <p className="text-white/90 leading-relaxed mb-4">
              Now, you don't have to get embarrassed due to hair loss or bald patches. Hair fixing gives you a new personality, boosts your confidence, and makes you look the manner you wished yourself to look.
            </p>
            <p className="text-white/90 leading-relaxed font-semibold">
              Look younger and achieve the desired look with our Hair Fixing Services. We fulfill your expectation of getting a head full of hair that appears stylish and natural.
            </p>
          </div>
          <div 
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-white shadow-xl border border-white/20 relative overflow-hidden"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-brand-950/85 mix-blend-multiply"></div>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-32 h-32" />
            </div>
            <h3 className="text-2xl font-bold mb-4 relative z-10">Know why to go for hair fixing treatment?</h3>
            <p className="text-white/80 leading-relaxed text-sm mb-4 relative z-10">
              Hair fixing is an excellent way to cover baldness for all age groups, convenient in both male pattern hair loss and females suffering from hair thinning. 
            </p>
            <p className="text-white/80 leading-relaxed text-sm relative z-10">
              This process is painless. We use the best quality and skin-friendly silicon adhesive to fix the hair patch. After this treatment, you can travel in an open vehicle, swim, and shampoo your hair regularly without any restrictions.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* ─── KEY FEATURES / WHY CHOOSE US ───────────────────────────── */}
      <section className="section-lg bg-cream">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="section-title heading-decorate">Why Choose HairsUp?</h2>
            <p className="section-subtitle">We give excellent solutions for your hair loss problems.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {FEATURES.map((feature, i) => (
              <div key={i} className="card p-6 bg-white flex flex-col items-center text-center hover:shadow-product-hover transition-shadow">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mb-4 text-brand-600">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AFTERCARE ──────────────────────────────────────────────── */}
      <section className="section-md container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <HeartHandshake className="w-12 h-12 text-brand-600 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Our Commitment & Aftercare</h2>
          <p className="text-gray-600 leading-relaxed">
            Our duty will not end with treatment. We satisfy each customer with personal attention and care. We provide aftercare tips, tell customers safety measures, and give hair maintenance suggestions. Our team is always ready to help our valuable clients in their hair-related issues, striving to fulfill customer needs so that every client steps out from HairsUp with complete satisfaction.
          </p>
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
            <Sparkles className="w-10 h-10 text-brand-300 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Get Your Natural Look Back
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              If you have tried various solutions and are dissatisfied with the results, contact us. We will make sure your requirements are fulfilled.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 px-8 py-3.5">
                Book an Appointment
              </Link>
              <Link href="/contact" className="border border-white/30 hover:border-white hover:bg-white/10 text-white font-semibold rounded-full px-8 py-3.5 transition-all">
                Contact Us
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
