import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '../../../../lib/supabase';

const supabase = getServiceSupabase();

// POST /api/submissions/approve - Approve a submission and convert it to a tool
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    // Get the submission with its categories
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select(`
        *,
        submission_categories(
          categories(
            id,
            name
          )
        )
      `)
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      console.error('Error fetching submission:', submissionError);
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Create the tool from submission data
    const { data: tool, error: toolError } = await supabase
      .from('tools')
      .insert({
        name: submission.name,
        url: submission.url,
        tagline: submission.tagline,
        content: submission.content,
        description: submission.description,
        logo: submission.logo,
        slug: submission.slug,
        featured: false,
        hidden: false,
        approved: true,
        submitter_email: submission.submitter_email
      })
      .select()
      .single();

    if (toolError) {
      console.error('Error creating tool:', toolError);
      
      // Handle duplicate slug error specifically
      if (toolError.code === '23505' && toolError.message.includes('tools_slug_key')) {
        return NextResponse.json({ 
          error: 'A tool with this name already exists. Please choose a different name.',
          details: 'duplicate_slug'
        }, { status: 409 });
      }
      
      return NextResponse.json({ error: 'Failed to create tool' }, { status: 500 });
    }

    // Copy categories from submission to tool
    if (submission.submission_categories && submission.submission_categories.length > 0) {
      for (const submissionCategory of submission.submission_categories) {
        await supabase
          .from('tool_categories')
          .insert({
            tool_id: tool.id,
            category_id: submissionCategory.categories.id
          });
      }
    }

    // Delete the submission after approval
    const { error: deleteError } = await supabase
      .from('submissions')
      .delete()
      .eq('id', submissionId);

    if (deleteError) {
      console.error('Error deleting submission:', deleteError);
      // Don't return error here as the tool was created successfully
    }

    // Send approval email notification via Loops
    try {
      const emailData = {
        transactionalId: 'cmf8d6tn3anlqyy0igag65ctj',
        email: submission.submitter_email,
        dataVariables: {
          first_name: submission.submitter_email.split('@')[0], // Extract name from email as fallback
          tool_name: submission.name,
          tool_description: submission.description,
          tool_url: `https://yourdomain.com/tool/${submission.slug}` // Update with your actual domain
        }
      };
      
      const loopsResponse = await fetch('https://app.loops.so/api/v1/transactional', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (!loopsResponse.ok) {
        console.error('Failed to send approval email:', await loopsResponse.text());
      } else {
        console.log(`Approval email sent to ${submission.submitter_email}`);
      }
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Don't fail the approval process if email fails
    }

    console.log(`Tool "${submission.name}" approved successfully for ${submission.submitter_email}`);

    return NextResponse.json({ 
      message: 'Submission approved successfully',
      tool: tool
    });
  } catch (error) {
    console.error('Error in POST /api/submissions/approve:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}