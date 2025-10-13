const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyAnalyticsMigration() {
  try {
    console.log('Applying analytics migration...');
    
    // Check if analytics table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'analytics');
    
    if (tablesError) {
      console.error('Error checking tables:', tablesError);
      return;
    }
    
    if (tables && tables.length > 0) {
      console.log('Analytics table already exists');
    } else {
      console.log('Analytics table does not exist, you need to run the migration in Supabase SQL editor');
      console.log('Please run the SQL from: database-migrations/add_analytics_table.sql');
    }
    
    // Test inserting a sample analytics event
    console.log('Testing analytics insertion...');
    const { data: testEvent, error: insertError } = await supabase
      .from('analytics')
      .insert({
        tool_id: '123e4567-e89b-12d3-a456-426614174000', // dummy UUID
        event_type: 'click',
        ip_address: '127.0.0.1',
        user_agent: 'test',
        metadata: { test: true }
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error inserting test event:', insertError);
      console.log('You may need to run the migration SQL manually in Supabase');
    } else {
      console.log('Test event inserted successfully:', testEvent);
      
      // Clean up test event
      await supabase
        .from('analytics')
        .delete()
        .eq('id', testEvent.id);
      console.log('Test event cleaned up');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

applyAnalyticsMigration();