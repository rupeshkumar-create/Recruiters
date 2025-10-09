-- Check comments table structure
-- Run this to see what columns exist in your comments table

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'comments' 
ORDER BY ordinal_position;

-- Check if comments table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'comments'
) as comments_table_exists;

-- Count existing comments
SELECT COUNT(*) as total_comments FROM comments;

-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'comments';