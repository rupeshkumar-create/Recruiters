-- Migration script to update submissions table from 'name' to 'first_name' and 'last_name'
-- Run this SQL in your Supabase SQL editor AFTER the main schema has been created

-- Step 1: Add the new columns if they don't exist
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);

-- Step 2: Migrate existing data (if any) from 'name' to 'first_name' and 'last_name'
-- This assumes names are in "First Last" format, adjust as needed
UPDATE submissions 
SET 
  first_name = CASE 
    WHEN name IS NOT NULL AND name != '' THEN 
      TRIM(SPLIT_PART(name, ' ', 1))
    ELSE 'Unknown'
  END,
  last_name = CASE 
    WHEN name IS NOT NULL AND name != '' AND POSITION(' ' IN name) > 0 THEN 
      TRIM(SUBSTRING(name FROM POSITION(' ' IN name) + 1))
    ELSE ''
  END
WHERE name IS NOT NULL;

-- Step 3: Set NOT NULL constraints on the new columns
ALTER TABLE submissions 
ALTER COLUMN first_name SET NOT NULL,
ALTER COLUMN last_name SET NOT NULL;

-- Step 4: Drop the old 'name' column (optional - uncomment if you want to remove it)
-- ALTER TABLE submissions DROP COLUMN IF EXISTS name;

-- Step 5: Update any existing indexes or constraints if needed
-- (No additional indexes needed for first_name/last_name based on current schema)

-- Verification query to check the migration
-- SELECT id, first_name, last_name, name FROM submissions LIMIT 5;