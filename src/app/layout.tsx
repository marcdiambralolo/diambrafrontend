import { getRootMetadata } from "@/lib/layout/rootMetadata";
import { rootViewport } from "@/lib/layout/rootViewport";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { memo } from "react";
import "./globals.css";
import { Providers, RootPortals, RootSkipLink } from "./providers";

const SITE_CONFIG = {
  name: "Diambra",
  url: "https://www.diambra.net",
  description: "🎯 Diambra ",
  twitterHandle: "@DiambraCorporation",
  ogImage: "/logo.png",
  ogImageAlt: "Diambra Win",
  ogImageWidth: 512,
  ogImageHeight: 512,
} as const;

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
      <meta name="keywords" content="jeu,  chiffres, réflexion, en ligne" />
      <meta name="author" content="Diambra" />
      <meta name="robots" content="index, follow" />
    </>
  );
});

RootHeadMeta.displayName = 'RootHeadMeta';

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
        description: "Jeu en ligne - Remplissez trois cases avec des chiffres sans répétition",
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
        description: "Jeu  - Entraînez votre cerveau avec ce puzzle de chiffres addictif",
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