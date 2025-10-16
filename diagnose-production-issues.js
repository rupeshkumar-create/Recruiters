#!/usr/bin/env node

// Production Issues Diagnostic Script
const https = require('https');

const VERCEL_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://your-vercel-domain.vercel.app';

console.log('🔍 Diagnosing Production Issues...\n');

// Test API endpoints
async function testEndpoint(path, description) {
  return new Promise((resolve) => {
    const url = `${VERCEL_URL}${path}`;
    console.log(`Testing ${description}: ${url}`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`✅ ${description}: ${Array.isArray(parsed) ? parsed.length : 'OK'} items`);
          resolve({ success: true, data: parsed });
        } catch (error) {
          console.log(`❌ ${description}: Invalid JSON response`);
          console.log(`Response: ${data.substring(0, 200)}...`);
          resolve({ success: false, error: data });
        }
      });
    }).on('error', (error) => {
      console.log(`❌ ${description}: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
  });
}

async function runDiagnostics() {
  console.log('1. Testing Recruiters API...');
  const recruitersTest = await testEndpoint('/api/recruiters', 'Recruiters API');
  
  console.log('\n2. Testing Submissions API...');
  const submissionsTest = await testEndpoint('/api/submissions', 'Submissions API');
  
  console.log('\n3. Testing Homepage Data...');
  // Test if homepage loads
  
  console.log('\n📊 DIAGNOSTIC RESULTS:');
  console.log('='.repeat(50));
  
  if (recruitersTest.success) {
    console.log(`✅ Recruiters: ${recruitersTest.data.length} found`);
    if (recruitersTest.data.length <= 3) {
      console.log('⚠️  WARNING: Only 3 or fewer recruiters found');
      console.log('   This suggests Supabase is not connected or has no data');
    }
  } else {
    console.log('❌ Recruiters API failed');
  }
  
  if (submissionsTest.success) {
    console.log(`✅ Submissions: ${submissionsTest.data.length} found`);
    if (submissionsTest.data.length === 0) {
      console.log('⚠️  WARNING: No submissions found');
      console.log('   New submissions may not be saving to database');
    }
  } else {
    console.log('❌ Submissions API failed');
  }
  
  console.log('\n🔧 RECOMMENDED FIXES:');
  console.log('='.repeat(50));
  
  if (!recruitersTest.success || (recruitersTest.success && recruitersTest.data.length <= 3)) {
    console.log('1. Check Supabase connection:');
    console.log('   - Verify NEXT_PUBLIC_SUPABASE_URL is set');
    console.log('   - Verify SUPABASE_SERVICE_ROLE_KEY is set');
    console.log('   - Check if recruiters table exists and has data');
  }
  
  if (!submissionsTest.success || (submissionsTest.success && submissionsTest.data.length === 0)) {
    console.log('2. Check submissions storage:');
    console.log('   - Verify submissions table exists');
    console.log('   - Test submitting a new profile');
    console.log('   - Check if submissions are being saved');
  }
  
  console.log('\n3. Environment Variables to verify in Vercel:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  console.log('   - NEXT_PUBLIC_APP_URL');
}

runDiagnostics().catch(console.error);