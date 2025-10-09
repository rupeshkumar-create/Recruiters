-- Check existing categories table structure and data
-- Run this to see what's already in your database

-- Check if categories table exists and its structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'categories'
ORDER BY ordinal_position;

-- Check existing data in categories table (if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'categories') THEN
        RAISE NOTICE 'Categories table exists. Checking data...';
        
        -- This will show the current categories
        PERFORM * FROM categories LIMIT 5;
        
        RAISE NOTICE 'Found % categories in the table', (SELECT COUNT(*) FROM categories);
    ELSE
        RAISE NOTICE 'Categories table does not exist';
    END IF;
END $$;

-- Check if tool_categories table exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tool_categories') 
        THEN 'tool_categories table EXISTS'
        ELSE 'tool_categories table DOES NOT EXIST'
    END as tool_categories_status;

-- Show existing indexes
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('categories', 'tool_categories')
ORDER BY tablename, indexname;