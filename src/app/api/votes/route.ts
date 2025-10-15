import { NextRequest, NextResponse } from 'next/server';

// GET /api/votes - Get votes for a tool (local storage)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');
    const admin = searchParams.get('admin');
    const voteId = searchParams.get('voteId');

    // Mock votes data
    const mockVotes = [
      {
        id: '1',
        tool_id: toolId || '6',
        vote_type: 'up',
        created_at: new Date().toISOString()
      },
      {
        id: '2', 
        tool_id: toolId || '6',
        vote_type: 'down',
        created_at: new Date().toISOString()
      }
    ];

    if (admin === 'true') {
      return NextResponse.json(mockVotes);
    }

    if (voteId) {
      const vote = mockVotes.find(v => v.id === voteId);
      return NextResponse.json(vote || null);
    }

    if (toolId) {
      const toolVotes = mockVotes.filter(v => v.tool_id === toolId);
      const upVotes = toolVotes.filter(v => v.vote_type === 'up').length;
      const downVotes = toolVotes.filter(v => v.vote_type === 'down').length;
      
      return NextResponse.json({
        upVotes,
        downVotes,
        totalVotes: upVotes + downVotes,
        score: upVotes - downVotes
      });
    }

    return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });
  } catch (error) {
    console.error('Error in GET /api/votes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/votes - Cast a vote (local storage)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, voteType } = body;

    if (!toolId || !voteType) {
      return NextResponse.json({ error: 'Tool ID and vote type are required' }, { status: 400 });
    }

    if (!['up', 'down'].includes(voteType)) {
      return NextResponse.json({ error: 'Vote type must be "up" or "down"' }, { status: 400 });
    }

    // Mock vote record
    const vote = {
      id: Date.now().toString(),
      tool_id: toolId,
      vote_type: voteType,
      created_at: new Date().toISOString()
    };

    console.log('Vote recorded:', vote);

    return NextResponse.json(vote, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/votes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/votes - Remove a vote (local storage)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const voteId = searchParams.get('voteId');

    if (!voteId) {
      return NextResponse.json({ error: 'Vote ID is required' }, { status: 400 });
    }

    console.log('Vote deleted:', voteId);

    return NextResponse.json({ message: 'Vote deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/votes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}