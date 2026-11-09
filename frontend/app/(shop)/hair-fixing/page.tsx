import { Metadata } from 'next';
import {
  Zap, IndianRupee, Layers, HeartHandshake, Shield, Smile, Droplet, Users,
} from 'lucide-react';
import {
  ServiceHero, ServiceIntro, Ledger, ResultSlots, FaqList, ServiceClose,
} from '@/components/shop/Service';

export const metadata: Metadata = {
  title: 'Hair Fixing Service | Glamour Hair Studios',
  description: 'Restore your health and confidence with top-class hair fixing. A painless, non-surgical method using skin-friendly adhesive.',
};

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/contact' },
  { label: 'Hair Fixing', href: '/hair-fixing' },
];

const FEATURES = [
  { icon: Layers, title: 'Non-surgical technique' },
  { icon: Zap, title: 'Quick results in no time' },
  { icon: IndianRupee, title: 'Low Cost & Affordable Fees' },
  { icon: Droplet, title: 'Skin friendly tapes/adhesives' },
  { icon: Smile, title: 'Various colors & textures' },
  { icon: Users, title: 'Done by professionals' },
  { icon: Shield, title: 'Quality Service & Low Maintenance' },
  { icon: HeartHandshake, title: 'Personalized Customer Support' },
];

const FAQS = [
  { q: 'What is hair fixing?', a: 'Hair fixing is an advanced non-surgical hair replacement method to cover baldness. It involves attaching a high-quality hair patch using skin-friendly silicon adhesive.' },
  { q: 'Is the hair fixing process painful?', a: 'No, the hair fixing process is completely non-surgical and painless.' },
  { q: 'Can I do regular activities like swimming with hair fixing?', a: 'Absolutely. We use the best quality and skin-friendly silicon adhesives. After this treatment, you can travel in open vehicles, swim, and shampoo your hair regularly without restrictions.' },
  { q: 'How much does hair fixing cost?', a: 'The price of hair fixing is fully based on the quality of hair and the specific customized options you select. We offer market-leading prices tailored to your budget.' },
];

const RELATED_SERVICES = [
  { title: 'Hair Weaving', href: '/hair-weaving' },
  { title: 'Hair Bonding', href: '/hair-bonding' },
  { title: 'Hair Extensions', href: '/hair-extensions' },
  { title: 'Hair Replacement', href: '/hair-replacement' },
];

export default function HairFixingPage() {
  return (
    <div>
      <ServiceHero
        crumbs={BREADCRUMBS}
        title="Hair fixing"
        lead="Say goodbye to your hair problems forever. Restore your confidence with our top-class hair fixing solutions."
        image="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Inside a quiet hair studio, chairs and mirrors ready for the day"
        slot="hair-fixing-hero"
        consultHref="/contact?service=hair-fixing"
      />

      <ServiceIntro
        heading="Restore your health and confidence"
        aside={{
          title: 'Know why to go for hair fixing treatment?',
          body: (
            <>
              <p>Hair fixing is an excellent way to cover baldness for all age groups, convenient in both male pattern hair loss and females suffering from hair thinning.</p>
              <p>This process is painless. We use the best quality and skin-friendly silicon adhesive to fix the hair patch. After this treatment, you can travel in an open vehicle, swim, and shampoo your hair regularly without any restrictions.</p>
            </>
          ),
        }}
      >
        <p>
          Hair is the most important feature of our personality. Because of modern lifestyle and genetic reasons, hair loss becomes a major problem among people of all age groups. By the age of 30, most men start balding and women also experience hair loss.
        </p>
        <p>
          Now, you don&apos;t have to get embarrassed due to hair loss or bald patches. Hair fixing gives you a new personality, boosts your confidence, and makes you look the manner you wished yourself to look.
        </p>
        <p className="text-ink font-medium">
          Look younger and achieve the desired look with our Hair Fixing Services. We fulfill your expectation of getting a head full of hair that appears stylish and natural.
        </p>
      </ServiceIntro>

      <Ledger
        heading="Why choose Glamour Hair Studios?"
        lead="We give excellent solutions for your hair loss problems."
        items={FEATURES}
      />

      <ServiceIntro heading="Our commitment and aftercare">
        <p>
          Our duty will not end with treatment. We satisfy each customer with personal attention and care. We provide aftercare tips, tell customers safety measures, and give hair maintenance suggestions. Our team is always ready to help our valuable clients in their hair-related issues, striving to fulfill customer needs so that every client steps out from Glamour Hair Studios with complete satisfaction.
        </p>
      </ServiceIntro>

      <ResultSlots slot="hair-fixing-result" />

      <FaqList heading="Frequently asked questions" items={FAQS} />

      <ServiceClose
        heading="Get your natural look back"
        body="If you have tried various solutions and are dissatisfied with the results, contact us. We will make sure your requirements are fulfilled."
        related={RELATED_SERVICES}
        relatedHeading="Explore related services"
        consultHref="/contact?service=hair-fixing"
      />
    </div>
  );
}
