# Vercel Email Configuration Guide

This guide helps you fix email functionality issues when deploying to Vercel.

## Problem
Emails work locally but fail on Vercel deployment due to missing or incorrect environment variable configuration.

## Solution

### 1. Get Your Loops API Key
1. Go to [Loops.so](https://loops.so)
2. Sign in to your account
3. Navigate to Settings > API Keys
4. Copy your API key

### 2. Configure Environment Variables in Vercel

#### Option A: Via Vercel Dashboard
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** tab
4. Click **Environment Variables** in the sidebar
5. Add a new environment variable:
   - **Name**: `LOOPS_API_KEY`
   - **Value**: Your Loops API key (starts with `loops_`)
   - **Environments**: Select Production, Preview, and Development
6. Click **Save**

#### Option B: Via Vercel CLI
```bash
# Add environment variable
vercel env add LOOPS_API_KEY
# Enter your Loops API key when prompted
# Select all environments (production, preview, development)
```

### 3. Redeploy Your Application
After adding the environment variable, you need to redeploy:

```bash
# Trigger a new deployment
vercel --prod
```

Or push a new commit to your connected Git repository to trigger automatic deployment.

### 4. Verify Configuration

1. Check the deployment logs in Vercel Dashboard
2. Look for the environment check logs in your API route
3. Test email functionality by submitting a form

## Debugging

If emails still don't work, check the Vercel function logs:

1. Go to Vercel Dashboard > Your Project > Functions tab
2. Click on the `/api/send-email` function
3. Check the logs for error messages

Common error messages and solutions:

- **"LOOPS_API_KEY is not configured"**: Environment variable not set in Vercel
- **"401 Unauthorized"**: Invalid API key
- **"403 Forbidden"**: API key doesn't have required permissions
- **"422 Unprocessable Entity"**: Invalid email template ID or data variables

## Testing

To test if the configuration works:

1. Submit a form on your deployed Vercel site
2. Check the Vercel function logs for success/error messages
3. Check your email inbox for the confirmation email

## Additional Notes

- Environment variables in Vercel are encrypted and secure
- Changes to environment variables require a new deployment to take effect
- Make sure your Loops account has sufficient email credits
- Verify that your email template ID (`cmf7u53sj2sscz40iyo4j540n`) exists in your Loops account