#!/bin/bash

echo "🚀 Installing Supabase client..."

# Install Supabase client
npm install @supabase/supabase-js

echo "✅ Supabase client installed successfully!"

echo "📋 Next steps:"
echo "1. Restart your development server: npm run dev"
echo "2. Set up your Supabase database using supabase_schema.sql"
echo "3. Run migration: curl -X POST http://localhost:3000/api/migrate -H 'Content-Type: application/json' -d '{\"action\": \"migrate\"}'"

echo "🎉 Ready to use Supabase!"