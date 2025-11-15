# Script de test de connexion Backend-Frontend
# TESSA COIFFURE

Write-Host "🔗 Test de connexion Backend-Frontend TESSA COIFFURE" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Variables
$BACKEND_URL = "http://localhost:3000"
$FRONTEND_URL = "http://localhost:5173"
$API_URL = "$BACKEND_URL/api"

Write-Host "`n📋 Configuration:" -ForegroundColor Yellow
Write-Host "Backend URL: $BACKEND_URL"
Write-Host "Frontend URL: $FRONTEND_URL"
Write-Host "API URL: $API_URL"

# Fonction pour tester une URL
function Test-URL {
    param($Url, $Name)
    
    try {
        Write-Host "`n🔍 Test de $Name..." -ForegroundColor Blue
        $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 10 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $Name : OK (Status: $($response.StatusCode))" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $Name : Erreur (Status: $($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ $Name : Impossible de se connecter" -ForegroundColor Red
        Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Fonction pour tester l'API
function Test-API {
    param($ApiUrl, $Endpoint, $Name)
    
    try {
        Write-Host "`n🔍 Test de l'API $Name..." -ForegroundColor Blue
        $response = Invoke-WebRequest -Uri "$ApiUrl$Endpoint" -Method GET -TimeoutSec 10 -ErrorAction Stop
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ API $Name : OK (Status: $($response.StatusCode))" -ForegroundColor Green
            $json = $response.Content | ConvertFrom-Json
            Write-Host "   Réponse: $($json | ConvertTo-Json -Compress)" -ForegroundColor Gray
            return $true
        } else {
            Write-Host "❌ API $Name : Erreur (Status: $($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ API $Name : Impossible de se connecter" -ForegroundColor Red
        Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Tests
Write-Host "`n🚀 Démarrage des tests..." -ForegroundColor Magenta

$backendOK = Test-URL -Url $BACKEND_URL -Name "Backend"
$healthOK = Test-URL -Url "$BACKEND_URL/health" -Name "Health Check"
$apiOK = Test-URL -Url $API_URL -Name "API Root"
$docsOK = Test-URL -Url "$BACKEND_URL/api/docs" -Name "API Documentation"

# Tests API spécifiques
$servicesOK = Test-API -ApiUrl $API_URL -Endpoint "/services" -Name "Services"
$authOK = Test-API -ApiUrl $API_URL -Endpoint "/auth" -Name "Auth"

# Résumé
Write-Host "`n📊 Résumé des tests:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

if ($backendOK) {
    Write-Host "✅ Backend : Opérationnel" -ForegroundColor Green
} else {
    Write-Host "❌ Backend : Non accessible" -ForegroundColor Red
}

if ($healthOK) {
    Write-Host "✅ Health Check : OK" -ForegroundColor Green
} else {
    Write-Host "❌ Health Check : Échec" -ForegroundColor Red
}

if ($apiOK) {
    Write-Host "✅ API : Accessible" -ForegroundColor Green
} else {
    Write-Host "❌ API : Non accessible" -ForegroundColor Red
}

if ($docsOK) {
    Write-Host "✅ Documentation : Disponible" -ForegroundColor Green
} else {
    Write-Host "❌ Documentation : Non accessible" -ForegroundColor Red
}

if ($servicesOK) {
    Write-Host "✅ Services API : Fonctionnel" -ForegroundColor Green
} else {
    Write-Host "❌ Services API : Problème" -ForegroundColor Red
}

# Instructions
Write-Host "`n📝 Instructions:" -ForegroundColor Yellow
Write-Host "==============" -ForegroundColor Yellow

if (-not $backendOK) {
    Write-Host "1. Assurez-vous que le backend est démarré:" -ForegroundColor White
    Write-Host "   cd backend" -ForegroundColor Gray
    Write-Host "   npm run dev" -ForegroundColor Gray
}

Write-Host "`n2. Pour démarrer le frontend:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray

Write-Host "`n3. URLs importantes:" -ForegroundColor White
Write-Host "   - Backend: $BACKEND_URL" -ForegroundColor Gray
Write-Host "   - Frontend: $FRONTEND_URL" -ForegroundColor Gray
Write-Host "   - API Docs: $BACKEND_URL/api/docs" -ForegroundColor Gray
Write-Host "   - Health: $BACKEND_URL/health" -ForegroundColor Gray

Write-Host "`n🎯 Connexion Backend-Frontend configurée pour TESSA COIFFURE!" -ForegroundColor Green

