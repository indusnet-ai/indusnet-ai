@echo off
cd /d "%~dp0"

echo ==========================================
echo Installing Smart Tender Startup Shortcut...
echo ==========================================

set SCRIPT_DIR=%~dp0
:: Remove trailing slash if present for powershell compatibility
if "%SCRIPT_DIR:~-1%"=="\" set SCRIPT_DIR=%SCRIPT_DIR:~0,-1%

set VBS_PATH=%SCRIPT_DIR%\start-tender-background.vbs
set SHORTCUT_PATH=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\Start-Tender.lnk

:: Create shortcut that launches wscript.exe explicitly with our script path as parameter
powershell -Command "$s = New-Object -ComObject WScript.Shell; $v = $s.CreateShortcut('%SHORTCUT_PATH%'); $v.TargetPath = 'wscript.exe'; $v.Arguments = '\"%VBS_PATH%\"'; $v.WorkingDirectory = '%SCRIPT_DIR%'; $v.Save()"

if %ERRORLEVEL% EQU 0 (
    echo Shortcut successfully installed to Windows Startup folder.
    echo The Tender application will now start automatically in the background when you log in.
) else (
    echo Failed to install startup shortcut.
)
pause
