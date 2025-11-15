# Test de l'API des services
Write-Host "Test de l'API des services..." -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/services" -Method GET
    Write-Host "✅ Backend accessible - Status: $($response.StatusCode)" -ForegroundColor Green
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "📊 Nombre de services: $($data.services.Count)" -ForegroundColor Yellow
    
    foreach ($service in $data.services) {
        Write-Host "  - $($service.name): $($service.price)€ ($($service.duration)min)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Erreur backend: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest de l'accès frontend..." -ForegroundColor Green
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET
    Write-Host "✅ Frontend accessible - Status: $($frontendResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur frontend: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Le frontend pourrait être sur un autre port (8080, 8081, etc.)" -ForegroundColor Yellow
}

