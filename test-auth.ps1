# Script de test pour l'authentification
Write-Host "Test d'authentification..." -ForegroundColor Green

# Test 1: Inscription
Write-Host "`n1. Test d'inscription:" -ForegroundColor Yellow
$headers = @{
    'Content-Type' = 'application/json'
}
$body = @{
    email = "test@example.com"
    password = "password123"
    first_name = "Test"
    last_name = "User"
    phone = "0123456789"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -Headers $headers -Body $body
    Write-Host "Inscription Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Erreur inscription: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

# Test 2: Connexion
Write-Host "`n2. Test de connexion:" -ForegroundColor Yellow
$loginBody = @{
    email = "admin@salon.test"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Headers $headers -Body $loginBody
    Write-Host "Connexion Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor White
} catch {
    Write-Host "Erreur connexion: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`nTest termine!" -ForegroundColor Green

