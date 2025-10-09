const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTools() {
  try {
    console.log('Checking tools in database...');
    
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, name, slug, approved, hidden')
      .limit(10);
    
    if (error) {
      console.error('Error fetching tools:', error);
    } else {
      console.log('Found tools:', tools);
      
      if (tools.length === 0) {
        console.log('No tools found in database. Let me check if we need to seed data...');
        
        // Check if there are any submissions that could be approved
        const { data: submissions, error: submissionsError } = await supabase
          .from('submissions')
          .select('*')
          .limit(5);
          
        if (submissionsError) {
          console.error('Error checking submissions:', submissionsError);
        } else {
          console.log('Found submissions:', submissions.length);
          if (submissions.length > 0) {
            console.log('Sample submission:', submissions[0]);
          }
        }
      } else {
        console.log('Testing API call to first tool...');
        const firstTool = tools[0];
        
        try {
          const response = await fetch(`http://localhost:3004/api/tools/${firstTool.slug}`);
          console.log('API response status:', response.status);
          
          if (response.ok) {
            const toolData = await response.json();
            console.log('API returned tool:', toolData.name);
          } else {
            const errorData = await response.json();
            console.log('API error:', errorData);
          }
        } catch (fetchError) {
          console.error('Error calling API:', fetchError);
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTools();