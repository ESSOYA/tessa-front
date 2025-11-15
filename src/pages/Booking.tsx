import { useState, useEffect } from 'react';
import { servicesApi } from '@/lib/api';
import { Service } from '@/types';
import { Card } from '@/components/ui/card';
import BookingForm from '@/components/BookingForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock } from 'lucide-react';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { toast } from 'sonner';

const Booking = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedService = services.find((s) => s.id === selectedServiceId);

  useEffect(() => {
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
    loadServices();
  }, []);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Réserver un rendez-vous</h1>
          <p className="text-xl text-muted-foreground">
            Choisissez votre service et sélectionnez un créneau
          </p>
        </div>

        <Card className="p-8 shadow-card">
          <div className="mb-8">
            <label className="text-sm font-medium mb-2 block">
              Sélectionnez un service
            </label>
            <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un service" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : services.length === 0 ? (
                  <SelectItem value="empty" disabled>Aucun service disponible</SelectItem>
                ) : (
                  services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{service.name}</span>
                        <span className="text-muted-foreground ml-4">
                          {formatPrice(service.price)} • {service.duration}min
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedService && (
            <>
              <Card className="p-6 mb-8 bg-muted/30 border-border/50">
                <div className="flex items-start gap-4">
                  {selectedService.image ? (
                    <img
                      src={getImageUrl(selectedService.image) || ''}
                      alt={selectedService.name}
                      className="w-24 h-24 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-24 h-24 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center';
                          fallback.innerHTML = '<div class="text-4xl opacity-20">✂️</div>';
                          parent.insertBefore(fallback, e.target);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <div className="text-4xl opacity-20">✂️</div>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{selectedService.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {selectedService.description || 'Service de coiffure professionnel'}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{selectedService.duration} min</span>
                      </div>
                      <div className="font-semibold">
                        {formatPrice(selectedService.price)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <BookingForm service={selectedService} />
            </>
          )}

          {!selectedService && (
            <div className="text-center py-12 text-muted-foreground">
              Veuillez sélectionner un service pour continuer
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Booking;
