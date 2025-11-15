# 🚀 Guide de Démarrage Rapide

## Installation en 3 étapes

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer l'environnement

Copiez le fichier d'exemple et modifiez l'URL de votre API :

```bash
cp .env.example .env
```

Puis éditez `.env` :
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Lancer l'application

```bash
npm run dev
```

Ouvrez http://localhost:8080 🎉

---

## 📍 Pages Disponibles

### Public
- **/** - Page d'accueil
- **/services** - Liste des services
- **/services/:id** - Détail d'un service
- **/booking** - Réservation

### Admin
- **/admin/login** - Connexion admin
- **/admin/dashboard** - Tableau de bord
- **/admin/services** - Gestion des services
- **/admin/bookings** - Gestion des réservations

**Identifiants de test** (à configurer dans votre backend) :
- Email: `admin@elegance.com`
- Mot de passe: `password123`

---

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Lint
npm run lint
```

---

## 🎨 Personnalisation du Design

### Modifier les couleurs

Éditez `src/index.css` :

```css
:root {
  --primary: 40 70% 55%;      /* Or rosé */
  --secondary: 350 45% 80%;   /* Rose poudré */
  --accent: 0 0% 10%;         /* Noir profond */
}
```

Toutes les couleurs utilisent le format HSL.

### Modifier le nom du salon

Recherchez "Élégance Coiffure" dans :
- `src/components/Layout.tsx`
- `src/components/admin/AdminLayout.tsx`
- `index.html`
- `README.md`

---

## 🔌 Backend - Mise en Place

### Option 1 : Mode Mock (pour tester le frontend)

Par défaut, l'app utilise des données mockées dans `src/lib/mockData.ts`.
Aucun backend requis pour tester l'interface.

### Option 2 : Connecter votre API

1. Créez votre backend selon la doc `BACKEND_DOCUMENTATION.md`
2. Configurez l'URL dans `.env`
3. L'app sera automatiquement connectée

---

## 📧 Configuration des Emails

Votre backend doit gérer 3 types d'emails :

1. **Confirmation de réservation** (POST /api/bookings)
2. **Rappel 24h avant** (Cron job)
3. **Annulation** (PATCH status → cancelled)

Services recommandés :
- **Resend** : https://resend.com (recommandé, simple)
- **SendGrid** : https://sendgrid.com
- **Mailgun** : https://mailgun.com

---

## 🚀 Déploiement

### Frontend (Vercel - Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configuration automatique détectée ✓
```

Variables d'environnement à ajouter sur Vercel :
```
VITE_API_URL=https://votre-api.com/api
```

### Backend

Consultez `BACKEND_DOCUMENTATION.md` section "Déploiement"

Options faciles :
- **Railway** : https://railway.app
- **Heroku** : https://heroku.com
- **Render** : https://render.com

---

## 🐛 Résolution de Problèmes

### L'app ne se lance pas
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreurs TypeScript
```bash
# Vérifier les types
npm run type-check
```

### Erreurs d'API
- Vérifiez que `VITE_API_URL` est correct dans `.env`
- Vérifiez que votre backend est lancé
- Consultez la console (F12) pour les détails

### Page blanche après build
```bash
# Vérifier les logs de build
npm run build

# Tester localement
npm run preview
```

---

## 📚 Documentation Complète

- **README.md** - Vue d'ensemble du projet
- **BACKEND_DOCUMENTATION.md** - Spécifications API complètes
- **Code source** - Commenté dans les fichiers

---

## 🆘 Support

Besoin d'aide ?

1. Consultez `BACKEND_DOCUMENTATION.md` pour l'API
2. Vérifiez les types dans `src/types/index.ts`
3. Examinez les exemples dans `src/lib/mockData.ts`

---

**Bon développement ! 💪**
