import { Service, Booking } from '@/types';

// Mock data pour le développement frontend
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Coupe Femme',
    description: 'Coupe personnalisée avec conseil styling inclus',
    duration: 60,
    price: 25000,
    category: 'Coupe',
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
    ],
  },
  {
    id: '2',
    name: 'Coupe Homme',
    description: 'Coupe moderne avec finitions précises',
    duration: 60,
    price: 10000,
    category: 'Coupe',
    images: [
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800',
    ],
  },
  {
    id: '3',
    name: 'Coloration',
    description: 'Coloration complète avec soin capillaire',
    duration: 60,
    price: 20000,
    category: 'Coloration',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    ],
  },
  {
    id: '4',
    name: 'Brushing',
    description: 'Brushing professionnel pour une tenue parfaite',
    duration: 30,
    price: 15000,
    category: 'Coiffage',
    images: [
      'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800',
    ],
  },
  {
    id: '5',
    name: 'Tresses',
    description: 'Tressage créatif et personnalisé',
    duration: 60,
    price: 10000,
    category: 'Coiffage',
    images: [
      'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800',
    ],
  },
  {
    id: '6',
    name: 'Soin Capillaire',
    description: 'Soin profond pour cheveux abîmés',
    duration: 30,
    price: 8000,
    category: 'Soin',
    images: [
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800',
    ],
  },
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    serviceId: '1',
    serviceName: 'Coupe Femme',
    clientName: 'Marie Dupont',
    clientEmail: 'marie.dupont@email.com',
    clientPhone: '0612345678',
    date: '2025-01-20',
    time: '10:00',
    status: 'confirmed',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    serviceId: '3',
    serviceName: 'Coloration',
    clientName: 'Sophie Martin',
    clientEmail: 'sophie.martin@email.com',
    clientPhone: '0623456789',
    date: '2025-01-21',
    time: '14:00',
    status: 'pending',
    createdAt: '2025-01-16T14:30:00Z',
  },
];
