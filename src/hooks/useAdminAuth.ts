import { useState, useEffect, createContext, useContext } from 'react';
import { adminAuthApi, setAdminToken, getAdminToken } from '@/lib/api';
import { toast } from 'sonner';

interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const useAdminAuthProvider = () => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(getAdminToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'admin est déjà connecté
    const storedToken = getAdminToken();
    if (storedToken) {
      setToken(storedToken);
      // Vérifier la validité du token
      verifyToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await adminAuthApi.getMe();
      if (response.success && response.data && response.data.user) {
        const user = response.data.user;
        // Vérifier que l'utilisateur est bien un admin (role = 'admin')
        if (user.role !== 'admin') {
          // L'utilisateur n'est pas admin
          localStorage.removeItem('admin_token');
          setAdminToken(null);
          setToken(null);
          setAdmin(null);
          setLoading(false);
          return;
        }
        setAdmin({
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name || '',
          role: user.role
        });
        setToken(tokenToVerify);
      } else {
        // Token invalide
        localStorage.removeItem('admin_token');
        setAdminToken(null);
        setToken(null);
        setAdmin(null);
      }
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      localStorage.removeItem('admin_token');
      setAdminToken(null);
      setToken(null);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await adminAuthApi.login(email, password);
      
      if (response.success && response.data) {
        const { token: newToken, user } = response.data;
        
        // La route backend vérifie déjà que c'est un admin (role_id = 2)
        // On vérifie quand même côté frontend pour sécurité
        if (user.role !== 'admin') {
          toast.error('Accès refusé', {
            description: 'Seuls les administrateurs peuvent accéder à cette page'
          });
          return false;
        }
        
        // Stocker le token et les données admin
        setAdminToken(newToken);
        setToken(newToken);
        setAdmin({
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name || '',
          role: user.role
        });
        
        toast.success('Connexion réussie');
        return true;
      } else {
        toast.error('Erreur de connexion', {
          description: response.error || 'Email ou mot de passe incorrect'
        });
        return false;
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error('Erreur de connexion', {
        description: 'Une erreur est survenue lors de la connexion'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdminToken(null);
    setToken(null);
    setAdmin(null);
    // Appeler l'API de déconnexion
    adminAuthApi.logout().catch(console.error);
    toast.success('Déconnexion réussie');
  };

  const isAuthenticated = !!token && !!admin;

  return {
    admin,
    token,
    isAuthenticated,
    login,
    logout,
    loading
  };
};

export { AdminAuthContext };


