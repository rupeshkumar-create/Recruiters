# Category Management System Setup Guide

## Database Migration

To enable the centralized category management system, you need to run the database migration.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL commands from: `database-migrations/add_categories_system.sql`

### Option 2: Using psql or other PostgreSQL client

1. Connect to your database
2. Run the SQL commands from the file: `database-migrations/add_categories_system.sql`

## How the Category System Works

### **Centralized Management**
- **Admin Interface**: `/admin/categories` - Full CRUD operations for categories
- **API Endpoints**: `/api/categories` - RESTful API for category management
- **Database Tables**: 
  - `categories` - Stores all available categories
  - `tool_categories` - Junction table linking tools to categories (many-to-many)

### **Automatic Synchronization**
- **Submission Form**: Fetches active categories from `/api/categories?active=true`
- **Homepage Filters**: Uses same API endpoint for consistent categories
- **Real-time Updates**: Changes reflect immediately across the platform

### **Features**

#### **Admin Category Management**
- ✅ **Add Categories**: Create new categories with name, description, and status
- ✅ **Edit Categories**: Update existing categories
- ✅ **Delete Categories**: Remove unused categories (prevents deletion if in use)
- ✅ **Toggle Status**: Activate/deactivate categories
- ✅ **Auto Slug Generation**: URL-friendly slugs generated automatically

#### **Integration Points**
- ✅ **Submission Form**: Dynamic category list from database
- ✅ **Homepage Filters**: Consistent category display
- ✅ **Tool Management**: Categories linked via junction table
- ✅ **Fallback Support**: Falls back to extracting from tools if API fails

#### **Data Integrity**
- ✅ **Unique Constraints**: Prevents duplicate category names/slugs
- ✅ **Foreign Key Constraints**: Maintains referential integrity
- ✅ **Usage Validation**: Prevents deletion of categories in use
- ✅ **Active Status**: Only active categories appear in forms/filters

## Usage Instructions

### **For Admins**

1. **Access Category Management**:
   - Go to `/admin` and click "Categories" card
   - Or navigate directly to `/admin/categories`

2. **Add New Category**:
   - Click "Add New Category" button
   - Enter category name and optional description
   - Set status (Active/Inactive)
   - Click "Add Category"

3. **Edit Category**:
   - Click edit icon next to any category
   - Modify name, description, or status
   - Click "Update Category"

4. **Delete Category**:
   - Click delete icon next to category
   - Confirm deletion (only works if category is not in use)

### **For Users**

1. **Submission Form**:
   - Categories automatically load from database
   - Only active categories are shown
   - Multi-select checkboxes for category selection

2. **Homepage Filtering**:
   - Categories appear in horizontal filter bar
   - Consistent with submission form categories
   - Real-time filtering of tools

## Migration from Old System

The migration script automatically:

1. **Creates new tables** (`categories`, `tool_categories`)
2. **Populates initial categories** based on existing tool data
3. **Maintains backward compatibility** with existing tools
4. **Provides fallback mechanisms** if API is unavailable

## Benefits

- ✅ **Centralized Control**: Single source of truth for categories
- ✅ **Consistency**: Same categories everywhere
- ✅ **Real-time Updates**: Changes reflect immediately
- ✅ **Data Integrity**: Proper database relationships
- ✅ **User Experience**: Better category management for admins
- ✅ **Scalability**: Easy to add/remove categories as needed

## API Endpoints

### GET `/api/categories`
- Fetch all categories
- Query params: `?active=true` (filter by active status)

### POST `/api/categories`
- Create new category
- Body: `{ name, description?, active? }`

### PUT `/api/categories`
- Update existing category
- Body: `{ id, name, description?, active? }`

### DELETE `/api/categories?id={id}`
- Delete category (if not in use)

The category management system is now fully functional and provides a much better experience for managing categories across the platform!