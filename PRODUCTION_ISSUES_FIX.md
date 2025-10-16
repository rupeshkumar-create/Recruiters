# 🚨 Production Issues Fix Guide

## Issues Identified

### 1. Submissions Not Showing in Admin Panel
**Problem**: New submissions are being created but not appearing in the admin panel.

**Root Causes**:
- Supabase connection issues in production
- Environment variables not properly set
- Submissions falling back to file storage (not accessible in Vercel)

### 2. Only 3 Recruiters Showing
**Problem**: Homepage only displays 3 recruiters instead of all available recruiters.

**Root Causes**:
- Supabase not connected, falling back to hardcoded migration data
- Database not populated with recruiter data
- Environment variables missing or incorrect

## 🔧 Immediate Fixes

### Fix 1: Environment Variables in Vercel

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add/Verify these variables**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
LOOPS_API_KEY=your_loops_key_here (optional)
```

3. **Redeploy** after adding variables

### Fix 2: Supabase Database Setup

1. **Create Tables** (if not exists):
```sql
-- Run in Supabase SQL Editor
-- Copy from supabase_schema_fixed.sql
```

2. **Create Storage Buckets**:
- Go to Supabase Dashboard → Storage
- Create bucket: `headshots` (public, 5MB limit)
- Create bucket: `logos` (public, 2MB limit)

3. **Run Storage Policies**:
```sql
-- Copy from supabase-storage-setup.sql
```

### Fix 3: Data Migration

1. **Migrate Existing Recruiters**:
```bash
# Use the migration API endpoint
curl -X POST https://your-vercel-domain.vercel.app/api/migrate-data
```

2. **Or manually add recruiters via admin panel**

## 🔍 Diagnostic Steps

### Step 1: Test API Endpoints
```bash
# Test recruiters API
curl https://your-vercel-domain.vercel.app/api/recruiters

# Test submissions API  
curl https://your-vercel-domain.vercel.app/api/submissions
```

### Step 2: Check Supabase Connection
1. Go to your Supabase project
2. Check if tables exist: `recruiters`, `submissions`, `testimonials`
3. Verify data exists in tables
4. Test API keys in Supabase settings

### Step 3: Test Submission Flow
1. Submit a test profile on your site
2. Check if it appears in Supabase `submissions` table
3. Check if it appears in admin panel
4. Try approving it and see if it moves to `recruiters` table

## 🎯 Expected Results After Fix

### Submissions
- ✅ New submissions save to Supabase `submissions` table
- ✅ Submissions appear in admin panel immediately
- ✅ Approved submissions move to `recruiters` table
- ✅ Approved recruiters appear on homepage

### Recruiters
- ✅ All recruiters from database display on homepage
- ✅ Filtering and search work properly
- ✅ Individual recruiter pages load correctly

## 🚀 Quick Fix Script

Create this temporary fix to populate data:

```javascript
// Run in browser console on your admin page
async function quickFix() {
  // Test submissions API
  const submissionsResponse = await fetch('/api/submissions');
  const submissions = await submissionsResponse.json();
  console.log('Submissions:', submissions.length);
  
  // Test recruiters API
  const recruitersResponse = await fetch('/api/recruiters');
  const recruiters = await recruitersResponse.json();
  console.log('Recruiters:', recruiters.length);
  
  // If recruiters < 5, likely using fallback data
  if (recruiters.length <= 3) {
    console.log('⚠️ Using fallback data - Supabase not connected');
  }
}
quickFix();
```

## 📋 Verification Checklist

- [ ] Environment variables set in Vercel
- [ ] Supabase tables created
- [ ] Storage buckets created
- [ ] RLS policies applied
- [ ] Test submission works
- [ ] Submissions appear in admin panel
- [ ] Recruiters display on homepage
- [ ] Approval flow works end-to-end

## 🆘 If Still Not Working

1. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Functions → View Logs
   - Look for Supabase connection errors

2. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs
   - Look for API call errors

3. **Test Locally**:
   - Set same environment variables locally
   - Test if everything works locally
   - Compare local vs production behavior

The main issue is likely that Supabase is not properly connected in production, causing the app to fall back to hardcoded data and file storage.