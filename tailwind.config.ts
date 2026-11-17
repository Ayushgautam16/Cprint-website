import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#627D98',
          500: '#334E68',
          600: '#243B53',
          700: '#1C2541',
          800: '#0B132B',
          900: '#060B18',
          950: '#03060E',
        },
        gold: {
          50: '#FDFBF4',
          100: '#FAF4DC',
          200: '#F3E5AB',
          300: '#E7D178',
          400: '#D4AF37', // Classic metallic gold
          500: '#C5A059', // Champagne gold
          600: '#A48028',
          700: '#7D601B',
          800: '#543F0F',
          900: '#2F2306',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#FAF6EE',
          300: '#F5EFE0',
          400: '#EDE3CB',
          500: '#DFD1B0',
        },
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-montserrat)', 'Inter', 'system-ui', 'sans-serif'],
        script: ['var(--font-great-vibes)', 'Brush Script MT', 'cursive'],
      },
      backgroundImage: {
        'gold-metallic': 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #AA8417 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #C5A059 0%, #F3E5AB 50%, #C5A059 100%)',
        'navy-gradient': 'linear-gradient(180deg, #0B132B 0%, #060B18 100%)',
        'card-gradient': 'linear-gradient(145deg, #101B3B 0%, #070D1F 100%)',
      },
      boxShadow: {
        'gold-glow': '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 10px 30px -4px rgba(212, 175, 55, 0.35)',
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;

