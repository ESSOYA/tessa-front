# Script PowerShell pour démarrer le frontend
Write-Host "Démarrage du frontend TESSA COIFFURE..." -ForegroundColor Green

# Vérifier si nous sommes dans le bon répertoire
if (Test-Path "package.json") {
    Write-Host "✓ package.json trouvé" -ForegroundColor Green
    
    # Installer les dépendances si nécessaire
    Write-Host "Installation des dépendances..." -ForegroundColor Yellow
    npm install
    
    # Démarrer le serveur de développement
    Write-Host "Démarrage du serveur de développement..." -ForegroundColor Yellow
    npm run dev
} else {
    Write-Host "❌ Erreur: package.json non trouvé" -ForegroundColor Red
    Write-Host "Assurez-vous d'être dans le répertoire style-schedules-pro-main" -ForegroundColor Red
}

