const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// Create Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  try {
    console.log('Applying comment approval system migration...');
    
    // Read the migration file
    const migrationSQL = fs.readFileSync('database-migrations/add_comment_approval_system_safe.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.error(`Error in statement ${i + 1}:`, error);
          } else {
            console.log(`Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.error(`Error executing statement ${i + 1}:`, err);
        }
      }
    }
    
    console.log('Migration completed!');
    
    // Test the comments table structure
    console.log('Testing comments table structure...');
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error testing comments table:', error);
    } else {
      console.log('Comments table is accessible');
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

applyMigration();