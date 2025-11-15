# 🚀 Guide de Déploiement

Ce guide vous accompagne pour mettre en production votre application de salon de coiffure.

---

## 📋 Checklist Pré-Déploiement

- [ ] Tests locaux réussis (`npm run build`)
- [ ] Backend API opérationnel
- [ ] Base de données configurée
- [ ] Système d'envoi d'emails configuré
- [ ] Variables d'environnement préparées
- [ ] Nom de domaine acheté (optionnel)

---

## 🌐 Déploiement Frontend

### Option A : Vercel (Recommandé - Gratuit)

**Avantages :** Déploiement automatique, SSL gratuit, CDN global, zéro configuration

#### 1. Via GitHub (Recommandé)

```bash
# Poussez votre code sur GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-username/elegance-coiffure.git
git push -u origin main
```

Sur [Vercel](https://vercel.com) :
1. Connectez votre compte GitHub
2. Cliquez "Import Project"
3. Sélectionnez votre repo
4. Ajoutez les variables d'environnement :
   ```
   VITE_API_URL=https://votre-api-backend.com/api
   ```
5. Cliquez "Deploy"

#### 2. Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Pour la production
vercel --prod
```

**Configuration des variables :**
```bash
vercel env add VITE_API_URL
# Entrez: https://votre-api-backend.com/api
```

---

### Option B : Netlify

**Avantages :** Formulaires intégrés, redirections simples, préviews de branches

#### Déploiement

1. Sur [Netlify](https://netlify.com), cliquez "Add new site"
2. Connectez votre repo GitHub
3. Configuration de build :
   - Build command : `npm run build`
   - Publish directory : `dist`
4. Variables d'environnement :
   ```
   VITE_API_URL = https://votre-api-backend.com/api
   ```
5. Cliquez "Deploy site"

#### Fichier netlify.toml (optionnel)

Créez `netlify.toml` à la racine :

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

### Option C : Cloudflare Pages

**Avantages :** CDN ultra-rapide, pas de limite de bande passante

1. Sur [Cloudflare Pages](https://pages.cloudflare.com)
2. Connectez votre repo
3. Configuration :
   - Framework : Vite
   - Build command : `npm run build`
   - Build output : `dist`
4. Variables d'environnement : `VITE_API_URL`
5. Deploy

---

## 🖥️ Déploiement Backend

### Option A : Railway (Recommandé pour Node.js)

**Avantages :** PostgreSQL inclus, déploiement Git, gratuit pour commencer

#### 1. Préparez votre Backend

Structure exemple Node.js/Express :

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── services.js
│   │   └── bookings.js
│   ├── models/
│   ├── middleware/
│   └── index.js
├── package.json
└── .env.example
```

#### 2. Déployez sur Railway

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialiser
railway init

# Déployer
railway up
```

Ou via interface web :
1. https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Sélectionnez votre repo backend
4. Ajoutez PostgreSQL : "New" → "Database" → "PostgreSQL"
5. Variables d'environnement :
   ```
   DATABASE_URL=${DATABASE_URL}
   JWT_SECRET=votre-secret-jwt
   RESEND_API_KEY=votre-cle-resend
   PORT=3000
   ```

---

### Option B : Heroku

```bash
# Installer Heroku CLI
npm install -g heroku

# Login
heroku login

# Créer app
heroku create elegance-coiffure-api

# Ajouter PostgreSQL
heroku addons:create heroku-postgresql:essential-0

# Déployer
git push heroku main

# Variables d'environnement
heroku config:set JWT_SECRET=votre-secret
heroku config:set RESEND_API_KEY=votre-cle
```

---

### Option C : DigitalOcean App Platform

1. https://cloud.digitalocean.com/apps
2. "Create App" → GitHub
3. Sélectionnez repo backend
4. Configure :
   - Type : Web Service
   - Build Command : `npm install && npm run build`
   - Run Command : `npm start`
5. Ajoutez PostgreSQL Managed Database
6. Variables d'environnement

---

## 🗄️ Base de Données

### Option A : Supabase (Recommandé)

**Avantages :** PostgreSQL gratuit, interface web, authentification intégrée

1. Créez un compte sur https://supabase.com
2. "New Project"
3. Copiez la connection string
4. Exécutez les migrations SQL (voir `BACKEND_DOCUMENTATION.md`)
5. Configurez dans votre backend :
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db
   ```

### Option B : PlanetScale (MySQL)

1. https://planetscale.com
2. Gratuit jusqu'à 5GB
3. Excellente performance
4. Branching de base de données

### Option C : Railway PostgreSQL

Inclus gratuitement avec le plan Railway (5GB).

---

## 📧 Configuration Emails

### Option A : Resend (Recommandé)

**Avantages :** API simple, 100 emails/jour gratuits, excellent pour débuter

#### Setup

1. Créez un compte sur https://resend.com
2. Vérifiez votre domaine (ou utilisez le domaine test)
3. Créez une API key
4. Configuration backend :

```javascript
const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Élégance Coiffure <noreply@elegance-coiffure.fr>',
  to: clientEmail,
  subject: 'Confirmation de rendez-vous',
  html: emailTemplate
});
```

### Option B : SendGrid

1. https://sendgrid.com (100 emails/jour gratuits)
2. Créez API key
3. Configuration similaire à Resend

### Option C : Mailgun

1. https://mailgun.com
2. 5000 emails gratuits pendant 3 mois
3. API REST simple

---

## 🔒 Configuration SSL/HTTPS

### Frontend

**Automatique** avec Vercel, Netlify ou Cloudflare Pages.

### Backend

Si vous utilisez un serveur custom :

```bash
# Avec Certbot (Let's Encrypt)
sudo certbot --nginx -d api.elegance-coiffure.fr
```

Ou utilisez Cloudflare pour proxy SSL gratuit.

---

## 🌍 Configuration Domaine Personnalisé

### Frontend

#### Sur Vercel

1. Projet → Settings → Domains
2. Ajoutez votre domaine : `elegance-coiffure.fr`
3. Configurez DNS chez votre registrar :
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

#### Sur Netlify

1. Site → Domain settings → Add custom domain
2. Configurez DNS :
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   ```

### Backend

1. Créez sous-domaine : `api.elegance-coiffure.fr`
2. DNS :
   ```
   Type: A
   Name: api
   Value: [IP de votre serveur backend]
   ```
3. Mettez à jour `VITE_API_URL` dans Vercel/Netlify

---

## ⚙️ Variables d'Environnement

### Frontend (Vercel/Netlify)

```env
VITE_API_URL=https://api.elegance-coiffure.fr/api
```

### Backend

```env
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=votre-secret-ultra-securise-min-32-chars

# Email
RESEND_API_KEY=re_...

# CORS
FRONTEND_URL=https://elegance-coiffure.fr

# Server
PORT=3000
NODE_ENV=production
```

---

## 🔄 CI/CD - Déploiement Automatique

### GitHub Actions (Exemple)

Créez `.github/workflows/deploy.yml` :

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      # Vercel déploie automatiquement
```

---

## 📊 Monitoring & Analytics

### Frontend

**Gratuit :**
- Vercel Analytics (intégré)
- Google Analytics
- Plausible Analytics

### Backend

**Gratuit :**
- Railway Metrics (intégré)
- Sentry (erreurs)
- LogRocket

### Uptime Monitoring

- **UptimeRobot** : https://uptimerobot.com (gratuit)
- **Pingdom**
- **Checkly**

---

## 🐛 Debug Production

### Logs Frontend

```bash
# Vercel
vercel logs

# Netlify
netlify logs
```

### Logs Backend

```bash
# Railway
railway logs

# Heroku
heroku logs --tail
```

---

## ✅ Checklist Post-Déploiement

- [ ] Site accessible via HTTPS
- [ ] API répond correctement
- [ ] Réservation fonctionne
- [ ] Emails envoyés
- [ ] Admin login opérationnel
- [ ] Tests sur mobile/tablette/desktop
- [ ] Certificats SSL valides
- [ ] Monitoring activé
- [ ] Backups DB configurés
- [ ] DNS propagés (24-48h)

---

## 🆘 Problèmes Courants

### 1. "Failed to fetch" sur l'API

**Cause :** CORS mal configuré

**Solution :** Dans votre backend :
```javascript
app.use(cors({
  origin: 'https://elegance-coiffure.fr',
  credentials: true
}));
```

### 2. 404 sur les routes React

**Solution Vercel :** Créez `vercel.json` :
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Solution Netlify :** Créez `_redirects` dans `public/` :
```
/*    /index.html   200
```

### 3. Variables d'environnement non chargées

- Vérifiez le préfixe `VITE_` pour le frontend
- Redéployez après avoir ajouté des variables
- Vérifiez la casse (sensible !)

---

## 💰 Coûts Estimés

### Gratuit (Hobby)
- Vercel (Frontend)
- Supabase/Railway (Backend + DB)
- Resend (100 emails/jour)
- **Total : 0€/mois**

### Startup (< 10 000 utilisateurs/mois)
- Vercel Pro : 20$/mois
- Railway : 5-10$/mois
- Resend : 20$/mois (50k emails)
- **Total : ~45$/mois (41€)**

### Production (> 50 000 utilisateurs/mois)
- Vercel Enterprise : 150$/mois
- DigitalOcean Droplet : 24$/mois
- SendGrid : 15$/mois (40k emails)
- **Total : ~189$/mois (173€)**

---

## 📚 Ressources Supplémentaires

- [Guide Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [Netlify Docs](https://docs.netlify.com/)
- [Railway Docs](https://docs.railway.app/)
- [Resend Email Guide](https://resend.com/docs/send-with-nodejs)

---

**Bon déploiement ! 🚀**
