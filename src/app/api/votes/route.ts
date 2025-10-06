import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '../../../lib/supabase';

const supabase = getServiceSupabase();

// GET /api/votes - Get votes for a tool
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');

    if (!toolId) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    // Get all votes for the tool
    const { data: votes, error } = await supabase
      .from('votes')
      .select('*')
      .eq('tool_id', toolId);

    if (error) {
      console.error('Error fetching votes:', error);
      return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
    }

    // Count upvotes and downvotes
    const upvotes = votes?.filter(vote => vote.vote_type === 'up').length || 0;
    const downvotes = votes?.filter(vote => vote.vote_type === 'down').length || 0;

    return NextResponse.json({
      upvotes,
      downvotes,
      total: upvotes + downvotes,
      votes: votes || []
    });
  } catch (error) {
    console.error('Error in GET /api/votes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/votes - Submit a vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, userEmail, userName, voteType, userData } = body;

    if (!toolId || !userEmail || !userName || !voteType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['up', 'down'].includes(voteType)) {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    // Check if user has already voted for this tool
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('tool_id', toolId)
      .eq('user_email', userEmail)
      .single();

    if (existingVote) {
      // Update existing vote
      const { data: updatedVote, error: updateError } = await supabase
        .from('votes')
        .update({
          vote_type: voteType,
          user_name: userName,
          user_data: userData,
          updated_at: new Date().toISOString()
        })
        .eq('tool_id', toolId)
        .eq('user_email', userEmail)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating vote:', updateError);
        return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 });
      }

      return NextResponse.json(updatedVote, { status: 200 });
    } else {
      // Create new vote
      const { data: newVote, error: insertError } = await supabase
        .from('votes')
        .insert({
          tool_id: toolId,
          user_email: userEmail,
          user_name: userName,
          vote_type: voteType,
          user_data: userData
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating vote:', insertError);
        return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 });
      }

      return NextResponse.json(newVote, { status: 201 });
    }
  } catch (error) {
    console.error('Error in POST /api/votes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/votes - Remove a vote
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toolId = searchParams.get('toolId');
    const userEmail = searchParams.get('userEmail');

    if (!toolId || !userEmail) {
      return NextResponse.json({ error: 'Tool ID and user email are required' }, { status: 400 });
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
    }

    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('tool_id', toolId)
      .eq('user_email', userEmail);

    if (error) {
      console.error('Error deleting vote:', error);
      return NextResponse.json({ error: 'Failed to delete vote' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Vote deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/votes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}