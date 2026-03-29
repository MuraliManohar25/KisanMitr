@echo off
echo ========================================
echo Starting Fair-Trade Quality Scanner
echo ========================================
echo.

REM Create .env if it doesn't exist
if not exist "backend\.env" (
    copy "backend\env.template" "backend\.env"
    echo ✅ Created backend/.env file
)

echo Starting services in separate windows...
echo.

echo [1/3] Starting YOLO Service (Port 8000)...
start "YOLO Service" cmd /k "cd /d %~dp0yolo-service && .\venv\Scripts\python.exe app.py"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend (Port 3000)...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo ✅ All services starting!
echo ========================================
echo.
echo Services will open in separate windows:
echo   • YOLO Service:    http://localhost:8000
echo   • Backend API:     http://localhost:5000
echo   • Frontend App:    http://localhost:3000
echo.
echo Open your browser to: http://localhost:3000
echo.
pause

