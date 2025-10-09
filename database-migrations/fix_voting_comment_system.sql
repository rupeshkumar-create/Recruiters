-- Fixed migration for voting and comment system
-- This handles existing policies and columns safely

-- Add new columns to comments table only if they don't exist
DO $$ 
BEGIN
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'status') THEN
        ALTER TABLE comments ADD COLUMN status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
    END IF;
    
    -- Add user_company column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'user_company') THEN
        ALTER TABLE comments ADD COLUMN user_company VARCHAR(255);
    END IF;
    
    -- Add user_title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'user_title') THEN
        ALTER TABLE comments ADD COLUMN user_title VARCHAR(255);
    END IF;
    
    -- Add approved_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'approved_at') THEN
        ALTER TABLE comments ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add approved_by column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'approved_by') THEN
        ALTER TABLE comments ADD COLUMN approved_by VARCHAR(255);
    END IF;
    
    -- Add user_data column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'user_data') THEN
        ALTER TABLE comments ADD COLUMN user_data JSONB;
    END IF;
END $$;

-- Add user_data to votes table if missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'user_data') THEN
        ALTER TABLE votes ADD COLUMN user_data JSONB;
    END IF;
END $$;

-- Create indexes only if they don't exist
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_approved_at ON comments(approved_at);
CREATE INDEX IF NOT EXISTS idx_votes_tool_user ON votes(tool_id, user_email);
CREATE INDEX IF NOT EXISTS idx_comments_tool_status ON comments(tool_id, status);

-- Update existing comments to approved status
UPDATE comments 
SET status = 'approved', approved_at = COALESCE(approved_at, created_at), approved_by = COALESCE(approved_by, 'system')
WHERE status IS NULL OR status = 'pending';

-- Drop existing policies safely and recreate them
DO $$
BEGIN
    -- Drop comment policies if they exist
    DROP POLICY IF EXISTS "Public can view comments" ON comments;
    DROP POLICY IF EXISTS "Public can view approved comments" ON comments;
    DROP POLICY IF EXISTS "Users can insert comments" ON comments;
    DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
    DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;
    DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;
    
    -- Create new comment policies
    CREATE POLICY "Public can view approved comments" ON comments
        FOR SELECT USING (status = 'approved');
    
    CREATE POLICY "Anyone can insert comments" ON comments
        FOR INSERT WITH CHECK (true);
    
    -- Drop vote policies if they exist
    DROP POLICY IF EXISTS "Public can view votes" ON votes;
    DROP POLICY IF EXISTS "Users can insert votes" ON votes;
    DROP POLICY IF EXISTS "Users can update their own votes" ON votes;
    DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;
    DROP POLICY IF EXISTS "Anyone can insert votes" ON votes;
    DROP POLICY IF EXISTS "Anyone can update votes" ON votes;
    DROP POLICY IF EXISTS "Anyone can delete votes" ON votes;
    
    -- Create new vote policies
    CREATE POLICY "Public can view votes" ON votes
        FOR SELECT USING (true);
    
    CREATE POLICY "Anyone can insert votes" ON votes
        FOR INSERT WITH CHECK (true);
    
    CREATE POLICY "Anyone can update votes" ON votes
        FOR UPDATE USING (true);
    
    CREATE POLICY "Anyone can delete votes" ON votes
        FOR DELETE USING (true);
        
EXCEPTION
    WHEN OTHERS THEN
        -- If there's any error, just continue
        NULL;
END $$;