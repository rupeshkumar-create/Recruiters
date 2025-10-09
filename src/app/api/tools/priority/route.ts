import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '../../../../lib/supabase';

const supabase = getServiceSupabase();

// PUT /api/tools/priority - Update priority order for multiple tools
export async function PUT(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    const body = await request.json();
    const { toolPriorities } = body; // Array of { id, priority_order }

    if (!Array.isArray(toolPriorities)) {
      return NextResponse.json({ error: 'toolPriorities must be an array' }, { status: 400 });
    }

    // Validate that we have at most 15 priority tools
    const priorityTools = toolPriorities.filter(tool => tool.priority_order !== null && tool.priority_order !== undefined);
    if (priorityTools.length > 15) {
      return NextResponse.json({ error: 'Maximum 15 tools can have priority order' }, { status: 400 });
    }

    // Update each tool's priority order
    const updatePromises = toolPriorities.map(async ({ id, priority_order }) => {
      const { error } = await supabase
        .from('tools')
        .update({ priority_order })
        .eq('id', id);
      
      if (error) {
        console.error(`Error updating tool ${id}:`, error);
        throw error;
      }
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Priority order updated successfully' });
  } catch (error) {
    console.error('Error in PUT /api/tools/priority:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/tools/priority - Get tools with their current priority order
export async function GET(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    const { data: tools, error } = await supabase
      .from('tools')
      .select(`
        id,
        name,
        tagline,
        logo,
        priority_order,
        created_at,
        tool_categories!inner(
          categories!inner(
            name
          )
        )
      `)
      .eq('approved', true)
      .eq('hidden', false)
      .order('priority_order', { ascending: true, nullsLast: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tools for priority:', error);
      return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
    }

    // Transform the data
    const transformedTools = tools?.map(tool => ({
      ...tool,
      categories: tool.tool_categories?.map((tc: any) => tc.categories.name).join(', ') || ''
    })) || [];

    return NextResponse.json(transformedTools);
  } catch (error) {
    console.error('Error in GET /api/tools/priority:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}