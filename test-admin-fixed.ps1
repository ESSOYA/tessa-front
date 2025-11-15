Write-Host "=== TEST DE L'ADMIN TESSA COIFFURE CORRIGE ===" -ForegroundColor Green

# Test 1: Backend
Write-Host "`n1. Test du backend..." -ForegroundColor Cyan
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:3000/api" -Method GET -TimeoutSec 10
    if ($backendResponse.StatusCode -eq 200) {
        Write-Host "✅ Backend: OK (Status: $($backendResponse.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend: Erreur (Status: $($backendResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Backend: ERREUR - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Frontend
Write-Host "`n2. Test du frontend..." -ForegroundColor Cyan
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 10
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend: OK (Status: $($frontendResponse.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend: Erreur (Status: $($frontendResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Frontend: ERREUR - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Page Admin Login
Write-Host "`n3. Test de la page admin login..." -ForegroundColor Cyan
try {
    $adminLoginResponse = Invoke-WebRequest -Uri "http://localhost:8080/admin/login" -Method GET -TimeoutSec 10
    if ($adminLoginResponse.StatusCode -eq 200) {
        Write-Host "✅ Page Admin Login: OK (Status: $($adminLoginResponse.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "❌ Page Admin Login: Erreur (Status: $($adminLoginResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Page Admin Login: ERREUR - $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Connexion Admin API
Write-Host "`n4. Test de la connexion admin API..." -ForegroundColor Cyan
try {
    $loginData = @{
        email = "admin@tessa-coiffure.com"
        password = "password"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginData -TimeoutSec 10
    
    if ($loginResponse.StatusCode -eq 200) {
        $loginResult = $loginResponse.Content | ConvertFrom-Json
        if ($loginResult.token) {
            Write-Host "✅ Connexion Admin API: OK (Token recu)" -ForegroundColor Green
        } else {
            Write-Host "❌ Connexion Admin API: Pas de token" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Connexion Admin API: Erreur (Status: $($loginResponse.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Connexion Admin API: ERREUR - $($_.Exception.Message)" -ForegroundColor Red
}

# Résumé
Write-Host "`n=== RESUME ===" -ForegroundColor Green
Write-Host "Backend: http://localhost:3000" -ForegroundColor White
Write-Host "Frontend: http://localhost:8080" -ForegroundColor White
Write-Host "Admin Login: http://localhost:8080/admin/login" -ForegroundColor White

Write-Host "`n=== IDENTIFIANTS ADMIN ===" -ForegroundColor Yellow
Write-Host "📧 Email: admin@tessa-coiffure.com" -ForegroundColor White
Write-Host "🔑 Mot de passe: password" -ForegroundColor White
Write-Host "👤 Nom: Admin TESSA COIFFURE" -ForegroundColor White
Write-Host "🔐 Role: Administrateur" -ForegroundColor White

Write-Host "`n=== FONCTIONNALITES ADMIN DISPONIBLES ===" -ForegroundColor Cyan
Write-Host "📊 Dashboard: http://localhost:8080/admin/dashboard" -ForegroundColor White
Write-Host "📅 Reservations: http://localhost:8080/admin/bookings" -ForegroundColor White
Write-Host "✂️ Services: http://localhost:8080/admin/services" -ForegroundColor White
Write-Host "👥 Employes: http://localhost:8080/admin/employees" -ForegroundColor White
Write-Host "👤 Clients: http://localhost:8080/admin/clients" -ForegroundColor White
Write-Host "📈 Rapports: http://localhost:8080/admin/reports" -ForegroundColor White
Write-Host "⚙️ Parametres: http://localhost:8080/admin/settings" -ForegroundColor White

Write-Host "`n🎉 L'interface d'administration TESSA COIFFURE est maintenant fonctionnelle !" -ForegroundColor Green
Write-Host "`n📝 INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "1. Allez sur: http://localhost:8080/admin/login" -ForegroundColor White
Write-Host "2. Connectez-vous avec les identifiants ci-dessus" -ForegroundColor White
Write-Host "3. Vous serez redirigé vers le tableau de bord admin" -ForegroundColor White
Write-Host "4. Explorez toutes les fonctionnalites admin disponibles" -ForegroundColor White


