# Setup Guide

## Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

**YOLO Service:**
```bash
cd yolo-service
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

**Backend (.env file in backend/ directory):**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/fair-trade-scanner
YOLO_SERVICE_URL=http://localhost:8000
```

### 3. Start MongoDB

Make sure MongoDB is running:
```bash
mongod
```

Or use MongoDB Atlas (cloud) and update MONGO_URI accordingly.

### 4. Seed Database

```bash
cd backend
npm run seed
```

### 5. Start Services

You need **3 terminal windows**:

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```
Runs on http://localhost:3000

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
Runs on http://localhost:5000

**Terminal 3 - YOLO Service:**
```bash
cd yolo-service
# Activate virtual environment first
python app.py
```
Runs on http://localhost:8000

### 6. Access Application

Open http://localhost:3000 in your browser.

## Troubleshooting

### YOLO Model Not Found
The YOLOv8 model will auto-download on first run. If it fails:
```bash
cd yolo-service
python -c "from ultralytics import YOLO; YOLO('yolov8n-seg.pt')"
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGO_URI in backend/.env
- Try: `mongosh` to test connection

### Port Already in Use
- Change PORT in backend/.env
- Or kill process using the port

### CORS Errors
- Ensure all services are running
- Check API URLs match in frontend/src/services/api.ts

## Development Notes

- The YOLO service includes fallback mock detection if the model fails to load
- Images are stored in `backend/uploads/`
- Analysis results are stored in MongoDB
- Certificates are generated client-side using html2canvas and jsPDF

