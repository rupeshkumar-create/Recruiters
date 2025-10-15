const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('Environment Variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  console.log('');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Missing required Supabase environment variables');
    console.log('Please add them to your .env.local file:');
    console.log('');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
    console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
    return;
  }

  try {
    // Test client connection
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client created successfully');

    // Test database connection by checking tables
    console.log('\n🔍 Testing database connection...');
    
    const { count, error: tablesError } = await supabase
      .from('recruiters')
      .select('*', { count: 'exact', head: true });

    if (tablesError) {
      console.log('❌ Database connection failed:', tablesError.message);
      
      if (tablesError.message.includes('relation "public.recruiters" does not exist')) {
        console.log('\n💡 The recruiters table does not exist.');
        console.log('Please run the SQL schema in your Supabase SQL Editor:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Run the schema from supabase_schema_varchar_fixed.sql');
        console.log('4. Or run the trigger fix from SUPABASE_TRIGGER_FIX.md');
      }
      return;
    }

    console.log('✅ Database connection successful');
    console.log(`📊 Recruiters table exists with ${count || 0} records`);

    // Test service role key if available
    if (supabaseServiceKey) {
      console.log('\n🔍 Testing service role key...');
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });

      const { data: adminTest, error: adminError } = await supabaseAdmin
        .from('recruiters')
        .select('count', { count: 'exact', head: true });

      if (adminError) {
        console.log('❌ Service role key test failed:', adminError.message);
      } else {
        console.log('✅ Service role key working correctly');
      }
    }

    // Test other tables
    console.log('\n🔍 Testing other tables...');
    
    const { count: testimonialsCount, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('*', { count: 'exact', head: true });

    const { count: submissionsCount, error: submissionsError } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true });

    console.log('- Testimonials table:', testimonialsError ? `❌ Error: ${testimonialsError.message}` : `✅ OK (${testimonialsCount || 0} records)`);
    console.log('- Submissions table:', submissionsError ? `❌ Error: ${submissionsError.message}` : `✅ OK (${submissionsCount || 0} records)`);

    console.log('\n🎉 Supabase connection test completed!');

  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
  }
}

testSupabaseConnection();