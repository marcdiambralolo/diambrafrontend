export const config = {
  api: {
    // ✅ CORRECTION : Ne pas inclure /api/v1 ici (sera ajouté par apiUrl)
    baseURL: process.env.NODE_ENV === 'production'
      ? ''
      : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'),
    apiVersion: 'v1',
    timeout: 300000,
  },

  // Auth Configuration
  auth: {
    tokenKey: 'monetoile_access_token',
    refreshTokenKey: 'monetoile_refresh_token',
    tokenExpirationBuffer: 360,
  },

  // Frontend Configuration
  frontend: {
    baseURL: process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.NODE_ENV === 'production' ? 'https://diambra.net' : 'http://localhost:3000'),
  },

  // Routes
  routes: {
    home: '/',
    login: '/auth/login',
    register: '/auth/register',
    dashboard: '/star/profil',
    adminDashboard: '/admin',
  },

  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
};

export default config;