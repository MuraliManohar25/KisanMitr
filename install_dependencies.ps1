# Fair-Trade Scanner - Install Dependencies
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Node.js Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please ensure Node.js is installed and restart your terminal." -ForegroundColor Red
    exit 1
}

# Install Frontend Dependencies
Write-Host ""
Write-Host "[1/2] Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend installation failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Frontend installation complete!" -ForegroundColor Green
Set-Location ..

# Install Backend Dependencies
Write-Host ""
Write-Host "[2/2] Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend installation failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Backend installation complete!" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ All Dependencies Installed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Ensure MongoDB is running" -ForegroundColor White
Write-Host "2. Create backend\.env file (see SETUP.md)" -ForegroundColor White
Write-Host "3. Run: cd backend && npm run seed" -ForegroundColor White
Write-Host "4. Start services (see README.md)" -ForegroundColor White
Write-Host ""

