export const endpoints = {  
  // Root
  root: '/',

  // Authentication
  auth: {
    register: '/api/v1/auth/register',
    login: '/api/v1/auth/login',
    refresh: '/api/v1/auth/refresh',
    me: '/api/v1/auth/me',
    logout: '/api/v1/auth/logout',
  },

  // Users
  users: {
    list: '/users',
    consultants: '/users/consultants',
    byId: (id: string) => `/users/${id}`,
    stats: (id: string) => `/users/${id}/stats`,
    role: (id: string) => `/users/${id}/role`,
    permissions: (id: string) => `/users/${id}/permissions`,
    password: (id: string) => `/users/${id}/password`,
  },

  // Consultations
  consultations: {
    list: '/consultations',
    create: '/consultations',
    byId: (id: string) => `/consultations/${id}`,
    status: (id: string) => `/consultations/${id}/status`,
    assign: (id: string) => `/consultations/${id}/assign`,
    stats: '/consultations/stats',
  },

  // Services
  services: {
    list: '/services',
    create: '/services',
    byId: (id: string) => `/services/${id}`,
    featured: '/services/featured',
  },

  // Payments
  payments: {
    createIntent: '/payments/create-intent',
    confirm: '/payments/confirm',
    byId: (id: string) => `/payments/${id}`,
    refund: (id: string) => `/payments/${id}/refund`,
    myPayments: '/payments/my-payments',
    stats: '/payments/stats',
  },

  // Notifications
  notifications: {
    list: '/notifications',
    unread: '/notifications/unread',
    unreadCount: '/notifications/unread/count',
    byId: (id: string) => `/notifications/${id}`,
    markAsRead: (id: string) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    preferences: '/notifications/preferences',
  }, 
 
  userAccess: {
    mySubscription: '/user-access/subscription-info',
    checkAccess: (rubriqueId: string) => `/user-access/check-access/${rubriqueId}`,
  },
};

export default endpoints;