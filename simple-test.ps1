# Simple test de connexion
Write-Host "Test de connexion TESSA COIFFURE" -ForegroundColor Green

# Test backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 5
    Write-Host "Backend OK: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Backend KO: $($_.Exception.Message)" -ForegroundColor Red
}

# Test API
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api" -Method GET -TimeoutSec 5
    Write-Host "API OK: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "API KO: $($_.Exception.Message)" -ForegroundColor Red
}

