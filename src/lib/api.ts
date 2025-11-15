import { Service, Booking, ApiResponse } from '@/types';

// Configuration de l'API - URL du backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Token d'authentification client
let authToken: string | null = localStorage.getItem('authToken');

// Token d'authentification admin
let adminToken: string | null = localStorage.getItem('admin_token');

// Fonction pour mettre à jour le token client
export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Fonction pour obtenir le token client
export const getAuthToken = () => authToken;

// Fonction pour mettre à jour le token admin
export const setAdminToken = (token: string | null) => {
  adminToken = token;
  if (token) {
    localStorage.setItem('admin_token', token);
  } else {
    localStorage.removeItem('admin_token');
  }
};

// Fonction pour obtenir le token admin
export const getAdminToken = () => {
  if (!adminToken) {
    adminToken = localStorage.getItem('admin_token');
  }
  return adminToken;
};

// Helper function pour les requêtes client
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    // Ajouter le token d'authentification client si disponible
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue');
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

// Helper function pour les requêtes admin
async function fetchApiAdmin<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const token = getAdminToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    // Ajouter le token d'authentification admin si disponible
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Une erreur est survenue');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Admin API Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

// Services API
export const servicesApi = {
  getAll: () => fetchApi<{services: Service[]}>('/services'),
  getById: (id: string) => fetchApi<Service>(`/services/${id}`),
  create: (service: Omit<Service, 'id'>) =>
    fetchApi<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(service),
    }),
  update: (id: string, service: Partial<Service>) =>
    fetchApi<Service>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    }),
  delete: (id: string) =>
    fetchApi<{message: string}>(`/services/${id}`, {
      method: 'DELETE',
    }),
};

// Appointments API (correspond au backend)
export const appointmentsApi = {
  getAll: () => fetchApi<{appointments: Booking[]}>('/appointments'),
  getById: (id: string) => fetchApi<Booking>(`/appointments/${id}`),
  create: (appointment: {
    client_user_id: number;
    service_id: number;
    start_datetime: string;
    employee_id?: number;
    notes?: string;
  }) =>
    fetchApi<Booking>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    }),
  updateStatus: (id: string, status: Booking['status'], reason?: string) =>
    fetchApi<Booking>(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    }),
  assignEmployee: (id: string) =>
    fetchApi<Booking>(`/appointments/${id}/assign`, {
      method: 'POST',
    }),
  delete: (id: string) =>
    fetchApi<{message: string}>(`/appointments/${id}`, {
      method: 'DELETE',
    }),
  getAvailability: (serviceId: string, date: string, employeeId?: string) =>
    fetchApi<{available_slots: Array<{start: string, end: string}>}>(`/appointments/availability/${serviceId}?date=${date}${employeeId ? `&employee_id=${employeeId}` : ''}`),
  getMyAppointments: () => fetchApi<{appointments: Booking[]}>('/appointments/my/appointments'),
};

// Auth API (pour les clients)
export const authApi = {
  login: (email: string, password: string) =>
    fetchApi<{ token: string; user: { id: number; email: string; first_name: string; last_name: string; role: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
    phone?: string;
  }) =>
    fetchApi<{ token: string; user: { id: number; email: string; first_name: string; last_name: string; role: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  getMe: () =>
    fetchApi<{ user: { id: number; email: string; first_name: string; last_name: string; role: string } }>('/auth/me'),
  updateProfile: (userData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  }) =>
    fetchApi<{ user: { id: number; email: string; first_name: string; last_name: string; role: string } }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    fetchApi<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    }),
  logout: () =>
    fetchApi<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),
};

// Auth API Admin (pour les administrateurs)
export const adminAuthApi = {
  login: (email: string, password: string) =>
    fetchApi<{ token: string; user: { id: number; email: string; first_name: string; last_name: string; role: string } }>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMe: () =>
    fetchApiAdmin<{ user: { id: number; email: string; first_name: string; last_name: string; role: string } }>('/auth/admin/me'),
  logout: () =>
    fetchApiAdmin<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),
};

