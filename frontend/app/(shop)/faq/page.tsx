import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { PageHero, FaqItems } from '@/components/shop/Service';

export const metadata: Metadata = {
  title: 'FAQ | Frequently Asked Questions | Glamour Hair Studios',
  description: 'Find answers to common questions about Glamour Hair Studios wigs, orders, shipping, returns, and virtual try-on.',
};

const FAQ_SECTIONS = [
  {
    title: 'Products & Quality',
    faqs: [
      { q: 'What types of wigs does Glamour Hair Studios sell?', a: "We carry 280+ styles across two main categories: Women's Wigs (lace front, full lace, human hair, synthetic, curly, straight, bob, ombre, and more) and Men's Hair Systems (Swiss lace hairpieces, toupees, crown covers, full cap systems, and sports-active systems)." },
      { q: 'Are your wigs made from real human hair?', a: "Many of our wigs are made from 100% human hair or premium human hair blends. Each product page clearly states the material. Our human hair wigs can be washed, dyed, and heat-styled just like your natural hair." },
      { q: 'What is the difference between a lace front and a full lace wig?', a: "A lace front wig has lace only along the front hairline, creating a natural-looking hairline. A full lace wig has lace across the entire cap, allowing you to part the hair anywhere and style it up completely. Full lace wigs are more versatile but also more expensive." },
      { q: 'How long will my wig last?', a: "Human hair wigs last 12–24 months with proper care. Synthetic wigs typically last 4–6 months. Proper washing, storage on a wig stand, and avoiding excessive heat will significantly extend the lifespan." },
      { q: 'Are Glamour Hair Studios products safe for sensitive scalps?', a: "Yes. All our products are dermatologically tested and free from harsh chemicals. We offer a range of wigs designed specifically for sensitive scalps, including those undergoing chemotherapy or dealing with alopecia." },
    ],
  },
  {
    title: 'Sizing & Fit',
    faqs: [
      { q: 'How do I measure my head for the right cap size?', a: "Use a soft measuring tape. Measure the circumference of your head starting at your natural hairline at the forehead, going around the back of your head, and returning to the start. The average adult head measures 53–58cm. Our wigs include adjustable straps for a secure fit." },
      { q: 'What if the wig doesn\'t fit perfectly?', a: "All our wigs have adjustable velcro straps that allow you to tighten or loosen the cap. If you're still unhappy with the fit within 7 days of delivery (unworn), contact us for an exchange. We also offer custom-sized wigs; contact our team for a consultation." },
      { q: 'Do you offer custom wigs?', a: "Yes! We offer custom-made wigs tailored to your exact measurements, hair colour, density, and texture. This service is available in-store at all 50+ Glamour Hair Studios experience centres. Contact us to book a custom wig consultation." },
    ],
  },
  {
    title: 'Orders & Shipping',
    faqs: [
      { q: 'How long does delivery take?', a: "Standard delivery takes 3–5 business days across India. Express delivery (1–2 business days) is available for an additional fee. Metro cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad) typically receive orders within 2–3 days." },
      { q: 'Is shipping free?', a: 'Yes! Standard shipping is free on every order within India. Express delivery is available for an additional fee.' },
      { q: 'Can I track my order?', a: "Yes! You will receive an SMS and email with your tracking link as soon as your order is dispatched. You can also track your order in the 'My Orders' section of your Glamour Hair Studios account." },
      { q: 'Do you ship internationally?', a: "We currently ship to UAE, Singapore, and the United Kingdom. International orders typically take 7–12 business days. Customs duties and taxes are the buyer's responsibility." },
    ],
  },
  {
    title: 'Returns & Exchanges',
    faqs: [
      { q: 'What is your return policy?', a: "We accept returns within 7 days of delivery for unused wigs in their original condition with all tags attached and in original packaging. Worn wigs cannot be returned for hygiene reasons. Custom-sized wigs are non-returnable." },
      { q: 'How do I initiate a return?', a: "Log in to your account, go to 'My Orders', select the order, and click 'Return/Exchange'. Our team will arrange a free pickup within 24–48 hours. Refunds are processed within 5–7 business days to your original payment method." },
      { q: 'What if I receive a damaged or wrong product?', a: "We sincerely apologise! Please contact us within 48 hours of delivery with photographs of the issue. We will arrange an immediate replacement or full refund at no cost to you." },
    ],
  },
  {
    title: 'Virtual Try-On',
    faqs: [
      { q: 'How does the virtual try-on work?', a: "Our AI-powered virtual try-on uses your device's camera to detect your face and overlay selected wig styles in real time. It works in any modern web browser, with no app download needed. You can also upload a selfie instead of using your live camera." },
      { q: 'Is my camera feed stored or shared?', a: "Never. Your camera feed is processed entirely on your device and is never uploaded to our servers. We are committed to your privacy." },
      { q: 'How accurate is the virtual try-on?', a: "Our AI provides a realistic approximation of how a wig will look. It accurately represents the wig's style, length, and colour. For the most accurate representation, ensure good lighting and look directly at the camera." },
    ],
  },
  {
    title: 'Payments',
    faqs: [
      { q: 'What payment methods are accepted?', a: "We accept UPI (GPay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay, Amex), Net Banking (all major banks), and Cash on Delivery. EMI options are available on credit cards for orders above ₹3,000." },
      { q: 'Is my payment information secure?', a: "Absolutely. All payments are processed through Razorpay, a PCI-DSS compliant payment gateway. We never store your card details on our servers. All transactions are 256-bit SSL encrypted." },
      { q: 'Can I use a coupon code?', a: "Yes! Enter your coupon code at checkout. Common codes include FIRST20 (20% off your first order) and HAIRSUP200 (₹200 off orders above ₹2,000). Check our social media and email newsletter for latest offers." },
    ],
  },
];

