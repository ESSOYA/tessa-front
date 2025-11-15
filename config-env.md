# Configuration des Variables d'Environnement

## Frontend (.env à la racine du projet)

Créez un fichier `.env` à la racine du projet avec :

```env
# Configuration API Backend
VITE_API_URL=http://localhost:3000/api

# Configuration de l'application
VITE_APP_NAME=TESSA COIFFURE
VITE_APP_VERSION=1.0.0
```

## Backend (.env dans le dossier backend)

Créez un fichier `.env` dans le dossier `backend/` avec :

```env
# Configuration Base de Données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=salon_coiffure
DB_USER=root
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@tessa-coiffure.com
EMAIL_FROM_NAME=TESSA COIFFURE

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Instructions de Démarrage

1. **Démarrer le Backend :**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Démarrer le Frontend :**
   ```bash
   npm install
   npm run dev
   ```

3. **Vérifier la connexion :**
   - Backend: http://localhost:3000/health
   - Frontend: http://localhost:5173
   - API Docs: http://localhost:3000/api/docs

