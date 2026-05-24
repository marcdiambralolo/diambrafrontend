import type { Viewport } from "next";

export const rootViewport: Viewport = {
  width: "device-width",
  minimumScale: 1,
  initialScale: 1,
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