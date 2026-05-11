import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // PRIMAIRE : Indigo Nuit
        primary: {
          DEFAULT: '#1E154A',
          light: '#2E2366',
          dark: '#130D32',
          50: '#E8E5F0',
          100: '#D1CCE1',
          200: '#A399C3',
          300: '#7566A5',
          400: '#4A3D82',
          500: '#1E154A',
          600: '#18123B',
          700: '#120E2C',
          800: '#0C091E',
          900: '#06050F',
        },

        // SECONDAIRE : Améthyste
        secondary: {
          DEFAULT: '#5C3D8F',
          light: '#7350A8',
          dark: '#452E6E',
          50: '#EFEAF5',
          100: '#DFD5EB',
          200: '#BFABD7',
          300: '#9F81C3',
          400: '#7F57AF',
          500: '#5C3D8F',
          600: '#4A3172',
          700: '#372556',
          800: '#251839',
          900: '#120C1D',
        },

        // ACCENT OR : Or Stellaire
        accent: {
          gold: '#C2913B',
          'gold-light': '#D4A85A',
          'gold-dark': '#9E7428',
          violet: '#7098C4',
          'violet-light': '#92B4D8',
          'violet-dark': '#4E7AAE',
        },

        // PASTELS
        pastel: {
          rose: '#C9A0AC',
          emerald: '#6B9E94',
          sky: '#8AAEC6',
        },

        // FONDS CLAIRS
        light: {
          bg: '#F4F1EC',
          alt: '#EAE5DB',
          text: '#1C1830',
          'text-muted': '#5C587A',
        },

        // FONDS SOMBRES
        dark: {
          bg: '#0C0B1D',
          bgAlt: '#141228',
          text: '#EDE7D9',
          'text-muted': '#9E97B8',
        },
      },

      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'border-pulse': 'border-pulse 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
      },

      backgroundImage: {
        'lux-light': 'linear-gradient(135deg, #F4F1EC 0%, #EAE5DB 100%)',
        'lux-dark': 'linear-gradient(135deg, #0C0B1D 0%, #141228 100%)',
        'cosmic': 'linear-gradient(135deg, #1E154A 0%, #5C3D8F 50%, #2E2366 100%)',
        'gold-cta': 'linear-gradient(135deg, #C2913B 0%, #D4A85A 50%, #9E7428 100%)',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-10px) translateX(5px)' },
          '50%': { transform: 'translateY(-20px) translateX(0)' },
          '75%': { transform: 'translateY(-10px) translateX(-5px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5', filter: 'blur(2px)' },
          '50%': { opacity: '1', filter: 'blur(0px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'border-pulse': {
          '0%, 100%': { opacity: '0.6', filter: 'blur(1px)' },
          '50%': { opacity: '1', filter: 'blur(0.5px)' },
        },
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config