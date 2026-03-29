<<<<<<< HEAD
# Fair-Trade Quality Scanner (KisanMitr)

A computer vision-powered web application that empowers small-scale farmers to objectively assess crop quality, generate professional certificates, and gain fair-trade credibility.

## 🎯 Features

- **AI-Powered Analysis**: Automatic counting, sizing, and color grading of crops
- **Quality Grading**: Automated A/B/C/Reject grading system
- **Digital Certificates**: Tamper-evident certificates with QR code verification
- **Mobile-First Design**: Optimized for use on smartphones in field conditions

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Supabase (PostgreSQL)
- **Computer Vision**: Python + Flask + YOLOv8

## 📦 Installation

### Prerequisites

- Node.js 18+
- Python 3.10+
- Supabase account (free tier available)
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:5173

### Backend Setup

```bash
cd backend
npm install
cp env.template .env
# Edit .env with your Supabase credentials
npm run dev
```

Backend will run on http://localhost:5000

### YOLO Service Setup

```bash
cd yolo-service
python -m venv venv
venv\Scripts\activate  # On Linux/Mac: source venv/bin/activate
pip install -r requirements.txt

# YOLOv8 model will auto-download on first run
python app.py
```

YOLO service will run on http://localhost:8000

### Database Setup

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Get your project URL and anon key from Settings > API

2. **Run Schema**
   - Go to SQL Editor in Supabase Dashboard
   - Copy and run `backend/database/schema.sql`

3. **Update .env**
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Seed Database**
   ```bash
   cd backend
   npm run seed
   ```

## 🚀 Usage

1. Open http://localhost:5173 in your browser
2. Fill in farmer information
3. Select crop type (Apple, Tomato, Orange, Mango)
4. Upload or capture a photo of crops on a white background
5. Wait for AI analysis
6. View results and download certificate

## 🎨 Design System

The application uses an earthy agricultural color palette:
- Forest Green (#2D5016) - Primary
- Leaf Green (#4A7C2C) - Accents
- Harvest Yellow (#F4C430) - Highlights
- Soil Brown (#8B6914) - Secondary

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Analysis
- `POST /api/analyze` - Upload image for analysis
- `GET /api/analysis/:analysisId` - Get analysis results

### Certificates
- `GET /api/certificate/:analysisId` - Get certificate data
- `GET /api/certificates/my-certificates` - Get user's certificates (auth required)

## 🔧 Development

### Running All Services

You'll need three terminal windows:

1. Frontend: `cd frontend && npm run dev`
2. Backend: `cd backend && npm run dev`
3. YOLO Service: `cd yolo-service && python app.py`

Or use the provided script:
```powershell
.\start_all_services.ps1
```

### Environment Variables

**Backend (.env)**
```
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
YOLO_SERVICE_URL=http://localhost:8000
JWT_SECRET=your-secure-secret-key
```

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.
=======
# KisanMitr
>>>>>>> 06ca23ec3b2273ef4af36b8c057df130b9d14a1a
