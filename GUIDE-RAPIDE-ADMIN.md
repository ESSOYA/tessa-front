# 🚀 GUIDE RAPIDE - CONNEXION ADMIN TESSA COIFFURE

## ✅ **ÉTAPES COMPLETÉES**

### 1. **Application Démarrée** ✅
- Backend : http://localhost:3000
- Frontend : http://localhost:5173
- Admin : http://localhost:5173/admin

### 2. **Prochaine Étape : Créer l'Admin**

## 🔧 **CRÉER L'ADMIN (2 minutes)**

### **Option A : Via phpMyAdmin (Recommandé)**
1. **Ouvrez** phpMyAdmin dans votre navigateur
2. **Sélectionnez** votre base de données `salon_coiffure`
3. **Cliquez** sur l'onglet "SQL"
4. **Copiez-collez** le contenu du fichier `creer-admin-simple.sql`
5. **Cliquez** sur "Exécuter"

### **Option B : Via MySQL Workbench**
1. **Ouvrez** MySQL Workbench
2. **Connectez-vous** à votre base de données
3. **Ouvrez** le fichier `creer-admin-simple.sql`
4. **Exécutez** le script

## 🔐 **IDENTIFIANTS ADMIN**

Une fois le script exécuté, utilisez :

- **Email** : `admin@tessa.fr`
- **Mot de passe** : `password`
- **URL** : http://localhost:5173/admin

## 🎯 **TEST DE CONNEXION**

1. **Ouvrez** http://localhost:5173/admin
2. **Entrez** les identifiants ci-dessus
3. **Cliquez** sur "Se connecter"

## 🎉 **INTERFACE ADMIN DISPONIBLE**

Une fois connecté, vous aurez accès à :

- ✅ **Dashboard** - Statistiques en temps réel
- ✅ **Réservations** - Gestion des RDV avec votre base de données
- ✅ **Services** - Prix, durées, statuts
- ✅ **Employés** - Gestion de l'équipe
- ✅ **Clients** - Base de données clients
- ✅ **Rapports** - Statistiques détaillées
- ✅ **Paramètres** - Configuration salon

## 🆘 **SI PROBLÈME**

### **Les serveurs ne démarrent pas ?**
```bash
# Redémarrez manuellement :
cd backend && npm run dev
cd .. && npm run dev
```

### **Erreur de connexion ?**
- Vérifiez que MySQL est démarré
- Vérifiez que la base de données `salon_coiffure` existe
- Exécutez le script SQL `creer-admin-simple.sql`

### **Erreur 401/429 ?**
- Attendez 15 minutes (rate limiting)
- Ou exécutez le script SQL pour créer un nouvel admin

---

**🎯 Votre interface admin TESSA COIFFURE sera opérationnelle en 2 minutes !**

