-- Complete voting and comment system setup
-- Run this after the basic comment approval migration

-- First, ensure all necessary columns exist in comments table
DO $$ 
BEGIN
    -- Add user_data column if it doesn't exist (for votes table compatibility)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'user_data') THEN
        ALTER TABLE comments ADD COLUMN user_data JSONB;
    END IF;
END $$;

-- Ensure votes table has all necessary columns
DO $$ 
BEGIN
    -- Add user_data column to votes if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'user_data') THEN
        ALTER TABLE votes ADD COLUMN user_data JSONB;
    END IF;
END $$;

-- Update RLS policies for proper access control
-- Drop and recreate all comment policies
DROP POLICY IF EXISTS "Public can view comments" ON comments;
DROP POLICY IF EXISTS "Public can view approved comments" ON comments;
DROP POLICY IF EXISTS "Users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

-- Create comprehensive comment policies
CREATE POLICY "Public can view approved comments" ON comments
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can insert comments" ON comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own comments" ON comments
    FOR UPDATE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can delete their own comments" ON comments
    FOR DELETE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Drop and recreate all vote policies
DROP POLICY IF EXISTS "Public can view votes" ON votes;
DROP POLICY IF EXISTS "Users can insert votes" ON votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;

-- Create comprehensive vote policies
CREATE POLICY "Public can view votes" ON votes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert votes" ON votes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update votes" ON votes
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete votes" ON votes
    FOR DELETE USING (true);

-- Create additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_tool_user ON votes(tool_id, user_email);
CREATE INDEX IF NOT EXISTS idx_comments_tool_status ON comments(tool_id, status);
CREATE INDEX IF NOT EXISTS idx_comments_user_email ON comments(user_email);

-- Update any existing comments that don't have status set
UPDATE comments 
SET status = 'approved', approved_at = created_at, approved_by = 'system'
WHERE status IS NULL;

-- Ensure all existing votes have proper structure
UPDATE votes 
SET updated_at = COALESCE(updated_at, created_at)
WHERE updated_at IS NULL;