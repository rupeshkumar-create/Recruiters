import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// GET /api/votes - Get votes for a tool
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')

    if (!toolId) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 })
    }

    const { data: votes, error } = await supabase
      .from('votes')
      .select('*')
      .eq('tool_id', toolId)

    if (error) {
      console.error('Error fetching votes:', error)
      return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 })
    }

    // Calculate vote counts
    const upvotes = votes.filter(vote => vote.vote_type === 'up').length
    const downvotes = votes.filter(vote => vote.vote_type === 'down').length

    return NextResponse.json({
      upvotes,
      downvotes,
      votes
    })
  } catch (error) {
    console.error('Error in votes API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/votes - Submit a vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolId, userEmail, userName, voteType, userData } = body

    if (!toolId || !userEmail || !userName || !voteType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['up', 'down'].includes(voteType)) {
      return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 })
    }

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('tool_id', toolId)
      .eq('user_email', userEmail)
      .single()

    if (existingVote) {
      // Update existing vote
      const { data, error } = await supabase
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
        .single()

      if (error) {
        console.error('Error updating vote:', error)
        return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 })
      }

      return NextResponse.json({ vote: data, action: 'updated' })
    } else {
      // Insert new vote
      const { data, error } = await supabase
        .from('votes')
        .insert({
          tool_id: toolId,
          user_email: userEmail,
          user_name: userName,
          vote_type: voteType,
          user_data: userData
        })
        .select()
        .single()

      if (error) {
        console.error('Error inserting vote:', error)
        return NextResponse.json({ error: 'Failed to insert vote' }, { status: 500 })
      }

      return NextResponse.json({ vote: data, action: 'created' })
    }
  } catch (error) {
    console.error('Error in votes API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/votes - Remove a vote
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')
    const userEmail = searchParams.get('userEmail')

    if (!toolId || !userEmail) {
      return NextResponse.json({ error: 'Tool ID and user email are required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('tool_id', toolId)
      .eq('user_email', userEmail)

    if (error) {
      console.error('Error deleting vote:', error)
      return NextResponse.json({ error: 'Failed to delete vote' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in votes API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}