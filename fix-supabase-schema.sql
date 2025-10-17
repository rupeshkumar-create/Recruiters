-- Drop existing table if it has wrong schema
DROP TABLE IF EXISTS public.recruiters CASCADE;

-- Create recruiters table with VARCHAR IDs (not UUID)
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

-- Enable Row Level Security
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;

-- Allow all operations (for admin functionality)
CREATE POLICY "Allow all operations" ON public.recruiters FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recruiters_updated_at 
    BEFORE UPDATE ON public.recruiters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();