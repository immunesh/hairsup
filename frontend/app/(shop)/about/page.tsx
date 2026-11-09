import type { Metadata } from 'next';
import Link from 'next/link';
import { Award, Users, Heart, Target, Eye, Leaf } from 'lucide-react';
import { PageHero, Ledger, headingClass } from '@/components/shop/Service';

export const metadata: Metadata = {
  title: 'About Glamour Hair Studios | Our Story & Mission',
  description: "Learn about Glamour Hair Studios, India's most trusted premium hair wig brand. Our story, mission, and the team dedicated to restoring confidence.",
};

const TIMELINE = [
  { year: '2015', event: 'Founded in Mumbai', desc: "Dr. Anita Sharma and Vikram Patel launch Glamour Hair Studios from a small studio in Bandra, driven by personal experience with hair loss in the family." },
  { year: '2017', event: 'First 1,000 customers', desc: "Word of mouth spreads the brand across Maharashtra. We open our first experience centre in Andheri West." },
  { year: '2019', event: 'Pan-India Expansion', desc: "Glamour Hair Studios enters Delhi, Bangalore, Chennai, and Hyderabad. Partnership with 200+ certified hair specialists nationwide." },
  { year: '2021', event: 'Virtual Try-On Launch', desc: "We launch India's first AI-powered virtual wig try-on technology. 5 lakh try-on sessions in the first year." },
  { year: '2023', event: '10 Lakh Customers', desc: "Milestone: 10 lakh satisfied customers. 50+ experience centres. Recognised by Forbes India as a leading healthtech-meets-beauty brand." },
  { year: '2025', event: 'Glamour Hair Studios 2.0', desc: "Launching next-gen Swiss lace technology, in-home consultation services, and our global expansion to UAE and Singapore." },
];

// Portraits are slots: the studio's own photographs of each person belong here.
const TEAM = [
  {
    name: 'Dr. Anita Sharma',
    role: 'Co-Founder & Chief Trichologist',
    bio: 'AIIMS-trained trichologist with 18 years of clinical experience in hair loss treatment. Her personal journey with alopecia inspired Glamour Hair Studios.',
  },
  {
    name: 'Vikram Patel',
    role: 'Co-Founder & CEO',
    bio: 'IIM Ahmedabad alumnus and serial entrepreneur. Former VP at Nykaa. Passionate about making premium hair solutions accessible to every Indian.',
  },
  {
    name: 'Priya Mehta',
    role: 'Creative Director',
    bio: '15 years in luxury beauty and fashion. Former stylist for Vogue India. Leads our product design, colour matching, and style innovation.',
  },
  {
    name: 'Arjun Nair',
    role: 'Head of Technology',
    bio: 'AI researcher and ex-Google engineer. Built our proprietary virtual try-on engine. Believer in technology as a force for human confidence.',
  },
];

const VALUES = [
  { icon: Heart, title: 'Empathy First', desc: "Every product we create starts with deeply understanding the emotional journey of hair loss. We don't just sell wigs; we restore confidence." },
  { icon: Award, title: 'Uncompromising Quality', desc: "From Swiss lace to 100% human hair, every material is sourced ethically and tested rigorously. We accept nothing less than extraordinary." },
  { icon: Leaf, title: 'Sustainability', desc: "Responsible sourcing, eco-friendly packaging, and carbon-neutral shipping. Beauty shouldn't cost the planet." },
  { icon: Target, title: 'Inclusivity', desc: "Hair loss doesn't discriminate. Neither do we. Our collections serve every gender, age, hair type, and skin tone." },
  { icon: Eye, title: 'Transparency', desc: "No hidden costs, no false promises. We show you 360° product views and virtual try-on so you know exactly what you're getting." },
  { icon: Users, title: 'Community', desc: "10 lakh+ customers and growing. Our support groups, expert consultations, and blog create a community where everyone belongs." },
];

const STATS = [
  { value: '10L+', label: 'Lives transformed' },
  { value: '50+', label: 'Experience centres' },
  { value: '280+', label: 'Wig styles' },
  { value: '4.8★', label: 'Customer rating' },
];

