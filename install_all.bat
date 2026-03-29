@echo off
echo ========================================
echo Fair-Trade Scanner - Full Installation
echo ========================================
echo.

echo [1/2] Installing Frontend Dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend installation complete!
echo.

cd ..
echo [2/2] Installing Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Backend installation failed!
    pause
    exit /b 1
)
echo Backend installation complete!
echo.

cd ..
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create backend\.env file with MongoDB connection
echo 2. Run: cd backend && npm run seed
echo 3. Start services (see README.md)
echo.
pause

