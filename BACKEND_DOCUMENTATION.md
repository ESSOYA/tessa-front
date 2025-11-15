# Documentation Backend - API Salon de Coiffure

## Architecture

L'application frontend est construite pour se connecter à une API REST backend. Toutes les fonctions API sont centralisées dans `src/lib/api.ts`.

## Configuration

### Variables d'Environnement

Créez un fichier `.env` à la racine du projet avec :

```env
VITE_API_URL=http://localhost:3000/api
```

Pour la production, changez l'URL vers votre serveur API.

## Endpoints API Requis

### 1. Authentication

#### POST `/api/auth/login`
Connexion administrateur

**Request Body:**
```json
{
  "email": "admin@elegance.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "admin@elegance.com",
    "role": "admin"
  }
}
```

**Response Error (401):**
```json
{
  "error": "Email ou mot de passe incorrect"
}
```

#### POST `/api/auth/logout`
Déconnexion

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "message": "Déconnexion réussie"
}
```

---

### 2. Services

#### GET `/api/services`
Récupérer tous les services

**Response Success (200):**
```json
[
  {
    "id": "1",
    "name": "Coupe Femme",
    "description": "Coupe personnalisée avec conseil styling inclus",
    "duration": 45,
    "price": 35,
    "category": "Coupe",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }
]
```

#### GET `/api/services/:id`
Récupérer un service spécifique

**Response Success (200):**
```json
{
  "id": "1",
  "name": "Coupe Femme",
  "description": "Coupe personnalisée avec conseil styling inclus",
  "duration": 45,
  "price": 35,
  "category": "Coupe",
  "images": ["https://example.com/image1.jpg"]
}
```

**Response Error (404):**
```json
{
  "error": "Service non trouvé"
}
```

#### POST `/api/services`
Créer un nouveau service (Admin uniquement)

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Nouveau Service",
  "description": "Description du service",
  "duration": 60,
  "price": 50,
  "category": "Coupe",
  "images": ["https://example.com/image.jpg"]
}
```

**Response Success (201):**
```json
{
  "id": "7",
  "name": "Nouveau Service",
  "description": "Description du service",
  "duration": 60,
  "price": 50,
  "category": "Coupe",
  "images": ["https://example.com/image.jpg"]
}
```

#### PUT `/api/services/:id`
Mettre à jour un service (Admin uniquement)

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Service Modifié",
  "price": 55
}
```

**Response Success (200):**
```json
{
  "id": "1",
  "name": "Service Modifié",
  "description": "Description du service",
  "duration": 60,
  "price": 55,
  "category": "Coupe",
  "images": ["https://example.com/image.jpg"]
}
```

#### DELETE `/api/services/:id`
Supprimer un service (Admin uniquement)

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "message": "Service supprimé avec succès"
}
```

---

### 3. Réservations (Bookings)

