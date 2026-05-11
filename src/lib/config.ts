export const config = {
  // API Configuration
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    apiVersion: 'v1', // pas de version, routes directes
    timeout: 300000, // 5 minutes (hooks longs peuvent override)
  },

  // Auth Configuration
  auth: {
    tokenKey: 'monetoile_access_token',
    refreshTokenKey: 'monetoile_refresh_token',
    tokenExpirationBuffer: 360, // 360 secondes avant expiration
  },

  // Frontend Configuration
  frontend: {
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Routes
  routes: {
    home: '/',
    login: '/auth/login',
    register: '/auth/register',
    dashboard: '/star/profil',
    adminDashboard: '/admin',
    consultantDashboard: '/consultant',
    profile: '/profile',
  },

  // Pagination
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
};

export default config;
