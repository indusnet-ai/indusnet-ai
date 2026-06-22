@echo off
cd /d "%~dp0"

echo ==========================================
echo Stopping Smart Tender Copilot Services...
echo ==========================================

:: Find and kill process on port 3000
echo Checking port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing Next.js frontend with PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

:: Find and kill process on port 8000
echo Checking port 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    echo Killing FastAPI backend on port 8000 with PID %%a...
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

