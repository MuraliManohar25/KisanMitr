# Supabase Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Name:** fair-trade-scanner
   - **Database Password:** (create strong password - save it!)
   - **Region:** Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for project to be ready

### Step 2: Get API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)

### Step 3: Create Database Schema

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New query"
3. Copy and paste the contents of `backend/database/schema.sql`
4. Click "Run" (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

### Step 4: Update Environment Variables

Update `backend/.env` file:

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
YOLO_SERVICE_URL=http://localhost:8000
```

### Step 5: Seed Database

```powershell
cd backend
npm install  # Install @supabase/supabase-js
npm run seed
npm run create-demo
```

### Step 6: Import Your Dataset (Optional)

```powershell
npm run import-dataset "C:\path\to\your\dataset"
```

## ✅ Verify Setup

Test the connection:
```powershell
cd backend
npm run seed
```

You should see:
```
✅ Supabase connected
✅ Crop standards seeded successfully
```

## 📊 Database Tables Created

- `users` - User accounts
- `crop_standards` - Grading thresholds
- `analyses` - Analysis results
- `analysis_items` - Individual detected items
- `training_images` - Dataset images
- `training_image_labels` - Image annotations

## 🔧 Troubleshooting

### "Table does not exist" Error
- Make sure you ran `schema.sql` in Supabase SQL Editor
- Check table names match exactly

### Connection Error
- Verify SUPABASE_URL and SUPABASE_ANON_KEY in `.env`
- Check project is active in Supabase dashboard
- Ensure API keys are correct

### Import Errors
- Check dataset folder structure
- Verify image file formats
- Check file permissions

## 🔐 Security Notes

- Use **anon key** for client-side operations
- Use **service_role key** for server-side (if needed)
- Row Level Security (RLS) can be enabled later
- API keys are safe to use in backend

## 📝 Next Steps

1. ✅ Run schema.sql
2. ✅ Update .env with credentials
3. ✅ Seed database
4. ✅ Create demo user
5. ✅ Import dataset (if you have one)
6. ✅ Restart backend server

## 🎯 Benefits of Supabase

- ✅ PostgreSQL database (powerful & reliable)
- ✅ Built-in authentication (can use later)
- ✅ Real-time subscriptions (can use later)
- ✅ Storage for images (can migrate to later)
- ✅ Free tier: 500MB database, 1GB storage
- ✅ Auto backups
- ✅ Web dashboard for data management

