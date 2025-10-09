-- Complete fix for voting and comment system
-- This addresses all the reported issues

-- Ensure comments table has all required columns
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS user_company VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_data JSONB;

-- Ensure votes table has user_data column
ALTER TABLE votes 
ADD COLUMN IF NOT EXISTS user_data JSONB;

-- Create necessary indexes
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_approved_at ON comments(approved_at);
CREATE INDEX IF NOT EXISTS idx_votes_tool_user ON votes(tool_id, user_email);

-- Set existing comments to approved (backward compatibility)
-- But new comments will default to 'pending'
UPDATE comments 
SET 
    status = 'approved',
    approved_at = COALESCE(approved_at, created_at),
    approved_by = COALESCE(approved_by, 'system')
WHERE status IS NULL;

-- Ensure proper RLS policies exist
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view comments" ON comments;
DROP POLICY IF EXISTS "Public can view approved comments" ON comments;
DROP POLICY IF EXISTS "Users can insert comments" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;

-- Create new comment policies
CREATE POLICY "Public can view approved comments" ON comments
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can insert comments" ON comments
    FOR INSERT WITH CHECK (true);

-- Ensure vote policies exist
DROP POLICY IF EXISTS "Public can view votes" ON votes;
DROP POLICY IF EXISTS "Users can insert votes" ON votes;
DROP POLICY IF EXISTS "Anyone can insert votes" ON votes;
DROP POLICY IF EXISTS "Anyone can update votes" ON votes;
DROP POLICY IF EXISTS "Anyone can delete votes" ON votes;

CREATE POLICY "Public can view votes" ON votes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert votes" ON votes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update votes" ON votes
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete votes" ON votes
    FOR DELETE USING (true);