-- COMPLETE VOTING AND COMMENTS SYSTEM FIX
-- This migration works with your existing database structure

-- First, let's check what we have and add what's missing

-- 1. Update the existing votes table to match our API expectations
-- Your current votes table has: id, tool_id, user_id, vote_type, created_at
-- We need: id, tool_id, user_email, user_name, vote_type, user_data, created_at, updated_at

ALTER TABLE votes 
ADD COLUMN IF NOT EXISTS user_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_data JSONB,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update vote_type values to match our API ('up'/'down' instead of 'upvote'/'downvote')
UPDATE votes SET vote_type = 'up' WHERE vote_type = 'upvote';
UPDATE votes SET vote_type = 'down' WHERE vote_type = 'downvote';

-- Add constraint for new vote_type values
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_vote_type_check;
ALTER TABLE votes ADD CONSTRAINT votes_vote_type_check CHECK (vote_type IN ('up', 'down'));

-- 2. Update the existing comments table to match our API expectations
-- Your current comments table has: id, tool_id, user_id, content, created_at, updated_at
-- We need: id, tool_id, user_email, user_name, user_company, user_title, content, status, approved_at, approved_by, user_data, created_at, updated_at

ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS user_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_company VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_data JSONB;

-- Set existing comments to approved (backward compatibility)
UPDATE comments 
SET 
    status = 'approved',
    approved_at = created_at,
    approved_by = 'system'
WHERE status IS NULL;

-- 3. Create proper indexes (avoiding the user_email error)
CREATE INDEX IF NOT EXISTS idx_votes_tool_id ON votes(tool_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_email ON votes(user_email) WHERE user_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_tool_id ON comments(tool_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_user_email ON comments(user_email) WHERE user_email IS NOT NULL;

-- 4. Add unique constraint for votes (one vote per user per tool)
-- First remove any existing constraint
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_tool_id_user_id_key;
ALTER TABLE votes DROP CONSTRAINT IF EXISTS unique_vote_per_user_tool;

-- Add new constraint using user_email
CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_unique_user_tool 
ON votes(tool_id, user_email) 
WHERE user_email IS NOT NULL;

-- 5. Enable RLS (Row Level Security)
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view votes" ON votes;
DROP POLICY IF EXISTS "Users can insert votes" ON votes;
DROP POLICY IF EXISTS "Anyone can insert votes" ON votes;
DROP POLICY IF EXISTS "Anyone can update votes" ON votes;
DROP POLICY IF EXISTS "Anyone can delete votes" ON votes;

DROP POLICY IF EXISTS "Public can view comments" ON comments;
DROP POLICY IF EXISTS "Public can view approved comments" ON comments;
DROP POLICY IF EXISTS "Users can insert comments" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;

-- 7. Create new RLS policies
-- Votes policies
CREATE POLICY "Public can view votes" ON votes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert votes" ON votes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update votes" ON votes
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete votes" ON votes
    FOR DELETE USING (true);

-- Comments policies  
CREATE POLICY "Public can view approved comments" ON comments
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can insert comments" ON comments
    FOR INSERT WITH CHECK (true);

-- 8. Create updated_at trigger for votes if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for votes updated_at
DROP TRIGGER IF EXISTS update_votes_updated_at ON votes;
CREATE TRIGGER update_votes_updated_at 
    BEFORE UPDATE ON votes
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for comments updated_at (if not exists)
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Verification queries (run these to check the setup)
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'votes' ORDER BY ordinal_position;
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'comments' ORDER BY ordinal_position;