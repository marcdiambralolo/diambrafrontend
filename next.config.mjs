import nextPWA from "next-pwa";
const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/.*$/i, // Cache toutes les requêtes HTTP(S)
      handler: "CacheFirst", // Toujours charger depuis le cache d'abord
      options: {
        cacheName: "full-app-cache",
        expiration: {
          maxEntries: 1000, // Nombre max d'éléments (pratiquement infini)
          maxAgeSeconds: 60 * 60 * 24 * 365 * 10, // 10 ans !
        },
        cacheableResponse: {
          statuses: [0, 200], // Cache même en mode offline
        },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: "out",
};

export default withPWA(nextConfig);