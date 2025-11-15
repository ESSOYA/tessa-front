# Élégance Coiffure - Application de Gestion de Rendez-vous

Application web complète de gestion de rendez-vous pour salon de coiffure, développée avec React, TypeScript et Tailwind CSS.

## 🌟 Fonctionnalités

### Côté Public
- 🏠 **Page d'accueil** avec présentation du salon et services
- 💇 **Catalogue de services** avec photos et détails
- 📅 **Réservation en ligne** sans création de compte
- 📧 **Notifications email** (confirmation et rappels)
- 📱 **Design responsive** (mobile, tablette, desktop)

### Côté Administration
- 🔐 **Authentification sécurisée**
- 📊 **Dashboard** avec statistiques
- ✂️ **Gestion des services** (CRUD complet)
- 📆 **Gestion des réservations** (confirmation, annulation)
- 📞 **Contact client** direct

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ et npm

### Installation

```bash
# Cloner le projet
git clone <votre-repo-url>
cd elegance-coiffure

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

L'application sera disponible sur `http://localhost:8080`

### Configuration

Créez un fichier `.env` à la racine :

```env
VITE_API_URL=http://localhost:3000/api
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI (shadcn)
│   ├── admin/          # Composants admin
│   ├── Layout.tsx      # Layout principal
│   ├── ServiceCard.tsx # Carte service
│   └── BookingForm.tsx # Formulaire réservation
├── pages/              # Pages de l'application
│   ├── Home.tsx        # Page d'accueil
│   ├── Services.tsx    # Liste des services
│   ├── ServiceDetail.tsx # Détail d'un service
│   ├── Booking.tsx     # Page de réservation
│   └── admin/          # Pages admin
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       ├── AdminServices.tsx
│       └── AdminBookings.tsx
├── lib/                # Utilitaires
│   ├── api.ts          # Client API
│   ├── mockData.ts     # Données de test
│   └── utils.ts        # Helpers
├── types/              # Types TypeScript
│   └── index.ts
└── App.tsx             # Composant racine avec routes
```

## 🎨 Design System

L'application utilise un design system luxueux :
- **Couleurs principales** : Or rosé (#D4AF37), Rose poudré (#E8B4B8), Noir profond (#1A1A1A)
- **Typographie** : Police moderne et élégante
- **Composants** : shadcn/ui personnalisés
- **Animations** : Transitions fluides et élégantes

Tous les tokens de design sont définis dans :
- `src/index.css` - Variables CSS
- `tailwind.config.ts` - Configuration Tailwind

## 🔌 Intégration Backend

Le frontend est prêt à se connecter à votre API backend. Consultez `BACKEND_DOCUMENTATION.md` pour :
- Spécifications complètes des endpoints
- Schéma de base de données
- Exemples d'implémentation
- Configuration des emails

### Endpoints Principaux

```typescript
// Services
GET    /api/services
GET    /api/services/:id
POST   /api/services          (Admin)
PUT    /api/services/:id      (Admin)
DELETE /api/services/:id      (Admin)

// Réservations
GET    /api/bookings          (Admin)
POST   /api/bookings
PATCH  /api/bookings/:id/status (Admin)
DELETE /api/bookings/:id      (Admin)

// Auth
POST   /api/auth/login
POST   /api/auth/logout
```

## 📧 Système de Notifications

L'application nécessite un système d'envoi d'emails pour :
1. **Confirmation de réservation** (immédiat)
2. **Rappel 24h avant** (cron job)
3. **Annulation** (si applicable)

Services recommandés : SendGrid, Mailgun, Resend

## 🔒 Sécurité

### Frontend
- Validation des formulaires avec Zod
- Protection des routes admin
- Tokens JWT stockés de manière sécurisée

### Backend (à implémenter)
- Authentification JWT
- Validation des entrées
- Protection CSRF
- Rate limiting
- CORS configuré

## 🧪 Tests

```bash
# Tests unitaires (à configurer)
npm run test

# Build de production
npm run build

# Preview du build
npm run preview
```

## 📦 Technologies Utilisées

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI
- **React Router** - Routing
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation de schémas
- **date-fns** - Manipulation de dates
- **Sonner** - Notifications toast
- **Lucide React** - Icônes

## 🚀 Déploiement

### Frontend
Déployez sur :
- **Vercel** (recommandé)
- **Netlify**
- **Cloudflare Pages**

```bash
npm run build
# Le dossier dist/ contient l'application prête pour la production
```

### Backend
Consultez `BACKEND_DOCUMENTATION.md` pour les options d'hébergement.

## 📱 Responsive Design

L'application est entièrement responsive :
- 📱 **Mobile** : < 768px
- 📱 **Tablette** : 768px - 1024px
- 💻 **Desktop** : > 1024px

## 🎯 Roadmap Futures Fonctionnalités

- [ ] Paiement en ligne (Stripe)
- [ ] Gestion multi-salons
- [ ] Programme de fidélité
- [ ] Notifications SMS
- [ ] Export des statistiques
- [ ] Application mobile native
- [ ] Système de promotions

## 📄 License

Ce projet est développé pour Élégance Coiffure.

## 👥 Support

Pour toute question :
- Documentation API : `BACKEND_DOCUMENTATION.md`
- Code frontend : Voir les commentaires dans les fichiers
- Issues : Créer une issue sur le repo

---

**Développé avec ❤️ pour Élégance Coiffure**