#### GET `/api/bookings`
Récupérer toutes les réservations (Admin uniquement)

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
[
  {
    "id": "1",
    "serviceId": "1",
    "serviceName": "Coupe Femme",
    "clientName": "Marie Dupont",
    "clientEmail": "marie@example.com",
    "clientPhone": "0612345678",
    "date": "2025-01-20",
    "time": "10:00",
    "status": "confirmed",
    "notes": "Préférence pour cheveux courts",
    "createdAt": "2025-01-15T10:00:00Z"
  }
]
```

#### GET `/api/bookings/:id`
Récupérer une réservation spécifique

**Response Success (200):**
```json
{
  "id": "1",
  "serviceId": "1",
  "serviceName": "Coupe Femme",
  "clientName": "Marie Dupont",
  "clientEmail": "marie@example.com",
  "clientPhone": "0612345678",
  "date": "2025-01-20",
  "time": "10:00",
  "status": "pending",
  "notes": "Préférence pour cheveux courts",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

#### POST `/api/bookings`
Créer une nouvelle réservation (Public)

**Request Body:**
```json
{
  "serviceId": "1",
  "serviceName": "Coupe Femme",
  "clientName": "Marie Dupont",
  "clientEmail": "marie@example.com",
  "clientPhone": "0612345678",
  "date": "2025-01-20",
  "time": "10:00",
  "notes": "Préférence pour cheveux courts"
}
```

**Response Success (201):**
```json
{
  "id": "3",
  "serviceId": "1",
  "serviceName": "Coupe Femme",
  "clientName": "Marie Dupont",
  "clientEmail": "marie@example.com",
  "clientPhone": "0612345678",
  "date": "2025-01-20",
  "time": "10:00",
  "status": "pending",
  "notes": "Préférence pour cheveux courts",
  "createdAt": "2025-01-16T14:30:00Z"
}
```

**Actions automatiques :**
- Envoyer un email de confirmation à `clientEmail`
- Programmer un email de rappel 24h avant le rendez-vous

#### PATCH `/api/bookings/:id/status`
Changer le statut d'une réservation (Admin uniquement)

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valeurs possibles:** `"pending"`, `"confirmed"`, `"cancelled"`

**Response Success (200):**
```json
{
  "id": "1",
  "status": "confirmed",
  "...autres champs"
}
```

**Actions automatiques :**
- Si `status = "confirmed"`: Envoyer email de confirmation
- Si `status = "cancelled"`: Envoyer email d'annulation

#### DELETE `/api/bookings/:id`
Supprimer une réservation (Admin uniquement)

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "message": "Réservation supprimée avec succès"
}
```

---

## Fonctionnalités Email

### Emails Automatiques Requis

1. **Email de Confirmation de Réservation**
   - Trigger: POST `/api/bookings` ou PATCH status → `confirmed`
   - À: `clientEmail`
   - Contenu: Détails du rdv, instructions pour annuler

2. **Email de Rappel (24h avant)**
   - Trigger: Cron job quotidien
   - À: `clientEmail`
   - Contenu: Rappel du rdv du lendemain

3. **Email d'Annulation**
   - Trigger: PATCH status → `cancelled`
   - À: `clientEmail`
   - Contenu: Confirmation d'annulation

### Configuration Email Recommandée

Utilisez un service comme:
- **SendGrid** (https://sendgrid.com/)
- **Mailgun** (https://www.mailgun.com/)
- **Amazon SES** (https://aws.amazon.com/ses/)
- **Resend** (https://resend.com/)

---

## Base de Données

### Schéma Recommandé

#### Table: `services`
```sql
CREATE TABLE services (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  duration INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  images JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Table: `bookings`
```sql
CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  service_id VARCHAR(50) NOT NULL,
  service_name VARCHAR(200) NOT NULL,
  client_name VARCHAR(200) NOT NULL,
  client_email VARCHAR(200) NOT NULL,
  client_phone VARCHAR(20) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
```

#### Table: `users` (Admin)
```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Sécurité

### Authentication
- Utilisez JWT (JSON Web Tokens) pour l'authentification admin
- Stockez le token de manière sécurisée (httpOnly cookies recommandé)
- Implémentez une expiration de token (ex: 24h)

### Validation
- Validez toutes les entrées utilisateur
- Sanitizez les emails et numéros de téléphone
- Vérifiez que les dates/heures sont dans le futur

### CORS
Configurez CORS pour accepter les requêtes depuis votre domaine frontend :

```javascript
// Exemple Express.js
app.use(cors({
  origin: 'https://votre-domaine.com',
  credentials: true
}));
```

---

## Exemples d'Implémentation Backend

### Exemple Node.js/Express

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route exemple
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = req.body;
    
    // Validation
    if (!booking.clientEmail || !booking.date) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    
    // Enregistrer dans la DB
    const newBooking = await db.bookings.create({
      ...booking,
      id: generateId(),
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    
    // Envoyer email de confirmation
    await sendConfirmationEmail(booking.clientEmail, newBooking);
    
    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.listen(3000, () => {
  console.log('API started on port 3000');
});
```

---

## Tests

### Tester l'API avec curl

```bash
# Créer une réservation
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "serviceId": "1",
    "serviceName": "Coupe Femme",
    "clientName": "Test User",
    "clientEmail": "test@example.com",
    "clientPhone": "0612345678",
    "date": "2025-01-25",
    "time": "14:00"
  }'

# Login admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@elegance.com",
    "password": "password123"
  }'
```

---

## Déploiement

### Hébergement Backend Recommandé
- **Heroku** (facile pour débutants)
- **DigitalOcean App Platform**
- **Railway** (moderne et simple)
- **AWS Elastic Beanstalk**
- **Vercel** (pour API Node.js)

### Base de Données
- **PostgreSQL** (Railway, Supabase, Neon)
- **MySQL** (PlanetScale, AWS RDS)
- **MongoDB Atlas** (NoSQL)

---

## Support

Pour toute question sur l'intégration backend, référez-vous à :
- `/src/lib/api.ts` - Toutes les fonctions API
- `/src/types/index.ts` - Types TypeScript
- `/src/lib/mockData.ts` - Exemples de données

---

## Connexion Frontend-Backend

### Configuration Rapide

1. **Variables d'environnement Frontend** (`.env` à la racine) :
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=TESSA COIFFURE
VITE_APP_VERSION=1.0.0
```

2. **Variables d'environnement Backend** (`.env` dans `backend/`) :
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=salon_coiffure
DB_USER=root
DB_PASSWORD=

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Démarrage

1. **Backend** : `cd backend && npm install && npm run dev`
2. **Frontend** : `npm install && npm run dev`

### Test de Connexion

- **Backend Health** : http://localhost:3000/health
- **API Documentation** : http://localhost:3000/api/docs
- **Frontend** : http://localhost:5173

### Scripts de Démarrage

- `start-backend.bat` : Démarre le backend
- `start-frontend.bat` : Démarre le frontend
- `test-connection.ps1` : Teste la connexion

---

**Version:** 1.1  
**Dernière mise à jour:** Janvier 2025  
**Connexion Frontend-Backend:** Configurée pour TESSA COIFFURE
