/** @type {import('next').NextConfig} */
const crypto = require('crypto');

function getApiUploadPattern() {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:3001';

  try {
    const parsed = new URL(rawApiUrl);
    return {
      protocol: parsed.protocol.replace(':', ''),
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: '/uploads/**',
    };
  } catch {
    return null;
  }
}

const apiUploadPattern = getApiUploadPattern();

const nextConfig = {
    // Cache busting : buildId unique à chaque build
    generateBuildId: async () => {
      return crypto.randomBytes(8).toString('hex');
    },
  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      ...(apiUploadPattern ? [apiUploadPattern] : []),
      // Autorise aussi les images sur /api/v1/uploads/** pour localhost:3001
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/api/v1/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'diambra.net',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.genspark.ai',
        port: '',
        pathname: '/api/files/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
      // Autorise placehold.co pour next/image
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 an de cache pour les images optimisées
  },
  
  // ✅ Proxy API vers le backend NestJS
  async rewrites() {
    // Adresse interne du backend (configurable via BACKEND_URL, non exposé au client)
    const backendUrl = (process.env.BACKEND_URL || 'http://localhost:3001').replace(/\/+$/, '');
    return [
      // Le client Axios envoie déjà les requêtes avec le préfixe /api/v1,
      // donc on fait un proxy direct sans modifier le chemin.
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
  
  // Headers de sécurité + cache optimisés
  async headers() {
    // En-têtes de sécurité appliqués à toutes les routes
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
    ];

    return [
      // Sécurité globale sur toutes les routes
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // Cache immutable pour les assets statiques Next.js
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache immutable pour les fichiers statiques
      {
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache immutable pour les images
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Pas de cache pour les routes API
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
      // Revalidation rapide pour les pages HTML (ISR-like)
      {
        source: '/:path((?!_next|static|api)[^.]*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=120' },
        ],
      },
    ];
  },
  
  // Experimental features pour performances
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts', 'date-fns', '@react-pdf/renderer'],
  },
}

module.exports = nextConfig