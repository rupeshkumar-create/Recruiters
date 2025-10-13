-- Create analytics table for tracking tool interactions
-- This migration creates a comprehensive analytics system

-- Create analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('click', 'share', 'visit', 'search', 'linkedin_share', 'twitter_share', 'copy_link')),
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_tool_id ON analytics(tool_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_tool_event ON analytics(tool_id, event_type);

-- Enable Row Level Security (RLS)
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics
CREATE POLICY IF NOT EXISTS "Public can insert analytics" ON analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Public can view analytics" ON analytics
    FOR SELECT USING (true);

-- Allow service role to manage all analytics (for admin)
CREATE POLICY IF NOT EXISTS "Service role can manage analytics" ON analytics
    FOR ALL USING (current_setting('role') = 'service_role');