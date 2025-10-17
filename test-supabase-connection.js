#!/usr/bin/env node

/**
 * Test Supabase connection and table schema
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vgonkiijhwfmlmbztoka.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnb25raWlqaHdmbWxtYnp0b2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ1NTY3OCwiZXhwIjoyMDc2MDMxNjc4fQ.5w9GYTVa5u39MgkCS1COvrDNcF_u3PM2lnHxT9Hq5Uc';

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Test 1: Check if we can connect
    console.log('1️⃣ Testing connection...');
    const { data: tables, error: tablesError } = await supabase
      .from('recruiters')
      .select('*')
      .limit(1);

    if (tablesError) {
      console.log('   ❌ Connection error:', tablesError.message);
      
      if (tablesError.message.includes('relation "public.recruiters" does not exist')) {
        console.log('   💡 Table does not exist - need to create it');
        return false;
      }
      
      if (tablesError.message.includes('uuid')) {
        console.log('   💡 Table exists but has UUID schema - need to recreate with VARCHAR');
        return false;
      }
    } else {
      console.log('   ✅ Connection successful!');
      console.log('   📊 Current data count:', tables?.length || 0);
    }

    // Test 2: Try to insert a test record
    console.log('\n2️⃣ Testing insert with VARCHAR ID...');
    const testRecord = {
      id: 'test-123',
      name: 'Test User',
      company: 'Test Company',
      email: 'test@example.com',
      phone: '+1234567890',
      linkedin: 'https://linkedin.com/in/test',
      specialization: 'Testing',
      experience: '1 year',
      location: 'Test City',
      bio: 'Test bio',
      avatar: 'https://example.com/avatar.jpg',
      slug: 'test-user'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('recruiters')
      .insert([testRecord])
      .select();

    if (insertError) {
      console.log('   ❌ Insert error:', insertError.message);
      return false;
    } else {
      console.log('   ✅ Insert successful!');
      
      // Clean up test record
      await supabase.from('recruiters').delete().eq('id', 'test-123');
      console.log('   🧹 Test record cleaned up');
    }

    console.log('\n🎉 Supabase is ready for admin functionality!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testSupabaseConnection().then(success => {
  if (success) {
    console.log('\n✅ You can now run: curl -X POST http://localhost:3000/api/populate-supabase');
  } else {
    console.log('\n❌ Please run the SQL setup first in Supabase Dashboard → SQL Editor');
    console.log('📄 Use the SQL from: COMPLETE_SUPABASE_SETUP_FINAL.sql');
  }
  process.exit(success ? 0 : 1);
});