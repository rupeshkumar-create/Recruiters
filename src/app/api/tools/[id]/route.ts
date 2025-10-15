import { NextRequest, NextResponse } from 'next/server'
import { csvRecruiters } from '../../../../lib/data'

// GET /api/tools/[id] - Get a specific recruiter by ID (local storage)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Find recruiter by ID
    const recruiter = csvRecruiters.find(r => r.id === id)

    if (!recruiter) {
      return NextResponse.json({ error: 'Recruiter not found' }, { status: 404 })
    }

    return NextResponse.json(recruiter)
  } catch (error) {
    console.error('Error in GET /api/tools/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/tools/[id] - Update a specific tool (local storage)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Mock update
    const updatedTool = {
      id,
      ...body,
      updated_at: new Date().toISOString()
    }

    console.log('Tool updated:', updatedTool)

    return NextResponse.json(updatedTool)
  } catch (error) {
    console.error('Error in PUT /api/tools/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/tools/[id] - Delete a specific tool (local storage)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    console.log('Tool deleted:', id)

    return NextResponse.json({ message: 'Tool deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/tools/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}