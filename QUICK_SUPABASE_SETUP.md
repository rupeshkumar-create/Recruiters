# 🚀 QUICK Supabase Setup - Fix Admin Changes Not Reflecting

## 🎯 Issue
Admin changes aren't reflecting because the app is using migration data instead of Supabase database.

## 📋 Quick Fix Steps

### Step 1: Get Your Supabase Credentials (2 minutes)

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign in** and select your project (or create new one)
3. **Go to Settings → API**
4. **Copy these 3 values:**
   - Project URL (e.g., `https://abc123.supabase.co`)
   - Anon public key (long string starting with `eyJhbGciOiJIUzI1NiIs...`)
   - Service role key (long string starting with `eyJhbGciOiJIUzI1NiIs...`)

### Step 2: Update Your .env.local File

Replace the placeholder values in `.env.local`:

```env
# Replace these lines with your actual values:
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

### Step 3: Set Up Database Tables (1 minute)

1. **Go to Supabase Dashboard → SQL Editor**
2. **Copy this SQL and run it:**

```sql
-- Create recruiters table
CREATE TABLE IF NOT EXISTS public.recruiters (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255),
    company VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    linkedin VARCHAR(500) NOT NULL,
    website VARCHAR(500),
    specialization VARCHAR(255) NOT NULL,
    experience VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    remote_available BOOLEAN DEFAULT false,
    bio TEXT NOT NULL,
    avatar VARCHAR(500) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    featured BOOLEAN DEFAULT false,
    hidden BOOLEAN DEFAULT false,
    approved BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'approved',
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    placements INTEGER DEFAULT 0,
    avg_time_to_hire INTEGER DEFAULT 30,
    candidate_satisfaction INTEGER DEFAULT 90,
    client_retention INTEGER DEFAULT 85,
    badge VARCHAR(20),
    achievements TEXT[],
    work_experience JSONB,
    roles_placed TEXT[],
    industries TEXT[],
    keywords TEXT[],
    languages TEXT[],
    seniority_levels TEXT[],
    employment_types TEXT[],
    regions TEXT[],
    certifications TEXT[],
    testimonials JSONB,
    availability JSONB,
    social_proof JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for testing)
CREATE POLICY "Allow all operations on recruiters" ON public.recruiters
FOR ALL USING (true) WITH CHECK (true);
```

### Step 4: Restart and Sync (30 seconds)

```bash
# Stop your dev server (Ctrl+C) and restart
npm run dev

# In another terminal, sync your data:
curl -X POST http://localhost:3000/api/sync-to-supabase
```

### Step 5: Test Admin Changes

1. **Go to:** `http://localhost:3000/admin/edit`
2. **Edit any recruiter** (change name or photo)
3. **Save changes**
4. **Check homepage** - changes should appear immediately!

## ✅ Success Indicators

After setup, you should see:

```bash
# Check if Supabase is connected:
curl http://localhost:3000/api/debug
# Should show: "recruitersTable": {"accessible": true, "hasData": true}

# Check if data is in Supabase:
curl http://localhost:3000/api/recruiters | jq length
# Should show: 10 (not from migration data)
```

## 🎯 Expected Behavior After Fix

- ✅ **Admin edits save to Supabase database**
- ✅ **Homepage refreshes automatically with new data**
- ✅ **Individual profile pages show updated info**
- ✅ **Changes persist across browser refreshes**
- ✅ **All pages show consistent data**

## 🚨 If Still Not Working

Check server logs for errors:
- Look for "✅ Loaded X recruiters from Supabase" (good)
- Avoid "📁 Using migration data fallback" (means Supabase not connected)

**This should take less than 5 minutes total and will make admin changes reflect everywhere immediately!**