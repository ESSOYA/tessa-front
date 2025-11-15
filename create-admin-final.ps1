Write-Host "=== CREATION DE L'UTILISATEUR ADMIN TESSA COIFFURE ===" -ForegroundColor Green

# Configuration de la base de données
$dbHost = "localhost"
$dbUser = "root"
$dbPassword = ""
$dbName = "salon_coiffure"

Write-Host "Configuration de la base de données:" -ForegroundColor Cyan
Write-Host "  Host: $dbHost" -ForegroundColor White
Write-Host "  User: $dbUser" -ForegroundColor White
Write-Host "  Database: $dbName" -ForegroundColor White

Write-Host "`nCreation de l'utilisateur admin..." -ForegroundColor Yellow

# Créer un fichier SQL temporaire
$sqlFile = "temp-admin.sql"
$sqlContent = @"
INSERT IGNORE INTO roles (name, description) VALUES ('admin', 'Administrateur du salon');

INSERT INTO users (email, password, first_name, last_name, phone, role_id, is_active, created_at, updated_at) 
VALUES ('admin@tessa-coiffure.com', '\$2b\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'TESSA COIFFURE', '01 23 45 67 89', (SELECT id FROM roles WHERE name = 'admin'), 1, NOW(), NOW());

INSERT INTO employees (user_id, first_name, last_name, email, phone, specializations, is_active, created_at, updated_at) 
VALUES ((SELECT id FROM users WHERE email = 'admin@tessa-coiffure.com'), 'Admin', 'TESSA COIFFURE', 'admin@tessa-coiffure.com', '01 23 45 67 89', '["Administration", "Gestion"]', 1, NOW(), NOW());
"@

$sqlContent | Out-File -FilePath $sqlFile -Encoding UTF8

try {
    # Exécuter le fichier SQL
    if ($dbPassword) {
        mysql -h $dbHost -u $dbUser -p$dbPassword $dbName < $sqlFile
    } else {
        mysql -h $dbHost -u $dbUser $dbName < $sqlFile
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Utilisateur admin créé avec succès !" -ForegroundColor Green
        Write-Host "`n=== IDENTIFIANTS DE CONNEXION ADMIN ===" -ForegroundColor Yellow
        Write-Host "📧 Email: admin@tessa-coiffure.com" -ForegroundColor White
        Write-Host "🔑 Mot de passe: password" -ForegroundColor White
        Write-Host "👤 Nom: Admin TESSA COIFFURE" -ForegroundColor White
        Write-Host "🔐 Rôle: Administrateur" -ForegroundColor White
        Write-Host "`n🌐 URL de connexion admin: http://localhost:8080/admin/login" -ForegroundColor Cyan
    } else {
        Write-Host "`n❌ Erreur lors de la creation de l'utilisateur admin" -ForegroundColor Red
        Write-Host "Code de sortie: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "`n❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Nettoyer le fichier temporaire
    if (Test-Path $sqlFile) {
        Remove-Item $sqlFile
    }
}

Write-Host "`n=== INSTRUCTIONS ===" -ForegroundColor Green
Write-Host "1. Démarrez le backend: cd backend && node src/server.js" -ForegroundColor White
Write-Host "2. Démarrez le frontend: npm run dev" -ForegroundColor White
Write-Host "3. Allez sur: http://localhost:8080/admin/login" -ForegroundColor White
Write-Host "4. Connectez-vous avec les identifiants ci-dessus" -ForegroundColor White


