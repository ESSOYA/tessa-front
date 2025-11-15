import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceCard from '@/components/ServiceCard';
import { servicesApi, siteSettingsApi } from '@/lib/api';
import { Service } from '@/types';
import AdminRedirect from '@/components/AdminRedirect';
import { useAuth } from '@/hooks/useAuth';
import { getImageUrl } from '@/lib/utils';

const Home = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>('/public/img.jpg');
  const [imageKey, setImageKey] = useState(0); // Pour forcer le rechargement

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await servicesApi.getAll();
        if (response.success && response.data) {
          setFeaturedServices(response.data.services.slice(0, 3));
        }
      } catch (error) {
        console.error('Erreur chargement services:', error);
      }
    };
    loadServices();

    // Charger l'image de fond
    const loadBackgroundImage = async () => {
      try {
        // Utiliser l'API publique pour récupérer l'image de fond
        const response = await siteSettingsApi.get('homepage_background_image');
        console.log('Réponse image de fond:', response);
        
        if (response.success && response.data?.value) {
          const imagePath = response.data.value;
          console.log('Image de fond chargée:', imagePath);
          setBackgroundImage(imagePath);
          // Forcer le rechargement en changeant la clé
          setImageKey(prev => prev + 1);
        } else {
          // Image par défaut si aucune image n'est configurée
          console.log('Aucune image configurée, utilisation de l\'image par défaut');
          setBackgroundImage('/public/img.jpg');
          setImageKey(prev => prev + 1);
        }
      } catch (error) {
        console.error('Erreur chargement image de fond:', error);
        // Image par défaut en cas d'erreur
        setBackgroundImage('/public/img.jpg');
        setImageKey(prev => prev + 1);
      }
    };
    loadBackgroundImage();

    // Écouter les changements de focus pour recharger l'image
    const handleFocus = () => {
      loadBackgroundImage();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Si l'utilisateur est admin, le rediriger vers l'interface admin
  // Note: role_id 1 = client, role_id 2 = admin
  if (isAuthenticated && user && (user as any).role_id === 2) {
    return <AdminRedirect />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: backgroundImage ? `url(${getImageUrl(backgroundImage) || ''}?v=${imageKey})` : 'none',
          }}
          key={imageKey}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/90 to-accent/70" />
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
            <span className="text-primary-foreground font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Votre beauté, notre passion
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-accent-foreground mb-6 leading-tight">
            Élégance & Raffinement
          </h1>
          <p className="text-xl md:text-2xl text-accent-foreground/80 mb-8 max-w-2xl mx-auto">
            Découvrez l'excellence de nos services de coiffure dans une ambiance chaleureuse
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-light hover:shadow-luxury text-lg px-8"
              >
                Réserver maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button
                size="lg"
                variant="outline"
                className="bg-background/10 backdrop-blur-sm border-accent-foreground/20 text-accent-foreground hover:bg-background/20 text-lg px-8"
              >
                Nos services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-card border border-border/50 hover:shadow-card transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Award className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expertise Professionnelle</h3>
              <p className="text-muted-foreground">
                Des coiffeurs qualifiés et passionnés à votre service
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card border border-border/50 hover:shadow-card transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Réservation Facile</h3>
              <p className="text-muted-foreground">
                Prenez rendez-vous en ligne 24h/24 en quelques clics
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card border border-border/50 hover:shadow-card transition-shadow">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Produits Premium</h3>
              <p className="text-muted-foreground">
                Nous utilisons uniquement des produits haut de gamme
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Nos Services Populaires</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre sélection de prestations pour sublimer votre beauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Voir tous les services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prête pour une transformation ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Réservez votre rendez-vous dès maintenant et laissez-nous prendre soin de vous
          </p>
          <Link to="/booking">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-light hover:shadow-luxury text-lg px-12"
            >
              Réserver maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
