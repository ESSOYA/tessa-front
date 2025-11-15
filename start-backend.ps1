# Script de démarrage du backend
Write-Host "Démarrage du backend..." -ForegroundColor Green

# Aller dans le répertoire backend
Set-Location "backend"

# Vérifier que nous sommes dans le bon répertoire
Write-Host "Répertoire actuel: $(Get-Location)" -ForegroundColor Yellow

# Vérifier que package.json existe
if (Test-Path "package.json") {
    Write-Host "✅ package.json trouvé" -ForegroundColor Green
} else {
    Write-Host "❌ package.json non trouvé" -ForegroundColor Red
    exit 1
}

# Vérifier que src/server.js existe
if (Test-Path "src/server.js") {
    Write-Host "✅ server.js trouvé" -ForegroundColor Green
} else {
    Write-Host "❌ server.js non trouvé" -ForegroundColor Red
    exit 1
}

# Démarrer le serveur
Write-Host "Démarrage du serveur..." -ForegroundColor Yellow
try {
    node src/server.js
} catch {
    Write-Host "❌ Erreur lors du démarrage: $($_.Exception.Message)" -ForegroundColor Red
}
