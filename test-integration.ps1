# Script de test pour l'integration frontend-backend
Write-Host "Test d'integration Frontend-Backend..." -ForegroundColor Green

# Test 1: Backend Health
Write-Host "`n1. Test Backend Health:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET
    Write-Host "Backend Status: $($response.StatusCode)" -ForegroundColor Green
    $health = $response.Content | ConvertFrom-Json
    Write-Host "Uptime: $($health.uptime) seconds" -ForegroundColor White
} catch {
    Write-Host "Backend non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Backend Services
Write-Host "`n2. Test Backend Services:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/services" -Method GET
    Write-Host "Services Status: $($response.StatusCode)" -ForegroundColor Green
    $services = $response.Content | ConvertFrom-Json
    Write-Host "Nombre de services: $($services.services.Count)" -ForegroundColor White
    foreach ($service in $services.services) {
        Write-Host "  - $($service.name): $($service.price)€" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Erreur services: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Frontend Health
Write-Host "`n3. Test Frontend Health:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET
    Write-Host "Frontend Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Frontend non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: CORS Test
Write-Host "`n4. Test CORS:" -ForegroundColor Yellow
try {
    $headers = @{
        'Origin' = 'http://localhost:5173'
        'Access-Control-Request-Method' = 'GET'
        'Access-Control-Request-Headers' = 'Content-Type'
    }
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/services" -Method OPTIONS -Headers $headers
    Write-Host "CORS Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "CORS Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest d'integration termine!" -ForegroundColor Green
Write-Host "`nURLs disponibles:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend: http://localhost:3000" -ForegroundColor White
Write-Host "  API Docs: http://localhost:3000/api/docs" -ForegroundColor White

