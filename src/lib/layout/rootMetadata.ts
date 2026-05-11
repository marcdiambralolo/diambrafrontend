/**
 * Configuration des métadonnées pour le layout root
 */
const faviconAnySize = `${'an'}y`;

export function getRootMetadata() {
  return {
    title: {
      default: "Mon Étoile - Votre Guide Spirituel  | guidance & Astrologie",
      template: "%s | Mon Étoile",
    },
    description:
      "✨ Découvrez votre destinée avec Mon Étoile : consultations de guidance authentiques, analyses astrologiques personnalisées, numérologie avancée et guidance spirituelle par des experts certifiés. Révélez votre potentiel cosmique dès maintenant",
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.monetoile.org"),
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: "/",
      siteName: "Mon Étoile",
      title: "Mon Étoile ✨ Votre Destinée Révélée",
      description:
        "🔮 Consultations spirituelles professionnelles • Analyses astrologiques détaillées • Guidance authentique • Révélez votre potentiel cosmique avec nos experts certifiés.",
      images: [
        { url: "/og-image.jpg", width: 1200, height: 630, alt: "Mon Étoile - Plateforme Spirituelle", type: "image/jpeg" },
        { url: "/og-image-square.jpg", width: 800, height: 800, alt: "Mon Étoile Logo", type: "image/jpeg" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@MonEtoileApp",
      creator: "@MonEtoileApp",
      title: "Mon Étoile ✨ Guidance & Astrologie Africaines",
      description: "🔮 Votre guide spirituel personnalisé. Consultations professionnelles, analyses astrologiques et guidance cosmique.",
      images: ["/twitter-image.jpg"],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: faviconAnySize },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#8b5cf6" }],
    },
    manifest: "/site.webmanifest",
    appleWebApp: { capable: true, title: "Mon Étoile", statusBarStyle: "black-translucent" as const },
    other: { "mobile-web-app-capable": "yes", "apple-mobile-web-app-capable": "yes" },
  };
}