import type { Viewport } from "next";

/**
 * Configuration du viewport pour tous les appareils
 */
export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 3,
  userScalable: true,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  interactiveWidget: "resizes-visual",
};