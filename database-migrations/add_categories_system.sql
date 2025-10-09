-- Create categories table for centralized category management
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Create junction table for tool-category relationships (many-to-many)
CREATE TABLE tool_categories (
  id SERIAL PRIMARY KEY,
  tool_id VARCHAR(255) NOT NULL,
  category_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(tool_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX idx_categories_active ON categories(active);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_tool_categories_tool_id ON tool_categories(tool_id);
CREATE INDEX idx_tool_categories_category_id ON tool_categories(category_id);

-- Insert initial categories based on existing data
INSERT INTO categories (name, slug, description, active) VALUES
('Analytics', 'analytics', 'Tools for data analysis and reporting', true),
('ATS', 'ats', 'Applicant Tracking Systems', true),
('Automation', 'automation', 'Workflow automation and process optimization tools', true),
('Candidate Presentation', 'candidate-presentation', 'Tools for presenting and showcasing candidates', true),
('Communication', 'communication', 'Communication and messaging platforms', true),
('Compliance Checks', 'compliance-checks', 'Background checks and compliance verification', true),
('Experience & Reputation', 'experience-reputation', 'Tools for managing experience and reputation', true),
('Implementation Services', 'implementation-services', 'Professional services and implementation support', true),
('Inbox Management', 'inbox-management', 'Email and inbox organization tools', true),
('Interviewing', 'interviewing', 'Interview scheduling and management platforms', true),
('Parsing', 'parsing', 'Resume and document parsing tools', true),
('Redeployment', 'redeployment', 'Candidate redeployment and talent marketplace tools', true),
('Sales & Marketing', 'sales-marketing', 'Sales enablement and marketing automation', true),
('Sourcing & Search', 'sourcing-search', 'Candidate sourcing and talent search tools', true);

-- Add comments to tables
COMMENT ON TABLE categories IS 'Centralized category management for tools';
COMMENT ON TABLE tool_categories IS 'Junction table linking tools to categories (many-to-many relationship)';
COMMENT ON COLUMN categories.slug IS 'URL-friendly version of category name';
COMMENT ON COLUMN categories.active IS 'Whether category is active and should be displayed';