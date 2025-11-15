Write-Host "=== CRÉATION DE L'UTILISATEUR ADMIN TESSA COIFFURE ===" -ForegroundColor Green

# Vérifier que MySQL est accessible
Write-Host "Vérification de la connexion MySQL..." -ForegroundColor Yellow

# Lire les variables d'environnement
$envFile = "backend\.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

$dbHost = if ($env:DB_HOST) { $env:DB_HOST } else { "localhost" }
$dbUser = if ($env:DB_USER) { $env:DB_USER } else { "root" }
$dbPassword = if ($env:DB_PASSWORD) { $env:DB_PASSWORD } else { "" }
$dbName = if ($env:DB_NAME) { $env:DB_NAME } else { "salon_coiffure" }

Write-Host "Configuration de la base de données:" -ForegroundColor Cyan
Write-Host "  Host: $dbHost" -ForegroundColor White
Write-Host "  User: $dbUser" -ForegroundColor White
Write-Host "  Database: $dbName" -ForegroundColor White

try {
    # Exécuter le script SQL pour créer l'utilisateur admin
    Write-Host "`nExécution du script SQL..." -ForegroundColor Yellow
    
    $sqlFile = "backend\database\create-admin-user.sql"
    if (Test-Path $sqlFile) {
        $mysqlCommand = "mysql -h $dbHost -u $dbUser"
        if ($dbPassword) {
            $mysqlCommand += " -p$dbPassword"
        }
        $mysqlCommand += " $dbName < `"$sqlFile`""
        
        Write-Host "Commande MySQL: $mysqlCommand" -ForegroundColor Gray
        
        # Exécuter la commande
        Invoke-Expression $mysqlCommand
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✅ Utilisateur admin créé avec succès !" -ForegroundColor Green
            Write-Host "`n=== IDENTIFIANTS DE CONNEXION ADMIN ===" -ForegroundColor Yellow
            Write-Host "📧 Email: admin@tessa-coiffure.com" -ForegroundColor White
            Write-Host "🔑 Mot de passe: password" -ForegroundColor White
            Write-Host "👤 Nom: Admin TESSA COIFFURE" -ForegroundColor White
            Write-Host "🔐 Rôle: Administrateur" -ForegroundColor White
            Write-Host "`n🌐 URL de connexion admin: http://localhost:8080/admin/login" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Erreur lors de la creation de l'utilisateur admin" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Fichier SQL non trouvé: $sqlFile" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nVérifiez que MySQL est démarré et que les paramètres de connexion sont corrects." -ForegroundColor Yellow
}

Write-Host "`n=== INSTRUCTIONS ===" -ForegroundColor Green
Write-Host "1. Démarrez le backend: cd backend && node src/server.js" -ForegroundColor White
Write-Host "2. Démarrez le frontend: npm run dev" -ForegroundColor White
Write-Host "3. Allez sur: http://localhost:8080/admin/login" -ForegroundColor White
Write-Host "4. Connectez-vous avec les identifiants ci-dessus" -ForegroundColor White
