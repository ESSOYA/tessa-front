export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  image?: string; // Image principale
  images?: string[]; // Toutes les images du service
  created_at: string;
}

export interface Booking {
  id: number;
  service_id: number;
  service_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  start_datetime: string;
  end_datetime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  notes?: string;
  created_at: string;
  employee_name?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
