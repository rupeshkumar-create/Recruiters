# 🚀 Local Testing Guide

## 🎯 Current Status
- ✅ Dependencies installed
- ✅ Environment file exists
- ⚠️ Supabase credentials need to be configured (optional for local testing)

## 🔧 Quick Start (Without Supabase)

The app will work locally using file-based storage as fallback:

```bash
npm run dev
```

**What you can test:**
- ✅ Homepage with 3 default recruiters
- ✅ Submission form (saves to local files)
- ✅ Admin panel functionality
- ✅ File uploads (as data URLs)
- ✅ All UI components and interactions

## 🗄️ Full Database Testing (With Supabase)

If you want to test with real database:

### Step 1: Get Supabase Credentials
1. Go to [supabase.com](https://supabase.com)
2. Create/access your project
3. Go to **Settings** → **API**
4. Copy these values:
   - Project URL
   - Anon public key  
   - Service role key

### Step 2: Update .env.local
Replace the placeholder values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
```

### Step 3: Set Up Database Tables
Run in Supabase SQL Editor:
```sql
-- Copy contents from supabase_schema_fixed.sql
```

### Step 4: Set Up Storage Buckets
Follow instructions in `SUPABASE_STORAGE_SETUP_GUIDE.md`

## 🧪 Testing Checklist

### Homepage Testing
- [ ] Visit `http://localhost:3000`
- [ ] See recruiters displayed
- [ ] Test search functionality
- [ ] Test filtering options
- [ ] Click on individual recruiter profiles

### Submission Flow Testing
- [ ] Click "Submit Your Profile" 
- [ ] Fill out the multi-step form
- [ ] Upload a headshot
- [ ] Submit the form
- [ ] Check if submission appears in admin panel

### Admin Panel Testing
- [ ] Visit `http://localhost:3000/admin`
- [ ] Check submissions in `http://localhost:3000/admin/submissions`
- [ ] Try approving a submission
- [ ] Edit a recruiter in `http://localhost:3000/admin/edit`
- [ ] Change a photo and see if it updates

### API Testing
- [ ] Test debug endpoint: `http://localhost:3000/api/debug`
- [ ] Test recruiters API: `http://localhost:3000/api/recruiters`
- [ ] Test submissions API: `http://localhost:3000/api/submissions`

## 🔍 Debug Endpoints

### Check System Status
```bash
curl http://localhost:3000/api/debug
```

### Test Migration
```bash
curl -X POST http://localhost:3000/api/migrate-data
```

### Force Migration (if Supabase configured)
```bash
curl -X POST http://localhost:3000/api/force-migrate
```

## 📊 Expected Behavior

### Without Supabase (File Storage)
- Homepage shows 3 default recruiters
- Submissions save to `data/submissions.json`
- Admin changes save to `data/recruiters.json`
- File uploads become data URLs

### With Supabase (Database)
- Homepage shows all recruiters from database
- Submissions save to `submissions` table
- Admin changes save to `recruiters` table  
- File uploads go to Supabase Storage

## 🚨 Common Issues & Solutions

### Issue: "Module not found"
**Solution**: Run `npm install` again

### Issue: "Port 3000 already in use"
**Solution**: 
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
npm run dev -- -p 3001
```

### Issue: "Supabase client not available"
**Solution**: This is normal without Supabase setup - app uses file fallback

### Issue: Changes not persisting
**Solution**: Check `data/` folder is created and writable

## 🎯 Testing Focus Areas

Since you're testing the production fixes:

1. **Recruiter Display**: Verify more than 3 recruiters show (if Supabase connected)
2. **Admin Edits**: Change recruiter details and verify they persist
3. **Photo Updates**: Upload new photos and see immediate updates
4. **Submission Flow**: Submit → Admin Review → Approval → Homepage display

## 🚀 Ready to Start!

Run this command to start testing:
```bash
npm run dev
```

Then visit: `http://localhost:3000`