-- Safe comment approval system migration
-- This migration safely adds the comment approval system with proper error handling

-- Check if comments table exists, if not create it
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns one by one with IF NOT EXISTS
DO $$ 
BEGIN
    -- Add user_data column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'user_data') THEN
        ALTER TABLE comments ADD COLUMN user_data JSONB;
    END IF;
    
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
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_approved_at ON comments(status, approved_at);
CREATE INDEX IF NOT EXISTS idx_comments_tool_id ON comments(tool_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_email ON comments(user_email);

-- Update existing comments to be approved (backward compatibility)
UPDATE comments 
SET 
    status = 'approved', 
    approved_at = COALESCE(approved_at, created_at), 
    approved_by = COALESCE(approved_by, 'system')
WHERE status IS NULL OR status = 'pending';

-- Enable RLS if not already enabled
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view comments" ON comments;
DROP POLICY IF EXISTS "Public can view approved comments" ON comments;
DROP POLICY IF EXISTS "Users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;
DROP POLICY IF EXISTS "Service role can view all comments" ON comments;

-- Create new policies
CREATE POLICY "Public can view approved comments" ON comments
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can insert comments" ON comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own comments" ON comments
    FOR UPDATE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can delete their own comments" ON comments
    FOR DELETE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Allow service role to view all comments (for admin)
CREATE POLICY "Service role can view all comments" ON comments
    FOR ALL USING (current_setting('role') = 'service_role');

-- Update comments to include user details from user_data JSONB (only if user_data column exists and has data)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'user_data') THEN
        UPDATE comments 
        SET 
            user_company = COALESCE(user_data->>'company', ''),
            user_title = COALESCE(user_data->>'title', '')
        WHERE user_data IS NOT NULL 
          AND user_data != 'null'::jsonb 
          AND (user_company IS NULL OR user_title IS NULL);
    END IF;
END $$;

-- Create updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ language 'plpgsql';

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();