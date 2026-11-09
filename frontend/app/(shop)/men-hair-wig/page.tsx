import { Metadata } from 'next';
import { Sparkles, ShieldCheck, Clock, HeartHandshake } from 'lucide-react';
import {
  ServiceHero, ServiceIntro, Ledger, ResultSlots, FaqList, ServiceClose,
} from '@/components/shop/Service';

export const metadata: Metadata = {
  title: 'Men Hair Wig Dealers | Glamour Hair Studios',
  description: 'Buy premium quality human hair wigs for men. Get a convincing and effective remedy for hair loss without expensive surgery.',
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Men Hair Wig', href: '/men-hair-wig' },
];

const FEATURES = [
  { icon: Clock, title: 'Used Since Ancient Times', desc: 'Wigs have improved remarkably over history. Today\'s wigs look 100% natural.' },
  { icon: Sparkles, title: 'Match Your Personality', desc: 'Choose from long, short, spiky, and various colors to suit your exact style.' },
  { icon: ShieldCheck, title: 'No Discomfort', desc: 'Designed to never fail their owners and become one with their head, heart, and soul.' },
  { icon: HeartHandshake, title: 'Specialist Guarantee', desc: 'Highest quality natural hair that easily passes off as the real thing.' },
];

const FAQS = [
  { q: 'Is a hair wig better than surgery?', a: 'Surgery and hair transplants are expensive and come with their own list of cons. High-quality human hair wigs provide a substantial, cost-effective, and instant solution to hair loss without the risks.' },
  { q: 'Will people notice I am wearing a wig?', a: 'No. Our men\'s wigs are made from the highest quality natural hair which easily passes off as the real thing. Wear it, and no one can spot the difference.' },
  { q: 'Can I style my wig?', a: 'Yes. Whether you desire long hair, short spiky ones, or a specific color, you can choose your design and style it to match your personality perfectly.' },
  { q: 'Are they comfortable to wear daily?', a: 'Our confidence comes from the assurance that none of our products will cause discomfort. They are designed to become one with you.' },
];

const RELATED_PRODUCTS = [
  { title: 'Hair Wig', href: '/hair-wig' },
  { title: 'Women Hair Wig', href: '/women-hair-wig' },
  { title: 'Hair Patch', href: '/search?q=hair%20patch' },
];

export default function MenHairWigPage() {
  return (
    <div>
      <ServiceHero
        crumbs={BREADCRUMBS}
        title="Men hair wigs"
        lead="A convincing and effective remedy to hair loss with our premium human hair wigs."
        image="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80"
        imageAlt="A barber's tools laid out at the studio"
        slot="men-wig-hero"
      />

      <ServiceIntro
        heading="Men hair wig dealers"
        aside={{
          title: 'Importance of men hair wigs',
          body: (
            <>
              <p>Is it long hair you desire? Or short spiky ones? Well choose your design and your style from a plethora of options available online where you can easily buy men hair wigs. And why only stop at the style, when you can also choose from a range of colors depending on what look you want to sport.</p>
              <p>Men who lose sleep over losing hair, take note of this and use it the next time you frown upon your own receding hairline or bald spot. Now looking good is all but a matter of selecting the best hair wig that goes best with your personality, and watch as compliments start being thrown your way.</p>
            </>
          ),
        }}
      >
        <p>
          We are amongst the most acknowledged names betrothed in providing a huge gamut of quality rich Human Hair Wigs to our customers. Utilization of progressive tools along with modern machinery and technology enables us to manufacture this distinctive collection of wigs.
        </p>
        <p>
          Men have tried and failed, hair products come and go, claims made and denounced, but a convincing and effective remedy is still not found among these hair growth solutions. A more expensive way out is surgery and hair transplant, but not everyone can afford that and even that comes with its own list of cons.
        </p>
        <p className="text-ink font-medium">
          Amidst all this furor surrounding the cause and effect and a substantial solution to hair loss, one particular remedy that sticks out is premium hair wigs.
        </p>
      </ServiceIntro>

      <Ledger
        heading="Why choose our men's wigs?"
        lead="We consider ourselves specialists in fashioning men's hair wigs."
        items={FEATURES}
      />

      <ResultSlots
        heading="Styles and results"
        note="A glimpse into our premium natural human hair wigs for men."
        frames={['Men\'s style 1', 'Men\'s style 2', 'Men\'s style 3']}
        slot="men-wig-style"
      />

      <FaqList heading="Frequently asked questions" items={FAQS} />

      <ServiceClose
        heading="Get your natural look back today"
        body="Ready to experience the ultimate versatility and quality? Browse our complete men's collection or speak with our experts to find exactly what you need."
        related={RELATED_PRODUCTS}
        relatedHeading="Explore related products"
      />
    </div>
  );
}
