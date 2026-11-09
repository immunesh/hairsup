import { Metadata } from 'next';
import { ShieldCheck, CheckCircle2, Zap, Scissors } from 'lucide-react';
import {
  ServiceHero, ServiceIntro, Ledger, ResultSlots, FaqList, ServiceClose,
} from '@/components/shop/Service';

export const metadata: Metadata = {
  title: 'Hair Replacement Service | Glamour Hair Studios',
  description: 'Expert non-surgical hair replacement services for a completely natural and full head of hair.',
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/contact' },
  { label: 'Hair Replacement', href: '/hair-replacement' },
];

const FEATURES = [
  { icon: ShieldCheck, title: '100% Safe', desc: 'Non-surgical and completely safe procedure without any side effects.' },
  { icon: Zap, title: 'Instant Results', desc: 'Get a full head of hair in just one session.' },
  { icon: CheckCircle2, title: 'Natural Look', desc: 'Undetectable hairline and natural hair movement.' },
  { icon: Scissors, title: 'Customized Fit', desc: 'Tailored specifically to your head shape and desired style.' },
];

const FAQS = [
  { q: 'Is hair replacement painful?', a: 'Not at all. It is a 100% non-surgical, painless procedure.' },
  { q: 'Can I play sports and swim?', a: 'Yes! Our high-quality adhesives ensure the hair system stays secure even during vigorous activities and swimming.' },
  { q: 'How long does a hair system last?', a: 'With proper maintenance, a premium hair system can last from several months to over a year depending on the base material.' },
];

export default function HairReplacementPage() {
  return (
    <div>
      <ServiceHero
        crumbs={BREADCRUMBS}
        title="Hair replacement"
        lead="Advanced non-surgical hair replacement for an undetectable, natural hairline."
        slot="hair-replacement-hero"
        consultHref="/contact?service=hair-replacement"
      />

      <ServiceIntro
        heading="Regain your confidence"
        aside={{
          title: 'Why choose non-surgical?',
          body: (
            <p>Enjoy complete freedom. You can swim, shower, exercise, and sleep without worrying about your hair. Our systems become a part of you, allowing you to live your life to the fullest with renewed confidence.</p>
          ),
        }}
      >
        <p>
          Hair loss doesn&apos;t have to be permanent. Our non-surgical hair replacement systems provide an immediate, painless, and completely natural-looking solution for baldness and severe hair thinning.
        </p>
        <p className="text-ink font-medium">
          Unlike surgical transplants, hair replacement offers guaranteed results without recovery time, scars, or limitations on hair density.
        </p>
      </ServiceIntro>

      <Ledger heading="Our advantages" items={FEATURES} />

      <ResultSlots slot="hair-replacement-result" />

      <FaqList heading="Frequently asked questions" items={FAQS} />

      <ServiceClose
        heading="Book your session"
        body="Ready to completely transform your appearance without surgery?"
        consultHref="/contact?service=hair-replacement"
      />
    </div>
  );
}
