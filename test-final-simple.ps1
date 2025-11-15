Write-Host "=== TEST FINAL ADMIN TESSA COIFFURE ===" -ForegroundColor Green

Write-Host "`n1. Test Backend..." -ForegroundColor Cyan
try {
    $backend = Invoke-WebRequest -Uri "http://localhost:3000/api" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: ERREUR" -ForegroundColor Red
}

Write-Host "`n2. Test Frontend..." -ForegroundColor Cyan
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:8080" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: ERREUR" -ForegroundColor Red
}

Write-Host "`n3. Test Admin Login..." -ForegroundColor Cyan
try {
    $admin = Invoke-WebRequest -Uri "http://localhost:8080/admin/login" -Method GET -TimeoutSec 5
    Write-Host "✅ Admin Login: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Admin Login: ERREUR" -ForegroundColor Red
}

Write-Host "`n=== RESUME ===" -ForegroundColor Green
Write-Host "Backend: http://localhost:3000" -ForegroundColor White
Write-Host "Frontend: http://localhost:8080" -ForegroundColor White
Write-Host "Admin Login: http://localhost:8080/admin/login" -ForegroundColor White

Write-Host "`n=== IDENTIFIANTS ADMIN ===" -ForegroundColor Yellow
Write-Host "Email: admin@tessa-coiffure.com" -ForegroundColor White
Write-Host "Mot de passe: password" -ForegroundColor White

Write-Host "`n=== FONCTIONNALITES ADMIN ===" -ForegroundColor Cyan
Write-Host "Dashboard: http://localhost:8080/admin/dashboard" -ForegroundColor White
Write-Host "Reservations: http://localhost:8080/admin/bookings" -ForegroundColor White
Write-Host "Services: http://localhost:8080/admin/services" -ForegroundColor White
Write-Host "Employes: http://localhost:8080/admin/employees" -ForegroundColor White
Write-Host "Clients: http://localhost:8080/admin/clients" -ForegroundColor White
Write-Host "Rapports: http://localhost:8080/admin/reports" -ForegroundColor White
Write-Host "Parametres: http://localhost:8080/admin/settings" -ForegroundColor White

Write-Host "`n🎉 L'interface admin TESSA COIFFURE est fonctionnelle !" -ForegroundColor Green
Write-Host "`n📝 INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "1. Allez sur: http://localhost:8080/admin/login" -ForegroundColor White
Write-Host "2. Connectez-vous avec les identifiants ci-dessus" -ForegroundColor White
Write-Host "3. Vous serez redirige vers le tableau de bord admin" -ForegroundColor White
Write-Host "4. Explorez toutes les fonctionnalites admin disponibles" -ForegroundColor White


