const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Parse CSV data
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const tools = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing - handle quoted fields
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
    values.push(current.trim());

    if (values.length >= headers.length) {
      const tool = {};
      headers.forEach((header, index) => {
        tool[header] = values[index] ? values[index].replace(/^"|"$/g, '') : '';
      });
      tools.push(tool);
    }
  }

  return tools;
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Read CSV file
    const csvPath = path.join(__dirname, 'tools-data.csv');
    const csvText = fs.readFileSync(csvPath, 'utf8');
    const csvTools = parseCSV(csvText);

    console.log(`📊 Found ${csvTools.length} tools in CSV`);

    // Clear existing tools
    console.log('🧹 Clearing existing tools...');
    await supabase.from('tool_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('tools').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Get all categories
    const { data: categories } = await supabase.from('categories').select('*');
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    let successCount = 0;

    for (const csvTool of csvTools) {
      try {
        // Generate slug from name
        const slug = csvTool.Name.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        // Convert logo path to use local images
        let logoPath = csvTool.Logo;
        if (logoPath.includes('linkedin.com') || logoPath.includes('licdn.com')) {
          // Use local image path for LinkedIn images
          logoPath = `/images/${slug}.jpg`;
        } else if (logoPath.startsWith('http')) {
          // Use local image path for external images
          logoPath = `/images/${slug}.jpg`;
        }

        // Insert tool
        const { data: tool, error: toolError } = await supabase
          .from('tools')
          .insert({
            name: csvTool.Name,
            url: csvTool.URL,
            tagline: csvTool.Tagline,
            content: csvTool.Content,
            description: csvTool.Content,
            logo: logoPath,
            slug: slug,
            featured: csvTool.Featured === 'TRUE',
            hidden: false,
            approved: true,
            submitter_email: 'admin@example.com'
          })
          .select()
          .single();

        if (toolError) {
          console.error(`❌ Error inserting tool ${csvTool.Name}:`, toolError.message);
          continue;
        }

        // Handle categories
        if (csvTool.Categories) {
          const toolCategories = csvTool.Categories.split(',').map(c => c.trim());

          for (const categoryName of toolCategories) {
            if (categoryMap[categoryName]) {
              await supabase
                .from('tool_categories')
                .insert({
                  tool_id: tool.id,
                  category_id: categoryMap[categoryName]
                });
            }
          }
        }

        successCount++;
        if (successCount % 10 === 0) {
          console.log(`✅ Processed ${successCount} tools...`);
        }

      } catch (error) {
        console.error(`❌ Error processing tool ${csvTool.Name}:`, error.message);
      }
    }

    console.log(`🎉 Successfully seeded ${successCount} tools!`);

    // Verify the data
    const { error: verifyError } = await supabase
      .from('tools')
      .select('count')
      .single();

    if (!verifyError) {
      console.log(`✅ Database verification: ${successCount} tools in database`);
    }

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();