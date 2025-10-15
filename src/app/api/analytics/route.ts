import { NextRequest, NextResponse } from 'next/server'

// GET /api/analytics - Get analytics data from local storage (mock)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')
    const type = searchParams.get('type') // 'click', 'share', 'visit', 'search'
    const period = searchParams.get('period') || '30' // days

    // Mock analytics data
    const mockAnalytics = [
      {
        id: '1',
        tool_id: toolId || '6',
        event_type: type || 'click',
        created_at: new Date().toISOString(),
        metadata: {}
      }
    ];

    return NextResponse.json({
      events: mockAnalytics,
      summary: [
        {
          tool_id: toolId || '6',
          event_type: type || 'click',
          count: 1,
          latest: new Date().toISOString()
        }
      ]
    })

  } catch (error) {
    console.error('Error in GET /api/analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/analytics - Track an analytics event (local storage)
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

    // Mock analytics event
    const event = {
      id: Date.now().toString(),
      tool_id: toolId,
      event_type: eventType,
      metadata: metadata,
      created_at: new Date().toISOString()
    };

    console.log('Analytics event tracked:', event);

    return NextResponse.json(event, { status: 201 })

  } catch (error) {
    console.error('Error in POST /api/analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}