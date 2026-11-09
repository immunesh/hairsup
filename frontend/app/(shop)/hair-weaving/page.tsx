import { Metadata } from 'next';
import { ShieldCheck, CheckCircle2, Clock, Zap } from 'lucide-react';
import {
  ServiceHero, ServiceIntro, Ledger, ResultSlots, FaqList, ServiceClose,
} from '@/components/shop/Service';

export const metadata: Metadata = {
  title: 'Hair Weaving Service | Glamour Hair Studios',
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
  { icon: CheckCircle2, title: 'Natural Look', desc: 'Blends in with your existing hair.' },
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
      <ServiceHero
        crumbs={BREADCRUMBS}
        title="Hair weaving"
        lead="A safe, non-surgical, and permanent solution to regain a full head of natural-looking hair."
        slot="hair-weaving-hero"
        consultHref="/contact?service=hair-weaving"
      />

      <ServiceIntro
        heading="Permanent hair fall solution"
        aside={{
          title: 'Best hair weaving experts',
          body: (
            <p>We offer the most complete and high-quality hair weaving services. Our team of hair experts brings intense experience to provide guaranteed solutions to our patients at affordable prices.</p>
          ),
        }}
      >
        <p>
          Our hair weaving process represents the most natural and safe solution for anyone dealing with severe hair loss or baldness. This non-surgical technique adds hair to your existing natural hair, so the new hair blends with your own.
        </p>
        <p className="text-ink font-medium">
          It provides the same permanent, dense look as surgical options, but without the pain, high costs, or recovery time.
        </p>
      </ServiceIntro>

      <Ledger heading="Why choose hair weaving?" items={FEATURES} />

      <ResultSlots slot="hair-weaving-result" />

      <FaqList heading="Frequently asked questions" items={FAQS} />

      <ServiceClose
        heading="Get your natural look back"
        body="Our experts are ready to help you restore your hair and your confidence."
        related={RELATED_SERVICES}
        relatedHeading="Explore related services"
        consultHref="/contact?service=hair-weaving"
      />
    </div>
  );
}
