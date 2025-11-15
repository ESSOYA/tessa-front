import { useState, useEffect, useMemo } from 'react';
import { Calendar, CheckCircle, AlertCircle, XCircle, Clock, Trash2, Search, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { adminAppointmentsApi } from '@/lib/api';
import { Booking } from '@/types';
import { toast } from 'sonner';

const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page: 1,
        limit: 100
      };
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      const response = await adminAppointmentsApi.getAll(filters);
      console.log('Réponse complète appointments:', response);
      console.log('Type de response.data:', typeof response.data);
      console.log('response.data est un array?', Array.isArray(response.data));
      
      if (response.success) {
        let appointments = [];
        
        if (response.data) {
          // Le backend retourne { appointments: [...] }
          // fetchApiAdmin enveloppe dans { success: true, data: { appointments: [...] } }
          if (Array.isArray(response.data)) {
            // Si response.data est directement un tableau
            appointments = response.data;
          } else if (typeof response.data === 'object') {
            // Si response.data est un objet, chercher appointments
            if ((response.data as any).appointments) {
              appointments = (response.data as any).appointments;
            } else if ((response.data as any).data && Array.isArray((response.data as any).data)) {
              appointments = (response.data as any).data;
            }
          }
        }
        
        console.log('Rendez-vous récupérés (nombre):', appointments.length);
        console.log('Premier rendez-vous:', appointments[0]);
        
        if (appointments.length > 0) {
          setBookings(appointments);
          toast.success(`${appointments.length} rendez-vous chargés`);
        } else {
          setBookings([]);
          console.warn('Aucun rendez-vous trouvé dans la réponse');
        }
      } else {
        console.error('Erreur réponse:', response);
        toast.error('Erreur lors du chargement des rendez-vous', {
          description: response.error || 'Une erreur est survenue'
        });
        setBookings([]);
      }
    } catch (error) {
      console.error('Erreur chargement rendez-vous:', error);
      toast.error('Erreur lors du chargement des rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: Booking['status']) => {
    try {
      const response = await adminAppointmentsApi.updateStatus(id, newStatus);
      if (response.success) {
        toast.success('Statut mis à jour avec succès');
        loadBookings();
      } else {
        toast.error('Erreur lors de la mise à jour', {
          description: response.error
        });
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      return;
    }
    try {
      const response = await adminAppointmentsApi.delete(id);
      if (response.success) {
        toast.success('Rendez-vous supprimé avec succès');
        loadBookings();
      } else {
        toast.error('Erreur lors de la suppression', {
          description: response.error
        });
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };


  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { label: 'En attente', variant: 'secondary' as const, icon: AlertCircle },
      'confirmed': { label: 'Confirmé', variant: 'default' as const, icon: CheckCircle },
      'completed': { label: 'Terminé', variant: 'outline' as const, icon: CheckCircle },
      'cancelled': { label: 'Annulé', variant: 'destructive' as const, icon: XCircle },
      'no_show': { label: 'Absent', variant: 'destructive' as const, icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      variant: 'secondary' as const, 
      icon: Clock 
    };
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      if (!booking) return false;
      
      // Filtre par statut
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      // Filtre par recherche
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        (booking.client_name || '').toLowerCase().includes(searchLower) ||
        (booking.service_name || '').toLowerCase().includes(searchLower) ||
        (booking.employee_name || '').toLowerCase().includes(searchLower);
      
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchTerm]);

  // Logs pour déboguer
  useEffect(() => {
    console.log('=== DEBUG RESERVATIONS ===');
    console.log('Total bookings dans state:', bookings.length);
    console.log('Filtered bookings:', filteredBookings.length);
    console.log('Status filter:', statusFilter);
    console.log('Search term:', searchTerm);
    if (bookings.length > 0) {
      console.log('Première réservation:', bookings[0]);
    }
    if (filteredBookings.length > 0) {
      console.log('Première réservation filtrée:', filteredBookings[0]);
    }
  }, [bookings, filteredBookings, statusFilter, searchTerm]);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestion des Réservations</h1>
        <p className="text-muted-foreground">Gérez tous les rendez-vous de votre salon</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Réservations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {bookings.filter(b => b.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {bookings.filter(b => b.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par client, service ou employé..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md"
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmé</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
          <option value="no_show">Absent</option>
        </select>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Réservations ({filteredBookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des rendez-vous...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      Aucune réservation trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => {
                    const startDate = new Date(booking.start_datetime);
                    const dateStr = startDate.toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: '2-digit', 
                      day: '2-digit' 
                    });
                    const timeStr = startDate.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    });
                    
                    return (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.client_name || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {booking.id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.service_name || 'N/A'}</div>
                            {booking.employee_name && (
                              <div className="text-sm text-muted-foreground">
                                {booking.employee_name}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{dateStr}</div>
                            <div className="text-sm text-muted-foreground">
                              {timeStr}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(booking.status)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {booking.client_phone && (
                              <div className="text-sm">{booking.client_phone}</div>
                            )}
                            {booking.client_email && (
                              <div className="text-sm text-muted-foreground">{booking.client_email}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {booking.status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleStatusUpdate(booking.id.toString(), 'confirmed')}
                                title="Confirmer"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleStatusUpdate(booking.id.toString(), 'cancelled')}
                                title="Annuler"
                              >
                                <XCircle className="h-4 w-4 text-orange-600" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(booking.id.toString())}
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;