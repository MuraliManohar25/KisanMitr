Write-Host "Installing YOLO dependencies..." -ForegroundColor Green
Write-Host "This may take 5-10 minutes due to large downloads (PyTorch ~1GB)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting installation..." -ForegroundColor Cyan

.\venv\Scripts\python.exe -m pip install ultralytics

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "You can now run: .\venv\Scripts\python.exe app.py" -ForegroundColor Cyan

