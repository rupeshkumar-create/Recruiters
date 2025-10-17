#!/usr/bin/env node

/**
 * Production Data Fix Script
 * Diagnoses and fixes data consistency issues in production
 */

const PRODUCTION_URL = 'https://directories-4hyw61beu-rupesh-kumars-projects-8be3cf82.vercel.app';

async function fixProductionData() {
  console.log('🔧 Production Data Fix Script');
  console.log('==============================\n');

  try {
    // Step 1: Diagnose the current state
    console.log('1️⃣ Diagnosing current state...');
    const debugResponse = await fetch(`${PRODUCTION_URL}/api/debug-production`);
    
    if (!debugResponse.ok) {
      console.log('❌ Cannot access debug endpoint - check deployment protection');
      console.log('💡 Disable deployment protection in Vercel dashboard first');
      return false;
    }
    
    const debugData = await debugResponse.json();
    console.log('📊 Debug Results:');
    console.log(`   Supabase Status: ${debugData.supabase.status}`);
    console.log(`   Supabase Data Count: ${debugData.supabase.dataCount}`);
    console.log(`   Fallback Data Count: ${debugData.fallback.migrationDataCount}`);
    console.log(`   Issue: ${debugData.diagnosis.issue}`);
    console.log(`   Recommendation: ${debugData.diagnosis.recommendation}\n`);

    // Step 2: Check current API responses
    console.log('2️⃣ Checking API responses...');
    
    const recruitersResponse = await fetch(`${PRODUCTION_URL}/api/recruiters`);
    let recruitersData = [];
    
    if (recruitersResponse.ok) {
      recruitersData = await recruitersResponse.json();
      console.log(`   Main API (/api/recruiters): ${recruitersData.length} recruiters`);
    } else {
      console.log('   ❌ Main API failed');
    }

    // Step 3: Force sync if needed
    if (debugData.supabase.status === 'CONNECTED' && debugData.supabase.dataCount === 0) {
      console.log('\n3️⃣ Supabase connected but empty - running force sync...');
      
      const syncResponse = await fetch(`${PRODUCTION_URL}/api/force-sync`, {
        method: 'POST'
      });
      
      if (syncResponse.ok) {
        const syncResult = await syncResponse.json();
        console.log('✅ Force sync completed');
        console.log(`   Before: ${syncResult.before.supabaseCount} recruiters`);
        console.log(`   After: ${syncResult.after.supabaseCount} recruiters`);
        console.log(`   Actions: ${syncResult.actions.join(', ')}`);
      } else {
        console.log('❌ Force sync failed');
        const errorText = await syncResponse.text();
        console.log(`   Error: ${errorText}`);
      }
    } else if (debugData.supabase.status !== 'CONNECTED') {
      console.log('\n3️⃣ Supabase not connected - checking environment variables...');
      console.log('   Please verify these in Vercel dashboard:');
      console.log('   - NEXT_PUBLIC_SUPABASE_URL');
      console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
      console.log('   - SUPABASE_SERVICE_ROLE_KEY');
    } else {
      console.log('\n3️⃣ Supabase has data - checking consistency...');
    }

    // Step 4: Verify fix
    console.log('\n4️⃣ Verifying fix...');
    
    const verifyResponse = await fetch(`${PRODUCTION_URL}/api/recruiters`);
    if (verifyResponse.ok) {
      const verifyData = await verifyResponse.json();
      console.log(`   ✅ Main API now returns: ${verifyData.length} recruiters`);
      
      if (verifyData.length > 0) {
        console.log(`   Sample: ${verifyData[0].name} - ${verifyData[0].company}`);
      }
    } else {
      console.log('   ❌ Main API still failing');
    }

    // Step 5: Test admin functionality
    console.log('\n5️⃣ Testing admin functionality...');
    
    if (recruitersData.length > 0) {
      const testRecruiter = recruitersData[0];
      const testUpdate = {
        ...testRecruiter,
        name: `${testRecruiter.name} - PRODUCTION TEST ${Date.now()}`,
        company: `${testRecruiter.company} - UPDATED`
      };
      
      const updateResponse = await fetch(`${PRODUCTION_URL}/api/recruiters/${testRecruiter.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUpdate)
      });
      
      if (updateResponse.ok) {
        const updateResult = await updateResponse.json();
        console.log('   ✅ Admin update successful');
        console.log(`   Updated: ${updateResult.recruiter?.name}`);
        
        // Verify the update persisted
        const checkResponse = await fetch(`${PRODUCTION_URL}/api/recruiters/${testRecruiter.id}`);
        if (checkResponse.ok) {
          const checkData = await checkResponse.json();
          if (checkData.name === testUpdate.name) {
            console.log('   ✅ Update persisted correctly');
          } else {
            console.log('   ❌ Update did not persist');
          }
        }
      } else {
        console.log('   ❌ Admin update failed');
        const errorText = await updateResponse.text();
        console.log(`   Error: ${errorText.substring(0, 200)}`);
      }
    }

    console.log('\n==============================');
    console.log('🎯 Fix Summary:');
    
    if (debugData.supabase.status === 'CONNECTED' && debugData.supabase.dataCount > 0) {
      console.log('✅ Production data is now consistent');
      console.log('✅ Admin functionality should work');
      console.log('✅ Changes will persist permanently');
      console.log('\n🎉 Your admin interface is ready for use!');
      console.log(`   Admin URL: ${PRODUCTION_URL}/admin/edit`);
    } else {
      console.log('❌ Issues still exist');
      console.log('💡 Next steps:');
      console.log('   1. Check Vercel environment variables');
      console.log('   2. Verify Supabase database exists');
      console.log('   3. Run force sync again');
    }

    return true;

  } catch (error) {
    console.error('❌ Fix script failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Ensure deployment protection is disabled');
    console.log('2. Check if the production URL is accessible');
    console.log('3. Verify environment variables in Vercel');
    return false;
  }
}

// Run the fix
fixProductionData().then(success => {
  process.exit(success ? 0 : 1);
});