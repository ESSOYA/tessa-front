// Types basés sur la base de données MySQL salon_coiffure

export interface User {
  id: number;
  role_id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: number;
  user_id: number;
  hire_date: string | null;
  note: string | null;
  is_available: boolean;
  created_at: string;
  // Relations
  user?: User;
}

export interface Appointment {
  id: number;
  client_user_id: number;
  employee_id: number | null;
  service_id: number;
  start_datetime: string;
  end_datetime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  client?: User;
  employee?: Employee;
  service?: Service;
}

export interface AppointmentHistory {
  id: number;
  appointment_id: number;
  action: string;
  old_value: string | null;
  new_value: string | null;
  changed_by: number | null;
  changed_at: string;
}

export interface Notification {
  id: number;
  appointment_id: number | null;
  user_id: number | null;
  channel: 'email' | 'sms';
  subject: string | null;
  body: string | null;
  scheduled_at: string | null;
  sent_at: string | null;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  created_at: string;
}

export interface WorkingHours {
  id: number;
  employee_id: number;
  jour_semaine: number; // 1=Lundi, 2=Mardi, ..., 7=Dimanche
  start_time: string;
  end_time: string;
}

export interface Setting {
  setting_key: string;
  setting_value: string | null;
  description: string | null;
}

export interface DailySchedule {
  appointment_id: number;
  start_datetime: string;
  end_datetime: string;
  status: string;
  service_name: string;
  duration_minutes: number;
  price: number;
  client_name: string;
  emp_user_id: number | null;
  employee_name: string | null;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Types pour les formulaires
export interface CreateServiceData {
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  is_active?: boolean;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  id: number;
}

export interface CreateEmployeeData {
  user_id: number;
  hire_date?: string;
  note?: string;
  is_available?: boolean;
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {
  id: number;
}

export interface CreateAppointmentData {
  client_user_id: number;
  service_id: number;
  start_datetime: string;
  employee_id?: number;
  notes?: string;
}

export interface UpdateAppointmentData {
  id: number;
  status?: string;
  employee_id?: number;
  notes?: string;
}

// Types pour les statistiques
export interface DashboardStats {
  totalAppointments: number;
  totalServices: number;
  totalEmployees: number;
  totalClients: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  todayAppointments: number;
  estimatedRevenue: number;
}

export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  no_show: number;
}

export interface ServiceStats {
  total: number;
  active: number;
  averagePrice: number;
  averageDuration: number;
}

export interface EmployeeStats {
  total: number;
  active: number;
  available: number;
  specializations: number;
}

export interface ClientStats {
  total: number;
  active: number;
  newThisMonth: number;
  totalRevenue: number;
}

// Types pour les filtres
export interface AppointmentFilters {
  status?: string;
  employee_id?: number;
  service_id?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface ServiceFilters {
  is_active?: boolean;
  search?: string;
}

export interface EmployeeFilters {
  is_available?: boolean;
  is_active?: boolean;
  search?: string;
}

export interface ClientFilters {
  is_active?: boolean;
  search?: string;
  date_from?: string;
  date_to?: string;
}

