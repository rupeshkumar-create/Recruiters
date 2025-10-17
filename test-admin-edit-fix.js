#!/usr/bin/env node

/**
 * Test script to verify admin edit functionality is working
 */

const BASE_URL = 'http://localhost:3000';

async function testAdminEditFunctionality() {
  console.log('🧪 Testing Admin Edit Functionality...\n');

  try {
    // 1. Get current Sarah Johnson data
    console.log('1️⃣ Fetching current Sarah Johnson data...');
    const currentResponse = await fetch(`${BASE_URL}/api/recruiters/1`);
    const currentData = await currentResponse.json();
    console.log(`   Current name: ${currentData.name}`);
    console.log(`   Current company: ${currentData.company}\n`);

    // 2. Update Sarah Johnson with new data
    console.log('2️⃣ Updating Sarah Johnson data...');
    const updateData = {
      ...currentData,
      name: 'Sarah Johnson - ADMIN EDIT TEST',
      company: 'TechTalent Solutions - ADMIN EDIT TEST',
      jobTitle: 'Senior Technical Recruiter - UPDATED'
    };

    const updateResponse = await fetch(`${BASE_URL}/api/recruiters/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    const updateResult = await updateResponse.json();
    
    if (updateResult.success) {
      console.log('   ✅ Update successful!');
      console.log(`   Updated name: ${updateResult.recruiter.name}`);
      console.log(`   Updated company: ${updateResult.recruiter.company}\n`);
    } else {
      console.log('   ❌ Update failed:', updateResult.error);
      return false;
    }

    // 3. Verify changes in main API
    console.log('3️⃣ Verifying changes in main recruiters API...');
    const verifyResponse = await fetch(`${BASE_URL}/api/recruiters`);
    const allRecruiters = await verifyResponse.json();
    const updatedRecruiter = allRecruiters.find(r => r.id === '1');
    
    if (updatedRecruiter && updatedRecruiter.name === updateData.name) {
      console.log('   ✅ Changes reflected in main API!');
      console.log(`   Verified name: ${updatedRecruiter.name}`);
      console.log(`   Verified company: ${updatedRecruiter.company}\n`);
    } else {
      console.log('   ❌ Changes not reflected in main API');
      return false;
    }

    // 4. Verify changes in individual API
    console.log('4️⃣ Verifying changes in individual recruiter API...');
    const individualResponse = await fetch(`${BASE_URL}/api/recruiters/1`);
    const individualData = await individualResponse.json();
    
    if (individualData.name === updateData.name) {
      console.log('   ✅ Changes reflected in individual API!');
      console.log(`   Verified name: ${individualData.name}`);
      console.log(`   Verified company: ${individualData.company}\n`);
    } else {
      console.log('   ❌ Changes not reflected in individual API');
      return false;
    }

    console.log('🎉 ALL TESTS PASSED!');
    console.log('✅ Admin edit functionality is working correctly');
    console.log('✅ Changes persist across all API endpoints');
    console.log('✅ The admin interface at http://localhost:3000/admin/edit should work now');
    console.log('\n💡 Note: Changes are stored in memory and will be lost on server restart.');
    console.log('💡 For permanent storage, set up Supabase credentials in .env.local');
    
    return true;

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return false;
  }
}

// Run the test
testAdminEditFunctionality().then(success => {
  process.exit(success ? 0 : 1);
});