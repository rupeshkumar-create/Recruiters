-- COMPLETE CATEGORIES SYSTEM SETUP
-- Copy and paste this entire script into Supabase SQL Editor and run it
-- This handles all scenarios: existing tables, missing columns, data, indexes, etc.

-- Step 1: Handle existing categories table or create new one
DO $$ 
BEGIN
    -- Check if categories table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'categories') THEN
        RAISE NOTICE 'Categories table exists, checking structure...';
        
        -- Add missing columns if they don't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'slug') THEN
            ALTER TABLE categories ADD COLUMN slug VARCHAR(255);
            RAISE NOTICE 'Added slug column to categories table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'description') THEN
            ALTER TABLE categories ADD COLUMN description TEXT;
            RAISE NOTICE 'Added description column to categories table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'active') THEN
            ALTER TABLE categories ADD COLUMN active BOOLEAN DEFAULT TRUE;
            RAISE NOTICE 'Added active column to categories table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'created_at') THEN
            ALTER TABLE categories ADD COLUMN created_at TIMESTAMP DEFAULT NOW();
            RAISE NOTICE 'Added created_at column to categories table';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'updated_at') THEN
            ALTER TABLE categories ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
            RAISE NOTICE 'Added updated_at column to categories table';
        END IF;
        
        -- Update existing records to have slugs if they don't
        UPDATE categories 
        SET slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
        WHERE slug IS NULL OR slug = '';
        
        -- Update existing records to be active if not set
        UPDATE categories SET active = TRUE WHERE active IS NULL;
        
        -- Update existing records to have timestamps if not set
        UPDATE categories SET created_at = NOW() WHERE created_at IS NULL;
        UPDATE categories SET updated_at = NOW() WHERE updated_at IS NULL;
        
    ELSE
        -- Create categories table from scratch
        CREATE TABLE categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL,
            slug VARCHAR(255) UNIQUE NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            active BOOLEAN DEFAULT TRUE
        );
        RAISE NOTICE 'Created new categories table';
    END IF;
    
    -- Add constraints if they don't exist
    BEGIN
        ALTER TABLE categories ADD CONSTRAINT categories_name_unique UNIQUE (name);
        RAISE NOTICE 'Added unique constraint on name';
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE 'Unique constraint on name already exists';
    END;
    
    BEGIN
        ALTER TABLE categories ADD CONSTRAINT categories_slug_unique UNIQUE (slug);
        RAISE NOTICE 'Added unique constraint on slug';
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE 'Unique constraint on slug already exists';
    END;
END $$;

-- Step 2: Create tool_categories junction table
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
        RAISE NOTICE 'Created tool_categories junction table';
    ELSE
        RAISE NOTICE 'Tool_categories table already exists';
    END IF;
END $$;

-- Step 3: Create all necessary indexes
DO $$ 
BEGIN
    -- Index on categories.active
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_categories_active') THEN
        CREATE INDEX idx_categories_active ON categories(active);
        RAISE NOTICE 'Created index on categories.active';
    END IF;
    
    -- Index on categories.slug
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_categories_slug') THEN
        CREATE INDEX idx_categories_slug ON categories(slug);
        RAISE NOTICE 'Created index on categories.slug';
    END IF;
    
    -- Index on categories.name
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_categories_name') THEN
        CREATE INDEX idx_categories_name ON categories(name);
        RAISE NOTICE 'Created index on categories.name';
    END IF;
    
    -- Index on tool_categories.tool_id
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_tool_categories_tool_id') THEN
        CREATE INDEX idx_tool_categories_tool_id ON tool_categories(tool_id);
        RAISE NOTICE 'Created index on tool_categories.tool_id';
    END IF;
    
    -- Index on tool_categories.category_id
    IF NOT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_tool_categories_category_id') THEN
        CREATE INDEX idx_tool_categories_category_id ON tool_categories(category_id);
        RAISE NOTICE 'Created index on tool_categories.category_id';
    END IF;
END $$;

-- Step 4: Add table comments
COMMENT ON TABLE categories IS 'Centralized category management for tools';
COMMENT ON TABLE tool_categories IS 'Junction table linking tools to categories (many-to-many relationship)';
COMMENT ON COLUMN categories.slug IS 'URL-friendly version of category name';
COMMENT ON COLUMN categories.active IS 'Whether category is active and should be displayed';

-- Step 5: Insert or update initial categories
DO $$ 
DECLARE
    category_data RECORD;
    category_exists BOOLEAN;
BEGIN
    -- Define categories to insert/update
    FOR category_data IN 
        SELECT * FROM (VALUES
            ('Analytics', 'analytics', 'Tools for data analysis and reporting'),
            ('ATS', 'ats', 'Applicant Tracking Systems'),
            ('Automation', 'automation', 'Workflow automation and process optimization tools'),
            ('Candidate Presentation', 'candidate-presentation', 'Tools for presenting and showcasing candidates'),
            ('Communication', 'communication', 'Communication and messaging platforms'),
            ('Compliance Checks', 'compliance-checks', 'Background checks and compliance verification'),
            ('Experience & Reputation', 'experience-reputation', 'Tools for managing experience and reputation'),
            ('Implementation Services', 'implementation-services', 'Professional services and implementation support'),
            ('Inbox Management', 'inbox-management', 'Email and inbox organization tools'),
            ('Interviewing', 'interviewing', 'Interview scheduling and management platforms'),
            ('Parsing', 'parsing', 'Resume and document parsing tools'),
            ('Redeployment', 'redeployment', 'Candidate redeployment and talent marketplace tools'),
            ('Sales & Marketing', 'sales-marketing', 'Sales enablement and marketing automation'),
            ('Sourcing & Search', 'sourcing-search', 'Candidate sourcing and talent search tools')
        ) AS t(name, slug, description)
    LOOP
        -- Check if category exists
        SELECT EXISTS(SELECT 1 FROM categories WHERE name = category_data.name) INTO category_exists;
        
        IF NOT category_exists THEN
            -- Insert new category
            INSERT INTO categories (name, slug, description, active, created_at, updated_at)
            VALUES (category_data.name, category_data.slug, category_data.description, TRUE, NOW(), NOW());
            RAISE NOTICE 'Inserted category: %', category_data.name;
        ELSE
            -- Update existing category with missing data
            UPDATE categories 
            SET 
                slug = COALESCE(NULLIF(slug, ''), category_data.slug),
                description = COALESCE(NULLIF(description, ''), category_data.description),
                active = COALESCE(active, TRUE),
                updated_at = NOW()
            WHERE name = category_data.name;
            RAISE NOTICE 'Updated category: %', category_data.name;
        END IF;
    END LOOP;
END $$;

-- Step 6: Final verification and summary
DO $$ 
DECLARE
    categories_count INTEGER;
    tool_categories_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO categories_count FROM categories;
    SELECT COUNT(*) INTO tool_categories_count FROM tool_categories;
    
    RAISE NOTICE '=== SETUP COMPLETE ===';
    RAISE NOTICE 'Categories table: % records', categories_count;
    RAISE NOTICE 'Tool_categories table: % records', tool_categories_count;
    RAISE NOTICE 'You can now access the admin panel at /admin/categories';
    RAISE NOTICE 'Categories will appear in submission forms and homepage filters';
END $$;

-- Step 7: Show final categories list
SELECT 
    id,
    name,
    slug,
    description,
    active,
    created_at
FROM categories 
ORDER BY name;