import { NextRequest, NextResponse } from 'next/server';

// GET /api/comments - Fetch comments for a tool (local storage)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');
    const status = searchParams.get('status') || 'approved';

    // Mock comments data
    const mockComments = [
      {
        id: '1',
        tool_id: toolId || '6',
        user_name: 'John Doe',
        user_email: 'john@example.com',
        user_company: 'Tech Corp',
        user_title: 'HR Manager',
        content: 'Great tool! Really helped streamline our recruitment process.',
        status: 'approved',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Filter by tool if specified
    let filteredComments = mockComments;
    if (toolId && toolId !== 'all') {
      filteredComments = mockComments.filter(comment => comment.tool_id === toolId);
    }

    // Filter by status if specified
    if (status !== 'all') {
      filteredComments = filteredComments.filter(comment => comment.status === status);
    }

    return NextResponse.json(filteredComments);
  } catch (error) {
    console.error('Error in GET /api/comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/comments - Submit a new comment (local storage)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, userEmail, userName, userCompany, userTitle, content } = body;

    if (!toolId || !userEmail || !userName || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Mock comment creation
    const comment = {
      id: Date.now().toString(),
      tool_id: toolId,
      user_email: userEmail,
      user_name: userName,
      user_company: userCompany || '',
      user_title: userTitle || '',
      content: content.trim(),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Comment submitted:', comment);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/comments - Update comment status (local storage)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, status, approvedBy } = body;

    if (!commentId || !status) {
      return NextResponse.json({ error: 'Comment ID and status are required' }, { status: 400 });
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Mock comment update
    const comment = {
      id: commentId,
      status,
      updated_at: new Date().toISOString(),
      approved_at: status === 'approved' ? new Date().toISOString() : null,
      approved_by: status === 'approved' ? (approvedBy || 'admin') : null
    };

    console.log('Comment updated:', comment);

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error in PUT /api/comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/comments - Delete a comment (local storage)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    console.log('Comment deleted:', commentId);

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}