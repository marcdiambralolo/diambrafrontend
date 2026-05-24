const faviconAnySize = `${'an'}y`;

export function getRootMetadata() {
  return {
    title: {
      default: "Diambra",
      template: "%s | Diambra",
    },
    description:
      "✨ Jouez DIAMBRA dès maintenant!",
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://www.diambra.net"),
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: "/",
      siteName: "Diambra win",
      title: "Diambra",
      description:
        "🔮 Jeu .",
      images: [
        { url: "/og-image.jpg", width: 1200, height: 630, alt: "Diambra", type: "image/jpeg" },
        { url: "/og-image-square.jpg", width: 800, height: 800, alt: "Diambra", type: "image/jpeg" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@DiambraApp",
      creator: "@DiambraApp",
      title: "Diambra",
      description: "🔮 Jeu.",
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
    appleWebApp: { capable: true, title: "Diambra", statusBarStyle: "black-translucent" as const },
    other: { "mobile-web-app-capable": "yes", "apple-mobile-web-app-capable": "yes" },
  };
}