Write-Host "Test de l'API depuis le frontend..." -ForegroundColor Green

# Test de l'API des services depuis le frontend
$headers = @{
    'Content-Type' = 'application/json'
    'Origin' = 'http://localhost:8080'
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/services" -Method GET -Headers $headers
    Write-Host "API accessible depuis le frontend - Status: $($response.StatusCode)" -ForegroundColor Green
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "Services retournes: $($data.services.Count)" -ForegroundColor Yellow
    
} catch {
    Write-Host "Erreur API: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest CORS..." -ForegroundColor Green
try {
    $corsResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/services" -Method OPTIONS -Headers $headers
    Write-Host "CORS OK - Status: $($corsResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Erreur CORS: $($_.Exception.Message)" -ForegroundColor Red
}

