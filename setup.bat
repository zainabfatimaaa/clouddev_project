@echo off
REM Restaurant Management System - DynamoDB Setup Script

echo ===== Restaurant Management System - DynamoDB Setup =====
echo This script will help you set up the DynamoDB environment for the restaurant management system.

REM Install dependencies
echo.
echo [1/4] Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install dependencies
    exit /b 1
)

REM Create DynamoDB tables
echo.
echo [2/4] Creating DynamoDB tables...
call npm run setup-db
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to create DynamoDB tables
    exit /b 1
)

REM Load sample data
echo.
echo [3/4] Loading sample data...
call npm run load-sample-data
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to load sample data
    exit /b 1
)

REM Start the application
echo.
echo [4/4] Starting the application...
echo The application will now start. Press Ctrl+C to stop it.
echo.
echo Access the application at: http://localhost:5000
npm run dev