-- Add user company and title fields to votes table
-- This migration adds user_company and user_title columns to the votes table

-- Add user_company column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'user_company') THEN
        ALTER TABLE votes ADD COLUMN user_company VARCHAR(255);
        RAISE NOTICE 'Added user_company column to votes table';
    ELSE
        RAISE NOTICE 'user_company column already exists in votes table';
    END IF;
END $$;

-- Add user_title column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'user_title') THEN
        ALTER TABLE votes ADD COLUMN user_title VARCHAR(255);
        RAISE NOTICE 'Added user_title column to votes table';
    ELSE
        RAISE NOTICE 'user_title column already exists in votes table';
    END IF;
END $$;

-- Update existing votes to extract company and title from user_data JSONB
UPDATE votes 
SET 
    user_company = COALESCE(user_data->>'company', ''),
    user_title = COALESCE(user_data->>'title', '')
WHERE user_data IS NOT NULL 
  AND user_data != 'null'::jsonb 
  AND (user_company IS NULL OR user_title IS NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_user_company ON votes(user_company);
CREATE INDEX IF NOT EXISTS idx_votes_user_title ON votes(user_title);