# Vérification de l'état de l'application TESSA COIFFURE
Write-Host "🔍 Vérification de l'état de l'application TESSA COIFFURE" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

# Test 1: Frontend
Write-Host "`n1. Test du Frontend (http://localhost:5173)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend inaccessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Page d'inscription
Write-Host "`n2. Test de la page d'inscription (http://localhost:5173/register)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173/register" -Method GET -TimeoutSec 5
    Write-Host "✅ Page d'inscription accessible (Status: $($response.StatusCode))" -ForegroundColor Green
    
    # Vérifier le contenu
    if ($response.Content -match "Inscription|Register") {
        Write-Host "✅ Contenu de la page d'inscription détecté" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Contenu de la page d'inscription non détecté" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Page d'inscription inaccessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Backend
Write-Host "`n3. Test du Backend (http://localhost:3000)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend inaccessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: API
Write-Host "`n4. Test de l'API (http://localhost:3000/api)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api" -Method GET -TimeoutSec 5
    Write-Host "✅ API accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ API inaccessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: API d'inscription
Write-Host "`n5. Test de l'API d'inscription..." -ForegroundColor Yellow
try {
    $body = '{"email":"test@example.com","password":"password123","first_name":"Test","last_name":"User"}'
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10
    
    if ($response.StatusCode -eq 201) {
        Write-Host "✅ API d'inscription fonctionne (Status: $($response.StatusCode))" -ForegroundColor Green
    } elseif ($response.StatusCode -eq 409) {
        Write-Host "⚠️ API d'inscription: Utilisateur existe déjà (Status: $($response.StatusCode))" -ForegroundColor Yellow
    } else {
        Write-Host "❌ API d'inscription erreur (Status: $($response.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ API d'inscription inaccessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Ports utilisés
Write-Host "`n6. Vérification des ports..." -ForegroundColor Yellow
$port5173 = netstat -an | findstr ":5173"
$port3000 = netstat -an | findstr ":3000"

if ($port5173) {
    Write-Host "✅ Port 5173 (Frontend) utilisé" -ForegroundColor Green
} else {
    Write-Host "❌ Port 5173 (Frontend) non utilisé" -ForegroundColor Red
}

if ($port3000) {
    Write-Host "✅ Port 3000 (Backend) utilisé" -ForegroundColor Green
} else {
    Write-Host "❌ Port 3000 (Backend) non utilisé" -ForegroundColor Red
}

Write-Host "`n📊 Résumé:" -ForegroundColor Cyan
Write-Host "=========" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Page d'inscription: http://localhost:5173/register" -ForegroundColor White
Write-Host "Backend: http://localhost:3000" -ForegroundColor White
Write-Host "API: http://localhost:3000/api" -ForegroundColor White

Write-Host "`n💡 Instructions:" -ForegroundColor Yellow
Write-Host "1. Ouvrez http://localhost:5173/register dans votre navigateur" -ForegroundColor White
Write-Host "2. Appuyez sur F12 pour ouvrir les outils de développement" -ForegroundColor White
Write-Host "3. Regardez l'onglet Console pour les erreurs" -ForegroundColor White
Write-Host "4. Regardez l'onglet Network pour les requêtes" -ForegroundColor White
Write-Host "5. Testez le formulaire d'inscription" -ForegroundColor White

Write-Host "`n🎯 Vérification terminée !" -ForegroundColor Green

