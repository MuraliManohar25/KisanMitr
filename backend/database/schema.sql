-- Supabase Database Schema for Fair-Trade Quality Scanner
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  farmer_name VARCHAR(255) DEFAULT '',
  location VARCHAR(255) DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crop Standards table
CREATE TABLE IF NOT EXISTS crop_standards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_type VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  icon VARCHAR(10),
  grade_a_min_diameter INTEGER,
  grade_a_max_diameter INTEGER,
  grade_a_min_hue INTEGER,
  grade_a_max_hue INTEGER,
  grade_b_min_diameter INTEGER,
  grade_b_max_diameter INTEGER,
  grade_b_min_hue INTEGER,
  grade_b_max_hue INTEGER,
  grade_c_min_diameter INTEGER,
  grade_c_max_diameter INTEGER,
  grade_c_min_hue INTEGER,
  grade_c_max_hue INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  crop_type VARCHAR(50) NOT NULL,
  farmer_name VARCHAR(255),
  farmer_location VARCHAR(255),
  farmer_phone VARCHAR(50),
  image_url TEXT,
  total_count INTEGER DEFAULT 0,
  overall_grade VARCHAR(20) CHECK (overall_grade IN ('A', 'B', 'C', 'Mixed', 'Reject')),
  grade_a_count INTEGER DEFAULT 0,
  grade_b_count INTEGER DEFAULT 0,
  grade_c_count INTEGER DEFAULT 0,
  reject_count INTEGER DEFAULT 0,
  certificate_hash TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analysis Items table (for individual detected items)
CREATE TABLE IF NOT EXISTS analysis_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL,
  bbox_x INTEGER,
  bbox_y INTEGER,
  bbox_width INTEGER,
  bbox_height INTEGER,
  diameter NUMERIC(10, 2),
  avg_r INTEGER,
  avg_g INTEGER,
  avg_b INTEGER,
  dominant_hue INTEGER,
  grade VARCHAR(20) CHECK (grade IN ('A', 'B', 'C', 'Reject')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Images table
CREATE TABLE IF NOT EXISTS training_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_type VARCHAR(50) NOT NULL,
  image_url TEXT,
  image_path TEXT,
  filename VARCHAR(255),
  uploaded_by VARCHAR(255) DEFAULT 'system',
  image_size INTEGER,
  image_width INTEGER,
  image_height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training Image Labels table
CREATE TABLE IF NOT EXISTS training_image_labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  training_image_id UUID REFERENCES training_images(id) ON DELETE CASCADE,
  bbox_x INTEGER,
  bbox_y INTEGER,
  bbox_width INTEGER,
  bbox_height INTEGER,
  grade VARCHAR(20) CHECK (grade IN ('A', 'B', 'C', 'Reject')),
  diameter NUMERIC(10, 2),
  avg_r INTEGER,
  avg_g INTEGER,
  avg_b INTEGER,
  dominant_hue INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_analysis_id ON analyses(analysis_id);
CREATE INDEX IF NOT EXISTS idx_analyses_crop_type ON analyses(crop_type);
CREATE INDEX IF NOT EXISTS idx_analysis_items_analysis_id ON analysis_items(analysis_id);
CREATE INDEX IF NOT EXISTS idx_training_images_crop_type ON training_images(crop_type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Enable Row Level Security (RLS) - Optional, can be configured later
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

