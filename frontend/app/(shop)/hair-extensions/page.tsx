import { Metadata } from 'next';
import { ShieldCheck, Zap, Scissors, Droplet } from 'lucide-react';
import {
  ServiceHero, ServiceIntro, Ledger, ResultSlots, FaqList, ServiceClose,
} from '@/components/shop/Service';

export const metadata: Metadata = {
  title: 'Hair Extensions | Glamour Hair Studios',
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
      <ServiceHero
        crumbs={BREADCRUMBS}
        title="Hair extensions"
        lead="Instantly add length, volume, and color with our premium 100% human hair extensions."
        image="https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=1200&q=80"
        imageAlt="A stylist sectioning long hair before fitting extensions"
        slot="hair-extensions-hero"
        consultHref="/contact?service=hair-extensions"
      />

      <ServiceIntro
        heading="Transform your look"
        aside={{
          title: 'Premium quality guaranteed',
          body: (
            <p>We believe in providing only the finest quality human hair. Our application techniques are advanced, ensuring that the extensions sit flat against the head, remaining undetectable and comfortable for daily wear.</p>
          ),
        }}
      >
        <p>
          Hair extensions are a phenomenal way to instantly add length, volume, and even chemical-free color dimension to your natural hair. At Glamour Hair Studios, we blend each extension into your own hair so it looks and feels natural.
        </p>
        <p className="text-ink font-medium">
          Our extensions are crafted from 100% premium human hair, ensuring they can be washed, heat-styled, and treated exactly like your own hair.
        </p>
      </ServiceIntro>

      <Ledger heading="Why choose our extensions?" items={BENEFITS} />

      <ResultSlots slot="hair-extensions-result" />

      <FaqList heading="Frequently asked questions" items={FAQS} />

      <ServiceClose
        heading="Get your dream hair today"
        body="Ready for long, voluminous hair? Book a free consultation with our experts."
        related={RELATED_SERVICES}
        relatedHeading="Explore related services"
        consultHref="/contact?service=hair-extensions"
      />
    </div>
  );
}
