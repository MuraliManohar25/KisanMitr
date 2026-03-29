@echo off
echo Installing YOLO dependencies...
echo This may take 5-10 minutes due to large downloads (PyTorch ~1GB)
echo.
echo Starting installation...
.\venv\Scripts\python.exe -m pip install ultralytics
echo.
echo Installation complete!
echo You can now run: .\venv\Scripts\python.exe app.py
pause

