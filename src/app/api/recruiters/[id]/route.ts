import { NextRequest, NextResponse } from 'next/server'
import { RecruiterStorage } from '../../../../lib/recruiterStorage'

// GET /api/recruiters/[id] - Get specific recruiter
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recruiters = await RecruiterStorage.getAll()
    const recruiter = recruiters.find(r => r.id === params.id)
    
    if (!recruiter) {
      return NextResponse.json(
        { error: 'Recruiter not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(recruiter)
  } catch (error) {
    console.error('Error fetching recruiter:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recruiter' },
      { status: 500 }
    )
  }
}

// PUT /api/recruiters/[id] - Update specific recruiter
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    
    const updatedRecruiter = await RecruiterStorage.updateRecruiter(params.id, updates)
    
    if (!updatedRecruiter) {
      return NextResponse.json(
        { error: 'Recruiter not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Recruiter updated successfully',
      recruiter: updatedRecruiter
    })
  } catch (error) {
    console.error('Error updating recruiter:', error)
    return NextResponse.json(
      { error: 'Failed to update recruiter' },
      { status: 500 }
    )
  }
}