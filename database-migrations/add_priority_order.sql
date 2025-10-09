-- Add priority_order column to tools table
-- This column will store the priority order for top 15 tools (1-15)
-- NULL values indicate tools that are not in the priority list

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