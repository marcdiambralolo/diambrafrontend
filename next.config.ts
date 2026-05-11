import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
  // Optimisations pour Tailwind CSS 4
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // Transpilation des packages pour une meilleure compatibilité
  transpilePackages: ["@tailwindcss/postcss"],
};

export default nextConfig;

 