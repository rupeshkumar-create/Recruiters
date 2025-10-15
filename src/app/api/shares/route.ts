import { NextRequest, NextResponse } from 'next/server'

// GET /api/shares - Get share count for a tool (local storage)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')

    if (!toolId) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 })
    }

    // Mock shares data
    const mockShares = [
      { id: '1', tool_id: toolId, share_type: 'copy', created_at: new Date().toISOString() },
      { id: '2', tool_id: toolId, share_type: 'linkedin', created_at: new Date().toISOString() }
    ];

    // Count shares by type
    const sharesByType = mockShares.reduce((acc, share) => {
      acc[share.share_type] = (acc[share.share_type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      total: mockShares.length,
      byType: sharesByType,
      shares: mockShares
    })
  } catch (error) {
    console.error('Error in shares API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/shares - Record a share (local storage)
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

    // Mock share record
    const share = {
      id: Date.now().toString(),
      tool_id: toolId,
      share_type: shareType,
      created_at: new Date().toISOString()
    };

    console.log('Share recorded:', share);

    return NextResponse.json({ share })
  } catch (error) {
    console.error('Error in shares API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}