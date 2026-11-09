/** @type {import('tailwindcss').Config} */

// Every colour resolves to a token in app/tokens.css. The channel form keeps
// Tailwind's opacity modifiers (bg-brand-700/10) working.
const ramp = (name, steps) =>
  Object.fromEntries(steps.map((s) => [s, `oklch(var(--c-${name}-${s}) / <alpha-value>)`]));
const neutral = ramp('n', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]);
const tok = (name) => `oklch(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: ramp('brand', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        admin: { base: tok('admin-base'), panel: tok('admin-panel'), raised: tok('admin-raised') },

        // Tailwind's cool greys and absolutes are replaced, not extended, so
        // every page that still uses them picks up the warm linen neutrals.
        white: tok('n-0'),
        black: tok('n-950'),
        gray: neutral,
        slate: neutral,
        zinc: neutral,
        neutral,
        stone: neutral,

        ink: {
          DEFAULT: tok('n-900'),
          soft: tok('n-700'),
          muted: tok('n-500'),
        },
        paper: {
          DEFAULT: tok('n-50'),
          2: tok('n-100'),
          3: tok('n-200'),
        },
        rule: tok('n-300'),
        // Edges of controls and fields: 3:1 against paper and surface.
        field: 'var(--color-field)',
        surface: tok('n-0'),
        accent: { DEFAULT: tok('brand-700'), ink: tok('n-0') },
        mint: tok('brand-100'),
        deep: { DEFAULT: tok('brand-950'), ink: tok('n-100'), muted: tok('deep-muted') },
        cream: tok('n-100'),
        mist: tok('n-50'),

        coral: ramp('coral', [400, 500, 600]),
        red: { 50: 'oklch(96% 0.02 27 / <alpha-value>)', 100: 'oklch(93% 0.04 27 / <alpha-value>)', 200: 'oklch(87% 0.07 27 / <alpha-value>)', 300: 'oklch(78% 0.11 27 / <alpha-value>)', 400: 'oklch(66% 0.17 27 / <alpha-value>)', 500: tok('error'), 600: tok('error'), 700: 'oklch(45% 0.16 27 / <alpha-value>)', 800: 'oklch(38% 0.13 27 / <alpha-value>)', 900: 'oklch(32% 0.1 27 / <alpha-value>)' },
        green: { 50: 'oklch(96% 0.03 150 / <alpha-value>)', 100: 'oklch(93% 0.05 150 / <alpha-value>)', 200: 'oklch(87% 0.08 150 / <alpha-value>)', 300: 'oklch(78% 0.11 150 / <alpha-value>)', 400: 'oklch(66% 0.13 150 / <alpha-value>)', 500: 'oklch(57% 0.13 150 / <alpha-value>)', 600: tok('success'), 700: 'oklch(43% 0.1 150 / <alpha-value>)', 800: 'oklch(36% 0.08 150 / <alpha-value>)', 900: 'oklch(30% 0.06 150 / <alpha-value>)' },
        emerald: ramp('brand', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        teal: ramp('brand', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        cyan: ramp('brand', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        sky: ramp('brand', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        blue: ramp('brand', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        indigo: ramp('brand', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        violet: ramp('brand', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        purple: ramp('brand', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
        rose: { 50: 'oklch(96% 0.02 27 / <alpha-value>)', 100: 'oklch(93% 0.04 27 / <alpha-value>)', 400: 'oklch(66% 0.17 27 / <alpha-value>)', 500: tok('error'), 600: tok('error'), 700: 'oklch(45% 0.16 27 / <alpha-value>)' },
        pink: { 50: 'oklch(96% 0.02 27 / <alpha-value>)', 100: 'oklch(93% 0.04 27 / <alpha-value>)', 400: 'oklch(66% 0.17 27 / <alpha-value>)', 500: tok('error'), 600: tok('error') },
        amber: { 50: 'oklch(97% 0.03 80 / <alpha-value>)', 100: 'oklch(94% 0.06 80 / <alpha-value>)', 200: 'oklch(89% 0.09 80 / <alpha-value>)', 400: tok('warn'), 500: tok('warn'), 600: 'oklch(58% 0.13 70 / <alpha-value>)', 700: 'oklch(48% 0.11 65 / <alpha-value>)', 800: 'oklch(40% 0.09 60 / <alpha-value>)' },
        yellow: { 50: 'oklch(97% 0.03 80 / <alpha-value>)', 100: 'oklch(94% 0.06 80 / <alpha-value>)', 200: 'oklch(89% 0.09 80 / <alpha-value>)', 300: 'oklch(84% 0.12 80 / <alpha-value>)', 400: tok('warn'), 500: tok('warn'), 600: 'oklch(58% 0.13 70 / <alpha-value>)', 700: 'oklch(48% 0.11 65 / <alpha-value>)', 800: 'oklch(40% 0.09 60 / <alpha-value>)' },
        orange: { 50: 'oklch(97% 0.03 60 / <alpha-value>)', 100: 'oklch(94% 0.05 55 / <alpha-value>)', 400: 'oklch(72% 0.14 50 / <alpha-value>)', 500: 'oklch(66% 0.16 45 / <alpha-value>)', 600: 'oklch(58% 0.15 42 / <alpha-value>)', 700: 'oklch(50% 0.13 40 / <alpha-value>)' },
      },

      fontFamily: {
        sans: ['var(--font-body)'],
        display: ['var(--font-display)'],
        // The old third family (Montserrat) is retired: controls and labels
        // now speak in the body face.
        ui: ['var(--font-body)'],
      },

      letterSpacing: {
        button: '0',
        label: '0',
      },

      aspectRatio: {
        product: '4 / 5',
      },

      borderRadius: {
        card: 'var(--radius-card)',
        button: 'var(--radius-pill)',
      },

      animation: {
        'fade-in': 'fadeIn var(--dur-long) var(--ease-out)',
        'slide-up': 'slideUp var(--dur-long) var(--ease-out)',
        'slide-in-right': 'slideInRight var(--dur-short) var(--ease-out)',
        'scale-in': 'scaleIn var(--dur-short) var(--ease-out)',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(12px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        scaleIn: { '0%': { transform: 'scale(0.97)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(160deg, var(--color-deep), oklch(var(--c-brand-900)))',
      },

      boxShadow: {
        product: 'var(--shadow-card)',
        'product-hover': '0 2px 4px oklch(var(--c-n-900) / 0.06), 0 16px 32px -16px oklch(var(--c-n-900) / 0.22)',
        glow: 'var(--shadow-card)',
      },
    },
  },
  plugins: [],
};
