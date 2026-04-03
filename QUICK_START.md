# Quick Start Guide

## ✅ Completed
- ✅ YOLO Service dependencies installed
- ✅ Project structure created

## 🔧 Setup Steps

### 1. Install Node.js Dependencies

**Option A: Run the setup script (Recommended)**
```powershell
powershell -ExecutionPolicy Bypass -File .\setup_nodejs.ps1
```

**Option B: Manual installation**
```powershell
# Add Node.js to PATH (if not already added)
$env:Path += ";C:\Program Files\nodejs"

# Install Frontend
cd frontend
npm install
cd ..

# Install Backend
cd backend
npm install
cd ..
```

### 2. Configure Environment

Create `backend/.env` file with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/fair-trade-scanner
YOLO_SERVICE_URL=http://localhost:8000
```

### 3. Set Up MongoDB

**Option A: Local MongoDB**
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Option B: MongoDB Atlas (Cloud - Free)**
- Sign up at: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string and update `MONGO_URI` in `backend/.env`

### 4. Seed Database

```powershell
cd backend
npm run seed
```

### 5. Start All Services

Open **3 separate terminal windows**:

**Terminal 1 - Frontend:**
```powershell
cd frontend
npm run dev
```
→ http://localhost:3000

**Terminal 2 - Backend:**
```powershell
cd backend
npm run dev
```
→ http://https://kisanmitr.up.railway.app/

**Terminal 3 - YOLO Service:**
```powershell
cd yolo-service
.\venv\Scripts\python.exe app.py
```
→ http://localhost:8000

## 🎯 Access Application

Open http://localhost:3000 in your browser!

## ⚠️ Troubleshooting

### Node.js not found
- Restart your terminal after installing Node.js
- Or use full path: `& "C:\Program Files\nodejs\npm.cmd" install`

### MongoDB connection error
- Ensure MongoDB is running
- Check connection string in `backend/.env`
- Test with: `mongosh` command

### YOLO service not starting
- Model will auto-download on first run
- Check Python virtual environment is activated
- Verify all dependencies installed

