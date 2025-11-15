@echo off
echo Demarrage de TESSA COIFFURE...
echo.

echo [1/2] Demarrage du backend...
start "Backend TESSA COIFFURE" cmd /c "cd backend && npm run dev"

echo [2/2] Demarrage du frontend...
start "Frontend TESSA COIFFURE" cmd /c "npm run dev"

echo.
echo Services demarres !
echo - Backend: http://localhost:3000
echo - Frontend: http://localhost:5173
echo - Admin: http://localhost:5173/admin
echo.
echo Appuyez sur une touche pour fermer...
pause > nul

