import { NextRequest, NextResponse } from 'next/server';

// POST /api/submissions/approve - Approve a submission and convert it to a tool (local storage)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    // Mock approval process
    const approvedTool = {
      id: Date.now().toString(),
      name: 'Approved Tool',
      url: 'https://example.com',
      tagline: 'This tool has been approved',
      content: 'Tool content here',
      slug: 'approved-tool',
      featured: false,
      hidden: false,
      approved: true,
      created_at: new Date().toISOString()
    };

    console.log(`Submission ${submissionId} approved successfully`);

    return NextResponse.json({ 
      message: 'Submission approved successfully',
      tool: approvedTool
    });
  } catch (error) {
    console.error('Error in POST /api/submissions/approve:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}