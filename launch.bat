@echo off
cd /d "%~dp0"
set "EXE=%CD%\src-tauri\target\release\app.exe"
if not exist "%EXE%" (
  echo.
  echo [ERROR] Cannot find app.exe
  echo Please run in this folder:
  echo   npm run tauri:build:exe
  echo.
  pause
  exit /b 1
)
start "" "%EXE%"
