 
import { getRootMetadata } from "@/lib/layout/rootMetadata";
import { rootViewport } from "@/lib/layout/rootViewport";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { memo } from "react";
import "./globals.css";
import { Providers, RootPortals, RootSkipLink } from "./providers";
 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Diambra — Quatre cases",
//   description:
//     "Placez des chiffres de 0 à 9 dans quatre cases, sans répéter un chiffre.",
//   applicationName: "Diambra",
//   appleWebApp: {
//     capable: true,
//     title: "Diambra",
//     statusBarStyle: "default",
//   },
//   formatDetection: {
//     telephone: false,
//   },
//   icons: {
//     icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
//     apple: [{ url: "/icons/icon.svg" }],
//   },
// };

// export const viewport: Viewport = {
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
//     { media: "(prefers-color-scheme: dark)", color: "#030712" },
//   ],
//   colorScheme: "dark light",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html
//       lang="fr"
//       suppressHydrationWarning
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <body className="flex min-h-full flex-col font-sans text-foreground antialiased">
//         <ServiceWorkerRegister />
//         <Providers>
//           <AppShell>{children}</AppShell>
//         </Providers>
//       </body>
//     </html>
//   );
// }




// ============================================================================
// CONSTANTES & CONFIGURATION
// ============================================================================

const SITE_CONFIG = {
  name: "Diambra",
  url: "https://www.diambra.net",
  description: "🎯 Diambra - Jeu de logique et de reflexion. Entraînez votre cerveau avec notre jeu de chiffres captivant. Quatre cases, des chiffres de 0 à 9, aucune répétition. Simple, rapide, addictif !",
  twitterHandle: "@DiambraNet",
  ogImage: "/logo.png",
  ogImageAlt: "Diambra - Jeu de Logique",
  ogImageWidth: 512,
  ogImageHeight: 512,
} as const;

// ============================================================================
// FONTS
// ============================================================================

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  adjustFontFallback: true,
  weight: ["400", "500", "600", "700", "800", "900"],
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Oxygen",
    "Ubuntu",
    "Cantarell",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

// ============================================================================
// COMPOSANTS MÉMOÏSÉS POUR LES MÉTA-DONNÉES
// ============================================================================

const RootHeadMeta = memo(function RootHeadMeta() {
  return (
    <>
      {/* PWA / Mobile */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content={SITE_CONFIG.name} />
      <meta name="theme-color" content="#7C3AED" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={`${SITE_CONFIG.name} — Défi Cérébral`} />
      <meta property="og:description" content={SITE_CONFIG.description} />
      <meta property="og:url" content={SITE_CONFIG.url} />
      <meta property="og:image" content={SITE_CONFIG.ogImage} />
      <meta property="og:image:alt" content={SITE_CONFIG.ogImageAlt} />
      <meta property="og:image:width" content={SITE_CONFIG.ogImageWidth.toString()} />
      <meta property="og:image:height" content={SITE_CONFIG.ogImageHeight.toString()} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:creator" content={SITE_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={`${SITE_CONFIG.name} — Défi Cérébral`} />
      <meta name="twitter:description" content={SITE_CONFIG.description} />
      <meta name="twitter:image" content={SITE_CONFIG.ogImage} />
      <meta name="twitter:image:alt" content={SITE_CONFIG.ogImageAlt} />

      {/* Additional SEO */}
      <meta name="keywords" content="jeu de logique, puzzle, chiffres, casse-tête, réflexion, défi cérébral, gratuit, en ligne" />
      <meta name="author" content="Diambra" />
      <meta name="robots" content="index, follow" />
    </>
  );
});

RootHeadMeta.displayName = 'RootHeadMeta';

// ============================================================================
// SCRIPTS OPTIMISÉS
// ============================================================================

const ThemeScript = memo(function ThemeScript() {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const theme = localStorage.getItem('diambra-theme') || localStorage.getItem('theme') || 'light';
              const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
              const root = document.documentElement;
              if (isDark) {
                root.classList.add('dark');
                root.style.colorScheme = 'dark';
              } else {
                root.classList.remove('dark');
                root.style.colorScheme = 'light';
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  );
});

ThemeScript.displayName = 'ThemeScript';

const SchemaScript = memo(function SchemaScript() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.url}/#website`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        description: "Jeu de logique en ligne - Remplissez quatre cases avec des chiffres sans répétition",
        inLanguage: "fr-FR",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_CONFIG.url}/#webapplication`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        description: "Jeu de logique Quatre Cases - Entraînez votre cerveau avec ce puzzle de chiffres addictif",
        applicationCategory: "Game",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "1250",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_CONFIG.url}/#organization`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_CONFIG.url}/logo.png`,
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://twitter.com/DiambraNet",
          "https://github.com/marcdiambralolo/diambrafrontend",
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_CONFIG.url}/#webpage`,
        url: SITE_CONFIG.url,
        name: `${SITE_CONFIG.name} - Jeu de Logique`,
        description: SITE_CONFIG.description,
        isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
        about: { "@id": `${SITE_CONFIG.url}/#webapplication` },
        inLanguage: "fr-FR",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
});

SchemaScript.displayName = 'SchemaScript';

// ============================================================================
// COMPOSANT PRINCIPAL LAYOUT
// ============================================================================

const RootMain = memo(function RootMain({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="relative" role="main" aria-label="DIAMBRA">
      {children}
    </main>
  );
});

RootMain.displayName = 'RootMain';

export const metadata: Metadata = getRootMetadata();
export const viewport = rootViewport;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const bodyClasses = `${inter.className} bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50 text-gray-900 dark:bg-gradient-to-b dark:from-slate-950 dark:via-purple-950/30 dark:to-indigo-950 dark:text-white
    selection:bg-purple-500/20 dark:selection:bg-purple-500/35 selection:text-purple-950 dark:selection:text-white antialiased`;

  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <head>
        <RootHeadMeta />
        <ThemeScript />
        <SchemaScript />
      </head>

      <body className={bodyClasses} suppressHydrationWarning>
        <RootSkipLink />
        <Providers>
          <RootMain>{children}</RootMain>
        </Providers>
        <RootPortals />
      </body>
    </html>
  );
}
