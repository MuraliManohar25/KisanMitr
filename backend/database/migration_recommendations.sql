-- Add recommendation and disease columns to analyses table
ALTER TABLE analyses 
ADD COLUMN IF NOT EXISTS disease_detected TEXT DEFAULT 'No Disease Detected',
ADD COLUMN IF NOT EXISTS recommendations JSONB DEFAULT '{}';

-- Optional: Comment if you want to be thorough
COMMENT ON COLUMN analyses.disease_detected IS 'Detected disease based on visual heuristics (Rot, Spots, etc.)';
COMMENT ON COLUMN analyses.recommendations IS 'JSON object containing advice and pesticide suggestions';
