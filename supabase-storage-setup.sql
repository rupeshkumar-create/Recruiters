-- Supabase Storage Setup for Recruiter Directory
-- IMPORTANT: Do NOT run this SQL directly in the SQL Editor
-- Instead, follow the manual setup steps below

-- ========================================
-- MANUAL SETUP STEPS (Required)
-- ========================================

-- Step 1: Create Storage Buckets via Supabase Dashboard
-- Go to Storage > Create Bucket in your Supabase Dashboard

-- Bucket 1: headshots
-- - Name: headshots
-- - Public: Yes
-- - File size limit: 5MB
-- - Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

-- Bucket 2: logos  
-- - Name: logos
-- - Public: Yes
-- - File size limit: 2MB
-- - Allowed MIME types: image/jpeg, image/png, image/webp, image/svg+xml

-- ========================================
-- ALTERNATIVE: Use Supabase CLI (if available)
-- ========================================

-- If you have Supabase CLI installed, you can run:
-- supabase storage create headshots --public
-- supabase storage create logos --public

-- ========================================
-- RLS POLICIES (Run these in SQL Editor)
-- ========================================

-- These policies can be run in the SQL Editor since they don't require special permissions
-- Note: Run each policy separately, ignore "already exists" errors if re-running

-- Drop existing policies first (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Public read access for headshots" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload headshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update headshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete headshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete logos" ON storage.objects;

-- Create new policies
-- Allow public read access to all files
CREATE POLICY "Public read access for headshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'headshots');

CREATE POLICY "Public read access for logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

-- Allow anyone to upload files (since we don't have user authentication)
CREATE POLICY "Anyone can upload headshots" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'headshots');

CREATE POLICY "Anyone can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos');

-- Allow anyone to update files (optional)
CREATE POLICY "Anyone can update headshots" ON storage.objects
  FOR UPDATE USING (bucket_id = 'headshots');

CREATE POLICY "Anyone can update logos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'logos');

-- Allow anyone to delete files (optional - be careful with this)
CREATE POLICY "Anyone can delete headshots" ON storage.objects
  FOR DELETE USING (bucket_id = 'headshots');

CREATE POLICY "Anyone can delete logos" ON storage.objects
  FOR DELETE USING (bucket_id = 'logos');