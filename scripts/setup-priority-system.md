# Priority System Setup Guide

## Database Migration

To enable the priority system, you need to add the `priority_order` column to your `tools` table.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL command:

```sql
-- Add priority_order column to tools table
ALTER TABLE tools 
ADD COLUMN priority_order INTEGER;

-- Add a check constraint to ensure priority_order is between 1 and 15 when not null
ALTER TABLE tools 
ADD CONSTRAINT check_priority_order 
CHECK (priority_order IS NULL OR (priority_order >= 1 AND priority_order <= 15));

-- Create a unique index on priority_order to ensure no duplicates
CREATE UNIQUE INDEX idx_tools_priority_order 
ON tools (priority_order) 
WHERE priority_order IS NOT NULL;

-- Add a comment to the column
COMMENT ON COLUMN tools.priority_order IS 'Priority order for top 15 tools (1-15). NULL for non-priority tools.';
```

### Option 2: Using psql or other PostgreSQL client

1. Connect to your database
2. Run the SQL commands from the file: `database-migrations/add_priority_order.sql`

## How the Priority System Works

1. **Top 15 Tools**: Admin can select up to 15 tools to have priority positions (1-15)
2. **Priority Display**: Tools with priority_order 1-15 will always appear first on the homepage
3. **Regular Tools**: Tools without priority_order (NULL) appear after priority tools, sorted by creation date
4. **Admin Interface**: Use `/admin/priority` to manage the top 15 tools

## Features

- ✅ Drag and drop interface for reordering priority tools
- ✅ Maximum 15 tools can have priority
- ✅ Real-time preview of changes
- ✅ Automatic sorting on homepage
- ✅ Database constraints prevent conflicts
- ✅ Smooth animations and transitions

## Usage

1. Run the database migration
2. Go to `/admin` and login
3. Click on "Top 15 Priority" card
4. Select tools from the available list to add to priority
5. Drag to reorder priority tools
6. Click "Save Priority Order" to apply changes

The homepage will immediately reflect the new priority order!