-- Simple fix - just add missing columns
-- Run this if you're getting policy errors

-- Add columns to comments table
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS user_company VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255) DEFAULT 'system',
ADD COLUMN IF NOT EXISTS user_data JSONB;

-- Add user_data to votes table
ALTER TABLE votes 
ADD COLUMN IF NOT EXISTS user_data JSONB;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_approved_at ON comments(approved_at);

-- Set default values for existing records (keep existing as approved, new ones will be pending)
UPDATE comments 
SET 
    status = COALESCE(status, 'approved'),
    approved_at = COALESCE(approved_at, created_at),
    approved_by = COALESCE(approved_by, 'system')
WHERE status IS NULL;