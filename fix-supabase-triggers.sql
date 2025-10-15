-- Fix for Supabase trigger error
-- Run this SQL in your Supabase SQL Editor to fix the trigger conflict

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_recruiters_updated_at ON public.recruiters;
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
DROP TRIGGER IF EXISTS update_submissions_updated_at ON public.submissions;

-- Drop and recreate the function
DROP FUNCTION IF EXISTS update_updated_at_column();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Recreate triggers
CREATE TRIGGER update_recruiters_updated_at 
  BEFORE UPDATE ON public.recruiters 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at 
  BEFORE UPDATE ON public.testimonials 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at 
  BEFORE UPDATE ON public.submissions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

SELECT 'Triggers fixed successfully!' as result;