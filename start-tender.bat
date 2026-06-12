@echo off
cd /d "%~dp0"

echo ==========================================
echo Starting Smart Tender Copilot Services...
echo ==========================================

:: Check if port 3000 is already in use
netstat -aon | findstr :3000 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo [Warning] Next.js frontend is already running on port 3000.
    set FRONTEND_RUNNING=1
) else (
    set FRONTEND_RUNNING=0
)

:: Check if port 8000 is already in use
netstat -aon | findstr :8000 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo [Warning] FastAPI backend is already running on port 8000.
    set BACKEND_RUNNING=1
) else (
    set BACKEND_RUNNING=0
)

if "%FRONTEND_RUNNING%"=="1" (
    if "%BACKEND_RUNNING%"=="1" (
        echo Both services are already running.
        ping 127.0.0.1 -n 4 >nul
        exit /b 0
    )
)

:: Run the dev server and log output to app_startup.log
npm run dev > app_startup.log 2>&1
