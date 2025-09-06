import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// GET /api/comments - Get comments for a tool
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')

    if (!toolId) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 })
    }

    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching comments:', error)
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error in comments API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/comments - Submit a comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolId, userEmail, userName, content, userData } = body

    if (!toolId || !userEmail || !userName || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment content cannot be empty' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        tool_id: toolId,
        user_email: userEmail,
        user_name: userName,
        content: content.trim(),
        user_data: userData
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting comment:', error)
      return NextResponse.json({ error: 'Failed to insert comment' }, { status: 500 })
    }

    return NextResponse.json({ comment: data })
  } catch (error) {
    console.error('Error in comments API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/comments - Update a comment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { commentId, content, userEmail } = body

    if (!commentId || !content || !userEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment content cannot be empty' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('comments')
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .eq('user_email', userEmail) // Ensure user can only update their own comments
      .select()
      .single()

    if (error) {
      console.error('Error updating comment:', error)
      return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Comment not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ comment: data })
  } catch (error) {
    console.error('Error in comments API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/comments - Delete a comment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')
    const userEmail = searchParams.get('userEmail')

    if (!commentId || !userEmail) {
      return NextResponse.json({ error: 'Comment ID and user email are required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_email', userEmail) // Ensure user can only delete their own comments

    if (error) {
      console.error('Error deleting comment:', error)
      return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in comments API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}