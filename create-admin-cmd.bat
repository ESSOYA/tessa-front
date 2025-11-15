@echo off
echo === CREATION DE L'UTILISATEUR ADMIN TESSA COIFFURE ===

REM Configuration de la base de données
set DB_HOST=localhost
set DB_USER=root
set DB_PASSWORD=
set DB_NAME=salon_coiffure

echo Configuration de la base de données:
echo   Host: %DB_HOST%
echo   User: %DB_USER%
echo   Database: %DB_NAME%

echo.
echo Creation de l'utilisateur admin...

REM Créer le fichier SQL
echo INSERT IGNORE INTO roles (name, description) VALUES ('admin', 'Administrateur du salon'); > temp-admin.sql
echo. >> temp-admin.sql
echo INSERT INTO users (email, password, first_name, last_name, phone, role_id, is_active, created_at, updated_at) >> temp-admin.sql
echo VALUES ('admin@tessa-coiffure.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'TESSA COIFFURE', '01 23 45 67 89', (SELECT id FROM roles WHERE name = 'admin'), 1, NOW(), NOW()); >> temp-admin.sql
echo. >> temp-admin.sql
echo INSERT INTO employees (user_id, first_name, last_name, email, phone, specializations, is_active, created_at, updated_at) >> temp-admin.sql
echo VALUES ((SELECT id FROM users WHERE email = 'admin@tessa-coiffure.com'), 'Admin', 'TESSA COIFFURE', 'admin@tessa-coiffure.com', '01 23 45 67 89', '["Administration", "Gestion"]', 1, NOW(), NOW()); >> temp-admin.sql

REM Exécuter le fichier SQL
if "%DB_PASSWORD%"=="" (
    mysql -h %DB_HOST% -u %DB_USER% %DB_NAME% < temp-admin.sql
) else (
    mysql -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% < temp-admin.sql
)

if %ERRORLEVEL%==0 (
    echo.
    echo ✅ Utilisateur admin créé avec succès !
    echo.
    echo === IDENTIFIANTS DE CONNEXION ADMIN ===
    echo 📧 Email: admin@tessa-coiffure.com
    echo 🔑 Mot de passe: password
    echo 👤 Nom: Admin TESSA COIFFURE
    echo 🔐 Rôle: Administrateur
    echo.
    echo 🌐 URL de connexion admin: http://localhost:8080/admin/login
) else (
    echo.
    echo ❌ Erreur lors de la creation de l'utilisateur admin
    echo Code de sortie: %ERRORLEVEL%
)

REM Nettoyer le fichier temporaire
if exist temp-admin.sql del temp-admin.sql

echo.
echo === INSTRUCTIONS ===
echo 1. Démarrez le backend: cd backend && node src/server.js
echo 2. Démarrez le frontend: npm run dev
echo 3. Allez sur: http://localhost:8080/admin/login
echo 4. Connectez-vous avec les identifiants ci-dessus

pause


