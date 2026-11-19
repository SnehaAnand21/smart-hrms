@echo off
title Smart HRMS Launcher
echo ========================================================
echo   Smart HRMS - Full Stack MERN Academic Project
echo   Sneha.A [310624205264] - Easwari Engineering College
echo ========================================================
echo.
echo [1/3] Starting Backend Server (Port 5000)...
start "HRMS Backend Server (:5000)" cmd /k "cd /d %~dp0server && node server.js"

echo [2/3] Waiting 3 seconds for database initialization...
ping 127.0.0.1 -n 4 > nul

echo [3/3] Starting Frontend Client (Port 5173)...
start "HRMS Frontend Client (:5173)" cmd /k "cd /d %~dp0client && npm.cmd run dev"

echo.
echo Waiting for Vite dev server to bind...
ping 127.0.0.1 -n 4 > nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173

echo.
echo ========================================================
echo   Smart HRMS is LIVE!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ========================================================
echo Keep this window open or close it when done.
pause
