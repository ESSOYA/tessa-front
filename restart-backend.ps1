Write-Host "Redémarrage du backend avec le nouveau nom TESSA COIFFURE..." -ForegroundColor Green

# Arrêter les processus Node.js existants
Write-Host "Arrêt des processus Node.js existants..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Attendre un peu
Start-Sleep -Seconds 2

# Aller dans le répertoire backend
Set-Location "backend"

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erreur: package.json non trouvé dans $(Get-Location)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Répertoire backend trouvé" -ForegroundColor Green

# Démarrer le serveur
Write-Host "Démarrage du serveur avec le nouveau nom..." -ForegroundColor Green
node src/server.js


