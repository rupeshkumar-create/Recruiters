const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyVotesMigration() {
  try {
    console.log('Applying votes migration manually...');
    
    // Check if columns exist by trying to select them
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('user_company, user_title')
        .limit(1);
      
      if (!error) {
        console.log('Columns already exist');
        return;
      }
    } catch (e) {
      console.log('Columns do not exist, need to add them manually');
    }
    
    // Since we can't execute DDL through the API, let's work around it
    // by updating the votes table structure through the Supabase dashboard
    console.log('Please add the following columns to the votes table in Supabase dashboard:');
    console.log('1. user_company (VARCHAR(255))');
    console.log('2. user_title (VARCHAR(255))');
    
    // Test if we can insert with the new structure
    console.log('Testing current votes table structure...');
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .limit(1)
      .single();
    
    if (existingVote) {
      console.log('Current vote columns:', Object.keys(existingVote));
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

applyVotesMigration();