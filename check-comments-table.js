const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCommentsTable() {
  try {
    console.log('Checking comments table structure...');
    
    // Try to select from comments table to see what columns exist
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error accessing comments table:', error);
      
      // If table doesn't exist, let's check what tables do exist
      console.log('Checking available tables...');
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
        
      if (tablesError) {
        console.error('Error checking tables:', tablesError);
      } else {
        console.log('Available tables:', tables.map(t => t.table_name));
      }
    } else {
      console.log('Comments table exists');
      if (data && data.length > 0) {
        console.log('Sample comment structure:', Object.keys(data[0]));
      } else {
        console.log('Comments table is empty');
        
        // Let's try to insert a test comment to see what columns are required
        console.log('Testing comment insertion...');
        const testComment = {
          tool_id: '123e4567-e89b-12d3-a456-426614174000', // dummy UUID
          user_email: 'test@example.com',
          user_name: 'Test User',
          content: 'Test comment',
          status: 'pending'
        };
        
        const { data: insertData, error: insertError } = await supabase
          .from('comments')
          .insert(testComment)
          .select();
          
        if (insertError) {
          console.error('Error inserting test comment:', insertError);
        } else {
          console.log('Test comment inserted successfully:', insertData);
          
          // Clean up test comment
          if (insertData && insertData[0]) {
            await supabase
              .from('comments')
              .delete()
              .eq('id', insertData[0].id);
            console.log('Test comment cleaned up');
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCommentsTable();