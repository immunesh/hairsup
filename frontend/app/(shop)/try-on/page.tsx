import type { Metadata } from 'next';
import VirtualTryOn from '@/components/features/VirtualTryOn';
import { Zap, Camera, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Virtual Try-On — See How Any Wig Looks on You',
  description: 'Use Glamour Hair Studios AI-powered virtual try-on to see how any wig looks on your face in real time — completely free. No download needed.',
};

const HOW_IT_WORKS = [
  { step: '01', icon: Camera, title: 'Turn on your camera', desc: 'Allow camera access for real-time try-on, or upload a selfie from your gallery.' },
  { step: '02', icon: Sparkles, title: 'Pick a style', desc: 'Browse through our wig styles and colours on the right panel.' },
  { step: '03', icon: Zap, title: 'See it instantly', desc: 'Watch as the selected wig is overlaid on your face in real time with AI precision.' },
  { step: '04', icon: Star, title: 'Capture and share', desc: 'Capture your look, download it, or add directly to your cart.' },
];


export default async function TryOnPage({
  searchParams,
}: {
  searchParams: Promise<{ wig?: string }>;
}) {
  const { wig } = await searchParams;

  let selectedProduct = null;

  if (wig) {
    const res = await fetch(
      `${API_URL}/products/${wig}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    selectedProduct = data.data;
  }


  return (
    <div>
      {/* Hero */}
      <div className="page-hero py-12 text-center">
        <div className="container-custom max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-4">
            See it on you before you buy
          </h1>
          <p className="text-ink-muted text-lg max-w-xl mx-auto mb-6">
            Try on any Glamour Hair Studios wig in real time using your camera. Our AI technology places the wig
            on your head instantly, with no app download required.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-ink-muted">
            <span className="flex items-center gap-1.5"><Camera className="w-4 h-4" /> Camera or upload</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Multiple styles</span>
            <span>Free to use</span>
          </div>
        </div>
      </div>

      {/* Main try-on tool */}
      <section className="py-12 bg-mist">
        <div className="container-custom">
      <VirtualTryOn selectedProductId={wig} selectedProduct={selectedProduct} />
        </div>
      </section>

      {/* How it works: a numbered list, read left to right */}
      <section className="section-md container-custom">
        <div className="max-w-2xl mb-10">
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle mt-3">Your look in four steps.</p>
        </div>
        <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 border-t border-ink">
          {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
            <li key={step} className="pt-5 min-w-0">
              <span className="font-display text-[length:var(--text-2xl)] leading-none text-accent">{String(Number(step))}</span>
              <h3 className="flex items-center gap-2 font-sans font-semibold text-ink text-[1.0625rem] mt-3">
                <Icon className="w-4 h-4 text-accent shrink-0" aria-hidden />
                {title}
              </h3>
              <p className="text-[0.9375rem] text-ink-soft leading-[1.6] mt-1.5">{desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* The close sits on paper: the deep-teal footer follows directly */}
      <section className="border-t border-rule">
        <div className="container-custom section-md grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 min-w-0">
            <h2 className="section-title">Found your match?</h2>
            <p className="text-[1.0625rem] leading-[1.65] text-ink-soft mt-4 max-w-[52ch]">
              Shop the style you just tried on and have it delivered to your door.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-wrap items-center gap-x-6 gap-y-3 lg:justify-end">
            <Link href="/women" className="btn-primary whitespace-nowrap">Shop women&apos;s wigs</Link>
            <Link href="/men" className="link-quiet whitespace-nowrap">Shop men&apos;s hair systems</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
