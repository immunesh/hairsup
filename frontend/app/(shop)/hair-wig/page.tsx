import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Package, Scissors } from 'lucide-react';
import {
  ServiceHero, ServiceIntro, Ledger, ResultSlots, FaqList, ServiceClose,
} from '@/components/shop/Service';

export const metadata: Metadata = {
  title: 'Best Quality Hair Wig Manufacturer | Glamour Hair Studios',
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
      <ServiceHero
        crumbs={BREADCRUMBS}
        title="Hair wig manufacturer"
        lead="Buy the best quality natural and designer hair wigs at reasonable prices."
        image="https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=1200&q=80"
        imageAlt="A woman with long, softly coloured hair"
        slot="hair-wig-hero"
      />

      <ServiceIntro heading="Best quality hair wigs">
        <p>
          We sell good quality Hair Wigs which are the best product all over the region. Our house offers the best quality hair wigs or artificial scalps at low prices. A hair wig is a thoroughly diverse product than partial hair wigs, silicon systems, or membrane artificial skin.
        </p>
        <p>
          Hair wigs are not simply worn to hide up baldness, but many people want to change their hairstyle every day. A hair wig is the best option to get the latest hairstyle on a regular basis without harming natural existing hair by coloring or ironing.
        </p>
      </ServiceIntro>

      <Ledger
        heading="Our specialized products"
        lead="Explore our diverse range of high-quality hair replacement options."
        items={WIG_TYPES}
      />

      {/* Foundations: the cap a wig is built on, named plainly */}
      <section className="bg-deep text-deep-ink">
        <div className="container-custom py-16 lg:py-20 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5 min-w-0">
            <h2 className="font-display text-[length:var(--text-3xl)] leading-[1.08] text-white">Wig cap foundations</h2>
            <p className="text-[1.0625rem] leading-[1.65] text-deep-muted mt-4 max-w-[46ch]">
              Our shop offers different types of hair wigs in different sizes, colors, and various high-quality wig cap foundations to ensure maximum comfort and a natural look.
            </p>
            <Link href="/products" className="inline-block mt-6 text-mint font-semibold underline underline-offset-4 decoration-mint/40 hover:decoration-mint rounded-sm">
              Explore our collection
            </Link>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7 border-t border-white/20">
            {FOUNDATIONS.map((foundation, i) => (
              <li key={foundation} className="flex items-baseline gap-5 py-4 border-b border-white/20">
                <span className="font-display text-mint text-[length:var(--text-lg)] w-6 shrink-0">{i + 1}</span>
                <span className="text-white text-[1.0625rem]">{foundation}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ResultSlots
        heading="Product showcase"
        note="A glimpse into our premium natural human hair wigs."
        frames={['Premium wig 1', 'Premium wig 2', 'Premium wig 3']}
        slot="hair-wig-showcase"
      />

      <FaqList heading="Frequently asked questions" items={FAQS} />

      <ServiceClose
        heading="Find your perfect style today"
        body="Ready to experience the ultimate versatility and quality? Browse our complete collection or speak with our experts to find exactly what you need."
        related={RELATED_PRODUCTS}
        relatedHeading="Explore related products"
      />
    </div>
  );
}
