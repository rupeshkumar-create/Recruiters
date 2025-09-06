# Supabase Setup Guide

## Quick Setup Instructions

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be ready

2. **Get Your Credentials**
   - Go to Settings > API in your Supabase dashboard
   - Copy the Project URL and anon public key
   - Copy the service_role key (keep this secret!)

3. **Update Environment Variables**
   Replace the placeholder values in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
   ```

4. **Set Up Database Schema**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the SQL to create all tables and policies

5. **Test the Application**
   - Restart your development server: `npm run dev`
   - Try submitting a tool via the form
   - Check the admin panel to approve submissions

## Database Schema

The application uses these main tables:
- `categories` - Tool categories
- `tools` - Approved tools in the directory
- `submissions` - Pending tool submissions
- `tool_categories` & `submission_categories` - Many-to-many relationships

## Features Migrated to Supabase

✅ Tool submissions (form saves to database)
✅ Admin panel (fetches from database)
✅ Homepage (displays tools from database)
✅ Approval workflow (API endpoints)
✅ Email notifications (on approval)

## Fallback Mode

If Supabase is not configured, the application will:
- Show errors in API routes
- Fall back to CSV data for tool display
- Disable submission functionality

To test without Supabase, you can temporarily comment out the Supabase calls in the API routes.