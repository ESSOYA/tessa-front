import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { adminClientsApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

const ClientHistory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [history, setHistory] = useState<Array<{
    id: number;
    service_name: string;
    start_datetime: string;
    end_datetime: string;
    status: string;
    notes: string | null;
    price: number;
    employee_name: string | null;
    created_at: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null>(null);

  useEffect(() => {
    if (id) {
      loadHistory();
    }
  }, [id]);

  const loadHistory = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await adminClientsApi.getHistory(id);
      if (response.success && response.data) {
        setHistory(response.data.history);
        setClientInfo(response.data.client);
      } else {
        toast.error('Erreur lors du chargement de l\'historique', {
          description: response.error || 'Une erreur est survenue'
        });
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
      'pending': { label: 'En attente', variant: 'secondary' },
      'confirmed': { label: 'Confirmé', variant: 'default' },
      'completed': { label: 'Terminé', variant: 'outline' },
      'cancelled': { label: 'Annulé', variant: 'destructive' },
      'no_show': { label: 'Absent', variant: 'destructive' }
    };
    
    const config = statusConfig[status] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/clients')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux clients
        </Button>
        <h1 className="text-3xl font-bold mb-2">Historique des Réservations</h1>
        {clientInfo && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-4">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{clientInfo.first_name} {clientInfo.last_name}</p>
                <p className="text-sm text-muted-foreground">{clientInfo.email}</p>
                {clientInfo.phone && (
                  <p className="text-sm text-muted-foreground">{clientInfo.phone}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de l'historique...</p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {history.length} réservation{history.length > 1 ? 's' : ''} au total
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune réservation pour ce client</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((appointment) => {
                  const startDate = new Date(appointment.start_datetime);
                  const endDate = new Date(appointment.end_datetime);
                  
                  return (
                    <div key={appointment.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{appointment.service_name || 'Service'}</h3>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{formatDate(appointment.start_datetime)}</span>
                            </div>
                            {appointment.employee_name && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>Coiffeur: {appointment.employee_name}</span>
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Prix:</span> {formatPrice(appointment.price)}
                            </div>
                            {appointment.notes && (
                              <div className="mt-2 italic">
                                <span className="font-medium">Note:</span> "{appointment.notes}"
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                        <span>ID: {appointment.id}</span>
                        <span>Créé le {new Date(appointment.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientHistory;

