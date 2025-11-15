@echo off
echo ========================================
echo    DEMARRAGE TESSA COIFFURE
echo ========================================
echo.

echo [1/4] Demarrage du backend...
cd backend
start "Backend TESSA" cmd /k "npm run dev"
cd ..

echo [2/4] Attente de 3 secondes...
timeout /t 3 /nobreak >nul

echo [3/4] Demarrage du frontend...
start "Frontend TESSA" cmd /k "npm run dev"

echo [4/4] Ouverture du navigateur...
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================
echo    APPLICATION DEMARREE !
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo Admin:    http://localhost:5173/admin
echo.
echo Appuyez sur une touche pour fermer...
pause >nul

