#!/usr/bin/env node

// Setup script to configure Supabase for local development
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Supabase Local Setup');
console.log('='.repeat(50));
console.log('This will configure your local environment to use Supabase.');
console.log('You can find these values in your Supabase Dashboard → Settings → API\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupSupabase() {
  try {
    console.log('Please provide your Supabase credentials:\n');
    
    const supabaseUrl = await askQuestion('Supabase Project URL (https://xxx.supabase.co): ');
    const anonKey = await askQuestion('Supabase Anon Key: ');
    const serviceKey = await askQuestion('Supabase Service Role Key: ');
    
    if (!supabaseUrl || !anonKey || !serviceKey) {
      console.log('❌ All fields are required. Please run the script again.');
      process.exit(1);
    }
    
    // Update .env.local file
    const envPath = path.join(__dirname, '.env.local');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace the placeholder values
    envContent = envContent.replace(
      'NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co',
      `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}`
    );
    envContent = envContent.replace(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here',
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`
    );
    envContent = envContent.replace(
      'SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here',
      `SUPABASE_SERVICE_ROLE_KEY=${serviceKey}`
    );
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ Supabase credentials configured successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Restart your development server: npm run dev');
    console.log('2. Run database setup: curl -X POST http://localhost:3000/api/force-migrate');
    console.log('3. Test the application at http://localhost:3000');
    console.log('\n🔍 Debug endpoint: http://localhost:3000/api/debug');
    
  } catch (error) {
    console.error('❌ Error setting up Supabase:', error.message);
  } finally {
    rl.close();
  }
}

setupSupabase();