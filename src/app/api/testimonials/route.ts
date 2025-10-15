import { NextRequest, NextResponse } from 'next/server';

export interface TestimonialSubmission {
  id: string;
  recruiterId: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  email: string;
  rating: number;
  testimonial: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

// GET /api/testimonials - Get all testimonial submissions (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const recruiterId = searchParams.get('recruiterId');

    // Mock testimonial submissions
    const mockTestimonials: TestimonialSubmission[] = [
      {
        id: '1',
        recruiterId: '1',
        firstName: 'John',
        lastName: 'Doe',
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        email: 'john.doe@techcorp.com',
        rating: 5,
        testimonial: 'Sarah was exceptional in helping me find my dream role. Her technical understanding and personal approach made all the difference.',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        recruiterId: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        title: 'VP Engineering',
        company: 'Startup Inc',
        email: 'jane.smith@startup.com',
        rating: 5,
        testimonial: 'Michael found us the perfect CEO for our transformation. His executive network and assessment skills are unparalleled.',
        status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    let filteredTestimonials = mockTestimonials;

    // Filter by status
    if (status !== 'all') {
      filteredTestimonials = mockTestimonials.filter(t => t.status === status);
    }

    // Filter by recruiter ID
    if (recruiterId) {
      filteredTestimonials = filteredTestimonials.filter(t => t.recruiterId === recruiterId);
    }

    return NextResponse.json(filteredTestimonials);
  } catch (error) {
    console.error('Error in GET /api/testimonials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/testimonials - Submit a new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recruiterId, firstName, lastName, title, company, email, rating, testimonial } = body;

    // Validate required fields
    if (!recruiterId || !firstName || !lastName || !title || !company || !email || !rating || !testimonial) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Create testimonial submission
    const newTestimonial: TestimonialSubmission = {
      id: Date.now().toString(),
      recruiterId,
      firstName,
      lastName,
      title,
      company,
      email,
      rating,
      testimonial: testimonial.trim(),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('New testimonial submitted:', newTestimonial);

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/testimonials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/testimonials - Update testimonial status (admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Testimonial ID and status are required' }, { status: 400 });
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Mock update
    const updatedTestimonial = {
      id,
      status,
      adminNotes: adminNotes || null,
      updated_at: new Date().toISOString()
    };

    console.log('Testimonial status updated:', updatedTestimonial);

    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    console.error('Error in PUT /api/testimonials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/testimonials - Delete a testimonial (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    console.log('Testimonial deleted:', id);

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/testimonials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}