export const endpoints = {
  // Admin Books
  adminBooks: {
    list: '/admin/books',
    byId: (id: string) => `/books/${id}`,
  },
  // Books
  books: {
    byId: (id: string) => `/books/${id}`,
  },
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
    review: (id: string) => `/consultations/${id}/review`,
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

  // Grades
  grades: {
    info: '/grades/info',
    myProgress: '/grades/progress',
    userProgress: (userId: string) => `/grades/progress/${userId}`,
    checkGrade: (userId: string) => `/grades/check/${userId}`,
    incrementConsultations: '/grades/increment-consultations',
    incrementRituels: '/grades/increment-rituels',
    incrementBooks: '/grades/increment-books',
    welcomeMessage: '/grades/welcome-message',
  },

  // Admin Grades
  adminGrades: {
    list: '/admin/grades',
    enriched: '/admin/grades/enriched',
    byId: (id: string) => `/admin/grades/${id}`,
    byName: (grade: string) => `/admin/grades/by-name/${grade}`,
    reorderChoices: (id: string) => `/admin/grades/${id}/reorder-choices`,
    nextGrade: (id: string) => `/admin/grades/${id}/next-grade`,
    consultationChoices: '/admin/consultation-choices',
  },

  // User Access (Profils)
  userAccess: {
    mySubscription: '/user-access/subscription-info',
    checkAccess: (rubriqueId: string) => `/user-access/check-access/${rubriqueId}`,
    activatePremium: '/user-access/activate-premium',
    activateIntegral: '/user-access/activate-integral',
    cancelSubscription: '/user-access/cancel-subscription',
  },

  // Blog
  blog: {
    list: '/blog',
    byId: (id: string) => `/blog/${id}`,
    create: '/blog',
    update: (id: string) => `/blog/${id}`,
    delete: (id: string) => `/blog/${id}`,
  },
};

export default endpoints;