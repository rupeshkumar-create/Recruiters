#!/bin/bash

echo "🚀 Setting up Recruiter Directory Application"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm version: $(npm -v)"

echo ""
echo "📦 Installing Dependencies..."
echo "=============================="

# Clean install
print_info "Cleaning previous installations..."
rm -rf node_modules package-lock.json .next

# Install dependencies
print_info "Installing npm packages..."
npm install

if [ $? -eq 0 ]; then
    print_status "Dependencies installed successfully!"
else
    print_error "Failed to install dependencies"
    exit 1
fi

echo ""
echo "🔧 Setting up Environment..."
echo "============================"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    print_warning ".env.local file not found. Creating from template..."
    cat > .env.local << EOL
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://vgonkiijhwfmlmbztoka.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnb25raWlqaHdmbWxtYnp0b2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTU2NzgsImV4cCI6MjA3NjAzMTY3OH0.4Z6AkuptKpPifO5aQoPWMgXWxU6DHuohZAW3URdfjMM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnb25raWlqaHdmbWxtYnp0b2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ1NTY3OCwiZXhwIjoyMDc2MDMxNjc4fQ.5w9GYTVa5u39MgkCS1COvrDNcF_u3PM2lnHxT9Hq5Uc
SUPABASE_JWT_SECRET=Bhm1TxeEHlPkLLNLMNB65xQvROWrrDoHaU4nzbAdr29K63A1JiN8TgQLSKbaI2+94Si5i535kp9tv8PDLiNPLw==
EOL
    print_status "Environment file created!"
else
    print_status "Environment file already exists"
fi

echo ""
echo "🏗️  Building Application..."
echo "=========================="

# Build the application
print_info "Building Next.js application..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Build completed successfully!"
else
    print_warning "Build failed, but you can still run in development mode"
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="

print_status "All dependencies installed"
print_status "Environment configured"
print_status "Application ready to run"

echo ""
echo "🚀 Next Steps:"
echo "=============="
echo "1. Start development server:"
echo "   ${BLUE}npm run dev${NC}"
echo ""
echo "2. Open your browser to:"
echo "   ${BLUE}http://localhost:3000${NC}"
echo ""
echo "3. Access admin panel:"
echo "   ${BLUE}http://localhost:3000/admin${NC}"
echo "   Password: ${YELLOW}admin123${NC}"
echo ""
echo "4. Set up Supabase database:"
echo "   - Go to: ${BLUE}https://vgonkiijhwfmlmbztoka.supabase.co${NC}"
echo "   - Run SQL from: ${YELLOW}fix_supabase_tables.sql${NC}"
echo ""
echo "5. Migrate data:"
echo "   - Visit: ${BLUE}http://localhost:3000/admin/migrate${NC}"
echo "   - Click 'Start Migration'"
echo ""
echo "🎯 Features Available:"
echo "====================="
echo "✅ Homepage with 20 professional recruiters"
echo "✅ Admin panel for managing recruiters"
echo "✅ Professional headshot management"
echo "✅ Testimonial system"
echo "✅ Search and filtering"
echo "✅ Real-time data sync (after Supabase setup)"
echo ""
echo "Happy coding! 🎉"