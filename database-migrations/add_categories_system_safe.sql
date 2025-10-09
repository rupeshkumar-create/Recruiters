-- Safe migration script that handles existing tables
-- This script will only create tables if they don't exist

-- Create categories table only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'categories') THEN
        CREATE TABLE categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            active BOOLEAN DEFAULT TRUE
        );
        
        -- Add comments
        COMMENT ON TABLE categories IS 'Centralized category management for tools';
        COMMENT ON COLUMN categories.slug IS 'URL-friendly version of category name';
        COMMENT ON COLUMN categories.active IS 'Whether category is active and should be displayed';
        
        RAISE NOTICE 'Created categories table';
    ELSE
        RAISE NOTICE 'Categories table already exists, skipping creation';
    END IF;
END $$;

-- Create tool_categories junction table only if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tool_categories') THEN
        CREATE TABLE tool_categories (
            id SERIAL PRIMARY KEY,
            tool_id VARCHAR(255) NOT NULL,
            category_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
            UNIQUE(tool_id, category_id)
        );
        
        -- Add comment
        COMMENT ON TABLE tool_categories IS 'Junction table linking tools to categories (many-to-many relationship)';
        
        RAISE NOTICE 'Created tool_categories table';
    ELSE
        RAISE NOTICE 'Tool_categories table already exists, skipping creation';
    END IF;
END $$;

-- Create indexes only if they don't exist
DO $$ 
BEGIN
    -- Index on categories.active
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_categories_active') THEN
        CREATE INDEX idx_categories_active ON categories(active);
        RAISE NOTICE 'Created index idx_categories_active';
    END IF;
    
    -- Index on categories.slug
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_categories_slug') THEN
        CREATE INDEX idx_categories_slug ON categories(slug);
        RAISE NOTICE 'Created index idx_categories_slug';
    END IF;
    
    -- Index on tool_categories.tool_id
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_tool_categories_tool_id') THEN
        CREATE INDEX idx_tool_categories_tool_id ON tool_categories(tool_id);
        RAISE NOTICE 'Created index idx_tool_categories_tool_id';
    END IF;
    
    -- Index on tool_categories.category_id
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_tool_categories_category_id') THEN
        CREATE INDEX idx_tool_categories_category_id ON tool_categories(category_id);
        RAISE NOTICE 'Created index idx_tool_categories_category_id';
    END IF;
END $$;

-- Insert initial categories only if the table is empty
DO $$ 
BEGIN
    IF (SELECT COUNT(*) FROM categories) = 0 THEN
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
        
        RAISE NOTICE 'Inserted initial categories';
    ELSE
        RAISE NOTICE 'Categories table already has data, skipping initial insert';
    END IF;
END $$;