import { Service } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice, getImageUrl } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const imageUrl = getImageUrl(service.image);

  return (
    <Link to={`/services/${service.id}`}>
      <Card className="group overflow-hidden hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 border-border/50">
        <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Si l'image ne charge pas, afficher l'icône par défaut
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent && !parent.querySelector('.fallback-icon')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'fallback-icon text-6xl opacity-20';
                  fallback.textContent = '✂️';
                  parent.appendChild(fallback);
                }
              }}
            />
          ) : (
            <div className="text-6xl opacity-20">✂️</div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            Coiffure
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {service.name}
          </h3>
          <p className="text-muted-foreground line-clamp-2">{service.description}</p>
        </CardContent>
        <CardFooter className="px-6 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{service.duration} min</span>
          </div>
          <div className="text-primary font-bold text-lg">
            {formatPrice(service.price)}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ServiceCard;
