-- Check current database structure
-- Run this first to see what you currently have

-- Check votes table structure
SELECT 'VOTES TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'votes' 
ORDER BY ordinal_position;

-- Check comments table structure  
SELECT 'COMMENTS TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'comments' 
ORDER BY ordinal_position;

-- Check tools table structure
SELECT 'TOOLS TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'tools' 
ORDER BY ordinal_position;

-- Check existing policies
SELECT 'EXISTING POLICIES:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename IN ('votes', 'comments', 'tools')
ORDER BY tablename, policyname;

-- Check existing indexes
SELECT 'EXISTING INDEXES:' as info;
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes 
WHERE tablename IN ('votes', 'comments', 'tools')
ORDER BY tablename, indexname;