const initials = (name: string) =>
  name.replace(/^Dr\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join('');

export default function AboutPage() {
  return (
    <div>
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About us', href: '/about' }]}
        title="We believe hair is identity."
        lead="Glamour Hair Studios was born from a personal story of loss and renewal."
        image="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=80"
        imageAlt="A stylist finishing a client's long, softly curled hair"
        slot="about-hero"
        actions={
          <>
            <Link href="/women" className="btn-primary">Shop collection</Link>
            <Link href="/contact" className="link-quiet">Contact us</Link>
          </>
        }
      />

      {/* The story, then what it is for */}
      <section className="section-lg bg-paper">
        <div className="container-custom grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 min-w-0">
            <h2 className={headingClass}>Where it started</h2>
            <p className="text-ink text-[length:var(--text-lead)] leading-[1.55] mt-6 max-w-[40ch]">
              A trichologist who watched her mother struggle with alopecia. An entrepreneur who saw an industry
              failing millions of Indians. Together, they built something extraordinary.
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 grid gap-10 min-w-0">
            <article className="border-t border-ink pt-5">
              <h3 className="font-display text-[length:var(--text-2xl)] text-ink leading-tight">Our mission</h3>
              <p className="text-ink-soft leading-[1.7] mt-3 max-w-[56ch]">
                To make premium, natural-looking hair solutions accessible to every Indian, regardless of gender, age,
                or the reason for their hair loss. We believe that confidence is a fundamental human right, not a luxury.
              </p>
            </article>
            <article className="border-t border-ink pt-5">
              <h3 className="font-display text-[length:var(--text-2xl)] text-ink leading-tight">Our vision</h3>
              <p className="text-ink-soft leading-[1.7] mt-3 max-w-[56ch]">
                To be South Asia&apos;s most trusted hair wellness brand, where technology meets craftsmanship,
                where science meets style, and where every customer walks away feeling like the best version of themselves.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* The figures, as the studio states them */}
      <section aria-label="Glamour Hair Studios in numbers" className="bg-paper-2 border-y border-rule">
        <dl className="container-custom grid grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className={`py-10 lg:py-14 ${i % 2 === 1 ? 'pl-6 border-l border-rule' : ''} ${i >= 2 ? 'border-t border-rule lg:border-t-0' : ''} ${i === 2 ? 'lg:pl-6 lg:border-l' : ''}`}
            >
              <dt className="text-[0.9375rem] text-ink-soft">{label}</dt>
              <dd className="font-display text-[length:var(--text-display-s)] leading-none text-ink mt-3">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Ledger
        heading="What we stand for"
        lead="The principles that guide every decision we make."
        items={VALUES}
        tone="paper"
      />

      {/* Journey: a dated ledger, read top to bottom */}
      <section className="section-lg bg-paper-2">
        <div className="container-custom grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 min-w-0">
            <h2 className={headingClass}>Our journey</h2>
            <p className="lead mt-3 max-w-[32ch]">From a Mumbai studio to India&apos;s #1 hair brand.</p>
          </div>
          <ol className="lg:col-span-8 border-t border-ink">
            {TIMELINE.map(({ year, event, desc }) => (
              <li key={year} className="grid grid-cols-[4.5rem_minmax(0,1fr)] sm:grid-cols-[7rem_minmax(0,1fr)] gap-x-6 py-6 border-b border-rule">
                <span className="font-display text-[length:var(--text-2xl)] leading-none text-accent pt-0.5">{year}</span>
                <div className="min-w-0">
                  <h3 className="font-sans font-semibold text-ink text-[1.0625rem]">{event}</h3>
                  <p className="text-ink-soft leading-[1.6] mt-1.5 max-w-[60ch]">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team: portraits are slots for the studio's own photographs */}
      <section className="section-lg bg-paper">
        <div className="container-custom">
          <div className="max-w-2xl mb-10">
            <h2 className={headingClass}>Meet the team</h2>
            <p className="lead mt-3">The people behind Glamour Hair Studios&apos; mission.</p>
          </div>
          <ul className="grid gap-x-6 gap-y-10 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))]">
            {TEAM.map(({ name, role, bio }, i) => (
              <li key={name} className="min-w-0">
                <div
                  data-slot={`about-team-${i + 1}`}
                  className="aspect-[4/5] rounded-card bg-paper-3 border border-rule grid place-items-center"
                >
                  <span aria-hidden className="font-display text-[3.5rem] leading-none text-ink-muted">{initials(name)}</span>
                </div>
                <h3 className="font-display text-[length:var(--text-xl)] text-ink mt-4 leading-tight">{name}</h3>
                <p className="text-[0.9375rem] text-accent font-medium mt-1">{role}</p>
                <p className="text-[0.9375rem] text-ink-soft leading-[1.6] mt-3">{bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The close sits on paper: the deep-teal footer follows directly */}
      <section className="border-t border-rule">
        <div className="container-custom section-md grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7 min-w-0">
            <h2 className="font-display text-[length:var(--text-3xl)] leading-[1.08] text-ink">Ready to start your transformation?</h2>
            <p className="text-[1.0625rem] leading-[1.65] text-ink-soft mt-4 max-w-[52ch]">
              Join 10 lakh+ Indians who have rediscovered confidence with Glamour Hair Studios.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-wrap items-center gap-x-6 gap-y-3 lg:justify-end">
            <Link href="/women" className="btn-primary">Shop collection</Link>
            <Link href="/contact" className="link-quiet">Contact us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
