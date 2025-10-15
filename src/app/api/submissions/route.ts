import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for submissions (in production, use a database)
let submissions: any[] = [];

// GET /api/submissions - Get all submissions
export async function GET() {
  try {
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error in GET /api/submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/submissions - Submit a new recruiter profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'name', 'jobTitle', 'company', 'email', 'phone', 'linkedin',
      'location', 'experience', 'bio', 'specializations',
      'placements', 'avgTimeToHire', 'candidateSatisfaction', 'clientRetention',
      'achievements', 'workExperience', 'rolesPlaced', 'industries',
      'keywords', 'languages', 'seniorityLevels', 'employmentTypes', 'regions'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = body[field];
      if (Array.isArray(value)) {
        return value.length === 0;
      }
      return !value || (typeof value === 'string' && value.trim() === '');
    });

    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `Missing or empty required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Validate bio word count (200-500 words)
    const bioWordCount = body.bio.trim().split(/\s+/).length;
    if (bioWordCount < 200 || bioWordCount > 500) {
      return NextResponse.json({
        error: `Bio must be between 200-500 words (currently ${bioWordCount} words)`
      }, { status: 400 });
    }

    // Validate array lengths
    const arrayValidations = [
      { field: 'specializations', min: 1, max: 3 },
      { field: 'achievements', min: 1, max: 6 },
      { field: 'workExperience', min: 1, max: 3 },
      { field: 'rolesPlaced', min: 1, max: 7 },
      { field: 'industries', min: 1, max: 5 },
      { field: 'keywords', min: 1, max: 5 },
      { field: 'languages', min: 1, max: 3 },
      { field: 'seniorityLevels', min: 1, max: 3 },
      { field: 'employmentTypes', min: 1, max: 2 },
      { field: 'regions', min: 1, max: 2 }
    ];

    for (const validation of arrayValidations) {
      const array = body[validation.field];
      if (!Array.isArray(array) || array.length < validation.min || array.length > validation.max) {
        return NextResponse.json({
          error: `${validation.field} must have between ${validation.min}-${validation.max} items`
        }, { status: 400 });
      }
    }

    // Generate slug
    const slug = body.name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 50);

    // Create submission object
    const submission = {
      id: Date.now().toString(),

      // Basic Information
      name: body.name,
      jobTitle: body.jobTitle,
      company: body.company,
      email: body.email,
      phone: body.phone,
      linkedin: body.linkedin,
      website: body.website || '',
      location: body.location,
      experience: body.experience,
      bio: body.bio,
      avatar: body.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(body.name)}&background=3B82F6&color=fff&size=128`,
      slug,

      // Specializations
      specialization: body.specializations[0], // Primary specialization for compatibility
      specializations: body.specializations,

      // Performance Metrics
      rating: 0, // Will be set after reviews
      reviewCount: 0,
      placements: body.placements,
      avgTimeToHire: body.avgTimeToHire,
      candidateSatisfaction: body.candidateSatisfaction,
      clientRetention: body.clientRetention,

      // Professional Details
      achievements: body.achievements,
      workExperience: body.workExperience,
      rolesPlaced: body.rolesPlaced,
      industries: body.industries,
      keywords: body.keywords,
      languages: body.languages,
      seniorityLevels: body.seniorityLevels,
      employmentTypes: body.employmentTypes,
      regions: body.regions,

      // Optional fields
      certifications: body.certifications || [],
      testimonials: [], // Will be added later

      // Availability
      availability: body.availability || { accepting: true, nextAvailable: '' },

      // Social Proof
      socialProof: body.socialProof || { linkedinFollowers: 0, featuredIn: [] },

      // Status and metadata
      status: 'pending',
      approved: false,
      hidden: true, // Hidden until approved
      featured: false,
      submitterEmail: body.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to submissions array
    submissions.push(submission);

    console.log('Recruiter profile submission received:', {
      id: submission.id,
      name: submission.name,
      company: submission.company,
      email: submission.email
    });

    return NextResponse.json({
      message: 'Recruiter profile submitted successfully',
      id: submission.id
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/submissions - Approve a submission
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    const submissionIndex = submissions.findIndex(s => s.id === id);
    if (submissionIndex === -1) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (action === 'approve') {
      submissions[submissionIndex] = {
        ...submissions[submissionIndex],
        status: 'approved',
        approved: true,
        hidden: false, // Make visible when approved
        updated_at: new Date().toISOString()
      };

      console.log('Submission approved:', id);
      return NextResponse.json({ message: 'Submission approved successfully' });
    } else if (action === 'reject') {
      submissions[submissionIndex] = {
        ...submissions[submissionIndex],
        status: 'rejected',
        approved: false,
        updated_at: new Date().toISOString()
      };

      console.log('Submission rejected:', id);
      return NextResponse.json({ message: 'Submission rejected successfully' });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in PUT /api/submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/submissions - Delete a submission
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    const submissionIndex = submissions.findIndex(s => s.id === id);
    if (submissionIndex === -1) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    submissions.splice(submissionIndex, 1);
    console.log('Submission deleted:', id);

    return NextResponse.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}