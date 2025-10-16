#!/bin/bash

echo "🚀 Deploying Recruiters Directory to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the project first to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Deploying to Vercel..."
    
    # Deploy to Vercel
    vercel --prod
    
    echo "🎉 Deployment complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to your Vercel dashboard"
    echo "2. Add environment variables (see VERCEL_ENVIRONMENT_VARIABLES.md)"
    echo "3. Test your deployment"
    echo ""
    echo "🔗 Don't forget to set these essential variables:"
    echo "   - NEXT_PUBLIC_APP_URL"
    echo "   - ADMIN_USERNAME"
    echo "   - ADMIN_PASSWORD"
    echo "   - NEXT_PUBLIC_SUPABASE_URL (if using Supabase)"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY (if using Supabase)"
    echo "   - SUPABASE_SERVICE_ROLE_KEY (if using Supabase)"
else
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi