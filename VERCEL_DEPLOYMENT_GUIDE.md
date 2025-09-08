# Vercel Deployment Guide

## Current Deployment Error

The deployment is failing with the error: **"Failed to collect page data for /api/categories"**

This error occurs because the required environment variables are not configured in Vercel, causing the Supabase client initialization to fail during the build process.

## Required Environment Variables

You need to set the following environment variables in your Vercel project:

### 1. Supabase Configuration (Required)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Email Service (Required)
```
LOOPS_API_KEY=your_loops_api_key
```

## How to Set Environment Variables in Vercel

### Method 1: Via Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: Variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: Your actual value
   - **Environment**: Select `Production`, `Preview`, and `Development`
4. Click **Save**
5. Redeploy your application

### Method 2: Via Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add LOOPS_API_KEY

# Redeploy
vercel --prod
```

## Getting Your Supabase Credentials

1. **NEXT_PUBLIC_SUPABASE_URL**:
   - Go to your Supabase project dashboard
   - Navigate to **Settings** → **API**
   - Copy the **Project URL**

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**:
   - In the same API settings page
   - Copy the **anon/public** key

3. **SUPABASE_SERVICE_ROLE_KEY**:
   - In the same API settings page
   - Copy the **service_role** key (keep this secret!)

## Getting Your Loops API Key

1. Go to your Loops dashboard
2. Navigate to **Settings** → **API Keys**
3. Copy your API key

## Database Setup Requirements

Ensure your Supabase database has the following tables with proper permissions:
- `categories`
- `tools`
- `submissions`
- `tool_categories`
- `submission_categories`
- `comments`
- `votes`

Refer to `supabase-schema.sql` for the complete database schema.

## Troubleshooting

### If deployment still fails:
1. **Check environment variable names**: Ensure they match exactly (case-sensitive)
2. **Verify Supabase permissions**: Make sure your service role key has the necessary permissions
3. **Check database tables**: Ensure all required tables exist in your Supabase project
4. **Review build logs**: Look for specific error messages in the Vercel deployment logs

### Common Issues:
- **Missing environment variables**: The app will throw errors during build if any required variables are missing
- **Incorrect Supabase URL**: Make sure you're using the correct project URL
- **Database permissions**: Ensure your database policies allow the operations your app needs

## After Setting Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Deployments**
3. Click **Redeploy** on the latest deployment
4. Monitor the build logs to ensure successful deployment

## Verification

Once deployed successfully, test these endpoints:
- `/api/categories` - Should return categories data
- `/api/send-email` - Should be able to send emails
- `/api/submissions` - Should handle form submissions

If you encounter any issues, check the Vercel function logs in your dashboard for detailed error messages.