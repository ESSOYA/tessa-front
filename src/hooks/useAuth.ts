import { useState, useEffect, createContext, useContext } from 'react';
import { User, AuthResponse } from '@/types';
import { authApi, setAuthToken, getAuthToken } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
    phone?: string;
  }) => Promise<boolean>;
  updateProfile: (userData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  }) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await authApi.getMe();
          if (response.success && response.data) {
            setUser(response.data.user);
          } else {
            // Token invalide
            setToken(null);
            setAuthToken(null);
          }
        } catch (error) {
          console.error('Erreur vérification auth:', error);
          setToken(null);
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(email, password);
      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
        setAuthToken(response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur login:', error);
      return false;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name?: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      const response = await authApi.register(userData);
      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
        setAuthToken(response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur register:', error);
      return false;
    }
  };

  const updateProfile = async (userData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      const response = await authApi.updateProfile(userData);
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur updateProfile:', error);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await authApi.changePassword(currentPassword, newPassword);
      return response.success;
    } catch (error) {
      console.error('Erreur changePassword:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    // Optionnel: appeler l'API de déconnexion
    authApi.logout().catch(console.error);
  };

  return {
    user,
    token,
    login,
    register,
    updateProfile,
    changePassword,
    logout,
    loading,
    isAuthenticated,
  };
};

export { AuthContext };
