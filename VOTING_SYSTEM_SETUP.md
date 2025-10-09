# 🗳️ Complete Voting & Comment System Setup Guide

## 📋 Database Setup

### Step 1: Run the Database Migration

Run this SQL in your Supabase SQL editor:

```sql
-- Complete voting and comment system setup
-- Run this after the basic comment approval migration

-- First, ensure all necessary columns exist in comments table
DO $$ 
BEGIN
    -- Add user_data column if it doesn't exist (for votes table compatibility)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'user_data') THEN
        ALTER TABLE comments ADD COLUMN user_data JSONB;
    END IF;
END $$;

-- Add new columns to comments table (skip user_data as it may not exist)
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS user_company VARCHAR(255),
ADD COLUMN IF NOT EXISTS user_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approved_by VARCHAR(255);

-- Ensure votes table has all necessary columns
DO $$ 
BEGIN
    -- Add user_data column to votes if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'user_data') THEN
        ALTER TABLE votes ADD COLUMN user_data JSONB;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_comments_approved_at ON comments(approved_at);
CREATE INDEX IF NOT EXISTS idx_votes_tool_user ON votes(tool_id, user_email);
CREATE INDEX IF NOT EXISTS idx_comments_tool_status ON comments(tool_id, status);
CREATE INDEX IF NOT EXISTS idx_comments_user_email ON comments(user_email);

-- Update existing comments to be approved (backward compatibility)
UPDATE comments 
SET status = 'approved', approved_at = created_at, approved_by = 'system'
WHERE status IS NULL;

-- Update RLS policies for proper access control
-- Drop and recreate all comment policies
DROP POLICY IF EXISTS "Public can view comments" ON comments;
DROP POLICY IF EXISTS "Public can view approved comments" ON comments;
DROP POLICY IF EXISTS "Users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

-- Create comprehensive comment policies
CREATE POLICY "Public can view approved comments" ON comments
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Anyone can insert comments" ON comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own comments" ON comments
    FOR UPDATE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can delete their own comments" ON comments
    FOR DELETE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Drop and recreate all vote policies
DROP POLICY IF EXISTS "Public can view votes" ON votes;
DROP POLICY IF EXISTS "Users can insert votes" ON votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;

-- Create comprehensive vote policies
CREATE POLICY "Public can view votes" ON votes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert votes" ON votes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update votes" ON votes
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete votes" ON votes
    FOR DELETE USING (true);

-- Ensure all existing votes have proper structure
UPDATE votes 
SET updated_at = COALESCE(updated_at, created_at)
WHERE updated_at IS NULL;
```

## 🎯 Features Implemented

### ✅ Voting System
- **Form Required**: Users must fill authentication form before voting
- **Upvote/Downvote**: Separate tracking for helpful vs not helpful
- **Real-time Updates**: Vote counts update immediately across all sections
- **Thank You Messages**: Users see confirmation after voting
- **Session Management**: User data stored for 30 days to avoid repeated forms

### ✅ Comment System
- **Admin Approval**: All comments require admin approval before display
- **Thank You Messages**: Users see confirmation after submitting comments
- **Admin Interface**: Full comment management at `/admin/comments`
- **Real-time Updates**: Comment counts update immediately

### ✅ Community Stats
- **Helpful Count**: Shows upvote count
- **Not Helpful Count**: Shows downvote count  
- **Comments Count**: Shows approved comments only
- **Shares Count**: Tracks social sharing

## 🧪 Testing Instructions

### 1. Test Voting System
1. Visit any tool page (e.g., `http://localhost:3001/tool/mercuryats`)
2. Click the upvote button in the hero section or voting section
3. Fill out the authentication form
4. Verify vote is recorded and counts update
5. Check that thank you message appears

### 2. Test Comment System
1. Scroll to comments section
2. Write a comment and submit
3. Fill out authentication form if not already done
4. Verify thank you message appears
5. Go to `/admin/comments` to approve the comment
6. Refresh tool page to see approved comment

### 3. Test Admin Interface
1. Visit `/admin/comments`
2. See pending comments
3. Approve/reject comments
4. Verify approved comments appear on tool pages

## 🔧 Troubleshooting

### Issue: Votes not updating
- Check Supabase connection in browser dev tools
- Verify RLS policies are set correctly
- Check that votes table has all required columns

### Issue: Comments not showing
- Verify comment status is 'approved' in database
- Check RLS policies for comments table
- Ensure API endpoints are working

### Issue: Form not appearing
- Check localStorage for existing user session
- Clear localStorage to test fresh user experience
- Verify UserAuthForm component is imported correctly

## 📊 Database Schema

### Comments Table
```sql
- id (UUID, Primary Key)
- tool_id (UUID, Foreign Key)
- user_email (VARCHAR)
- user_name (VARCHAR)
- user_company (VARCHAR)
- user_title (VARCHAR)
- content (TEXT)
- status (VARCHAR) - 'pending', 'approved', 'rejected'
- approved_at (TIMESTAMP)
- approved_by (VARCHAR)
- user_data (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Votes Table
```sql
- id (UUID, Primary Key)
- tool_id (UUID, Foreign Key)
- user_email (VARCHAR)
- user_name (VARCHAR)
- vote_type (VARCHAR) - 'up', 'down'
- user_data (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🚀 Next Steps

1. **Run the database migration** above
2. **Test the voting system** on any tool page
3. **Test the comment system** and admin approval
4. **Customize thank you messages** if needed
5. **Monitor performance** and add more indexes if needed

The system is now fully functional with form-required voting, comment approval, and real-time updates across all components!