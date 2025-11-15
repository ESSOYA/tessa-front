// Configuration de l'environnement
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

// URLs de l'application
export const URLS = {
  HOME: '/',
  SERVICES: '/services',
  BOOKING: '/booking',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_BOOKINGS: '/admin/bookings',
} as const;