const sectionId = (title: string) => title.toLowerCase().replace(/\s+&?\s*/g, '-');

export default function FAQPage() {
  return (
    <div>
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'FAQ', href: '/faq' }]}
        title="Frequently asked questions"
        lead="Answers about Glamour Hair Studios, our products, and how we work."
      />

      <div className="container-custom section-md grid gap-12 lg:grid-cols-12">
        {/* Index and help: stays in view while the answers scroll */}
        <aside className="lg:col-span-3 min-w-0">
          <div className="lg:sticky lg:top-28 grid gap-10">
            <nav aria-labelledby="faq-index">
              <h2 id="faq-index" className="font-semibold text-ink text-[1.0625rem]">Jump to a section</h2>
              <ul className="mt-3 border-t border-rule">
                {FAQ_SECTIONS.map(({ title }) => (
                  <li key={title} className="border-b border-rule">
                    <a
                      href={`#${sectionId(title)}`}
                      className="flex items-center min-h-[44px] text-[0.9375rem] text-ink-soft hover:text-accent transition-colors rounded-sm"
                    >
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="font-semibold text-ink text-[1.0625rem]">Still need help?</h2>
              <p className="text-[0.9375rem] text-ink-soft mt-2">Our hair specialists are available 7 days a week.</p>
              <ul className="mt-4 grid gap-1">
                <li>
                  <a href="tel:+919027396563" className="inline-flex items-center gap-2.5 min-h-[40px] text-[0.9375rem] text-ink font-medium hover:text-accent transition-colors rounded-sm">
                    <Phone className="w-4 h-4 text-accent" aria-hidden /> +91 90273 96563
                  </a>
                </li>
                <li>
                  <a href="mailto:help@hairsup.com" className="inline-flex items-center gap-2.5 min-h-[40px] text-[0.9375rem] text-ink font-medium hover:text-accent transition-colors rounded-sm">
                    <Mail className="w-4 h-4 text-accent" aria-hidden /> help@hairsup.com
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="inline-flex items-center gap-2.5 min-h-[40px] text-[0.9375rem] text-ink font-medium hover:text-accent transition-colors rounded-sm">
                    <MessageCircle className="w-4 h-4 text-accent" aria-hidden /> Live Chat
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-8 lg:col-start-5 grid gap-16 min-w-0">
          {FAQ_SECTIONS.map(({ title, faqs }) => (
            <section key={title} id={sectionId(title)} aria-labelledby={`${sectionId(title)}-h`} className="scroll-mt-28">
              <h2 id={`${sectionId(title)}-h`} className="font-display text-[length:var(--text-2xl)] leading-tight text-ink mb-5">
                {title}
              </h2>
              <FaqItems items={faqs} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
