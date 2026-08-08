/** @type {import('tailwindcss').Config} */
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
        // Mint-teal, anchored on the salon palette: 100 and 200 are the exact
        // accent and its hover state. The deeper steps exist because much of
        // the app sets text and backgrounds at 500-700, which need enough
        // contrast to carry white text — the pale mint alone cannot.
        brand: {
          50:  '#f2fbf9',
          100: '#cef1ea',
          200: '#b4e5db',
          300: '#8ed3c6',
          400: '#5cb9a8',
          500: '#3a9e8d',
          600: '#2b8073', // 4.73:1 on white — AA for body text
          700: '#26665d',
          800: '#22524c',
          900: '#1f4440',
          950: '#0d2724',
        },

        // Near-black used for headings and on-mint text, kept separate from
        // Tailwind's grays so it stays consistent.
        ink: {
          DEFAULT: '#151515',
          soft: '#2b2c2f',
          muted: '#6f6f6f', // darkened from the template's #9b9b9b, which
                            // only reaches 2.78:1 on white and fails AA
        },

        // Warm off-white for alternating sections, and the cool tint used
        // behind cards.
        cream: '#f5f2e9',
        mist:  '#f6f9f9',

        // Reserved for sale badges and destructive actions.
        coral: {
          400: '#f77c6b',
          500: '#f5543f',
          600: '#d93b27',
        },
      },

      fontFamily: {
        // Body copy.
        sans: ['Lato', 'system-ui', 'sans-serif'],
        // Headings — high-contrast serif is what gives the layout its
        // editorial feel.
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        // Buttons, labels and small caps UI text.
        ui: ['Montserrat', 'system-ui', 'sans-serif'],
      },

      letterSpacing: {
        button: '0.06em',
        label: '0.12em',
      },

      borderRadius: {
        // Cards and inputs stay nearly square; only buttons are pills.
        card: '5px',
        button: '25px',
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        scaleIn: { '0%': { transform: 'scale(0.9)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        // Deep teal rather than the previous purple.
        'hero-pattern': 'linear-gradient(135deg, #0d2724 0%, #1f4440 55%, #26665d 100%)',
      },

      boxShadow: {
        // Quiet, close shadows. The previous set used a coloured glow, which
        // is the main thing that read as synthetic.
        product: '0 1px 2px rgba(21,21,21,0.04), 0 8px 24px -12px rgba(21,21,21,0.12)',
        'product-hover': '0 2px 4px rgba(21,21,21,0.06), 0 16px 40px -16px rgba(21,21,21,0.18)',
        glow: '0 6px 18px -8px rgba(43,128,115,0.45)',
      },
    },
  },
  plugins: [],
};
