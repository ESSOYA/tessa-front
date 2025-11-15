import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Scissors, Users, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminStatsApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalServices: 0,
    totalEmployees: 0,
    totalClients: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    todayBookings: 0,
    revenue: 0
  });
  const [recentBookings, setRecentBookings] = useState<Array<{
    id: number;
    client_name: string;
    service_name: string;
    employee_name: string;
    start_datetime: string;
    status: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await adminStatsApi.getDashboard();
        if (response.success && response.data) {
          setStats({
            totalBookings: response.data.totalBookings,
            totalServices: response.data.totalServices,
            totalEmployees: response.data.totalEmployees,
            totalClients: response.data.totalClients,
            pendingBookings: response.data.pendingBookings,
            confirmedBookings: response.data.confirmedBookings,
            todayBookings: response.data.todayBookings,
            revenue: response.data.revenue
          });
          setRecentBookings(response.data.recentBookings || []);
        } else {
          toast.error('Erreur lors du chargement des statistiques', {
            description: response.error || 'Une erreur est survenue'
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        toast.error('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord TESSA COIFFURE</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité salon</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-border/50 hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Réservations
            </CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingBookings} en attente
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Services Actifs
            </CardTitle>
            <Scissors className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalServices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Services disponibles
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Employés
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Équipe active
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clients
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Base clients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Rendez-vous confirmés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</div>
            <p className="text-sm text-muted-foreground">Rendez-vous validés</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              En attente de confirmation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingBookings}</div>
            <p className="text-sm text-muted-foreground">Nécessitent votre attention</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.todayBookings}</div>
            <p className="text-sm text-muted-foreground">Rendez-vous du jour</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Chiffre d'affaires estimé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatPrice(stats.revenue)}</div>
            <p className="text-sm text-muted-foreground">Revenus des rendez-vous confirmés</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Taux de conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalBookings > 0 
                ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100)
                : 0}%
            </div>
            <p className="text-sm text-muted-foreground">Rendez-vous confirmés</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/admin/bookings">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Gérer les réservations
              </Button>
            </Link>
            <Link to="/admin/services">
              <Button className="w-full justify-start" variant="outline">
                <Scissors className="mr-2 h-4 w-4" />
                Gérer les services
              </Button>
            </Link>
            <Link to="/admin/employees">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Gérer les employés
              </Button>
            </Link>
            <Link to="/admin/clients">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Gérer les clients
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Réservations récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Aucune réservation récente
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => {
                  const startDate = new Date(booking.start_datetime);
                  const dateStr = startDate.toLocaleDateString('fr-FR', { 
                    day: '2-digit', 
                    month: 'short' 
                  });
                  const timeStr = startDate.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  });
                  const isToday = startDate.toDateString() === new Date().toDateString();
                  
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <div className="font-medium">{booking.client_name || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{booking.service_name || 'N/A'}</div>
                        {booking.employee_name && (
                          <div className="text-xs text-muted-foreground mt-1">Par {booking.employee_name}</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {isToday ? 'Aujourd\'hui' : dateStr} {timeStr}
                        </div>
                        <Badge 
                          variant={
                            booking.status === 'confirmed' ? 'default' : 
                            booking.status === 'pending' ? 'secondary' : 
                            booking.status === 'completed' ? 'outline' : 
                            'destructive'
                          }
                        >
                          {booking.status === 'confirmed' ? 'Confirmé' :
                           booking.status === 'pending' ? 'En attente' :
                           booking.status === 'completed' ? 'Terminé' :
                           booking.status === 'cancelled' ? 'Annulé' :
                           booking.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;