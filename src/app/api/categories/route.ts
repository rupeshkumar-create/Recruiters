import { NextRequest, NextResponse } from 'next/server';
import { csvRecruiters } from '../../../lib/data';

// GET /api/categories - Fetch all specializations from local data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    // Extract unique specializations from recruiters
    const categorySet = new Set<string>();
    csvRecruiters.forEach(recruiter => {
      if (recruiter.specialization) {
        const trimmed = recruiter.specialization.trim();
        if (trimmed) {
          categorySet.add(trimmed);
        }
      }
    });

    // Convert to category objects
    const categories = Array.from(categorySet).map(name => ({
      id: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })).sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error in GET /api/categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/categories - Create a new category (local storage)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();

    // Create new category
    const category = {
      id: Date.now().toString(),
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/categories - Update a category (local storage)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, active } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();

    // Mock updated category
    const category = {
      id,
      name: name.trim(),
      slug,
      description: description?.trim() || null,
      active: active !== undefined ? active : true,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error in PUT /api/categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/categories - Delete a category (local storage)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Mock deletion
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}