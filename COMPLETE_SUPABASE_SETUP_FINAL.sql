-- ========================================
-- COMPLETE SUPABASE SETUP - FINAL VERSION
-- Run this SQL in your Supabase SQL Editor
-- ========================================

-- Clean up existing tables and policies first
DROP TRIGGER IF EXISTS update_recruiters_updated_at ON public.recruiters;
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
DROP TRIGGER IF EXISTS update_submissions_updated_at ON public.submissions;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop existing policies
DROP POLICY IF EXISTS "Public recruiters are viewable by everyone" ON public.recruiters;
DROP POLICY IF EXISTS "Public testimonials are viewable by everyone" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can submit recruiter profiles" ON public.submissions;
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin full access to recruiters" ON public.recruiters;
DROP POLICY IF EXISTS "Admin full access to testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin full access to submissions" ON public.submissions;
DROP POLICY IF EXISTS "Allow all operations" ON public.recruiters;

-- Drop existing tables (this will remove any existing data)
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.recruiters CASCADE;

-- ========================================
-- CREATE TABLES WITH VARCHAR IDs
-- ========================================

-- Create recruiters table with VARCHAR IDs (matching your data format)
CREATE TABLE public.recruiters (
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
    submitter_email VARCHAR(255),
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
    status VARCHAR(20) DEFAULT 'pending',
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
    status VARCHAR(20) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- CREATE INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX idx_recruiters_status ON public.recruiters(status);
CREATE INDEX idx_recruiters_featured ON public.recruiters(featured);
CREATE INDEX idx_recruiters_hidden ON public.recruiters(hidden);
CREATE INDEX idx_recruiters_specialization ON public.recruiters(specialization);
CREATE INDEX idx_recruiters_location ON public.recruiters(location);
CREATE INDEX idx_recruiters_slug ON public.recruiters(slug);
CREATE INDEX idx_testimonials_recruiter_id ON public.testimonials(recruiter_id);
CREATE INDEX idx_testimonials_status ON public.testimonials(status);
CREATE INDEX idx_submissions_status ON public.submissions(status);

-- ========================================
-- CREATE TRIGGERS FOR UPDATED_AT
-- ========================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_recruiters_updated_at 
    BEFORE UPDATE ON public.recruiters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON public.testimonials 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at 
    BEFORE UPDATE ON public.submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- ========================================
-- CREATE RLS POLICIES
-- ========================================

-- Allow all operations on recruiters (for admin functionality)
CREATE POLICY "Allow all operations" ON public.recruiters FOR ALL USING (true) WITH CHECK (true);

-- Allow public read access to approved testimonials
CREATE POLICY "Public testimonials are viewable by everyone" ON public.testimonials
    FOR SELECT USING (status = 'approved');

-- Allow anyone to submit testimonials
CREATE POLICY "Anyone can submit testimonials" ON public.testimonials
    FOR INSERT WITH CHECK (true);

-- Allow admin full access to testimonials
CREATE POLICY "Admin full access to testimonials" ON public.testimonials
    FOR ALL USING (true);

-- Allow anyone to submit recruiter profiles
CREATE POLICY "Anyone can submit recruiter profiles" ON public.submissions
    FOR INSERT WITH CHECK (true);

-- Allow admin full access to submissions
CREATE POLICY "Admin full access to submissions" ON public.submissions
    FOR ALL USING (true);

-- ========================================
-- STORAGE POLICIES (for file uploads)
-- ========================================

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public read access for headshots" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload headshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update headshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update logos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete headshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete logos" ON storage.objects;

-- Create storage policies (these will work if you have storage buckets)
CREATE POLICY "Public read access for headshots" ON storage.objects
    FOR SELECT USING (bucket_id = 'headshots');

CREATE POLICY "Public read access for logos" ON storage.objects
    FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Anyone can upload headshots" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'headshots');

CREATE POLICY "Anyone can upload logos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Anyone can update headshots" ON storage.objects
    FOR UPDATE USING (bucket_id = 'headshots');

CREATE POLICY "Anyone can update logos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'logos');

CREATE POLICY "Anyone can delete headshots" ON storage.objects
    FOR DELETE USING (bucket_id = 'headshots');

CREATE POLICY "Anyone can delete logos" ON storage.objects
    FOR DELETE USING (bucket_id = 'logos');

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

SELECT 'Complete Supabase setup finished successfully! Ready for admin functionality.' as result