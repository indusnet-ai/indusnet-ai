@echo off
cd /d "%~dp0"

echo ==========================================
echo Smart Tender Copilot Service Status
echo ==========================================

netstat -aon | findstr :3000 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo [Frontend] Next.js is RUNNING on port 3000
) else (
    echo [Frontend] Next.js is STOPPED
)

netstat -aon | findstr :8000 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo [Backend] FastAPI is RUNNING on port 8000
) else (
    echo [Backend] FastAPI is STOPPED
)

echo ==========================================
pause
