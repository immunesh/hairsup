import { Metadata } from 'next';
import { Heart, Sparkles, Activity, Droplet } from 'lucide-react';
import {
  ServiceHero, ServiceIntro, Ledger, ResultSlots, FaqList, ServiceClose,
} from '@/components/shop/Service';

export const metadata: Metadata = {
  title: 'Women Hair Wig Wholesaler | Glamour Hair Studios',
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
      <ServiceHero
        crumbs={BREADCRUMBS}
        title="Women hair wigs"
        lead="Solve hair loss gracefully and win back your confidence with our premium handmade wigs."
        image="/women.avif"
        imageAlt="A woman with a full, natural head of hair"
        slot="women-wig-hero"
      />

      <ServiceIntro
        heading="Women hair wig wholesaler"
        aside={{
          title: 'Premium monofilament quality',
          body: (
            <>
              <p>We provide a wide variety of Women&apos;s wigs in different lengths. The monofilament top makes a natural-looking parting. This is a handmade women&apos;s wig that gives a natural form.</p>
              <p>The full hand-tied monofilament top allows you to change the parting for different looks. This ladies&apos; wig is all about smoothness and comfort. Made with 100% Nature Human hair, it looks very soft, styles like your own hair, and fits really close to the head for the maximum natural look.</p>
            </>
          ),
        }}
      >
        <p>
          Women lose their hair due to various reasons and it starts with hair thinning out and then the hair parting becoming bigger, finally advancing to &ldquo;Female Pattern Baldness&rdquo;. Many reasons are attributed to this: age, hormonal changes, medical conditions, stress, skin conditions, genetics, and chronic alopecia.
        </p>
        <p className="text-ink font-medium">
          At Glamour Hair Studios, we understand &ldquo;Women&apos;s Hair Loss&rdquo; is a very delicate and sensitive matter that affects overall looks and personality. We support our customers to solve this problem and help them get their looks and confidence back!
        </p>
        <p>
          We also provide women wigs and ladies patches that cover your bald area at the lowest rate on the market. Our patches are prepared from Remy human hair, providing a completely natural scalp.
        </p>
      </ServiceIntro>

      <Ledger
        heading="Why choose our women's wigs?"
        lead="Delicate care combined with premium, natural-looking materials."
        items={FEATURES}
      />

      <ResultSlots
        heading="Premium collections"
        note="A glimpse into our natural human hair wigs for women."
        frames={['Women\'s style 1', 'Women\'s style 2', 'Women\'s style 3']}
        slot="women-wig-style"
      />

      <FaqList heading="Frequently asked questions" items={FAQS} />

      <ServiceClose
        heading="Win back your confidence"
        body="Ready to experience a completely natural look with our premium handmade wigs? Browse our collection or speak with our sensitive and caring experts today."
        related={RELATED_PRODUCTS}
        relatedHeading="Explore related products"
      />
    </div>
  );
}
