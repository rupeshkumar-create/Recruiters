import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// In-memory storage for submissions (fallback when Supabase is not available)
let submissions: any[] = [];

// GET /api/submissions - Get all submissions
export async function GET() {
  try {
    // Try Supabase first
    if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { data, error } = await supabaseAdmin
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        // Fall back to in-memory storage
        return NextResponse.json(submissions);
      }

      return NextResponse.json(data || []);
    }

    // Fallback to in-memory storage
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
    const submissionData = {
      name: body.name,
      job_title: body.jobTitle,
      company: body.company,
      email: body.email,
      phone: body.phone,
      linkedin: body.linkedin,
      website: body.website || null,
      specialization: body.specializations[0], // Primary specialization
      experience: body.experience,
      location: body.location,
      remote_available: body.remoteAvailable || false,
      bio: body.bio,
      avatar: body.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(body.name)}&background=3B82F6&color=fff&size=128`,
      submitter_email: body.email,
      status: 'pending'
    };

    let submission;

    // Try Supabase first
    if (supabase && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase
        .from('submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        // Fall back to in-memory storage
        submission = {
          id: Date.now().toString(),
          ...submissionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        submissions.push(submission);
      } else {
        submission = data;
      }
    } else {
      // Fallback to in-memory storage
      submission = {
        id: Date.now().toString(),
        ...submissionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      submissions.push(submission);
    }

    console.log('Recruiter profile submission received:', {
      id: submission.id,
      name: submission.name,
      company: submission.company,
      email: submission.email
    });

    // Send confirmation email to the submitter
    try {
      await emailService.sendSubmissionConfirmation({
        name: submission.name,
        email: submission.email,
      });
      console.log('Confirmation email sent to:', submission.email);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      // Don't fail the submission if email fails
    }

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
      let submission;

      // Try Supabase first
      if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { data, error } = await supabaseAdmin
          .from('submissions')
          .update({ status: 'approved' })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          // Fall back to in-memory storage
          const submissionIndex = submissions.findIndex(s => s.id === id);
          if (submissionIndex === -1) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
          }
          submission = submissions[submissionIndex];
          submissions[submissionIndex] = {
            ...submission,
            status: 'approved',
            updated_at: new Date().toISOString()
          };
        } else {
          submission = data;
        }
      } else {
        // Fallback to in-memory storage
        const submissionIndex = submissions.findIndex(s => s.id === id);
        if (submissionIndex === -1) {
          return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }
        submission = submissions[submissionIndex];
        submissions[submissionIndex] = {
          ...submission,
          status: 'approved',
          updated_at: new Date().toISOString()
        };
      }

      console.log('Submission approved:', id);

      // Send approval email to the recruiter
      try {
        const slug = submission.name.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .substring(0, 50);
        const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/recruiter/${slug}`;
        await emailService.sendApprovalNotification({
          name: submission.name,
          email: submission.email,
          profileUrl: profileUrl,
        });
        console.log('Approval email sent to:', submission.email);
      } catch (error) {
        console.error('Failed to send approval email:', error);
        // Don't fail the approval if email fails
      }

      return NextResponse.json({ message: 'Submission approved successfully' });
    } else if (action === 'reject') {
      // Try Supabase first
      if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { error } = await supabaseAdmin
          .from('submissions')
          .update({ status: 'rejected' })
          .eq('id', id);

        if (error) {
          console.error('Supabase error:', error);
          // Fall back to in-memory storage
          const submissionIndex = submissions.findIndex(s => s.id === id);
          if (submissionIndex === -1) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
          }
          submissions[submissionIndex] = {
            ...submissions[submissionIndex],
            status: 'rejected',
            updated_at: new Date().toISOString()
          };
        }
      } else {
        // Fallback to in-memory storage
        const submissionIndex = submissions.findIndex(s => s.id === id);
        if (submissionIndex === -1) {
          return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }
        submissions[submissionIndex] = {
          ...submissions[submissionIndex],
          status: 'rejected',
          updated_at: new Date().toISOString()
        };
      }

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

    // Try Supabase first
    if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { error } = await supabaseAdmin
        .from('submissions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        // Fall back to in-memory storage
        const submissionIndex = submissions.findIndex(s => s.id === id);
        if (submissionIndex === -1) {
          return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }
        submissions.splice(submissionIndex, 1);
      }
    } else {
      // Fallback to in-memory storage
      const submissionIndex = submissions.findIndex(s => s.id === id);
      if (submissionIndex === -1) {
        return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
      }
      submissions.splice(submissionIndex, 1);
    }

    console.log('Submission deleted:', id);
    return NextResponse.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}