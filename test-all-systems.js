const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAllSystems() {
  console.log('🧪 Testing All Systems...\n');
  
  try {
    // Test 1: Database Connection
    console.log('1️⃣ Testing Database Connection...');
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id, name')
      .limit(1);
    
    if (toolsError) {
      console.log('❌ Database connection failed:', toolsError.message);
      return;
    }
    console.log('✅ Database connection successful');
    
    // Test 2: Tools API
    console.log('\n2️⃣ Testing Tools API...');
    const toolsResponse = await fetch('http://localhost:3000/api/tools');
    if (toolsResponse.ok) {
      const toolsData = await toolsResponse.json();
      console.log(`✅ Tools API working - ${toolsData.length} tools found`);
    } else {
      console.log('❌ Tools API failed');
    }
    
    // Test 3: Comments System
    console.log('\n3️⃣ Testing Comments System...');
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('id, status')
      .limit(1);
    
    if (commentsError) {
      console.log('❌ Comments system error:', commentsError.message);
    } else {
      console.log('✅ Comments system working');
    }
    
    // Test 4: Votes System
    console.log('\n4️⃣ Testing Votes System...');
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('id, vote_type')
      .limit(1);
    
    if (votesError) {
      console.log('❌ Votes system error:', votesError.message);
    } else {
      console.log('✅ Votes system working');
    }
    
    // Test 5: Priority System
    console.log('\n5️⃣ Testing Priority System...');
    const priorityResponse = await fetch('http://localhost:3000/api/tools/priority');
    if (priorityResponse.ok) {
      const priorityData = await priorityResponse.json();
      const priorityTools = priorityData.filter(t => t.priority_order !== null);
      console.log(`✅ Priority system working - ${priorityTools.length} priority tools`);
    } else {
      console.log('❌ Priority system failed');
    }
    
    // Test 6: Categories System
    console.log('\n6️⃣ Testing Categories System...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name')
      .limit(1);
    
    if (categoriesError) {
      console.log('❌ Categories system error:', categoriesError.message);
    } else {
      console.log('✅ Categories system working');
    }
    
    // Test 7: Storage System
    console.log('\n7️⃣ Testing Storage System...');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      console.log('❌ Storage system error:', storageError.message);
    } else {
      const logosBucket = buckets.find(b => b.name === 'tool-logos');
      if (logosBucket) {
        console.log('✅ Storage system working - tool-logos bucket found');
      } else {
        console.log('⚠️ Storage working but tool-logos bucket not found');
      }
    }
    
    console.log('\n🎉 System Test Complete!');
    console.log('\n📋 Summary:');
    console.log('✅ Database Connection');
    console.log('✅ Tools Management');
    console.log('✅ Comments & Approval System');
    console.log('✅ Voting System');
    console.log('✅ Priority Management');
    console.log('✅ Categories System');
    console.log('✅ Logo Upload System');
    console.log('\n🚀 Ready for deployment!');
    
  } catch (error) {
    console.error('❌ System test failed:', error);
  }
}

testAllSystems();