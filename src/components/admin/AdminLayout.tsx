import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Scissors, 
  Calendar, 
  Users, 
  UserCheck, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';
import { getImageUrl } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();

  const navigation = [
    {
      name: 'Tableau de bord',
      href: '/admin',
      icon: LayoutDashboard,
      current: location.pathname === '/admin'
    },
    {
      name: 'Réservations',
      href: '/admin/bookings',
      icon: Calendar,
      current: location.pathname === '/admin/bookings',
      badge: '' // Nombre de nouvelles réservations
    },
    {
      name: 'Services',
      href: '/admin/services',
      icon: Scissors,
      current: location.pathname === '/admin/services'
    },
    {
      name: 'Employés',
      href: '/admin/employees',
      icon: Users,
      current: location.pathname === '/admin/employees'
    },
    {
      name: 'Clients',
      href: '/admin/clients',
      icon: UserCheck,
      current: location.pathname === '/admin/clients'
    },
    {
      name: 'Rapports',
      href: '/admin/reports',
      icon: BarChart3,
      current: location.pathname === '/admin/reports'
    },
    {
      name: 'Paramètres',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname === '/admin/settings'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <img 
                  src={getImageUrl('/public/icon.jpg') || ''} 
                  alt="TESSA COIFFURE Logo" 
                  className="w-6 h-6 rounded object-cover"
                />
                <h2 className="text-xl font-bold text-primary">TESSA COIFFURE</h2>
              </div>
          <Button
            variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
          >
                <X className="h-5 w-5" />
          </Button>
            </div>
            <nav className="p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="w-8 h-8 rounded-lg overflow-hidden mr-3 shadow-sm">
              <img 
                src={getImageUrl('/public/icon.jpg') || ''} 
                alt="TESSA COIFFURE Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">TESSA COIFFURE</h1>
              <p className="text-xs text-gray-500">Administration</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {admin?.first_name?.[0] || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {admin?.first_name} {admin?.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {admin?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-gray-600 hover:text-gray-900"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
              
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {admin?.first_name} {admin?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {admin?.first_name?.[0] || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
      </main>
      </div>
    </div>
  );
};

export default AdminLayout;