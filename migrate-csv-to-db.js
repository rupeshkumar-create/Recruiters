const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please check your .env.local file for:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read and parse CSV file
const csvPath = path.join(__dirname, 'tools-data.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV content
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',');

// Parse each line into a tool object
const tools = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  
  // Split by comma but handle commas within quotes
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim()); // Add the last value
  
  if (values.length >= 8) {
    const name = values[0] || '';
    const tool = {
      name,
      url: values[1] || '',
      tagline: values[2] || '',
      content: values[3] || '',
      categoryNames: values[4] || '', // Store category names separately
      logo: values[5] || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F26B21&color=fff&size=48`,
      slug: (values[6] || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')),
      featured: values[7] === 'TRUE',
      approved: true,
      hidden: false
    };
    tools.push(tool);
  }
}

console.log(`Parsed ${tools.length} tools from CSV`);

async function migrateTools() {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await supabase.from('tool_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('tools').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert tools one by one to handle categories
    let successCount = 0;
    
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      console.log(`Processing tool ${i + 1}/${tools.length}: ${tool.name}`);
      
      // Insert the tool (without categories)
      const toolData = {
        name: tool.name,
        url: tool.url,
        tagline: tool.tagline,
        content: tool.content,
        logo: tool.logo,
        slug: tool.slug,
        featured: tool.featured,
        approved: tool.approved,
        hidden: tool.hidden
      };
      
      const { data: insertedTool, error: toolError } = await supabase
        .from('tools')
        .insert(toolData)
        .select('id')
        .single();
      
      if (toolError) {
        console.error(`Error inserting tool ${tool.name}:`, toolError);
        continue;
      }
      
      // Handle categories
      if (tool.categoryNames) {
        const categoryNames = tool.categoryNames.split(',').map(cat => cat.trim()).filter(Boolean);
        
        for (const categoryName of categoryNames) {
          // Find or create category
          let { data: category } = await supabase
            .from('categories')
            .select('id')
            .eq('name', categoryName)
            .single();
          
          if (!category) {
            const { data: newCategory } = await supabase
              .from('categories')
              .insert({
                name: categoryName,
                slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
              })
              .select('id')
              .single();
            category = newCategory;
          }
          
          if (category) {
            // Create tool-category association
            await supabase
              .from('tool_categories')
              .insert({
                tool_id: insertedTool.id,
                category_id: category.id
              });
          }
        }
      }
      
      successCount++;
    }
    
    console.log(`\nMigration completed!`);
    console.log(`Successfully migrated ${successCount}/${tools.length} tools`);
    
    // Verify the migration
    const { data: verifyData, error: verifyError } = await supabase
      .from('tools')
      .select('id, name, featured')
      .order('name');
    
    if (verifyError) {
      console.error('Error verifying migration:', verifyError);
    } else {
      console.log(`\nVerification: Found ${verifyData.length} tools in database`);
      const featuredCount = verifyData.filter(t => t.featured).length;
      console.log(`Featured tools: ${featuredCount}`);
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateTools();