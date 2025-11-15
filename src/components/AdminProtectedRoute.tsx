import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { admin, isAuthenticated, loading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers la page de connexion si non authentifié
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Affichage de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Vérification des permissions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si non authentifié, ne rien afficher (la redirection est gérée par useEffect)
  if (!isAuthenticated || !admin) {
    return null;
  }

  // L'admin est authentifié
  return <>{children}</>;
};

export default AdminProtectedRoute;