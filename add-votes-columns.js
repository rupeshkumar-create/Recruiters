const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addVotesColumns() {
  try {
    console.log('Adding missing columns to votes table...');
    
    // Check current structure
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .limit(1)
      .single();
    
    if (existingVote) {
      console.log('Current vote structure:', Object.keys(existingVote));
    }
    
    // Test inserting a vote with the new columns
    const testVote = {
      tool_id: '123e4567-e89b-12d3-a456-426614174000',
      user_email: 'test@example.com',
      user_name: 'Test User',
      user_company: 'Test Company',
      user_title: 'Test Title',
      vote_type: 'up',
      user_data: { company: 'Test Company', title: 'Test Title' }
    };
    
    const { data: insertedVote, error: insertError } = await supabase
      .from('votes')
      .insert(testVote)
      .select()
      .single();
    
    if (insertError) {
      console.error('Error inserting test vote:', insertError);
    } else {
      console.log('Test vote inserted successfully:', insertedVote);
      
      // Clean up test vote
      await supabase
        .from('votes')
        .delete()
        .eq('id', insertedVote.id);
      console.log('Test vote cleaned up');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

addVotesColumns();