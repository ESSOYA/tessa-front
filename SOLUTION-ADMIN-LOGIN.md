# 🔧 SOLUTION PROBLÈME CONNEXION ADMIN

## 🚨 **Problèmes Identifiés**
- ❌ 401 Unauthorized - Email/mot de passe incorrect
- ❌ 429 Too Many Requests - Trop de tentatives
- ❌ Backend/Frontend pas démarrés
- ❌ Identifiants admin incorrects

## ✅ **SOLUTION RAPIDE**

### **Étape 1 : Démarrer l'Application**
```bash
# Double-cliquez sur ce fichier :
demarrer-application.bat
```

### **Étape 2 : Corriger les Identifiants Admin**
1. **Ouvrez** votre gestionnaire MySQL (phpMyAdmin, MySQL Workbench, etc.)
2. **Exécutez** le script `fix-admin-credentials.sql`
3. **Vérifiez** que l'admin a été créé

### **Étape 3 : Identifiants Admin Corrigés**
- **Email** : `admin@tessa.fr`
- **Mot de passe** : `password`
- **URL Admin** : http://localhost:5173/admin

## 🔐 **Identifiants Alternatifs**

Si le premier ne fonctionne pas, essayez :

### **Option 1 :**
- **Email** : `admin@tessa-coiffure.com`
- **Mot de passe** : `password`

### **Option 2 :**
- **Email** : `admin@hairflow.com`
- **Mot de passe** : `password`

### **Option 3 :**
- **Email** : `test@example.com`
- **Mot de passe** : `password`

## 🛠️ **Si Toujours des Problèmes**

### **Réinitialiser le Rate Limiting**
```sql
-- Nettoyer les tentatives de connexion
DELETE FROM rate_limit_attempts WHERE ip_address = 'votre_ip';
```

### **Créer un Admin Manuellement**
```sql
INSERT INTO users (role_id, email, password_hash, first_name, last_name, phone, is_active, created_at, updated_at) 
VALUES (1, 'admin@tessa.fr', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'TESSA', '01 23 45 67 89', 1, NOW(), NOW());
```

## 🎯 **Interface Admin Complète**

Une fois connecté, vous aurez accès à :

- ✅ **Dashboard** - Statistiques en temps réel
- ✅ **Réservations** - Gestion des RDV
- ✅ **Services** - Prix et durées
- ✅ **Employés** - Gestion de l'équipe
- ✅ **Clients** - Base de données clients
- ✅ **Rapports** - Statistiques détaillées
- ✅ **Paramètres** - Configuration salon

## 🚀 **Démarrage Rapide**

1. **Double-cliquez** sur `demarrer-application.bat`
2. **Attendez** que les deux serveurs démarrent
3. **Ouvrez** http://localhost:5173/admin
4. **Connectez-vous** avec `admin@tessa.fr` / `password`

---

**🎉 Votre interface admin TESSA COIFFURE sera opérationnelle !**

