@echo off
title TESSA COIFFURE - Demarrage
color 0A

echo.
echo ========================================
echo    TESSA COIFFURE - DEMARRAGE
echo ========================================
echo.

echo [1/3] Verification des repertoires...
if not exist "package.json" (
    echo ERREUR: package.json non trouve
    echo Assurez-vous d'etre dans le bon repertoire
    pause
    exit
)

if not exist "backend\package.json" (
    echo ERREUR: backend\package.json non trouve
    echo Assurez-vous d'etre dans le bon repertoire
    pause
    exit
)

echo [2/3] Demarrage du backend...
start "Backend TESSA COIFFURE" cmd /c "cd backend && npm run dev"

echo [3/3] Demarrage du frontend...
start "Frontend TESSA COIFFURE" cmd /c "npm run dev"

echo.
echo ========================================
echo    SERVICES DEMARRES !
echo ========================================
echo.
echo - Backend:  http://localhost:3000
echo - Frontend: http://localhost:5173
echo - Admin:    http://localhost:5173/admin
echo.
echo Ouvrez votre navigateur sur:
echo http://localhost:5173/admin
echo.
echo Appuyez sur une touche pour fermer...
pause > nul

