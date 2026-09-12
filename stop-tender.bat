@echo off
cd /d "%~dp0"

echo ==========================================
echo Stopping Smart Tender Copilot Services...
echo ==========================================

:: Find and kill process on port 3005
echo Checking port 3005...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3005 ^| findstr LISTENING') do (
    echo Killing Next.js frontend on port 3005 with PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

:: Find and kill process on port 8001
echo Checking port 8001...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001 ^| findstr LISTENING') do (
    echo Killing FastAPI backend on port 8001 with PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo Services stopped successfully.
ping 127.0.0.1 -n 4 >nul
