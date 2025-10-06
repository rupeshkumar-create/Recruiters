import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '../../../../lib/supabase'

const supabase = getServiceSupabase()

// PUT /api/tools/[id] - Update a tool
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    
    const {
      name,
      url,
      tagline,
      content,
      description,
      logo,
      slug,
      featured,
      hidden,
      categories
    } = body

    // Update the tool in Supabase
    const { data, error } = await supabase
      .from('tools')
      .update({
        name,
        url,
        tagline,
        content,
        description,
        logo,
        slug,
        featured: featured || false,
        hidden: hidden || false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating tool:', error)
      return NextResponse.json({ error: 'Failed to update tool' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
    }

    // Handle categories if provided
    if (categories) {
      // First, remove existing category associations
      await supabase
        .from('tool_categories')
        .delete()
        .eq('tool_id', id)

      // Parse categories string and add new associations
      const categoryNames = categories.split(',').map((cat: string) => cat.trim()).filter(Boolean)
      
      for (const categoryName of categoryNames) {
        // Find or create category
        let { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('name', categoryName)
          .single()

        if (!category) {
          // Create new category if it doesn't exist
          const { data: newCategory } = await supabase
            .from('categories')
            .insert({
              name: categoryName,
              slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            })
            .select('id')
            .single()
          
          category = newCategory
        }

        if (category) {
          // Create tool-category association
          await supabase
            .from('tool_categories')
            .insert({
              tool_id: id,
              category_id: category.id
            })
        }
      }
    }

    return NextResponse.json({ tool: data })
  } catch (error) {
    console.error('Error in PUT /api/tools/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/tools/[id] - Delete a tool
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Delete the tool from Supabase (cascade will handle related records)
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting tool:', error)
      return NextResponse.json({ error: 'Failed to delete tool' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/tools/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/tools/[id] - Get a specific tool by ID or slug
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: 'ID or slug is required' }, { status: 400 })
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      return NextResponse.json({ error: 'Supabase not configured. Please check SUPABASE_SETUP.md' }, { status: 503 })
    }

    // Try to find by ID first (UUID format), then by slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    
    let query = supabase
      .from('tools')
      .select(`
        *,
        tool_categories(
          categories(
            name,
            slug
          )
        )
      `)
      .eq('approved', true)
      .eq('hidden', false)

    if (isUUID) {
      query = query.eq('id', id)
    } else {
      query = query.eq('slug', id)
    }

    const { data: tool, error } = await query.single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
      }
      console.error('Error fetching tool:', error)
      return NextResponse.json({ error: 'Failed to fetch tool' }, { status: 500 })
    }

    // Format the response to match the expected structure
    const formattedTool = {
      ...tool,
      categories: tool.tool_categories?.map((tc: any) => tc.categories.name).join(', ') || ''
    }

    // Remove the junction table data from the response
    delete formattedTool.tool_categories

    return NextResponse.json(formattedTool)
  } catch (error) {
    console.error('Error in GET /api/tools/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}