# Guide de Connexion Backend-Frontend
## TESSA COIFFURE

## 🚀 Démarrage Rapide

### 1. Configuration des Variables d'Environnement

#### Frontend (.env à la racine)
Créez un fichier `.env` avec :
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=TESSA COIFFURE
VITE_APP_VERSION=1.0.0
```

#### Backend (.env dans backend/)
Créez un fichier `.env` dans le dossier `backend/` avec :
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=salon_coiffure
DB_USER=root
DB_PASSWORD=

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@tessa-coiffure.com
EMAIL_FROM_NAME=TESSA COIFFURE

PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Installation des Dépendances

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
npm install
```

### 3. Démarrage des Services

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
npm run dev
```

### 4. Vérification de la Connexion

#### URLs à tester :
- **Backend Health**: http://localhost:3000/health
- **API Info**: http://localhost:3000/api
- **API Docs**: http://localhost:3000/api/docs
- **Frontend**: http://localhost:5173

#### Test avec curl :
```bash
# Test backend
curl http://localhost:3000/health

# Test API
curl http://localhost:3000/api

# Test services
curl http://localhost:3000/api/services
```

## 🔧 Configuration Avancée

### Base de Données
1. Installez MySQL
2. Créez la base de données `salon_coiffure`
3. Exécutez les scripts SQL dans `backend/database/`

### Email (Optionnel)
1. Créez un compte SendGrid
2. Obtenez votre API key
3. Mettez à jour `SENDGRID_API_KEY` dans `.env`

## 🐛 Résolution de Problèmes

### Backend ne démarre pas
- Vérifiez que le port 3000 est libre
- Vérifiez la configuration de la base de données
- Consultez les logs dans la console

### Frontend ne se connecte pas
- Vérifiez que `VITE_API_URL` est correct
- Vérifiez que le backend est démarré
- Ouvrez les outils de développement (F12) pour voir les erreurs

### Erreurs CORS
- Vérifiez que `FRONTEND_URL` est correct dans le backend
- Vérifiez que le frontend utilise la bonne URL

## 📱 Utilisation

### Interface Utilisateur
1. Ouvrez http://localhost:5173
2. Naviguez dans l'application
3. Testez les fonctionnalités de réservation

### Interface Admin
1. Allez sur http://localhost:5173/admin
2. Connectez-vous avec les identifiants admin
3. Gérez les services et rendez-vous

## 🔍 Test de Connexion

### Automatique
Utilisez le composant `ConnectionTest` dans l'interface :
```tsx
import { ConnectionTest } from '@/components/ConnectionTest';

// Dans votre composant
<ConnectionTest />
```

### Manuel
```javascript
// Dans la console du navigateur
fetch('http://localhost:3000/health')
  .then(response => response.json())
  .then(data => console.log('Backend OK:', data))
  .catch(error => console.error('Backend KO:', error));
```

## 📚 Documentation API

Une fois le backend démarré, consultez :
- **Documentation complète**: http://localhost:3000/api/docs
- **Endpoints disponibles**: http://localhost:3000/api

## 🎯 Prochaines Étapes

1. ✅ Configuration des variables d'environnement
2. ✅ Installation des dépendances
3. ✅ Démarrage des services
4. ✅ Test de la connexion
5. 🔄 Développement des fonctionnalités
6. 🔄 Tests et déploiement

---

**Support**: Pour toute question, consultez la documentation dans `BACKEND_DOCUMENTATION.md`

