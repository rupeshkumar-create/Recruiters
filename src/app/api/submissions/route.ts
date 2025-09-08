import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ToolSubmission } from '../../../types/submissions';

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// GET /api/submissions - Fetch all pending submissions (admin only)
export async function GET() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      return NextResponse.json({ error: 'Supabase not configured. Please check SUPABASE_SETUP.md' }, { status: 503 });
    }
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select(`
        *,
        submission_categories!inner(
          categories!inner(
            id,
            name,
            slug
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions:', error);
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }

    // Transform the data to match the expected format
    const transformedSubmissions = submissions?.map(submission => ({
      ...submission,
      categories: submission.submission_categories?.map((sc: any) => sc.categories.name) || []
    })) || [];

    return NextResponse.json(transformedSubmissions);
  } catch (error) {
    console.error('Error in GET /api/submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/submissions - Create a new submission
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/submissions called');
    console.log('Environment check:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing',
    serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length
  });
    
    const body = await request.json();
    console.log('Request body:', body);
    const { first_name, last_name, name, url, tagline, content, description, logo, categories, email } = body;

    // Validate required fields
    if (!first_name || !last_name || !name || !url || !tagline || !email) {
      return NextResponse.json({ error: 'Missing required fields: first_name, last_name, name, url, tagline, email' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Prepare submission data
    const submissionData: ToolSubmission = {
      name,
      url,
      tagline,
      description: description || '',
      first_name,
      last_name,
      email,
      submitter_email: email
    };

    // Insert the submission
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert({
        name,
        first_name,
        last_name,
        url,
        tagline,
        content,
        description,
        logo: logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F26B21&color=fff&size=48`,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        submitter_email: email
      })
      .select()
      .single();

    if (submissionError) {
      console.error('Error creating submission:', submissionError);
      return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
    }

    // Handle categories if provided
    if (categories && Array.isArray(categories)) {
      for (const categoryName of categories) {
        // Find or create category
        let { data: category, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('name', categoryName)
          .single();

        // If category doesn't exist, create it
        if (categoryError && categoryError.code === 'PGRST116') {
          const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          const { data: newCategory, error: createError } = await supabase
            .from('categories')
            .insert({
              name: categoryName,
              slug: categorySlug
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating category:', createError);
            continue;
          }
          category = newCategory;
        }

        if (category) {
          // Link submission to category
          await supabase
            .from('submission_categories')
            .insert({
              submission_id: submission.id,
              category_id: category.id
            });
        }
      }
    }

    // Send confirmation email (only once per submission)
    let emailSent = false;
    try {
      if (!emailSent) {
        const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionalId: 'cmf7u53sj2sscz40iyo4j540n',
            email: email,
            dataVariables: {
              first_name: first_name, // For template {{DATA_VARIABLE:first_name}} - User's first name
              last_name: last_name, // For template {{DATA_VARIABLE:last_name}} - User's last name
              tool_name: name, // For template {{DATA_VARIABLE:tool_name}} - Tool name  
              tool_description: description || tagline, // For template {{DATA_VARIABLE:tool_description}} - Tool description
              website_url: url, // For template {{DATA_VARIABLE:website_url}} - Tool website URL
            }
          })
        });

        emailSent = true;
        
        if (!emailResponse.ok) {
          console.error('Failed to send confirmation email:', await emailResponse.text());
          // Don't fail the submission if email fails
        } else {
          console.log('Confirmation email sent successfully to:', email);
        }
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the submission if email fails
    }



    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/submissions - Delete a submission (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting submission:', error);
      return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}