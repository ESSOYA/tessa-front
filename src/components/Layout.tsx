import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Scissors, Calendar, Phone, Instagram, Facebook, User, LogOut, Settings, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getImageUrl } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Rediriger l'admin vers l'interface admin
  useEffect(() => {
    if (isAuthenticated && user?.role_id === 1 && !isAdminRoute) {
      navigate('/admin');
    }
  }, [isAuthenticated, user, isAdminRoute, navigate]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg overflow-hidden group-hover:scale-110 transition-transform shadow-md">
                <img 
                  src={getImageUrl('/public/icon.jpg') || ''} 
                  alt="TESSA COIFFURE Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TESSA COIFFURE
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Accueil
              </Link>
              <Link
                to="/services"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Services
              </Link>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-light text-primary-foreground font-medium hover:shadow-luxury transition-all hover:scale-105"
              >
                <Calendar className="h-4 w-4" />
                Réserver
              </Link>
              
              {/* Auth buttons */}
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  {user?.role_id === 1 && (
                    <Link
                      to="/admin"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <User className="h-4 w-4" />
                    {user?.first_name}
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-foreground hover:text-primary transition-colors font-medium"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    S'inscrire
                  </Link>
                </div>
              )}
            </nav>

            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors font-medium"
              >
                Accueil
              </Link>
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors font-medium"
              >
                Services
              </Link>
              <Link
                to="/booking"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-primary-light text-primary-foreground font-medium hover:shadow-luxury transition-all"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Réserver
                </div>
              </Link>
              
              {/* Auth buttons mobile */}
              {isAuthenticated ? (
                <div className="pt-2 space-y-2 border-t border-border/50">
                  {user?.role_id === 1 && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Admin
                      </div>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user?.first_name}
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="pt-2 space-y-2 border-t border-border/50">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors font-medium"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      S'inscrire
                    </div>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src={getImageUrl('/public/icon.jpg') || ''} 
                  alt="TESSA COIFFURE Logo" 
                  className="w-8 h-8 rounded object-cover"
                />
                <span className="text-xl font-bold">TESSA COIFFURE</span>
              </div>
              <p className="text-muted-foreground">
                Votre salon de beauté pour des moments de bien-être et d'élégance
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  01 23 45 67 89
                </p>
                <p>123 Avenue de la Beauté</p>
                <p>75001 Paris</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Suivez-nous</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 TESSA COIFFURE. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
