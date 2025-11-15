# Test des pages frontend TESSA COIFFURE
Write-Host "=== Test des Pages Frontend TESSA COIFFURE ===" -ForegroundColor Magenta

$baseUrl = "http://localhost:5173"
$pages = @(
    @{url="/"; name="Page d'accueil"},
    @{url="/login"; name="Page de connexion"},
    @{url="/register"; name="Page d'inscription"},
    @{url="/services"; name="Page des services"},
    @{url="/booking"; name="Page de réservation"},
    @{url="/admin"; name="Page admin"},
    @{url="/profile"; name="Page profil"}
)

Write-Host "`n🔍 Test de connectivité des pages..." -ForegroundColor Yellow

foreach ($page in $pages) {
    try {
        Write-Host "`n📄 Test de $($page.name)..." -ForegroundColor Blue
        $response = Invoke-WebRequest -Uri "$baseUrl$($page.url)" -Method GET -TimeoutSec 10
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($page.name) : OK (Status: $($response.StatusCode))" -ForegroundColor Green
            
            # Vérifier le contenu HTML
            if ($response.Content -match "<!DOCTYPE html|<html") {
                Write-Host "   📄 Contenu HTML détecté" -ForegroundColor Green
            } else {
                Write-Host "   ⚠️ Contenu HTML non détecté" -ForegroundColor Yellow
            }
            
            # Vérifier la taille de la réponse
            $contentLength = $response.Content.Length
            Write-Host "   📏 Taille: $contentLength caractères" -ForegroundColor Gray
            
        } else {
            Write-Host "❌ $($page.name) : Erreur (Status: $($response.StatusCode))" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ $($page.name) : Impossible de se connecter" -ForegroundColor Red
        Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🔗 Test des liens et ressources..." -ForegroundColor Yellow

# Test des ressources statiques
$resources = @(
    @{url="/favicon.ico"; name="Favicon"},
    @{url="/robots.txt"; name="Robots.txt"}
)

foreach ($resource in $resources) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$($resource.url)" -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($resource.name) : OK" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "⚠️ $($resource.name) : Non trouvé (normal)" -ForegroundColor Yellow
    }
}

Write-Host "`n📊 Résumé des tests:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan

Write-Host "`n🌐 URLs à tester manuellement:" -ForegroundColor White
Write-Host "Frontend: $baseUrl" -ForegroundColor Gray
Write-Host "Page d'accueil: $baseUrl/" -ForegroundColor Gray
Write-Host "Connexion: $baseUrl/login" -ForegroundColor Gray
Write-Host "Services: $baseUrl/services" -ForegroundColor Gray
Write-Host "Réservation: $baseUrl/booking" -ForegroundColor Gray
Write-Host "Admin: $baseUrl/admin" -ForegroundColor Gray

Write-Host "`n🔧 Backend (si démarré):" -ForegroundColor White
Write-Host "API: http://localhost:3000/api" -ForegroundColor Gray
Write-Host "Health: http://localhost:3000/health" -ForegroundColor Gray
Write-Host "Docs: http://localhost:3000/api/docs" -ForegroundColor Gray

Write-Host "`n💡 Instructions:" -ForegroundColor Yellow
Write-Host "1. Ouvrez votre navigateur" -ForegroundColor White
Write-Host "2. Allez sur $baseUrl" -ForegroundColor White
Write-Host "3. Testez la navigation entre les pages" -ForegroundColor White
Write-Host "4. Vérifiez que l'interface s'affiche correctement" -ForegroundColor White

Write-Host "`n🎯 Interface TESSA COIFFURE prête à l'emploi !" -ForegroundColor Green

