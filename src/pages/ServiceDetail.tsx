import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BookingForm from '@/components/BookingForm';
import { servicesApi } from '@/lib/api';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { Service } from '@/types';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const loadService = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await servicesApi.getById(id);
        if (response.success && response.data) {
          setService(response.data);
        } else {
          toast.error('Erreur lors du chargement du service', {
            description: response.error || 'Service non trouvé'
          });
        }
      } catch (error) {
        console.error('Erreur chargement service:', error);
        toast.error('Erreur lors du chargement du service');
      } finally {
        setLoading(false);
      }
    };
    loadService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service non trouvé</h1>
          <Link to="/services">
            <Button>Retour aux services</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <Link to="/services">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux services
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Gallery */}
          <div className="space-y-4">
            {service.images && service.images.length > 0 ? (
              <>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  <img
                    src={getImageUrl(service.images[0]) || ''}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage non disponible%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                {service.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {service.images.slice(1, 5).map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all"
                      >
                        <img
                          src={getImageUrl(image) || ''}
                          alt={`${service.name} ${index + 2}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-6xl opacity-20">✂️</div>
              </div>
            )}
          </div>

          {/* Service Info */}
          <div>
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
              Coiffure
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.name}</h1>
            <p className="text-xl text-muted-foreground mb-8">{service.description || 'Service de coiffure professionnel'}</p>

            <Card className="p-6 mb-8 bg-muted/30 border-border/50">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Durée</div>
                    <div className="font-semibold">{service.duration} minutes</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Prix</div>
                    <div className="font-semibold text-xl">{formatPrice(service.price)}</div>
                  </div>
                </div>
              </div>
            </Card>

            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-primary-light hover:shadow-luxury text-lg"
              onClick={() => setBookingOpen(true)}
            >
              Réserver ce service
            </Button>

            <div className="mt-8 p-6 rounded-xl bg-secondary/20 border border-secondary/30">
              <h3 className="font-semibold mb-2">À savoir</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Consultation incluse</li>
                <li>✓ Produits professionnels premium</li>
                <li>✓ Conseils personnalisés</li>
                <li>✓ Annulation gratuite jusqu'à 24h avant</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Réserver - {service.name}</DialogTitle>
          </DialogHeader>
          <BookingForm service={service} onSuccess={() => setBookingOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceDetail;
