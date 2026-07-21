@echo off
cd /d "%~dp0"
echo.
echo   Iniciando BLOCKOUT (servidor local SIN cache)...
echo   Deja abierta la ventana negra del servidor mientras juegas.
echo.
start "BLOCKOUT server" cmd /k "node _serve.js"
timeout /t 1 /nobreak >nul
start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "http://localhost:8181/rumble_arena_cinta_v4.html"
exit
