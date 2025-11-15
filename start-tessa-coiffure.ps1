# Script de démarrage TESSA COIFFURE
# Démarre le backend et le frontend

Write-Host "💇‍♀️ TESSA COIFFURE - Démarrage de l'application" -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor Magenta

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Vérifier si npm est installé
try {
    $npmVersion = npm --version
    Write-Host "✅ npm détecté: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm n'est pas installé" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔧 Configuration des variables d'environnement..." -ForegroundColor Yellow

# Créer le fichier .env pour le frontend s'il n'existe pas
if (-not (Test-Path ".env")) {
    Write-Host "📝 Création du fichier .env pour le frontend..." -ForegroundColor Blue
    @"
# Configuration API Backend
VITE_API_URL=http://localhost:3000/api

# Configuration de l'application
VITE_APP_NAME=TESSA COIFFURE
VITE_APP_VERSION=1.0.0
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Fichier .env créé" -ForegroundColor Green
} else {
    Write-Host "✅ Fichier .env existe déjà" -ForegroundColor Green
}

# Créer le fichier .env pour le backend s'il n'existe pas
if (-not (Test-Path "backend/.env")) {
    Write-Host "📝 Création du fichier .env pour le backend..." -ForegroundColor Blue
    @"
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
"@ | Out-File -FilePath "backend/.env" -Encoding UTF8
    Write-Host "✅ Fichier .env backend créé" -ForegroundColor Green
} else {
    Write-Host "✅ Fichier .env backend existe déjà" -ForegroundColor Green
}

Write-Host "`n📦 Installation des dépendances..." -ForegroundColor Yellow

# Installer les dépendances du frontend
Write-Host "🔍 Installation des dépendances frontend..." -ForegroundColor Blue
try {
    npm install
    Write-Host "✅ Dépendances frontend installées" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de l'installation des dépendances frontend" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# Installer les dépendances du backend
Write-Host "🔍 Installation des dépendances backend..." -ForegroundColor Blue
try {
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "✅ Dépendances backend installées" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de l'installation des dépendances backend" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Set-Location ..
}

Write-Host "`n🚀 Démarrage des services..." -ForegroundColor Yellow

# Démarrer le backend en arrière-plan
Write-Host "🔧 Démarrage du backend..." -ForegroundColor Blue
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\backend
    npm run dev
}

# Attendre un peu que le backend démarre
Write-Host "⏳ Attente du démarrage du backend..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Vérifier si le backend est démarré
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend démarré avec succès" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Backend en cours de démarrage..." -ForegroundColor Yellow
}

# Démarrer le frontend
Write-Host "🎨 Démarrage du frontend..." -ForegroundColor Blue
Write-Host "`n🌐 L'application sera accessible sur:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend: http://localhost:3000" -ForegroundColor White
Write-Host "   API Docs: http://localhost:3000/api/docs" -ForegroundColor White
Write-Host "   Health: http://localhost:3000/health" -ForegroundColor White

Write-Host "`n💡 Pour arrêter l'application, utilisez Ctrl+C" -ForegroundColor Yellow
Write-Host "💡 Pour tester la connexion, exécutez: .\test-connection.ps1" -ForegroundColor Yellow

# Démarrer le frontend (bloquant)
npm run dev

