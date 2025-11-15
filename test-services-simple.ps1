Write-Host "Test de l'API des services..." -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/services" -Method GET
    Write-Host "Backend accessible - Status: $($response.StatusCode)" -ForegroundColor Green
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "Nombre de services: $($data.services.Count)" -ForegroundColor Yellow
    
    foreach ($service in $data.services) {
        Write-Host "Service: $($service.name) - Prix: $($service.price) - Duree: $($service.duration)min" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Erreur backend: $($_.Exception.Message)" -ForegroundColor Red
}

