# Add Node.js to PATH for this session
$env:Path += ";C:\Program Files\nodejs"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Node.js Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verify Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = & "C:\Program Files\nodejs\node.exe" --version
$npmVersion = & "C:\Program Files\nodejs\npm.cmd" --version
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
Write-Host ""

# Install Frontend Dependencies
Write-Host "[1/2] Installing Frontend Dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
Set-Location frontend
& "C:\Program Files\nodejs\npm.cmd" install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend installation failed!" -ForegroundColor Red
    Set-Location ..
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Frontend installation complete!" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "[2/2] Installing Backend Dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
Set-Location backend
& "C:\Program Files\nodejs\npm.cmd" install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend installation failed!" -ForegroundColor Red
    Set-Location ..
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Backend installation complete!" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ All Dependencies Installed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Ensure Supabase credentials are in backend\.env" -ForegroundColor White
Write-Host "2. Run: cd backend" -ForegroundColor Gray
Write-Host "3. Run: npm run seed" -ForegroundColor White
Write-Host "4. Start services (see README.md)" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"

