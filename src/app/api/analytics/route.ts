import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '../../../lib/supabase'

const supabase = getServiceSupabase()

// GET /api/analytics - Get analytics data for tools
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')
    const type = searchParams.get('type') // 'click', 'share', 'visit', 'search'
    const period = searchParams.get('period') || '30' // days

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    let query = supabase
      .from('analytics')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (toolId && toolId !== 'all') {
      query = query.eq('tool_id', toolId)
    }

    if (type && type !== 'all') {
      query = query.eq('event_type', type)
    }

    const { data: analytics, error } = await query

    if (error) {
      console.error('Error fetching analytics:', error)
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
    }

    // Aggregate data by tool and event type
    const aggregated = analytics?.reduce((acc: any, event: any) => {
      const key = `${event.tool_id}_${event.event_type}`
      if (!acc[key]) {
        acc[key] = {
          tool_id: event.tool_id,
          event_type: event.event_type,
          count: 0,
          latest: event.created_at
        }
      }
      acc[key].count += 1
      return acc
    }, {})

    return NextResponse.json({
      events: analytics || [],
      summary: Object.values(aggregated || {})
    })

  } catch (error) {
    console.error('Error in GET /api/analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/analytics - Track an analytics event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolId, eventType, metadata = {} } = body

    if (!toolId || !eventType) {
      return NextResponse.json({ error: 'Tool ID and event type are required' }, { status: 400 })
    }

    // Valid event types
    const validEventTypes = ['click', 'share', 'visit', 'search', 'linkedin_share', 'twitter_share', 'copy_link']
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
    }

    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Insert analytics event
    const { data: event, error } = await supabase
      .from('analytics')
      .insert({
        tool_id: toolId,
        event_type: eventType,
        ip_address: ip,
        user_agent: userAgent,
        metadata: metadata
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating analytics event:', error)
      return NextResponse.json({ error: 'Failed to create analytics event' }, { status: 500 })
    }

    return NextResponse.json(event, { status: 201 })

  } catch (error) {
    console.error('Error in POST /api/analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}