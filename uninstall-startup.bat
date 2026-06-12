@echo off
echo ==========================================
echo Removing Smart Tender Startup Shortcut...
echo ==========================================

set SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\Start-Tender.lnk

if exist "%SHORTCUT_PATH%" (
    del "%SHORTCUT_PATH%"
    echo Startup shortcut successfully removed.
) else (
    echo Startup shortcut was not found.
)
pause
