# Supabase Storage Setup Guide

## 🚨 Important: Manual Setup Required

The storage buckets **cannot** be created via SQL commands due to permission restrictions. You must create them manually through the Supabase Dashboard.

## 📋 Step-by-Step Setup

### Step 1: Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project

### Step 2: Create Storage Buckets

#### Create "headshots" Bucket
1. Navigate to **Storage** in the left sidebar
2. Click **"Create Bucket"**
3. Configure the bucket:
   - **Name**: `headshots`
   - **Public**: ✅ **Yes** (Enable public access)
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/png` 
     - `image/webp`
     - `image/gif`
4. Click **"Create Bucket"**

#### Create "logos" Bucket
1. Click **"Create Bucket"** again
2. Configure the bucket:
   - **Name**: `logos`
   - **Public**: ✅ **Yes** (Enable public access)
   - **File size limit**: `2097152` (2MB)
   - **Allowed MIME types**:
     - `image/jpeg`
     - `image/png`
     - `image/webp`
     - `image/svg+xml`
3. Click **"Create Bucket"**

### Step 3: Set Up RLS Policies (SQL Editor)
1. Go to **SQL Editor** in the left sidebar
2. Create a new query
3. Copy and paste this SQL:

```sql
-- Drop existing policies first (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Public read access for headshots" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload headshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload logos" ON storage.objects;

-- Create new policies
-- Allow public read access to all files
CREATE POLICY "Public read access for headshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'headshots');

CREATE POLICY "Public read access for logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

-- Allow anyone to upload files
CREATE POLICY "Anyone can upload headshots" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'headshots');

CREATE POLICY "Anyone can upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos');
```

4. Click **"Run"** to execute the policies
5. Ignore any "policy does not exist" errors from the DROP statements

## 🔧 Alternative: Supabase CLI Method

If you have the Supabase CLI installed:

```bash
# Create buckets
supabase storage create headshots --public
supabase storage create logos --public

# Then run the RLS policies in the SQL Editor as shown above
```

## ✅ Verification

### Check Buckets Created
1. Go to **Storage** in your Supabase Dashboard
2. You should see both buckets:
   - `headshots` (Public, 5MB limit)
   - `logos` (Public, 2MB limit)

### Test Upload (Optional)
1. Click on the `headshots` bucket
2. Try uploading a test image
3. Verify you can access the public URL

## 🚨 Common Issues & Solutions

### Issue: "must be owner of table objects"
- **Cause**: Trying to run bucket creation SQL directly
- **Solution**: Use the Dashboard method above

### Issue: Bucket not found in application
- **Cause**: Bucket name mismatch or not created
- **Solution**: Verify bucket names are exactly `headshots` and `logos`

### Issue: Upload fails with 403 error
- **Cause**: RLS policies not set up correctly
- **Solution**: Run the RLS policy SQL from Step 3

### Issue: Files not publicly accessible
- **Cause**: Bucket not set to public
- **Solution**: Edit bucket settings and enable public access

## 🔗 Environment Variables

Make sure these are set in your Vercel deployment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📊 Expected File Structure

After setup, your uploads will be stored as:
- Headshots: `https://your-project.supabase.co/storage/v1/object/public/headshots/headshot-timestamp.jpg`
- Logos: `https://your-project.supabase.co/storage/v1/object/public/logos/logo-timestamp.png`

## 🎯 Next Steps

1. ✅ Create both storage buckets via Dashboard
2. ✅ Run RLS policies via SQL Editor  
3. ✅ Deploy your application to Vercel
4. ✅ Test file uploads in your application

Your application will automatically use Supabase Storage once the buckets are created!