// Appointments API Admin (pour les administrateurs)
export const adminAppointmentsApi = {
  getAll: (filters?: {
    page?: number;
    limit?: number;
    status?: string;
    employee_id?: number;
    client_id?: number;
    date_from?: string;
    date_to?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString();
    return fetchApiAdmin<{appointments: Booking[]}>(`/appointments${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: string) =>
    fetchApiAdmin<Booking>(`/appointments/${id}`),
  updateStatus: (id: string, status: Booking['status'], reason?: string) =>
    fetchApiAdmin<Booking>(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    }),
  assignEmployee: (id: string) =>
    fetchApiAdmin<Booking>(`/appointments/${id}/assign`, {
      method: 'POST',
    }),
  delete: (id: string) =>
    fetchApiAdmin<{message: string}>(`/appointments/${id}`, {
      method: 'DELETE',
    }),
  getHistory: (id: string) =>
    fetchApiAdmin<{history: any[]}>(`/appointments/${id}/history`),
};

// Stats API Admin
export const adminStatsApi = {
  getDashboard: () =>
    fetchApiAdmin<{
      totalBookings: number;
      totalServices: number;
      totalEmployees: number;
      totalClients: number;
      pendingBookings: number;
      confirmedBookings: number;
      todayBookings: number;
      revenue: number;
      recentBookings: Array<{
        id: number;
        client_name: string;
        service_name: string;
        employee_name: string;
        start_datetime: string;
        status: string;
      }>;
    }>('/stats/dashboard'),
};

// Reports API Admin
export const adminReportsApi = {
  getReport: (period?: string) => {
    const params = new URLSearchParams();
    if (period) {
      params.append('period', period);
    }
    const queryString = params.toString();
    return fetchApiAdmin<{
      totalRevenue: number;
      totalAppointments: number;
      averageAppointmentValue: number;
      topServices: Array<{
        name: string;
        appointments: number;
        revenue: number;
      }>;
      statusDistribution: Array<{
        status: string;
        count: number;
        percentage: number;
      }>;
      monthlyData: Array<{
        month: string;
        appointments: number;
        revenue: number;
      }>;
      clientStats: {
        totalClients: number;
        newClients: number;
        returningClients: number;
      };
    }>(`/reports${queryString ? `?${queryString}` : ''}`);
  },
};

// Site Settings API (public pour certaines routes)
export const siteSettingsApi = {
  get: (key: string) =>
    fetchApi<{ value: string | null }>(`/site-settings/${key}`),
};

// Service Images API Admin
export const adminServiceImagesApi = {
  getAll: (serviceId: string) =>
    fetchApiAdmin<{
      images: Array<{
        id: number;
        service_id: number;
        image_url: string;
        image_order: number;
        is_primary: number;
        created_at: string;
      }>;
    }>(`/service-images/${serviceId}`),
  add: (serviceId: string, imageUrl: string, isPrimary?: boolean) =>
    fetchApiAdmin<{
      success: boolean;
      image: {
        id: number;
        service_id: number;
        image_url: string;
        image_order: number;
        is_primary: number;
      };
    }>(`/service-images/${serviceId}`, {
      method: 'POST',
      body: JSON.stringify({ image_url: imageUrl, is_primary: isPrimary || false }),
    }),
  update: (imageId: string, data: { image_url?: string; is_primary?: boolean; image_order?: number }) =>
    fetchApiAdmin<{
      success: boolean;
      image: any;
    }>(`/service-images/${imageId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (imageId: string) =>
    fetchApiAdmin<{ success: boolean; message: string }>(`/service-images/${imageId}`, {
      method: 'DELETE',
    }),
};

// Site Settings API Admin
export const adminSiteSettingsApi = {
  getAll: () =>
    fetchApiAdmin<{
      settings: Record<string, string>;
    }>('/site-settings'),
  get: (key: string) =>
    fetchApi<{ value: string }>(`/site-settings/${key}`),
  update: (key: string, value: string) =>
    fetchApiAdmin<{ success: boolean; message: string }>(`/site-settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    }),
};

// Employees API Admin
export const adminEmployeesApi = {
  getAll: (filters?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString();
    return fetchApiAdmin<{
      employees: Array<{
        id: number;
        user_id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        hire_date: string;
        note: string;
        is_available: number;
        created_at: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/employees${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: string) =>
    fetchApiAdmin<any>(`/employees/${id}`),
  create: (data: { user_id: number; hire_date: string; note?: string }) =>
    fetchApiAdmin<{ id: number; message: string }>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: { hire_date?: string; note?: string; is_available?: boolean }) =>
    fetchApiAdmin<{ message: string }>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApiAdmin<{ message: string }>(`/employees/${id}`, {
      method: 'DELETE',
    }),
};

// Clients API Admin
export const adminClientsApi = {
  getAll: (filters?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const queryString = params.toString();
    return fetchApiAdmin<{
      clients: Array<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        total_appointments: number;
        total_spent: number;
        last_appointment_date: string | null;
        created_at: string;
        is_active: boolean;
      }>;
      total: number;
      page: number;
      limit: number;
    }>(`/clients${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: string) =>
    fetchApiAdmin<{
      client: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        created_at: string;
      };
    }>(`/clients/${id}`),
  getHistory: (id: string) =>
    fetchApiAdmin<{
      client: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
      };
      history: Array<{
        id: number;
        service_name: string;
        start_datetime: string;
        end_datetime: string;
        status: string;
        notes: string | null;
        price: number;
        employee_name: string | null;
        created_at: string;
      }>;
    }>(`/clients/${id}/history`),
};
