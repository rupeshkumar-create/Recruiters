# 🔧 UUID Error Fix Guide

## 🚨 **Error Explanation**
```json
{
  "success": false,
  "error": {
    "code": "22P02",
    "message": "invalid input syntax for type uuid: \"1\""
  }
}
```

**Problem**: Your recruiter data uses simple IDs like "1", "2", "3", but Supabase tables were created expecting UUID format (like `550e8400-e29b-41d4-a716-446655440000`).

## ✅ **Quick Fix Solution**

### **Step 1: Fix Supabase Tables**
1. Go to your Supabase Dashboard: https://vgonkiijhwfmlmbztoka.supabase.co
2. Click **"SQL Editor"** in the left sidebar
3. Copy and paste this SQL to fix the tables:

```sql
-- Drop existing tables with UUID format
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.recruiters CASCADE;

-- Recreate with VARCHAR IDs (compatible with your data)
CREATE TABLE public.recruiters (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255),
    company VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    linkedin VARCHAR(500) NOT NULL,
    website VARCHAR(500),
    specialization VARCHAR(255) NOT NULL,
    experience VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    remote_available BOOLEAN DEFAULT false,
    bio TEXT NOT NULL,
    avatar VARCHAR(500) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    featured BOOLEAN DEFAULT false,
    hidden BOOLEAN DEFAULT false,
    approved BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitter_email VARCHAR(255),
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    placements INTEGER DEFAULT 0,
    avg_time_to_hire INTEGER DEFAULT 30,
    candidate_satisfaction INTEGER DEFAULT 90 CHECK (candidate_satisfaction >= 0 AND candidate_satisfaction <= 100),
    client_retention INTEGER DEFAULT 85 CHECK (client_retention >= 0 AND client_retention <= 100),
    badge VARCHAR(20) CHECK (badge IN ('verified', 'top-rated', 'rising-star')),
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

-- Create testimonials table
CREATE TABLE public.testimonials (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    recruiter_id VARCHAR(50) NOT NULL REFERENCES public.recruiters(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    testimonial TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE public.submissions (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
    avatar VARCHAR(500),
    submitter_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_recruiters_status ON public.recruiters(status);
CREATE INDEX idx_recruiters_featured ON public.recruiters(featured);
CREATE INDEX idx_recruiters_hidden ON public.recruiters(hidden);
CREATE INDEX idx_recruiters_specialization ON public.recruiters(specialization);
CREATE INDEX idx_recruiters_location ON public.recruiters(location);
CREATE INDEX idx_recruiters_slug ON public.recruiters(slug);
CREATE INDEX idx_testimonials_recruiter_id ON public.testimonials(recruiter_id);
CREATE INDEX idx_testimonials_status ON public.testimonials(status);
CREATE INDEX idx_submissions_status ON public.submissions(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_recruiters_updated_at BEFORE UPDATE ON public.recruiters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public recruiters are viewable by everyone" ON public.recruiters
    FOR SELECT USING (status = 'approved' AND hidden = false);

CREATE POLICY "Public testimonials are viewable by everyone" ON public.testimonials
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can submit recruiter profiles" ON public.submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit testimonials" ON public.testimonials
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access to recruiters" ON public.recruiters
    FOR ALL USING (true);

CREATE POLICY "Admin full access to testimonials" ON public.testimonials
    FOR ALL USING (true);

CREATE POLICY "Admin full access to submissions" ON public.submissions
    FOR ALL USING (true);
```

### **Step 2: Run the SQL**
1. Click **"Run"** in the SQL Editor
2. Wait for completion (should show success messages)

### **Step 3: Retry Migration**
1. Go back to `http://localhost:3000/admin/migrate`
2. Click **"Start Migration"** again
3. Should now work without UUID errors

## 🎯 **What This Fixes**

### **Before (Broken)**
- Database expects: `550e8400-e29b-41d4-a716-446655440000`
- Your data has: `"1"`, `"2"`, `"3"`
- Result: UUID format error

### **After (Fixed)**
- Database accepts: Any string up to 50 characters
- Your data has: `"1"`, `"2"`, `"3"`
- Result: Migration works perfectly

## ✅ **Verification Steps**

### **1. Check Tables Created**
In Supabase Dashboard → Table Editor:
- ✅ `recruiters` table exists
- ✅ `testimonials` table exists  
- ✅ `submissions` table exists

### **2. Test Migration**
```bash
curl -X POST http://localhost:3000/api/migrate \
  -H "Content-Type: application/json" \
  -d '{"action": "migrate"}'
```

Should return:
```json
{
  "success": true,
  "count": 20
}
```

### **3. Verify Data**
In Supabase → Table Editor → recruiters:
- Should see 20 recruiter records
- IDs should be "1", "2", "3", etc.

## 🚀 **Alternative: Use Admin Panel**

1. Go to `http://localhost:3000/admin/migrate`
2. Click **"Copy SQL Statements"** 
3. Paste in Supabase SQL Editor
4. Run the SQL
5. Click **"Start Migration"** in admin panel

## 🔄 **If Still Having Issues**

### **Clear and Restart**
```bash
# In Supabase SQL Editor, run:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

# Then run the fixed SQL above
```

### **Check Environment Variables**
Verify `.env.local` has correct Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## ✅ **Status After Fix**

- ✅ **Database Schema**: Compatible with string IDs
- ✅ **Migration**: Works without UUID errors
- ✅ **Data Integrity**: All 20 recruiters preserved
- ✅ **Functionality**: Real-time sync enabled

The UUID error should be completely resolved! 🎉

## 🎯 **Next Steps**

1. **Run the SQL fix** in Supabase
2. **Retry migration** in admin panel
3. **Verify success** - check Supabase tables
4. **Test functionality** - edit recruiters in admin
5. **Enjoy real-time sync** between admin and homepage

Your recruiter directory will now work seamlessly with Supabase! 🚀