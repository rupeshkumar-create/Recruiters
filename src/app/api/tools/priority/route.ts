import { NextRequest, NextResponse } from 'next/server';

// PUT /api/tools/priority - Update tool priority order (local storage)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, priorityOrder } = body;

    if (!toolId || priorityOrder === undefined) {
      return NextResponse.json({ error: 'Tool ID and priority order are required' }, { status: 400 });
    }

    // Mock priority update
    const updatedTool = {
      id: toolId,
      priority_order: priorityOrder,
      updated_at: new Date().toISOString()
    };

    console.log('Tool priority updated:', updatedTool);

    return NextResponse.json(updatedTool);
  } catch (error) {
    console.error('Error in PUT /api/tools/priority:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}