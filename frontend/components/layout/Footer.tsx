'use client';

import Link from 'next/link';
import {
  Instagram, Facebook, Youtube, Twitter, Mail, Phone, MapPin,
  Truck, RotateCcw, ShieldCheck, MessageCircle,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';

const FOOTER_LINKS = {
  'Hair Collections': [
    { label: "Women's Wigs", href: '/women' },
    { label: "Men's Hair Systems", href: '/men' },
    { label: 'Human Hair Wigs', href: '/women?material=human-hair' },
    { label: 'Synthetic Wigs', href: '/women?material=synthetic' },
    { label: 'Lace Front Wigs', href: '/women?texture=lace-front' },
    { label: 'Best Sellers', href: '/women?bestSeller=true' },
    { label: 'New Arrivals', href: '/women?newArrival=true' },
  ],
  'Customer Care': [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Track Your Order', href: '/orders' },
    { label: 'Returns & Exchanges', href: '/faq#returns' },
    { label: 'Shipping Policy', href: '/faq#shipping' },
    { label: 'Wig Care Guide', href: '/blog/how-to-maintain-human-hair-wig' },
    { label: 'Virtual Try-On', href: '/try-on' },
  ],
  'Company': [
    { label: 'About us', href: '/about' },
    { label: 'Blog & Tips', href: '/blog' },
    { label: 'Careers', href: '/about#careers' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Affiliate Program', href: '/affiliate' },
  ],
};

const SOCIAL_LINKS = [
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Facebook, href: '#', label: 'Facebook' },
  { Icon: Youtube, href: '#', label: 'YouTube' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
];

const FEATURES = [
  { Icon: Truck, title: 'Free Shipping', desc: 'On every order' },
  { Icon: RotateCcw, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { Icon: ShieldCheck, title: 'Secure Payment', desc: '100% encrypted & safe' },
  { Icon: MessageCircle, title: '24/7 Support', desc: 'Expert help anytime' },
];

// Hairlines between cells: two by two on small screens, one row on large.
const FEATURE_CELL = [
  '',
  'pl-4 lg:pl-8 border-l',
  'lg:pl-8 lg:border-l border-t lg:border-t-0',
  'pl-4 lg:pl-8 border-l border-t lg:border-t-0',
];

const linkCls = 'text-deep-ink/80 hover:text-white underline-offset-4 hover:underline transition-colors';

export default function Footer() {
  return (
    <footer className="bg-deep text-deep-ink">
      {/* The four promises, set in type between hairlines */}
      <div className="border-b border-white/10">
        <ul className="container-custom grid grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, desc }, i) => (
            <li
              key={title}
              className={`flex items-start gap-3 py-6 lg:py-8 pr-4 border-white/10 ${FEATURE_CELL[i]}`}
            >
              <Icon className="w-5 h-5 mt-0.5 shrink-0 text-mint" strokeWidth={1.75} aria-hidden />
              <div>
                <p className="font-semibold text-white text-[0.9375rem]">{title}</p>
                <p className="text-[0.875rem] text-deep-muted mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container-custom py-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl text-white">Style notes, now and then</h2>
              <p className="text-[0.9375rem] text-deep-muted mt-1">
                Get style inspiration and exclusive offers. Join 2 lakh+ subscribers. Unsubscribe anytime.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-email" className="visually-hidden">Email address</label>
              <input
                id="footer-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-80 min-h-[48px] px-5 bg-white/5 border border-white/55 rounded-full text-[0.9375rem] text-white placeholder:text-deep-muted hover:border-white/80 focus:outline-none focus:border-mint focus-visible:outline-2 focus-visible:outline-mint transition-colors"
              />
              <button
                type="submit"
                className="btn-primary !bg-mint !border-mint !text-ink hover:!bg-white hover:!border-white focus-visible:!outline-mint"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mast: the wordmark and how to reach the studio, then the links */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-10 gap-y-12">
          <div className="md:col-span-2 lg:col-span-12 xl:col-span-5">
            <Link href="/" className="inline-block mb-6 rounded-sm">
              <Logo tone="light" height={52} />
            </Link>
            <p className="font-display text-2xl leading-snug text-white max-w-[26ch] mb-8">
              India&apos;s most trusted hair wig brand, for men and women alike.
            </p>
            <ul className="space-y-3 text-[0.9375rem]">
              <li>
                <a href="tel:+919027396563" className={`inline-flex items-center gap-3 ${linkCls}`}>
                  <Phone className="w-4 h-4 text-mint" aria-hidden /> +91 90273 96563
                </a>
              </li>
              <li>
                <a href="mailto:hello@hairsup.com" className={`inline-flex items-center gap-3 ${linkCls}`}>
                  <Mail className="w-4 h-4 text-mint" aria-hidden /> hello@hairsup.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-deep-ink/80">
                <MapPin className="w-4 h-4 text-mint mt-1 shrink-0" aria-hidden />
                <span>Glamour Hair Studios HQ, Bandra Kurla Complex, Mumbai 400051</span>
              </li>
            </ul>

            <ul className="flex items-center gap-2 mt-8">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="w-11 h-11 border border-white/20 hover:border-mint hover:text-mint rounded-full flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links], i) => (
            <nav
              key={title}
              aria-label={title}
              className={i === 0 ? 'lg:col-span-4 xl:col-span-2 xl:col-start-7' : 'lg:col-span-4 xl:col-span-2'}
            >
              <h3 className="font-sans text-[0.9375rem] font-semibold text-white mb-4 tracking-normal">{title}</h3>
              <ul className="space-y-2.5 text-[0.9375rem]">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className={linkCls}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-[0.8125rem] text-deep-muted">
          <p>© {new Date().getFullYear()} Glamour Hair Studios Pvt. Ltd.</p>
          <p>We accept Visa, Mastercard, UPI, Razorpay and EMI.</p>
          <ul className="flex gap-5">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
            <li><Link href="/sitemap" className="hover:text-white transition-colors">Sitemap</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
