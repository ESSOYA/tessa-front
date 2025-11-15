import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AdminRedirect = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user?.role_id === 1) {
        // L'utilisateur est admin, rediriger vers l'interface admin
        navigate('/admin', { replace: true });
      } else if (isAuthenticated) {
        // L'utilisateur est connecté mais pas admin, rediriger vers le profil
        navigate('/profile', { replace: true });
      } else {
        // L'utilisateur n'est pas connecté, rediriger vers la page d'accueil
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Afficher un loader pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirection en cours...</p>
      </div>
    </div>
  );
};

export default AdminRedirect;
