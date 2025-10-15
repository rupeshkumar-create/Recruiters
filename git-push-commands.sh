#!/bin/bash

echo "🚀 Pushing Recruiter Directory to GitHub"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if git is initialized
if [ ! -d .git ]; then
    print_info "Initializing Git repository..."
    git init
    print_status "Git repository initialized"
fi

# Add remote origin if not exists
if ! git remote get-url origin &> /dev/null; then
    print_info "Adding GitHub remote..."
    git remote add origin https://github.com/rupeshkumar-create/Recruiters.git
    print_status "GitHub remote added"
else
    print_status "GitHub remote already exists"
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
if [ -z "$CURRENT_BRANCH" ]; then
    print_info "Creating main branch..."
    git checkout -b main
    print_status "Main branch created"
fi

# Add all files
print_info "Adding files to Git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    print_warning "No changes to commit"
else
    # Commit changes
    print_info "Committing changes..."
    git commit -m "🎉 Complete Recruiter Directory Application

✨ Features:
- Professional recruiter directory with 20+ profiles
- Advanced search and filtering system
- Comprehensive admin panel with full CRUD operations
- Professional headshot management system
- Testimonial review and approval workflow
- Real-time data synchronization
- Responsive design optimized for all devices
- Supabase integration ready

🛠️ Technical Stack:
- Next.js 14.2.33 with App Router
- TypeScript 5.0
- Tailwind CSS 3.3
- Framer Motion animations
- Radix UI components
- Supabase integration
- Professional image management

🎯 Admin Features:
- Dashboard with analytics
- Recruiter profile management
- Headshot upload and gallery
- Testimonial management
- Submission handling
- System settings

🎨 UI/UX:
- Modern professional design
- Mobile-responsive layout
- Smooth animations and interactions
- Accessibility compliant
- Professional color scheme

Ready for production deployment! 🚀"

    print_status "Changes committed successfully"
fi

# Push to GitHub
print_info "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    print_status "Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Your Recruiter Directory is now on GitHub!"
    echo "============================================="
    echo ""
    echo "📍 Repository URL:"
    echo "   ${BLUE}https://github.com/rupeshkumar-create/Recruiters${NC}"
    echo ""
    echo "🌐 Deploy to Vercel:"
    echo "   ${BLUE}https://vercel.com/new/git/external?repository-url=https://github.com/rupeshkumar-create/Recruiters${NC}"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Visit your GitHub repository"
    echo "   2. Set up deployment (Vercel recommended)"
    echo "   3. Configure environment variables"
    echo "   4. Set up Supabase database (optional)"
    echo ""
    echo "✨ Your professional recruiter directory is ready for the world!"
else
    print_warning "Push failed. You may need to authenticate with GitHub first."
    echo ""
    echo "🔐 GitHub Authentication:"
    echo "   1. Set up GitHub CLI: gh auth login"
    echo "   2. Or use personal access token"
    echo "   3. Then run: git push -u origin main"
fi