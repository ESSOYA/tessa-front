import { useState, useEffect } from 'react';
import ServiceCard from '@/components/ServiceCard';
import { servicesApi } from '@/lib/api';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('🔄 Chargement des services...');
        const response = await servicesApi.getAll();
        console.log('📡 Réponse API:', response);
        
        if (response.success && response.data) {
          console.log('✅ Services chargés:', response.data.services);
          setServices(response.data.services);
        } else {
          console.error('❌ Erreur API:', response.error);
          setError(response.error || 'Erreur lors du chargement des services');
          toast.error('Erreur lors du chargement des services');
        }
      } catch (error) {
        console.error('❌ Erreur fetch:', error);
        setError('Erreur de connexion');
        toast.error('Erreur lors du chargement des services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = ['all'];

  const filteredServices = services;

  // Affichage de débogage
  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Nos Services</h1>
            <p className="text-lg">Chargement des services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Nos Services</h1>
            <p className="text-lg text-red-600">Erreur: {error}</p>
            <p className="text-sm text-gray-500 mt-2">Vérifiez la console pour plus de détails</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez l'ensemble de nos prestations de coiffure et soins capillaires
          </p>
          {/* Debug info */}
          <p className="text-sm text-gray-500 mt-2">
            Services chargés: {services.length} | Catégorie: {selectedCategory}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-primary-light'
                  : ''
              }
            >
              {category === 'all' ? 'Tous' : category}
            </Button>
          ))}
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">Aucun service disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
