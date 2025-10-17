# 🚀 Complete Supabase Setup Guide

## 🎯 Overview
This guide will set up your application to use Supabase exclusively for all data storage, ensuring admin changes reflect everywhere immediately.

## 📋 Step 1: Get Supabase Credentials

### 1.1 Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (or create a new one)

### 1.2 Get API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **Service role key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 📋 Step 2: Configure Local Environment

### Option A: Automated Setup (Recommended)
```bash
node setup-supabase-local.js
```
Follow the prompts to enter your credentials.

### Option B: Manual Setup
Edit `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
USE_SUPABASE=true
```

## 📋 Step 3: Set Up Database Tables

### 3.1 Create Tables
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `supabase_schema_fixed.sql`
3. Click **Run** to create all tables

### 3.2 Set Up Storage Buckets
1. Go to **Storage** → **Create Bucket**
2. Create bucket: `headshots` (Public, 5MB limit)
3. Create bucket: `logos` (Public, 2MB limit)

### 3.3 Apply Storage Policies
1. Go to **SQL Editor**
2. Copy and paste the contents of `supabase-storage-setup.sql`
3. Click **Run** to apply RLS policies

## 📋 Step 4: Initialize Data

### 4.1 Restart Development Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 4.2 Populate Database
```bash
curl -X POST http://localhost:3000/api/force-migrate
```

### 4.3 Verify Setup
```bash
curl http://localhost:3000/api/debug
```

Expected response should show:
```json
{
  "environment": {
    "supabaseUrl": "Set",
    "supabaseAnonKey": "Set", 
    "supabaseServiceKey": "Set"
  },
  "tests": {
    "recruitersTable": {"accessible": true, "hasData": true},
    "recruitersCount": 10
  }
}
```

## 🧪 Step 5: Test Everything

### 5.1 Test Homepage
- Visit `http://localhost:3000`
- Should show 10 recruiters with professional photos
- All data loaded from Supabase

### 5.2 Test Admin Changes
1. Go to `http://localhost:3000/admin/edit`
2. Edit any recruiter (name, photo, bio)
3. Save changes
4. Check homepage - changes should appear immediately
5. Refresh browser - changes should persist

### 5.3 Test API Endpoints
```bash
# Get all recruiters (from Supabase)
curl http://localhost:3000/api/recruiters

# Update a recruiter
curl -X PUT http://localhost:3000/api/recruiters/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Verify update
curl http://localhost:3000/api/recruiters/1
```

## ✅ Success Indicators

### Database Connection
- ✅ Debug endpoint shows all "Set" for environment variables
- ✅ `recruitersTable.accessible: true`
- ✅ `recruitersCount > 0`

### Data Flow
- ✅ Homepage loads recruiters from Supabase
- ✅ Admin edits save to Supabase
- ✅ Changes reflect immediately everywhere
- ✅ No file storage fallbacks used

### Admin Panel
- ✅ Edit form loads current data from Supabase
- ✅ Save button updates Supabase database
- ✅ Changes appear on homepage instantly
- ✅ Photo uploads work with Supabase Storage

## 🔧 Troubleshooting

### Issue: "Supabase not configured"
**Solution**: Check environment variables are set correctly

### Issue: "Table does not exist"
**Solution**: Run the SQL schema from `supabase_schema_fixed.sql`

### Issue: "No recruiters found"
**Solution**: Run `curl -X POST http://localhost:3000/api/force-migrate`

### Issue: Admin changes don't persist
**Solution**: Check Supabase service role key has proper permissions

## 🎯 Production Deployment

The same setup works for production:
1. Set environment variables in Vercel
2. Ensure Supabase tables exist
3. Run force migration if needed
4. Test admin functionality

## 📊 Architecture

```
Frontend (Admin Panel) 
    ↓ (PUT /api/recruiters/[id])
Supabase Database 
    ↓ (GET /api/recruiters)
Homepage (Real-time updates)
```

**All data flows through Supabase - no local files, no fallbacks, immediate consistency everywhere!**