# Test simple de la page d'inscription
Write-Host "Test page d'inscription TESSA COIFFURE" -ForegroundColor Green

# Test frontend
Write-Host "Test frontend..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173/register" -Method GET -TimeoutSec 5
    Write-Host "Frontend OK: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Frontend KO: $($_.Exception.Message)" -ForegroundColor Red
}

# Test backend
Write-Host "Test backend..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 5
    Write-Host "Backend OK: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Backend KO: $($_.Exception.Message)" -ForegroundColor Red
}

# Test API inscription
Write-Host "Test API inscription..." -ForegroundColor Blue
try {
    $body = '{"email":"test@example.com","password":"password123","first_name":"Test","last_name":"User"}'
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10
    Write-Host "API inscription OK: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "API inscription KO: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Test terminé !" -ForegroundColor Green

