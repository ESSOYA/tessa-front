// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000, // 10 secondes
};

// Endpoints de l'API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  SERVICES: {
    LIST: '/services',
    DETAIL: (id: number) => `/services/${id}`,
    CREATE: '/services',
    UPDATE: (id: number) => `/services/${id}`,
    DELETE: (id: number) => `/services/${id}`,
  },
  APPOINTMENTS: {
    LIST: '/appointments',
    DETAIL: (id: number) => `/appointments/${id}`,
    CREATE: '/appointments',
    UPDATE_STATUS: (id: number) => `/appointments/${id}/status`,
    ASSIGN: (id: number) => `/appointments/${id}/assign`,
    DELETE: (id: number) => `/appointments/${id}`,
    AVAILABILITY: (serviceId: number) => `/appointments/availability/${serviceId}`,
    MY_APPOINTMENTS: '/appointments/my/appointments',
  },
  EMPLOYEES: {
    LIST: '/employees',
    DETAIL: (id: number) => `/employees/${id}`,
    AVAILABLE: '/employees/available',
  },
};

