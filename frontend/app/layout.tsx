import type { Metadata, Viewport } from 'next';
import { Alegreya, Figtree } from 'next/font/google';
import './globals.css';

// Alegreya carries the headings: a calligraphic serif with a hand in it, which
// reads closer to a salon's signage than to a fashion masthead. Figtree is the
// working face for everything else.
const alegreya = Alegreya({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal'],
  variable: '--font-alegreya',
  display: 'swap',
});

const figtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-figtree',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Glamour Hair Studios — Premium Hair Wigs for Men & Women',
    template: '%s | Glamour Hair Studios',
  },
  description:
    "India's #1 hair wig brand. Shop premium human hair wigs, synthetic wigs, and hair systems for men and women. Virtual try-on available. Free shipping.",
  keywords: [
    'hair wigs', 'human hair wigs', 'synthetic wigs', "men's hair system",
    "women's wigs", 'lace front wigs', 'Glamour Hair Studios', 'buy wigs online India',
  ],
  authors: [{ name: 'Glamour Hair Studios' }],
  metadataBase: new URL('http://localhost:3000'),
  creator: 'Glamour Hair Studios',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Glamour Hair Studios',
    title: 'Glamour Hair Studios — Premium Hair Wigs for Men & Women',
    description: "India's #1 hair wig brand — premium human hair wigs & systems with virtual try-on.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glamour Hair Studios — Premium Hair Wigs',
    description: "India's #1 hair wig brand.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // brand-950, the deep teal of the footer
  themeColor: '#0f2a28',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${alegreya.variable} ${figtree.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
