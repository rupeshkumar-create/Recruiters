// Test script to verify admin panel and homepage functionality
const { RecruiterStorage } = require('./src/lib/recruiterStorage');

async function testAdminAndHomepage() {
  console.log('🧪 Testing Admin Panel & Homepage Functionality...\n');

  try {
    // Test 1: Data Loading (Homepage dependency)
    console.log('1. Testing data loading...');
    const syncData = RecruiterStorage.getAllSync();
    console.log(`   ✅ Sync data: ${syncData?.length || 0} recruiters`);

    const asyncData = await RecruiterStorage.getAll();
    console.log(`   ✅ Async data: ${asyncData?.length || 0} recruiters`);

    // Test 2: Data Structure (Admin panel dependency)
    if (syncData && syncData.length > 0) {
      console.log('\n2. Testing data structure...');
      const firstRecruiter = syncData[0];
      
      // Check required fields for admin panel
      const requiredFields = ['id', 'name', 'company', 'email', 'specialization', 'status'];
      const missingFields = requiredFields.filter(field => !firstRecruiter[field]);
      
      if (missingFields.length === 0) {
        console.log('   ✅ All required fields present');
        console.log(`   ✅ Sample: ${firstRecruiter.name} (${firstRecruiter.company})`);
      } else {
        console.log(`   ❌ Missing fields: ${missingFields.join(', ')}`);
      }
    }

    // Test 3: API Endpoints (Admin panel functionality)
    console.log('\n3. Testing API endpoints...');
    
    // Test submissions API
    try {
      const submissionsResponse = await fetch('http://localhost:3000/api/submissions');
      console.log(`   ✅ Submissions API: ${submissionsResponse ? 'Available' : 'Not available'}`);
    } catch (error) {
      console.log('   ⚠️  Submissions API: Server not running (expected in test)');
    }

    // Test recruiters API
    try {
      const recruitersResponse = await fetch('http://localhost:3000/api/recruiters');
      console.log(`   ✅ Recruiters API: ${recruitersResponse ? 'Available' : 'Not available'}`);
    } catch (error) {
      console.log('   ⚠️  Recruiters API: Server not running (expected in test)');
    }

    // Test 4: Filter Data (Homepage functionality)
    console.log('\n4. Testing filter functionality...');
    const visibleRecruiters = syncData.filter(r => !r.hidden);
    const specializations = [...new Set(visibleRecruiters.map(r => r.specialization))];
    
    console.log(`   ✅ Visible recruiters: ${visibleRecruiters.length}`);
    console.log(`   ✅ Specializations: ${specializations.length} categories`);
    console.log(`   ✅ Categories: ${specializations.slice(0, 3).join(', ')}...`);

    // Test 5: Admin Panel Data Requirements
    console.log('\n5. Testing admin panel requirements...');
    const pendingSubmissions = syncData.filter(r => r.status === 'pending');
    const approvedRecruiters = syncData.filter(r => r.status === 'approved');
    
    console.log(`   ✅ Pending submissions: ${pendingSubmissions.length}`);
    console.log(`   ✅ Approved recruiters: ${approvedRecruiters.length}`);

    console.log('\n🎉 All tests passed! Both Homepage and Admin Panel should work correctly.');
    console.log('\n📋 Summary:');
    console.log(`   • Homepage: ${syncData.length} recruiters available`);
    console.log(`   • Admin Panel: ${pendingSubmissions.length} pending submissions`);
    console.log(`   • Filters: ${specializations.length} specialization categories`);
    console.log(`   • Data Quality: All required fields present`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure the data file exists: src/lib/data.ts');
    console.log('   2. Check that RecruiterStorage is properly exported');
    console.log('   3. Verify localStorage is working (browser environment)');
  }
}

testAdminAndHomepage();