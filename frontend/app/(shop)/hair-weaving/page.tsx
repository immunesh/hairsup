import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, ArrowRight, ShieldCheck,
  CheckCircle2, Clock, Zap, Star
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hair Weaving Service | HairsUp',
  description: 'Expert hair weaving services for a permanent, non-surgical solution to baldness. 100% safe, natural-looking, and affordable.',
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/contact' },
  { label: 'Hair Weaving', href: '/hair-weaving' },
];

const FEATURES = [
  { icon: ShieldCheck, title: '100% Safe', desc: 'No side effects and completely safe for your natural hair.' },
  { icon: Clock, title: 'Quick Process', desc: 'Complete transformation in just a few hours.' },
  { icon: CheckCircle2, title: 'Natural Look', desc: 'Blends seamlessly with your existing hair.' },
  { icon: Zap, title: 'Painless', desc: 'A completely painless and non-surgical procedure.' },
];

const FAQS = [
  { q: 'Is hair weaving painful?', a: 'No, hair weaving is a 100% non-surgical and painless procedure. It does not involve any cuts or stitches.' },
  { q: 'How long does hair weaving last?', a: 'With proper care and maintenance, a hair weave can last for several months. Regular follow-ups are recommended for the best look.' },
  { q: 'Can I wash my hair normally?', a: 'Yes, once the weave is settled, you can gently wash your hair. Our experts will provide you with a specific care routine to ensure longevity.' },
  { q: 'Are there any side effects?', a: 'Our hair weaving process is completely safe with 0% side effects. We use high-quality, skin-friendly materials.' },
];

const RELATED_SERVICES = [
  { title: 'Hair Bonding', href: '/hair-bonding' },
  { title: 'Hair Replacement', href: '/hair-replacement' },
  { title: 'Hair Extensions', href: '/hair-extensions' },
];

export default function HairWeavingPage() {
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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-4">Hair Weaving</h1>
          <p className="text-ink-muted text-lg">
            A safe, non-surgical, and permanent solution to regain a full head of natural-looking hair.
          </p>
        </div>
      </div>

      <section 
        className="section-lg relative text-white"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-brand-950/85 mix-blend-multiply"></div>
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Permanent Hair Fall Solution</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                Our hair weaving process represents the most natural and safe solution for anyone dealing with severe hair loss or baldness. This non-surgical technique adds hair to your existing natural hair, offering a seamless and beautiful result.
              </p>
              <p className="text-white/90 leading-relaxed font-semibold">
                It provides the same permanent, dense look as surgical options, but without the pain, high costs, or recovery time.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-white shadow-xl border border-white/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Star className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Best Hair Weaving Experts</h3>
                <p className="text-white/80 leading-relaxed text-sm">
                  We offer the most complete and high-quality hair weaving services. Our team of hair experts brings intense experience to provide guaranteed solutions to our patients at affordable prices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-lg bg-cream">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="section-title heading-decorate">Why Choose Hair Weaving?</h2>
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
              Get Your Natural Look Back
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Our experts are ready to help you restore your hair and your confidence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary bg-white text-brand-900 hover:bg-brand-50 px-8 py-3.5">
                Consult With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
