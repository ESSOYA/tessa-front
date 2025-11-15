@echo off
title Frontend TESSA COIFFURE
color 0B

echo.
echo ========================================
echo    DEMARRAGE FRONTEND TESSA COIFFURE
echo ========================================
echo.

echo [1/3] Verification du repertoire...
if not exist "package.json" (
    echo ERREUR: package.json non trouve
    echo Repertoire actuel: %CD%
    echo.
    echo Assurez-vous d'etre dans le dossier style-schedules-pro-main
    pause
    exit
)

echo [2/3] Installation des dependances...
call npm install
if errorlevel 1 (
    echo ERREUR lors de l'installation des dependances
    pause
    exit
)

echo [3/3] Demarrage du serveur de developpement...
echo.
echo Le frontend va demarrer sur http://localhost:5173
echo L'interface admin sera disponible sur http://localhost:5173/admin
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

call npm run dev

pause

