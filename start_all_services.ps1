# Start All Services for Fair-Trade Quality Scanner
$env:Path += ";C:\Program Files\nodejs"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Fair-Trade Quality Scanner" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create .env if it doesn't exist
if (-not (Test-Path backend\.env)) {
    Copy-Item backend\env.template backend\.env
    Write-Host "✅ Created backend/.env file" -ForegroundColor Green
}

# Get current directory
$projectRoot = $PSScriptRoot
if (-not $projectRoot) {
    $projectRoot = Get-Location
}

Write-Host "Starting services in separate windows..." -ForegroundColor Yellow
Write-Host ""

# Start YOLO Service
Write-Host "[1/3] Starting YOLO Service (Port 8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\yolo-service'; Write-Host 'YOLO Service Starting...' -ForegroundColor Green; .\venv\Scripts\python.exe app.py" -WindowStyle Normal
Start-Sleep -Seconds 2

# Start Backend
Write-Host "[2/3] Starting Backend Server (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\backend'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; & 'C:\Program Files\nodejs\npm.cmd' run dev" -WindowStyle Normal
Start-Sleep -Seconds 2

# Start Frontend
Write-Host "[3/3] Starting Frontend (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\frontend'; Write-Host 'Frontend Starting...' -ForegroundColor Green; & 'C:\Program Files\nodejs\npm.cmd' run dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ All services starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services will open in separate windows:" -ForegroundColor Yellow
Write-Host "  • YOLO Service:    http://localhost:8000" -ForegroundColor White
Write-Host "  • Backend API:     http://localhost:5000" -ForegroundColor White
Write-Host "  • Frontend App:    http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Open your browser to: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Note: Ensure Supabase credentials are in backend/.env" -ForegroundColor Yellow
Write-Host ""

