import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Users, Calendar, DollarSign, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { adminClientsApi } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AdminClients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Array<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    total_appointments: number;
    total_spent: number;
    last_appointment_date: string | null;
    created_at: string;
    is_active: boolean;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, [searchTerm]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await adminClientsApi.getAll({
        page: 1,
        limit: 100,
        search: searchTerm || undefined
      });
      if (response.success && response.data) {
        setClients(response.data.clients);
      } else {
        toast.error('Erreur lors du chargement des clients', {
          description: response.error || 'Une erreur est survenue'
        });
      }
    } catch (error) {
      console.error('Erreur chargement clients:', error);
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.is_active).length;
  const newClients = clients.filter(c => {
    const createdDate = new Date(c.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate >= thirtyDaysAgo;
  }).length;
  const returningClients = clients.filter(c => c.total_appointments > 1).length;

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Clients</h1>
          <p className="text-muted-foreground">Gérez votre base de données clients</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un client
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border/50 hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clients
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeClients} actifs
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nouveaux Clients (30j)
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{newClients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Clients inscrits récemment
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clients Fidèles
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{returningClients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Clients avec plusieurs RDV
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-input bg-background rounded-md"
        />
      </div>

      {/* Clients Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Liste des Clients ({totalClients})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des clients...</p>
            </div>
          ) : (
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Dépensé</TableHead>
                <TableHead>Total RDV</TableHead>
                <TableHead>Dernier RDV</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                    Aucun client trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {client.first_name} {client.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {client.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{client.email}</div>
                        <div className="text-sm text-muted-foreground">{client.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatPrice(client.total_spent)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{client.total_appointments}</div>
                    </TableCell>
                    <TableCell>
                      {client.last_appointment_date
                        ? new Date(client.last_appointment_date).toLocaleDateString('fr-FR')
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.is_active ? 'default' : 'destructive'}>
                        {client.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/admin/clients/${client.id}`)}
                          title="Voir l'historique"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminClients;