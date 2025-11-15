# Test détaillé de connexion
Write-Host "=== Test de connexion TESSA COIFFURE ===" -ForegroundColor Green

# Test 1: Vérifier si le port 3000 est ouvert
Write-Host "`n1. Vérification du port 3000..." -ForegroundColor Yellow
$port3000 = netstat -an | findstr ":3000"
if ($port3000) {
    Write-Host "✅ Port 3000 ouvert" -ForegroundColor Green
    Write-Host $port3000
} else {
    Write-Host "❌ Port 3000 fermé" -ForegroundColor Red
}

# Test 2: Test avec Invoke-WebRequest
Write-Host "`n2. Test avec Invoke-WebRequest..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend Health OK: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Réponse: $($response.Content)"
} catch {
    Write-Host "❌ Backend Health KO: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test API
Write-Host "`n3. Test API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api" -Method GET -TimeoutSec 5
    Write-Host "✅ API OK: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Réponse: $($response.Content)"
} catch {
    Write-Host "❌ API KO: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test avec Test-NetConnection
Write-Host "`n4. Test de connectivité..." -ForegroundColor Yellow
$connection = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet
if ($connection) {
    Write-Host "✅ Connexion TCP OK" -ForegroundColor Green
} else {
    Write-Host "❌ Connexion TCP KO" -ForegroundColor Red
}

Write-Host "`n=== Fin du test ===" -ForegroundColor Green

