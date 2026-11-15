@echo off
rem Runs every collection in this folder with Newman, one after another.
rem Needs Node.js and Newman once:  npm install -g newman
rem The backend (Spring Boot), Oracle and Redis must be running first.
setlocal enabledelayedexpansion
set FAILED=0
for %%f in (Restaurant_*.postman_collection.json) do (
  echo.
  echo ===== %%f =====
  call newman run "%%f" --reporters cli --color on
  if errorlevel 1 set FAILED=1
)
echo.
if "%FAILED%"=="1" (echo SOME COLLECTIONS FAILED) else (echo ALL COLLECTIONS PASSED)
exit /b %FAILED%
