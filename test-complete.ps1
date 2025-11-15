Write-Host "=== TEST COMPLET DE L'APPLICATION ===" -ForegroundColor Green

Write-Host "`n1. Test du backend..." -ForegroundColor Yellow
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:3000/api" -Method GET
    Write-Host "✅ Backend: OK (Status: $($backendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: ERREUR - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Test de l'API des services..." -ForegroundColor Yellow
try {
    $servicesResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/services" -Method GET
    $servicesData = $servicesResponse.Content | ConvertFrom-Json
    Write-Host "✅ API Services: OK ($($servicesData.services.Count) services)" -ForegroundColor Green
} catch {
    Write-Host "❌ API Services: ERREUR - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Test du frontend..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET
    Write-Host "✅ Frontend: OK (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: ERREUR - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Test de la page des services..." -ForegroundColor Yellow
try {
    $servicesPageResponse = Invoke-WebRequest -Uri "http://localhost:8080/services" -Method GET
    Write-Host "✅ Page Services: OK (Status: $($servicesPageResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Page Services: ERREUR - $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== RÉSUMÉ ===" -ForegroundColor Green
Write-Host "Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Page Services: http://localhost:8080/services" -ForegroundColor Cyan
Write-Host "`nL'application devrait maintenant fonctionner correctement !" -ForegroundColor Green


