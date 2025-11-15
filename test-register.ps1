# Test spécifique de la page d'inscription
Write-Host "=== Test Page d'Inscription TESSA COIFFURE ===" -ForegroundColor Magenta

# Test 1: Vérifier si le frontend répond
Write-Host "`n1. Test du frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend erreur: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Frontend inaccessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Test de la page d'inscription
Write-Host "`n2. Test de la page d'inscription..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173/register" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Page d'inscription accessible" -ForegroundColor Green
        
        # Vérifier le contenu HTML
        if ($response.Content -match "Inscription|Register|Créez votre compte") {
            Write-Host "✅ Contenu de la page d'inscription détecté" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Contenu de la page d'inscription non détecté" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Page d'inscription erreur: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Page d'inscription inaccessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test du backend
Write-Host "`n3. Test du backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend erreur: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Backend inaccessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test de l'API d'inscription
Write-Host "`n4. Test de l'API d'inscription..." -ForegroundColor Yellow
try {
    $body = @{
        email = "test@example.com"
        password = "password123"
        first_name = "Test"
        last_name = "User"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10
    
    if ($response.StatusCode -eq 201) {
        Write-Host "✅ API d'inscription fonctionne" -ForegroundColor Green
        Write-Host "Réponse: $($response.Content)" -ForegroundColor Gray
    } elseif ($response.StatusCode -eq 409) {
        Write-Host "⚠️ API d'inscription: Utilisateur existe déjà (normal)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ API d'inscription erreur: $($response.StatusCode)" -ForegroundColor Red
        Write-Host "Réponse: $($response.Content)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ API d'inscription inaccessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Test de l'API générale
Write-Host "`n5. Test de l'API générale..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ API générale accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ API générale erreur: $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ API générale inaccessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📊 Résumé:" -ForegroundColor Cyan
Write-Host "=========" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Page d'inscription: http://localhost:5173/register" -ForegroundColor White
Write-Host "Backend: http://localhost:3000" -ForegroundColor White
Write-Host "API: http://localhost:3000/api" -ForegroundColor White

Write-Host "`n💡 Instructions de débogage:" -ForegroundColor Yellow
Write-Host "1. Ouvrez http://localhost:5173/register dans votre navigateur" -ForegroundColor White
Write-Host "2. Ouvrez les outils de développement (F12)" -ForegroundColor White
Write-Host "3. Regardez l'onglet Console pour les erreurs JavaScript" -ForegroundColor White
Write-Host "4. Regardez l'onglet Network pour les requêtes API" -ForegroundColor White
Write-Host "5. Testez l'inscription avec des données valides" -ForegroundColor White

Write-Host "`n🎯 Test terminé !" -ForegroundColor Green