-- FINAL CATEGORIES SYSTEM SETUP - HANDLES ALL EXISTING DATA
-- Copy and paste this entire script into Supabase SQL Editor and run it
-- This properly handles existing categories and duplicate slugs

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
        
        -- Update existing records to have slugs if they don't (avoid duplicates)
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
    
    -- Add constraints if they don't exist (handle gracefully)
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'categories_name_unique' 
            AND table_name = 'categories'
        ) THEN
            ALTER TABLE categories ADD CONSTRAINT categories_name_unique UNIQUE (name);
            RAISE NOTICE 'Added unique constraint on name';
        END IF;
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE 'Unique constraint on name already exists';
    END;
    
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'categories_slug_unique' 
            AND table_name = 'categories'
        ) THEN
            ALTER TABLE categories ADD CONSTRAINT categories_slug_unique UNIQUE (slug);
            RAISE NOTICE 'Added unique constraint on slug';
        END IF;
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

-- Step 5: Insert or update initial categories (SAFE VERSION)
DO $$ 
DECLARE
    category_data RECORD;
    category_exists_by_name BOOLEAN;
    category_exists_by_slug BOOLEAN;
    existing_category_id INTEGER;
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
        -- Check if category exists by name
        SELECT EXISTS(SELECT 1 FROM categories WHERE name = category_data.name) INTO category_exists_by_name;
        
        -- Check if category exists by slug
        SELECT EXISTS(SELECT 1 FROM categories WHERE slug = category_data.slug) INTO category_exists_by_slug;
        
        IF category_exists_by_name THEN
            -- Update existing category by name
            UPDATE categories 
            SET 
                description = COALESCE(NULLIF(description, ''), category_data.description),
                active = COALESCE(active, TRUE),
                updated_at = NOW()
            WHERE name = category_data.name;
            RAISE NOTICE 'Updated existing category by name: %', category_data.name;
            
        ELSIF category_exists_by_slug THEN
            -- Update existing category by slug (different name)
            UPDATE categories 
            SET 
                description = COALESCE(NULLIF(description, ''), category_data.description),
                active = COALESCE(active, TRUE),
                updated_at = NOW()
            WHERE slug = category_data.slug;
            RAISE NOTICE 'Updated existing category by slug: % (slug: %)', category_data.name, category_data.slug;
            
        ELSE
            -- Insert new category (neither name nor slug exists)
            BEGIN
                INSERT INTO categories (name, slug, description, active, created_at, updated_at)
                VALUES (category_data.name, category_data.slug, category_data.description, TRUE, NOW(), NOW());
                RAISE NOTICE 'Inserted new category: %', category_data.name;
            EXCEPTION
                WHEN unique_violation THEN
                    RAISE NOTICE 'Skipped category % due to unique constraint (already exists)', category_data.name;
            END;
        END IF;
    END LOOP;
END $$;

-- Step 6: Clean up any duplicate slugs by adding numbers
DO $$
DECLARE
    dup_record RECORD;
    new_slug TEXT;
    counter INTEGER;
BEGIN
    -- Find and fix duplicate slugs
    FOR dup_record IN 
        SELECT slug, array_agg(id ORDER BY id) as ids
        FROM categories 
        WHERE slug IS NOT NULL
        GROUP BY slug 
        HAVING COUNT(*) > 1
    LOOP
        RAISE NOTICE 'Found duplicate slug: %, fixing...', dup_record.slug;
        
        -- Keep the first one, rename the others
        FOR counter IN 2..array_length(dup_record.ids, 1) LOOP
            new_slug := dup_record.slug || '-' || counter;
            
            -- Make sure the new slug doesn't exist
            WHILE EXISTS(SELECT 1 FROM categories WHERE slug = new_slug) LOOP
                counter := counter + 1;
                new_slug := dup_record.slug || '-' || counter;
            END LOOP;
            
            UPDATE categories 
            SET slug = new_slug, updated_at = NOW()
            WHERE id = dup_record.ids[counter];
            
            RAISE NOTICE 'Renamed duplicate slug to: %', new_slug;
        END LOOP;
    END LOOP;
END $$;

-- Step 7: Final verification and summary
DO $$ 
DECLARE
    categories_count INTEGER;
    tool_categories_count INTEGER;
    active_categories_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO categories_count FROM categories;
    SELECT COUNT(*) INTO tool_categories_count FROM tool_categories;
    SELECT COUNT(*) INTO active_categories_count FROM categories WHERE active = TRUE;
    
    RAISE NOTICE '=== SETUP COMPLETE ===';
    RAISE NOTICE 'Total categories: %', categories_count;
    RAISE NOTICE 'Active categories: %', active_categories_count;
    RAISE NOTICE 'Tool-category links: %', tool_categories_count;
    RAISE NOTICE '';
    RAISE NOTICE 'SUCCESS! You can now:';
    RAISE NOTICE '1. Access admin panel at /admin/categories';
    RAISE NOTICE '2. Categories will appear in submission forms';
    RAISE NOTICE '3. Homepage filters will use the new system';
END $$;

-- Step 8: Show final categories list
SELECT 
    id,
    name,
    slug,
    description,
    active,
    created_at
FROM categories 
ORDER BY name;