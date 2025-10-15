import { NextRequest, NextResponse } from 'next/server';
import { csvRecruiters } from '../../../lib/data';

// GET /api/tools - Fetch all approved recruiters from local data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    let recruiters = csvRecruiters.filter(recruiter => 
      (recruiter.approved !== false) && 
      (recruiter.hidden !== true)
    );

    // Filter by featured if specified
    if (featured === 'true') {
      recruiters = recruiters.filter(recruiter => recruiter.featured === true);
    }

    // Filter by specialization if specified
    if (category) {
      recruiters = recruiters.filter(recruiter => 
        recruiter.specialization && recruiter.specialization.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      recruiters = recruiters.filter(recruiter => 
        recruiter.name.toLowerCase().includes(searchLower) ||
        recruiter.company.toLowerCase().includes(searchLower) ||
        recruiter.specialization.toLowerCase().includes(searchLower) ||
        recruiter.location.toLowerCase().includes(searchLower) ||
        (recruiter.bio && recruiter.bio.toLowerCase().includes(searchLower))
      );
    }

    // Sort by featured first, then by rating, then by name
    recruiters.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.rating && b.rating && a.rating !== b.rating) return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json(recruiters);
  } catch (error) {
    console.error('Error in GET /api/tools:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/tools - Create a new tool (local storage)
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

    // Create new tool object
    const newTool = {
      id: Date.now().toString(),
      name,
      url,
      tagline,
      content: content || '',
      description: description || '',
      categories: Array.isArray(categories) ? categories.join(', ') : (categories || ''),
      logo: logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F26B21&color=fff&size=48`,
      slug,
      featured,
      hidden,
      approved: true,
      submitterEmail: submitter_email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(newTool, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/tools:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/tools - Update a tool (local storage)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, url, tagline, content, description, logo, categories, featured, hidden } = body;

    if (!id) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });
    }

    // Find and update tool in csvTools array (this is just a mock response)
    const updatedTool = {
      id,
      name,
      url,
      tagline,
      content,
      description,
      logo,
      categories: Array.isArray(categories) ? categories.join(', ') : (categories || ''),
      featured,
      hidden,
      slug: name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : undefined,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(updatedTool);
  } catch (error) {
    console.error('Error in PUT /api/tools:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/tools - Delete a tool (local storage)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });
    }

    // Mock deletion (in real implementation, this would remove from local storage)
    return NextResponse.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/tools:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}