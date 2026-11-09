import { Metadata } from 'next';
import { Shield, Scissors, HeartHandshake, Smile } from 'lucide-react';
import {
  ServiceHero, ServiceIntro, Ledger, Steps, TwoLists, ResultSlots, FaqList, ServiceClose,
} from '@/components/shop/Service';

export const metadata: Metadata = {
  title: 'Hair Bonding Service | Glamour Hair Studios',
  description: 'Learn about hair bonding, available options, the process, benefits, maintenance, and how to book a consultation with our hair experts.',
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/contact' },
  { label: 'Hair Bonding', href: '/hair-bonding' },
];

const WHO_MAY_CONSIDER = [
  { icon: Scissors, title: 'Patchy Hair Loss', desc: 'Effectively cover specific areas of thinning or bald patches.' },
  { icon: HeartHandshake, title: 'Thinning Hair', desc: 'Add volume and density to areas where the hair is sparse.' },
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

const OPTIONS = [
  {
    title: 'Soft hair bonding',
    body: 'Soft hair bonding utilizes specially formulated, skin-friendly tapes or gentle adhesives to secure the hair system. This method is often preferred for its comfort and flexibility, allowing the system to rest securely while being gentle on the scalp. It is an excellent choice for individuals with sensitive skin or those looking for a temporary, easily adjustable solution.',
  },
  {
    title: 'Hard hair bonding',
    body: 'Hard hair bonding involves the use of a stronger liquid adhesive or bonding glue to attach the hair system. This option provides a very secure and long-lasting hold, making it suitable for active lifestyles. The process requires careful application by a professional to ensure a flawless finish and a durable bond that withstands daily activities.',
  },
];

const BENEFITS = [
  'A natural look that blends with your own hair',
  'Adds the immediate appearance of hair density',
  'Non-surgical and painless cosmetic solution',
  'Customized according to your natural hair color and texture',
  'Suitable for different styling preferences',
  'Can be maintained or adjusted by professionals easily',
];

const CARE = [
  'Follow professional maintenance instructions',
  'Keep the hair system and application area clean',
  'Use only recommended hair-care products',
  'Avoid excessive pulling or rough handling',
  'Schedule maintenance and re-adjustment when required',
  'Consult your professional if there is any irritation',
];

const COMPARISON = [
  { title: 'Hair Patches / Systems', desc: 'Often used interchangeably with bonding, systems can be attached using clips, tapes, or bonding glue.' },
  { title: 'Wigs', desc: 'Cover the entire head and are removable daily. Bonding targets specific areas or provides a semi-permanent hold.' },
  { title: 'Hair Extensions', desc: 'Primarily add length and volume to existing hair, while bonding is often used to cover balding areas.' },
  { title: 'Hair Transplantation', desc: 'A surgical, permanent procedure. Bonding is non-surgical and provides immediate cosmetic results.' },
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
      <ServiceHero
        crumbs={BREADCRUMBS}
        title="Hair bonding"
        lead="A non-surgical hair replacement solution designed to improve the appearance of thinning hair, bald patches, and hair loss."
        image="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80"
        imageAlt="A stylist blow-drying a client's hair in the studio"
        slot="hair-bonding-hero"
        consultHref="/contact?service=hair-bonding"
      />

      <ServiceIntro heading="What is hair bonding?">
        <p className="text-ink text-[length:var(--text-lead)] leading-[1.55]">
          Hair bonding is an effective, non-surgical hair enhancement technique. It involves attaching a suitable hair system or hair extension to your existing hair or scalp area. The result is a natural-looking appearance that blends flawlessly with your own hair.
        </p>
        <p>
          Whether you are experiencing reduced hair density or simply need a fuller-looking hairstyle, hair bonding can provide an immediate visual change tailored to your needs.
        </p>
      </ServiceIntro>

      <Ledger
        heading="Who may consider hair bonding?"
        lead="Common situations where hair bonding is a suitable solution."
        items={WHO_MAY_CONSIDER}
      />

      {/* Options: the two bonds, side by side */}
      <section className="section-lg bg-paper">
        <div className="container-custom">
          <div className="max-w-2xl mb-10">
            <h2 className="font-display text-[length:var(--text-3xl)] leading-[1.08] text-ink">Hair bonding options</h2>
            <p className="lead mt-3">The suitable option depends on your hair condition, lifestyle, and a professional consultation.</p>
          </div>
          <div className="grid gap-10 md:grid-cols-2">
            {OPTIONS.map((o) => (
              <article key={o.title} className="min-w-0 border-t border-ink pt-5">
                <h3 className="font-display text-[length:var(--text-2xl)] text-ink leading-tight">{o.title}</h3>
                <p className="text-ink-soft leading-[1.7] mt-3 max-w-[56ch]">{o.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Steps
        heading="How it works"
        lead="From the first conversation to caring for it at home."
        steps={HOW_IT_WORKS}
      />

      <TwoLists
        lists={[
          { title: 'Benefits of hair bonding', items: BENEFITS },
          { title: 'Care and maintenance', items: CARE },
        ]}
      />

      {/* Comparison: no option is better in general, only for a person */}
      <section className="section-lg bg-paper-2">
        <div className="container-custom grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 min-w-0">
            <h2 className="font-display text-[length:var(--text-3xl)] leading-[1.08] text-ink">Hair bonding vs other solutions</h2>
            <p className="text-ink-soft mt-3 max-w-[40ch]">
              There is no universally &ldquo;better&rdquo; option; the right choice depends on your needs.
            </p>
          </div>
          <dl className="lg:col-span-8 border-t border-ink">
            {COMPARISON.map((c) => (
              <div key={c.title} className="grid sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] gap-x-8 gap-y-1 py-5 border-b border-rule">
                <dt className="font-semibold text-ink">{c.title}</dt>
                <dd className="text-ink-soft leading-[1.6]">{c.desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ResultSlots slot="hair-bonding-result" />

      <FaqList heading="Frequently asked questions" items={FAQS} />

      <ServiceClose
        heading="Looking for a hair bonding solution?"
        body="Speak with our certified hair experts to understand the available hair bonding options and find a solution based on your hair condition, appearance goals, and lifestyle."
        related={RELATED_SERVICES}
        relatedHeading="Explore related services"
        consultHref="/contact?service=hair-bonding"
      />
    </div>
  );
}
