import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// GET /api/shares - Get share count for a tool
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')

    if (!toolId) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 })
    }

    const { data: shares, error } = await supabase
      .from('shares')
      .select('*')
      .eq('tool_id', toolId)

    if (error) {
      console.error('Error fetching shares:', error)
      return NextResponse.json({ error: 'Failed to fetch shares' }, { status: 500 })
    }

    // Count shares by type
    const sharesByType = shares.reduce((acc, share) => {
      acc[share.share_type] = (acc[share.share_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      total: shares.length,
      byType: sharesByType,
      shares
    })
  } catch (error) {
    console.error('Error in shares API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/shares - Record a share
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolId, shareType } = body

    if (!toolId || !shareType) {
      return NextResponse.json({ error: 'Tool ID and share type are required' }, { status: 400 })
    }

    const validShareTypes = ['copy', 'linkedin', 'twitter', 'other']
    if (!validShareTypes.includes(shareType)) {
      return NextResponse.json({ error: 'Invalid share type' }, { status: 400 })
    }

    // Get client IP and user agent from headers
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwarded?.split(',')[0] || realIp || '127.0.0.1'

    const { data, error } = await supabase
      .from('shares')
      .insert({
        tool_id: toolId,
        share_type: shareType,
        user_agent: userAgent,
        ip_address: ipAddress
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting share:', error)
      return NextResponse.json({ error: 'Failed to record share' }, { status: 500 })
    }

    return NextResponse.json({ share: data })
  } catch (error) {
    console.error('Error in shares API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}