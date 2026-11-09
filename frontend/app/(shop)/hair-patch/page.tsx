import { Metadata } from 'next';
import { UserCheck, Star, Zap, HeartHandshake } from 'lucide-react';
import {
  ServiceHero, ServiceIntro, TwoLists, ResultSlots, FaqList, ServiceClose,
} from '@/components/shop/Service';

export const metadata: Metadata = {
  title: 'Hair Patch Service | Glamour Hair Studios',
  description: 'Trusted hair patch services for partial baldness. Non-surgical, comfortable, durable, and affordable with a completely natural appearance.',
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Hair Patch', href: '/hair-patch' },
];

const WHY_CHOOSE_US = [
  { icon: UserCheck, title: 'Natural Appearance', desc: 'Our patches blend effortlessly with your existing hair.' },
  { icon: Star, title: 'Affordable Prices', desc: 'Premium quality services at competitive rates.' },
  { icon: Zap, title: 'Quick Application', desc: 'Enjoy a hassle-free, non-surgical process.' },
  { icon: HeartHandshake, title: 'Expert Team', desc: 'Highly skilled professionals committed to customer satisfaction.' },
];

const BENEFITS = [
  'Low-cost technique',
  'Desired hairstyle achieved',
  'Painless procedure',
  'Can wear or remove when needed',
  'No suture or cut is required',
  'Application just takes 1-2 hrs',
];

const GUIDELINES = [
  'Give preference to sieve hair patch; sweating is less.',
  'Maintain hygienic condition well.',
  'Avoid stretching or pulling of hair patch.',
  'Do not use heavy cosmetics directly on the patch.',
  'Do regular shampoo to avoid dirt/dust in the scalp.',
  'Apply conditioner and serum to maintain quality.',
];

const FAQS = [
  { q: 'What is the difference between a hair wig and a patch?', a: 'A hair wig covers the entire scalp, often requiring natural hair to be completely removed. A hair patch covers only a small bald area. When applying a patch, natural hair is not removed, though some minor cutting might be done to blend it perfectly.' },
  { q: 'How is a hair patch applied?', a: 'Before applying, the patch is cut according to the bald area. The scalp is cleaned, and the patch is applied using either skin-friendly glue and tape, or small clips and tapes on the sides. It is highly comfortable and easy to manage at home.' },
  { q: 'What colors and shapes are available?', a: 'Our hair patches are available in many shapes based on the scalp size. They come in 3 primary colors: Light Brown, Dark Brown, and Black.' },
  { q: 'Is it safe for sensitive skin?', a: 'Usually, hair patch application does not create any problems. The adhesives are skin-friendly, and the probability of allergy is extremely low even for highly sensitive skin.' },
];

const RELATED_PRODUCTS = [
  { title: 'Hair Wig', href: '/hair-wig' },
  { title: 'Men Hair Wig', href: '/men-hair-wig' },
  { title: 'Women Hair Wig', href: '/women-hair-wig' },
];

export default function HairPatchPage() {
  return (
    <div>
      <ServiceHero
        crumbs={BREADCRUMBS}
        title="Hair patch service"
        lead="A customized, non-surgical solution for partial baldness with a natural look."
        image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80"
        imageAlt="A man with a full head of short hair, smiling"
        slot="hair-patch-hero"
      />

      <ServiceIntro
        heading="Restore your confidence"
        aside={{
          title: 'Why choose us?',
          body: (
            <dl className="space-y-4">
              {WHY_CHOOSE_US.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3">
                  <Icon className="w-5 h-5 text-accent mt-0.5" strokeWidth={1.75} aria-hidden />
                  <div>
                    <dt className="font-semibold text-ink">{title}</dt>
                    <dd>{desc}</dd>
                  </div>
                </div>
              ))}
            </dl>
          ),
        }}
      >
        <p>
          Are you struggling with hair loss and searching for a non-surgical solution? Look no further than Glamour Hair Studios, the trusted name for hair patches. Our customized hair patches are designed to restore your confidence with a natural look.
        </p>
        <p>
          Whether you are experiencing partial baldness or need a full hair restoration, our services are tailored to meet your needs. Our hair patch service ensures comfort, durability, and affordability.
        </p>
        <p className="text-ink font-medium">
          The patches are made from high-quality, skin-friendly materials, providing a breathable and lightweight experience. We focus on delivering personalized solutions, ensuring each hair patch matches your hair texture, color, and style perfectly.
        </p>
      </ServiceIntro>

      <TwoLists
        lists={[
          { title: 'Benefits of hair patches', items: BENEFITS },
          { title: 'Things to keep in mind', items: GUIDELINES },
        ]}
      />

      <ResultSlots slot="hair-patch-result" />

      <FaqList heading="Frequently asked questions" items={FAQS} />

      <ServiceClose
        heading="Ready for a full head of hair?"
        body="Say goodbye to hair loss worries and hello to renewed confidence. Contact us today and take the first step towards a natural look."
        related={RELATED_PRODUCTS}
        relatedHeading="Explore related services"
      />
    </div>
  );
}
