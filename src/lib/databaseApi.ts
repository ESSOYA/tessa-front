import { API_CONFIG } from '@/config/api';
import { 
  User, 
  Role, 
  Service, 
  Employee, 
  Appointment, 
  Notification,
  WorkingHours,
  Setting,
  DailySchedule,
  ApiResponse,
  PaginatedResponse,
  CreateServiceData,
  UpdateServiceData,
  CreateEmployeeData,
  UpdateEmployeeData,
  CreateAppointmentData,
  UpdateAppointmentData,
  DashboardStats,
  AppointmentFilters,
  ServiceFilters,
  EmployeeFilters,
  ClientFilters
} from '@/types/database';

const API_BASE = API_CONFIG.BASE_URL;

// Fonction utilitaire pour les appels API
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('authToken');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Erreur API');
    }
    
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

// API pour les utilisateurs et rôles
export const usersApi = {
  // Récupérer tous les utilisateurs avec pagination
  getAll: (page = 1, limit = 10, filters?: ClientFilters) =>
    fetchApi<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}&${new URLSearchParams(filters as any)}`),
  
  // Récupérer un utilisateur par ID
  getById: (id: number) =>
    fetchApi<User>(`/users/${id}`),
  
  // Créer un utilisateur
  create: (userData: Partial<User>) =>
    fetchApi<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  // Mettre à jour un utilisateur
  update: (id: number, userData: Partial<User>) =>
    fetchApi<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  // Supprimer un utilisateur
  delete: (id: number) =>
    fetchApi<void>(`/users/${id}`, {
      method: 'DELETE',
    }),
  
  // Récupérer les rôles
  getRoles: () =>
    fetchApi<Role[]>('/roles'),
};

// API pour les services
export const servicesApi = {
  // Récupérer tous les services
  getAll: (filters?: ServiceFilters) =>
    fetchApi<Service[]>(`/services?${new URLSearchParams(filters as any)}`),
  
  // Récupérer un service par ID
  getById: (id: number) =>
    fetchApi<Service>(`/services/${id}`),
  
  // Créer un service
  create: (serviceData: CreateServiceData) =>
    fetchApi<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    }),
  
  // Mettre à jour un service
  update: (id: number, serviceData: UpdateServiceData) =>
    fetchApi<Service>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    }),
  
  // Supprimer un service
  delete: (id: number) =>
    fetchApi<void>(`/services/${id}`, {
      method: 'DELETE',
    }),
  
  // Statistiques des services
  getStats: () =>
    fetchApi<{ total: number; active: number; averagePrice: number; averageDuration: number }>('/services/stats'),
};

// API pour les employés
export const employeesApi = {
  // Récupérer tous les employés
  getAll: (filters?: EmployeeFilters) =>
    fetchApi<Employee[]>(`/employees?${new URLSearchParams(filters as any)}`),
  
  // Récupérer un employé par ID
  getById: (id: number) =>
    fetchApi<Employee>(`/employees/${id}`),
  
  // Créer un employé
  create: (employeeData: CreateEmployeeData) =>
    fetchApi<Employee>('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    }),
  
  // Mettre à jour un employé
  update: (id: number, employeeData: UpdateEmployeeData) =>
    fetchApi<Employee>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    }),
  
  // Supprimer un employé
  delete: (id: number) =>
    fetchApi<void>(`/employees/${id}`, {
      method: 'DELETE',
    }),
  
  // Récupérer les horaires de travail
  getWorkingHours: (employeeId: number) =>
    fetchApi<WorkingHours[]>(`/employees/${employeeId}/working-hours`),
  
  // Mettre à jour les horaires de travail
  updateWorkingHours: (employeeId: number, workingHours: WorkingHours[]) =>
    fetchApi<void>(`/employees/${employeeId}/working-hours`, {
      method: 'PUT',
      body: JSON.stringify(workingHours),
    }),
  
  // Statistiques des employés
  getStats: () =>
    fetchApi<{ total: number; active: number; available: number }>('/employees/stats'),
};

// API pour les rendez-vous
export const appointmentsApi = {
  // Récupérer tous les rendez-vous
  getAll: (filters?: AppointmentFilters) =>
    fetchApi<Appointment[]>(`/appointments?${new URLSearchParams(filters as any)}`),
  
  // Récupérer un rendez-vous par ID
  getById: (id: number) =>
    fetchApi<Appointment>(`/appointments/${id}`),
  
  // Créer un rendez-vous
  create: (appointmentData: CreateAppointmentData) =>
    fetchApi<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),
  
  // Mettre à jour un rendez-vous
  update: (id: number, appointmentData: UpdateAppointmentData) =>
    fetchApi<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    }),
  
  // Supprimer un rendez-vous
  delete: (id: number) =>
    fetchApi<void>(`/appointments/${id}`, {
      method: 'DELETE',
    }),
  
  // Changer le statut d'un rendez-vous
  updateStatus: (id: number, status: string) =>
    fetchApi<Appointment>(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  // Assigner un employé à un rendez-vous
  assignEmployee: (id: number, employeeId: number) =>
    fetchApi<Appointment>(`/appointments/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ employee_id: employeeId }),
    }),
  
  // Annuler un rendez-vous
  cancel: (id: number, reason?: string) =>
    fetchApi<Appointment>(`/appointments/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),
  
  // Récupérer l'historique d'un rendez-vous
  getHistory: (id: number) =>
    fetchApi<any[]>(`/appointments/${id}/history`),
  
  // Statistiques des rendez-vous
  getStats: () =>
    fetchApi<{ total: number; pending: number; confirmed: number; completed: number; cancelled: number; no_show: number }>('/appointments/stats'),
  
  // Planning quotidien
  getDailySchedule: (date: string) =>
    fetchApi<DailySchedule[]>(`/appointments/daily-schedule?date=${date}`),
};

// API pour les notifications
export const notificationsApi = {
  // Récupérer toutes les notifications
  getAll: (page = 1, limit = 10) =>
    fetchApi<PaginatedResponse<Notification>>(`/notifications?page=${page}&limit=${limit}`),
  
  // Marquer une notification comme lue
  markAsRead: (id: number) =>
    fetchApi<void>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),
  
  // Envoyer une notification
  send: (notificationData: Partial<Notification>) =>
    fetchApi<Notification>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    }),
};

// API pour les paramètres
export const settingsApi = {
  // Récupérer tous les paramètres
  getAll: () =>
    fetchApi<Setting[]>('/settings'),
  
  // Récupérer un paramètre
  get: (key: string) =>
    fetchApi<Setting>(`/settings/${key}`),
  
  // Mettre à jour un paramètre
  update: (key: string, value: string) =>
    fetchApi<Setting>(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ setting_value: value }),
    }),
};

// API pour le dashboard
export const dashboardApi = {
  // Statistiques générales
  getStats: () =>
    fetchApi<DashboardStats>('/dashboard/stats'),
  
  // Rendez-vous récents
  getRecentAppointments: (limit = 5) =>
    fetchApi<Appointment[]>(`/dashboard/recent-appointments?limit=${limit}`),
  
  // Rendez-vous du jour
  getTodayAppointments: () =>
    fetchApi<Appointment[]>('/dashboard/today-appointments'),
  
  // Revenus par période
  getRevenueByPeriod: (period: 'day' | 'week' | 'month' | 'year') =>
    fetchApi<{ period: string; revenue: number }[]>(`/dashboard/revenue?period=${period}`),
};

// API pour les rapports
export const reportsApi = {
  // Rapport des rendez-vous
  getAppointmentsReport: (dateFrom: string, dateTo: string) =>
    fetchApi<any>(`/reports/appointments?from=${dateFrom}&to=${dateTo}`),
  
  // Rapport des services
  getServicesReport: (dateFrom: string, dateTo: string) =>
    fetchApi<any>(`/reports/services?from=${dateFrom}&to=${dateTo}`),
  
  // Rapport des employés
  getEmployeesReport: (dateFrom: string, dateTo: string) =>
    fetchApi<any>(`/reports/employees?from=${dateFrom}&to=${dateTo}`),
  
  // Rapport des clients
  getClientsReport: (dateFrom: string, dateTo: string) =>
    fetchApi<any>(`/reports/clients?from=${dateFrom}&to=${dateTo}`),
};

