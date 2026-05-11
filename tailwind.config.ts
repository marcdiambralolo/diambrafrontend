import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── PRIMAIRE : Indigo Nuit ──────────────────────────
        // Identitaire dominant, voûte céleste, contemplation
        primary: {
          DEFAULT: '#1E154A',
          light:   '#2E2366',
          dark:    '#130D32',
        },

        // ─── SECONDAIRE : Améthyste ─────────────────────────
        // Pierre spirituelle, sagesse et transformation
        secondary: {
          DEFAULT: '#5C3D8F',
          light:   '#7350A8',
          dark:    '#452E6E',
        },

        // ─── ACCENT OR : Or Stellaire ───────────────────────
        // CTA, boutons, éléments premium — or patiné naturel
        // Remplace l'ancien doré fluo par un ton plus sophistiqué et lisible
        accent: {
          gold:         '#C2913B',
          'gold-light': '#D4A85A',
          'gold-dark':  '#9E7428',
          // Alias conservé pour compatibilité composants existants
          violet:       '#7098C4',
          'violet-light': '#92B4D8',
          'violet-dark':  '#4E7AAE',
        },

        // ─── PASTELS SOPHISTIQUÉS ───────────────────────────
        // Touches décoratives désaturées, badges, survols
        pastel: {
          rose:    '#C9A0AC', // Rose mûre — chaleur douce
          emerald: '#6B9E94', // Sauge — nature & guérison
          sky:     '#8AAEC6', // Ciel d'aube — introspection
        },

        // ─── FONDS CLAIRS ───────────────────────────────────
        light: {
          bg:   '#F4F1EC', // Parchemin ivoire — fond principal
          alt:  '#EAE5DB', // Ivoire sable — sections alternées
          text: '#1C1830', // Encre nocturne — WCAG 16.2:1 ✓
        },

        // ─── FONDS SOMBRES ──────────────────────────────────
        dark: {
          bg:    '#0C0B1D', // Nuit cosmique — fond principal
          bgAlt: '#141228', // Indigo soyeux — sections alternées
          text:  '#EDE7D9', // Crème stellaire — WCAG 18.1:1 ✓
        },

        // ─── DÉGRADÉS ───────────────────────────────────────
        gradient: {
          light: '#E2DDD4', // Grège doux
          dark:  '#1C1938', // Voile nocturne
        },
      },

      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      backgroundImage: {
        // Fond général mode clair : parchemin chaud
        'lux-light': 'linear-gradient(135deg, #F4F1EC 0%, #EAE5DB 100%)',
        // Fond général mode sombre : nuit cosmique
        'lux-dark':  'linear-gradient(135deg, #0C0B1D 0%, #141228 100%)',
        // Dégradé identitaire spirituel
        'cosmic':    'linear-gradient(135deg, #1E154A 0%, #5C3D8F 50%, #2E2366 100%)',
        // Or stellaire — dégradé CTA premium
        'gold-cta':  'linear-gradient(135deg, #C2913B 0%, #D4A85A 50%, #9E7428 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
