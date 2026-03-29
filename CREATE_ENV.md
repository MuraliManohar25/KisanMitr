# How to Create backend/.env File

## Quick Method (Windows)

1. Open PowerShell in the project root
2. Run:
   ```powershell
   Copy-Item backend\env.template backend\.env
   ```

## Manual Method

1. Navigate to `backend` folder
2. Create a new file named `.env` (note the dot at the beginning)
3. Add this content:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/fair-trade-scanner
   YOLO_SERVICE_URL=http://localhost:8000
   ```

## For MongoDB Atlas Users

Replace `MONGO_URI` with your Atlas connection string:
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fair-trade-scanner?retryWrites=true&w=majority
YOLO_SERVICE_URL=http://localhost:8000
```

## Verify

After creating, verify the file exists:
```powershell
Test-Path backend\.env
```
Should return: `True`

