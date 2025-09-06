-- Supabase Database Schema for AI Staffing Tools Directory
-- Run this SQL in your Supabase SQL editor to create the necessary tables
-- This version handles existing tables gracefully

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS submission_categories CASCADE;
DROP TABLE IF EXISTS tool_categories CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS tools CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tools table (for approved tools)
CREATE TABLE tools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  tagline TEXT,
  content TEXT,
  description TEXT,
  logo TEXT,
  slug VARCHAR(255) NOT NULL UNIQUE,
  featured BOOLEAN DEFAULT FALSE,
  hidden BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT TRUE,
  submitter_email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table (for pending submissions)
CREATE TABLE submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  tagline TEXT,
  content TEXT,
  description TEXT,
  logo TEXT,
  slug VARCHAR(255) NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  hidden BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitter_email VARCHAR(255) NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tool categories junction table (many-to-many)
CREATE TABLE tool_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tool_id, category_id)
);

-- Submission categories junction table (many-to-many)
CREATE TABLE submission_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX idx_tools_featured ON tools(featured);
CREATE INDEX idx_tools_hidden ON tools(hidden);
CREATE INDEX idx_tools_approved ON tools(approved);
CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitter_email ON submissions(submitter_email);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories (based on existing data)
INSERT INTO categories (name, slug) VALUES
('Candidate Presentation', 'candidate-presentation'),
('Analytics', 'analytics'),
('Resume Screening', 'resume-screening'),
('ATS', 'ats'),
('CRM', 'crm'),
('Sourcing', 'sourcing'),
('Interview', 'interview'),
('Assessment', 'assessment'),
('Background Check', 'background-check'),
('Communication', 'communication'),
('Automation', 'automation'),
('AI/ML', 'ai-ml'),
('Talent Marketplace', 'talent-marketplace'),
('Job Board', 'job-board'),
('Video Interview', 'video-interview'),
('Skills Testing', 'skills-testing'),
('Reference Check', 'reference-check'),
('Onboarding', 'onboarding'),
('HR Management', 'hr-management'),
('Payroll', 'payroll')
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to approved tools and categories
CREATE POLICY "Public can view approved tools" ON tools
    FOR SELECT USING (approved = true AND hidden = false);

CREATE POLICY "Public can view categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Public can view tool categories" ON tool_categories
    FOR SELECT USING (true);

-- Create policies for submissions (users can insert, admins can manage)
CREATE POLICY "Public can submit tools" ON submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view submissions" ON submissions
    FOR SELECT USING (true);

CREATE POLICY "Public can insert submission categories" ON submission_categories
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view submission categories" ON submission_categories
    FOR SELECT USING (true);

-- Votes table (for tool voting)
CREATE TABLE votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  user_email VARCHAR(255),
  user_name VARCHAR(255),
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
  user_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tool_id, user_email)
);

-- Comments table (for tool comments)
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shares table (for tracking tool shares)
CREATE TABLE shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  share_type VARCHAR(20) NOT NULL CHECK (share_type IN ('copy', 'linkedin', 'twitter', 'other')),
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_votes_tool_id ON votes(tool_id);
CREATE INDEX idx_votes_user_email ON votes(user_email);
CREATE INDEX idx_comments_tool_id ON comments(tool_id);
CREATE INDEX idx_comments_user_email ON comments(user_email);
CREATE INDEX idx_shares_tool_id ON shares(tool_id);
CREATE INDEX idx_shares_created_at ON shares(created_at);

-- Create triggers for updated_at
CREATE TRIGGER update_votes_updated_at BEFORE UPDATE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for new tables
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Create policies for votes
CREATE POLICY "Public can view votes" ON votes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert votes" ON votes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own votes" ON votes
    FOR UPDATE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can delete their own votes" ON votes
    FOR DELETE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create policies for comments
CREATE POLICY "Public can view comments" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Users can insert comments" ON comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own comments" ON comments
    FOR UPDATE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can delete their own comments" ON comments
    FOR DELETE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create policies for shares
CREATE POLICY "Public can view shares" ON shares
    FOR SELECT USING (true);

CREATE POLICY "Public can insert shares" ON shares
    FOR INSERT WITH CHECK (true);

-- Note: Admin policies will be handled by service role key in the application
-- The service role bypasses RLS, so admin operations will work without additional policies