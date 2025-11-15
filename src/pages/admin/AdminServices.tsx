import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Scissors, DollarSign, Clock, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { formatPrice } from '@/lib/utils';
import { servicesApi } from '@/lib/api';
import { toast } from 'sonner';
import ServiceImagesManager from '@/components/admin/ServiceImagesManager';

const AdminServices = () => {
  const [services, setServices] = useState<Array<{
    id: number;
    name: string;
    description: string | null;
    duration_minutes: number;
    price: number;
    is_active: boolean;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<{ id: number; name: string } | null>(null);
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await servicesApi.getAll();
      if (response.success && response.data) {
        setServices(response.data.services);
      } else {
        toast.error('Erreur lors du chargement des services', {
          description: response.error || 'Une erreur est survenue'
        });
      }
    } catch (error) {
      console.error('Erreur chargement services:', error);
      toast.error('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };

  const totalActiveServices = services.filter(s => s.is_active).length;
  const averageDuration = services.length > 0 
    ? Math.round(services.reduce((sum, s) => sum + s.duration_minutes, 0) / services.length)
    : 0;
  const averagePrice = services.length > 0 
    ? services.reduce((sum, s) => sum + s.price, 0) / services.length
    : 0;

  const handleManageImages = (service: { id: number; name: string }) => {
    setSelectedService(service);
    setImagesDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Services</h1>
          <p className="text-muted-foreground">Gérez les prestations proposées par votre salon</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un service
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border/50 hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Services
            </CardTitle>
            <Scissors className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalActiveServices} actifs
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Durée Moyenne
            </CardTitle>
            <Clock className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageDuration} min</div>
            <p className="text-xs text-muted-foreground mt-1">
              Durée moyenne d'un service
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-card transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prix Moyen
            </CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatPrice(averagePrice)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Prix moyen d'un service
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Liste des Services</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                    Aucun service trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {service.description || 'N/A'}
                    </TableCell>
                    <TableCell>{service.duration_minutes} min</TableCell>
                    <TableCell>{formatPrice(service.price)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={service.is_active}
                          onCheckedChange={async (checked) => {
                            try {
                              const response = await servicesApi.update(service.id.toString(), {
                                is_active: checked
                              });
                              if (response.success) {
                                toast.success(`Service ${checked ? 'activé' : 'désactivé'} avec succès`);
                                loadServices();
                              } else {
                                toast.error('Erreur lors de la mise à jour', {
                                  description: response.error
                                });
                                loadServices(); // Recharger pour annuler le changement visuel
                              }
                            } catch (error) {
                              console.error('Erreur mise à jour service:', error);
                              toast.error('Erreur lors de la mise à jour');
                              loadServices(); // Recharger pour annuler le changement visuel
                            }
                          }}
                        />
                        <Badge variant={service.is_active ? 'default' : 'secondary'}>
                          {service.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleManageImages(service)}
                          title="Gérer les images"
                        >
                          <Image className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de gestion des images */}
      {selectedService && (
        <ServiceImagesManager
          serviceId={selectedService.id}
          serviceName={selectedService.name}
          open={imagesDialogOpen}
          onOpenChange={setImagesDialogOpen}
        />
      )}
    </div>
  );
};

export default AdminServices;