-- Add comment approval system (Simple Version)
-- This migration adds status, approval fields, and user details to the comments table

-- Add new columns to comments table (skip user_data as it may not exist)
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS user_company VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_approved_at ON comments(approved_at);

-- Update existing comments to be approved (backward compatibility)
UPDATE comments 
SET status = 'approved', approved_at = created_at, approved_by = 'system'
WHERE status IS NULL;

-- Update the RLS policy for comments to only show approved comments to public
DROP POLICY IF EXISTS "Public can view comments" ON comments;
CREATE POLICY "Public can view approved comments" ON comments
    FOR SELECT USING (status = 'approved');