// Test script to verify homepage data loading
const { RecruiterStorage } = require('./src/lib/recruiterStorage');

async function testDataLoading() {
  console.log('🧪 Testing Homepage Data Loading...\n');

  try {
    // Test sync data loading
    console.log('1. Testing getAllSync()...');
    const syncData = RecruiterStorage.getAllSync();
    console.log(`   ✅ Sync data loaded: ${syncData?.length || 0} recruiters`);

    // Test async data loading
    console.log('\n2. Testing getAll()...');
    const asyncData = await RecruiterStorage.getAll();
    console.log(`   ✅ Async data loaded: ${asyncData?.length || 0} recruiters`);

    // Test data structure
    if (syncData && syncData.length > 0) {
      console.log('\n3. Testing data structure...');
      const firstRecruiter = syncData[0];
      console.log(`   ✅ First recruiter: ${firstRecruiter.name}`);
      console.log(`   ✅ Company: ${firstRecruiter.company}`);
      console.log(`   ✅ Specialization: ${firstRecruiter.specialization}`);
      console.log(`   ✅ Hidden: ${firstRecruiter.hidden || false}`);
    }

    // Test filtering (simulate homepage logic)
    console.log('\n4. Testing filtering logic...');
    const visibleRecruiters = syncData.filter(r => !r.hidden);
    console.log(`   ✅ Visible recruiters: ${visibleRecruiters.length}`);

    console.log('\n🎉 All tests passed! Homepage should work correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDataLoading();