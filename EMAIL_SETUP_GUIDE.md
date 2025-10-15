# Email Notifications Setup Guide

## Overview
The application now sends automated emails via Loops.so for:
1. **Form Submission Confirmation** - When someone submits a recruiter profile
2. **Approval Notification** - When a recruiter is approved from the admin panel

## Setup Instructions

### 1. Get Your Loops.so API Key
1. Log into your Loops.so account
2. Go to API settings
3. Copy your API key

### 2. Configure Environment Variables
Add the following to your `.env.local` file:
```
LOOPS_API_KEY=your_loops_api_key_here
```

### 3. Email Templates Configuration

#### Form Submission Email
- **Transactional ID**: `cmgroum0g8bawy90i0jck6fwt`
- **Data Variables**: 
  - `name` - The recruiter's name

#### Approval Notification Email  
- **Transactional ID**: `cmgroy309bc3gy60is6dyrvdj`
- **Data Variables**:
  - `name` - The recruiter's name
  - `profileUrl` - Their live profile URL

## How It Works

### Form Submission Flow
1. User submits recruiter profile form
2. Profile is saved with "pending" status
3. Confirmation email is automatically sent to the submitter
4. Email includes their name for personalization

### Approval Flow
1. Admin approves recruiter from admin panel
2. Profile status changes to "approved" and becomes visible
3. Approval email is automatically sent to the recruiter
4. Email includes their name and live profile URL

## Email Service Features

- **Error Handling**: Email failures don't break the core functionality
- **Logging**: All email attempts are logged for debugging
- **Environment Safety**: Gracefully handles missing API keys in development

## Testing

To test the email functionality:

1. **Test Form Submission**:
   - Fill out and submit a recruiter profile
   - Check the console logs for email confirmation
   - Verify email is received at the submitted email address

2. **Test Approval Notification**:
   - Go to admin panel (`/admin/submissions`)
   - Approve a pending submission
   - Check console logs for approval email confirmation
   - Verify email is received with profile URL

## Troubleshooting

### Email Not Sending
1. Check if `LOOPS_API_KEY` is set in environment variables
2. Verify the API key is correct in Loops.so dashboard
3. Check console logs for specific error messages
4. Ensure transactional IDs match your Loops.so templates

### Profile URL Issues
- Profile URLs are generated as: `{NEXT_PUBLIC_APP_URL}/recruiter/{slug}`
- Make sure `NEXT_PUBLIC_APP_URL` is set correctly in production
- In development, it defaults to `http://localhost:3000`

## Production Deployment

When deploying to production:
1. Set `LOOPS_API_KEY` in your hosting platform's environment variables
2. Ensure `NEXT_PUBLIC_APP_URL` points to your live domain
3. Test both email flows after deployment
4. Monitor logs for any email delivery issues

## Email Template Variables

Make sure your Loops.so email templates use these variable names:

**Submission Confirmation Template**:
- `{{name}}` - Recruiter's name

**Approval Notification Template**:
- `{{name}}` - Recruiter's name  
- `{{profileUrl}}` - Live profile URL

The system automatically sends these variables with each email.