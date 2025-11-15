import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formater un prix en Franc CFA
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice) + ' FCFA';
}

// Construire l'URL complète d'une image depuis le backend
export function getImageUrl(imagePath: string | undefined | null): string | null {
  if (!imagePath) return null;
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  
  // Si l'image commence par /public, utiliser la route API /api/images
  if (imagePath.startsWith('/public/')) {
    // Convertir /public/... en /api/images/public/...
    return `${apiUrl}/images${imagePath}`;
  }
  
  // Si l'image commence déjà par /api/images, utiliser directement
  if (imagePath.startsWith('/api/images')) {
    return `${apiUrl}${imagePath.replace('/api', '')}`;
  }
  
  // Si c'est déjà une URL complète, la retourner telle quelle
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Sinon, supposer que c'est un chemin relatif commençant par /public
  if (imagePath.startsWith('/')) {
    return `${apiUrl}/images/public${imagePath}`;
  }
  
  return `${apiUrl}/images/public/${imagePath}`;
}
