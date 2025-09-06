import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '../../../lib/supabase';

const supabase = getServiceSupabase();

// GET /api/tools - Fetch all approved tools
export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      return NextResponse.json({ error: 'Supabase not configured. Please check SUPABASE_SETUP.md' }, { status: 503 });
    }
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let query = supabase
      .from('tools')
      .select(`
        *,
        tool_categories!inner(
          categories!inner(
            id,
            name,
            slug
          )
        )
      `)
      .eq('approved', true)
      .eq('hidden', false);

    // Filter by featured if specified
    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    // Filter by category if specified
    if (category) {
      query = query.eq('tool_categories.categories.slug', category);
    }

    // Search functionality
    if (search) {
      query = query.or(`name.ilike.%${search}%,tagline.ilike.%${search}%,content.ilike.%${search}%`);
    }

    const { data: tools, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tools:', error);
      return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
    }

    // Transform the data to match the expected format
    const transformedTools = tools?.map(tool => ({
      ...tool,
      categories: tool.tool_categories?.map((tc: any) => tc.categories.name).join(', ') || ''
    })) || [];

    return NextResponse.json(transformedTools);
  } catch (error) {
    console.error('Error in GET /api/tools:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/tools - Create a new tool (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, tagline, content, description, logo, categories, featured = false, hidden = false, submitter_email } = body;

    // Validate required fields
    if (!name || !url || !tagline) {
      return NextResponse.json({ error: 'Missing required fields: name, url, tagline' }, { status: 400 });
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Insert the tool
    const { data: tool, error: toolError } = await supabase
      .from('tools')
      .insert({
        name,
        url,
        tagline,
        content,
        description,
        logo: logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F26B21&color=fff&size=48`,
        slug,
        featured,
        hidden,
        approved: true,
        submitter_email
      })
      .select()
      .single();

    if (toolError) {
      console.error('Error creating tool:', toolError);
      return NextResponse.json({ error: 'Failed to create tool' }, { status: 500 });
    }

    // Handle categories if provided
    if (categories && Array.isArray(categories)) {
      for (const categoryName of categories) {
        // Find or create category
        const { data: category, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('name', categoryName)
          .single();

        if (category) {
          // Link tool to category
          await supabase
            .from('tool_categories')
            .insert({
              tool_id: tool.id,
              category_id: category.id
            });
        }
      }
    }

    return NextResponse.json(tool, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/tools:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/tools - Update a tool (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, url, tagline, content, description, logo, categories, featured, hidden } = body;

    if (!id) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });
    }

    // Update the tool
    const { data: tool, error: toolError } = await supabase
      .from('tools')
      .update({
        name,
        url,
        tagline,
        content,
        description,
        logo,
        featured,
        hidden,
        slug: name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : undefined
      })
      .eq('id', id)
      .select()
      .single();

    if (toolError) {
      console.error('Error updating tool:', toolError);
      return NextResponse.json({ error: 'Failed to update tool' }, { status: 500 });
    }

    // Update categories if provided
    if (categories && Array.isArray(categories)) {
      // Remove existing categories
      await supabase
        .from('tool_categories')
        .delete()
        .eq('tool_id', id);

      // Add new categories
      for (const categoryName of categories) {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('name', categoryName)
          .single();

        if (category) {
          await supabase
            .from('tool_categories')
            .insert({
              tool_id: id,
              category_id: category.id
            });
        }
      }
    }

    return NextResponse.json(tool);
  } catch (error) {
    console.error('Error in PUT /api/tools:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/tools - Delete a tool (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tool:', error);
      return NextResponse.json({ error: 'Failed to delete tool' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/tools:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}