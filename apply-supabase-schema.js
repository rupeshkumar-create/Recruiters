const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function applySupabaseSchema() {
  console.log('🔧 Applying Supabase Schema...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing Supabase environment variables');
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('✅ Connected to Supabase');

    // Read the schema SQL
    let schemaSQL;
    try {
      schemaSQL = fs.readFileSync('supabase_schema_fixed.sql', 'utf8');
      console.log('✅ Schema file loaded');
    } catch (error) {
      console.log('❌ Could not read supabase_schema_fixed.sql');
      console.log('Creating schema from your provided SQL...');
      
      // Use the schema you provided
      schemaSQL = `
-- Supabase Database Schema for Recruiter Directory
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create recruiters table
CREATE TABLE IF NOT EXISTS public.recruiters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recruiter_id UUID NOT NULL REFERENCES public.recruiters(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_recruiters_status ON public.recruiters(status);
CREATE INDEX IF NOT EXISTS idx_recruiters_featured ON public.recruiters(featured);
CREATE INDEX IF NOT EXISTS idx_recruiters_hidden ON public.recruiters(hidden);
CREATE INDEX IF NOT EXISTS idx_recruiters_specialization ON public.recruiters(specialization);
CREATE INDEX IF NOT EXISTS idx_recruiters_location ON public.recruiters(location);
CREATE INDEX IF NOT EXISTS idx_recruiters_slug ON public.recruiters(slug);
CREATE INDEX IF NOT EXISTS idx_testimonials_recruiter_id ON public.testimonials(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON public.testimonials(status);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_recruiters_updated_at BEFORE UPDATE ON public.recruiters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to approved recruiters
CREATE POLICY "Public recruiters are viewable by everyone" ON public.recruiters
FOR SELECT USING (status = 'approved' AND hidden = false);

-- Create policies for public read access to approved testimonials
CREATE POLICY "Public testimonials are viewable by everyone" ON public.testimonials
FOR SELECT USING (status = 'approved');

-- Create policies for public insert on submissions and testimonials
CREATE POLICY "Anyone can submit recruiter profiles" ON public.submissions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit testimonials" ON public.testimonials
FOR INSERT WITH CHECK (true);

-- Admin policies (you'll need to set up authentication for these)
-- For now, we'll allow all operations for development
CREATE POLICY "Admin full access to recruiters" ON public.recruiters
FOR ALL USING (true);

CREATE POLICY "Admin full access to testimonials" ON public.testimonials
FOR ALL USING (true);

CREATE POLICY "Admin full access to submissions" ON public.submissions
FOR ALL USING (true);
      `;
    }

    console.log('📝 Applying schema to database...');
    
    // Note: Supabase client doesn't support running raw SQL directly
    // The schema needs to be applied through the Supabase dashboard SQL editor
    console.log('⚠️  Note: The schema needs to be applied through the Supabase dashboard');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the schema SQL');
    console.log('4. Run the SQL to create tables and policies');
    
    // Test if tables exist
    console.log('\n🔍 Checking if tables exist...');
    
    const { data: recruiters, error: recruitersError } = await supabase
      .from('recruiters')
      .select('count', { count: 'exact', head: true });

    if (recruitersError) {
      console.log('❌ Recruiters table not found:', recruitersError.message);
      console.log('Please apply the schema in Supabase SQL Editor');
    } else {
      console.log('✅ Recruiters table exists');
    }

    const { data: testimonials, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('count', { count: 'exact', head: true });

    if (testimonialsError) {
      console.log('❌ Testimonials table not found');
    } else {
      console.log('✅ Testimonials table exists');
    }

    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('count', { count: 'exact', head: true });

    if (submissionsError) {
      console.log('❌ Submissions table not found');
    } else {
      console.log('✅ Submissions table exists');
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

applySupabaseSchema();