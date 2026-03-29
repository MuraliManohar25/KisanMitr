# Main Code Files - Fair-Trade Quality Scanner

## 🎨 Frontend (React + TypeScript)

### Core Application Files
- **`frontend/src/App.tsx`** - Main app component, routing setup
- **`frontend/src/main.tsx`** - Application entry point
- **`frontend/src/index.css`** - Global styles, Tailwind imports

### Pages (Main UI Screens)
- **`frontend/src/pages/Home.tsx`** - Main landing page, image upload/capture
- **`frontend/src/pages/Login.tsx`** - Login/Register page
- **`frontend/src/pages/Dashboard.tsx`** - User dashboard, certificate list
- **`frontend/src/pages/Results.tsx`** - Analysis results display
- **`frontend/src/pages/Certificate.tsx`** - Certificate view and PDF download
- **`frontend/src/pages/Admin.tsx`** - Admin dashboard (basic)

### Components (Reusable UI)
- **`frontend/src/components/CameraCapture.tsx`** - Webcam capture component
- **`frontend/src/components/CropSelector.tsx`** - Crop type selection
- **`frontend/src/components/LoadingSpinner.tsx`** - Loading indicator

### Services & State
- **`frontend/src/services/api.ts`** - API client, all HTTP requests
- **`frontend/src/store/authStore.ts`** - Authentication state management (Zustand)

### Configuration
- **`frontend/package.json`** - Dependencies and scripts
- **`frontend/vite.config.ts`** - Vite build configuration
- **`frontend/tailwind.config.js`** - Tailwind CSS theme and colors
- **`frontend/tsconfig.json`** - TypeScript configuration
- **`frontend/index.html`** - HTML template

---

## 🔧 Backend (Node.js + Express)

### Core Server
- **`backend/server.js`** - Main Express server, middleware setup, route registration

### Routes (API Endpoints)
- **`backend/routes/analyze.js`** - Image analysis endpoint (POST /api/analyze, GET /api/analysis/:id)
- **`backend/routes/auth.js`** - Authentication routes (login, register, get user)
- **`backend/routes/certificate.js`** - Certificate retrieval
- **`backend/routes/certificates.js`** - User's certificates list (protected)

### Models (Database Schemas)
- **`backend/models/Analysis.js`** - Analysis/certificate data model
- **`backend/models/User.js`** - User account model
- **`backend/models/CropStandard.js`** - Crop grading standards

### Services (Business Logic)
- **`backend/services/yoloService.js`** - YOLO service integration
- **`backend/services/gradingEngine.js`** - Crop grading logic (A/B/C/Reject)

### Configuration & Middleware
- **`backend/config/database.js`** - MongoDB connection
- **`backend/middleware/auth.js`** - JWT authentication middleware
- **`backend/middleware/errorHandler.js`** - Error handling middleware
- **`backend/package.json`** - Dependencies and scripts
- **`backend/.env`** - Environment variables (PORT, MONGO_URI, etc.)

### Scripts (Utilities)
- **`backend/scripts/seedCropStandards.js`** - Seed crop standards to database
- **`backend/scripts/createDemoUser.js`** - Create demo user account
- **`backend/scripts/createDemoCertificate.js`** - Create demo certificate
- **`backend/scripts/deleteDemoCertificate.js`** - Delete certificate
- **`backend/scripts/listDemoCertificates.js`** - List all certificates

---

## 🤖 YOLO Service (Python + Flask)

### Main Application
- **`yolo-service/app.py`** - Flask server, API endpoints

### Detection Logic
- **`yolo-service/utils/detector.py`** - YOLOv8 detection, image processing, color analysis

### Configuration
- **`yolo-service/requirements.txt`** - Python dependencies

---

## 📋 Key File Summary

### Most Important Files to Understand:

**Frontend:**
1. `frontend/src/App.tsx` - App structure
2. `frontend/src/pages/Home.tsx` - Main user flow
3. `frontend/src/services/api.ts` - All API calls
4. `frontend/src/store/authStore.ts` - Auth state

**Backend:**
1. `backend/server.js` - Server setup
2. `backend/routes/analyze.js` - Core analysis logic
3. `backend/services/gradingEngine.js` - Grading rules
4. `backend/models/Analysis.js` - Data structure

**YOLO:**
1. `yolo-service/app.py` - Detection API
2. `yolo-service/utils/detector.py` - Computer vision logic

---

## 🔄 Data Flow

1. **User uploads image** → `Home.tsx` → `api.ts` → `backend/routes/analyze.js`
2. **Image processed** → `yoloService.js` → `yolo-service/app.py` → `detector.py`
3. **Results graded** → `gradingEngine.js` → Saved to `Analysis` model
4. **Display results** → `Results.tsx` → `Certificate.tsx`
5. **User dashboard** → `Dashboard.tsx` → `certificates.js` → Lists all user certificates

