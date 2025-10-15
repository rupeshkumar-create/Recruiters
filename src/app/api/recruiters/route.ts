import { NextRequest, NextResponse } from 'next/server'
import { RecruiterStorage } from '../../../lib/recruiterStorage'

// GET /api/recruiters - Get all recruiters
export async function GET() {
  try {
    const recruiters = await RecruiterStorage.getAll()
    return NextResponse.json(recruiters)
  } catch (error) {
    console.error('Error fetching recruiters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recruiters' },
      { status: 500 }
    )
  }
}

// PUT /api/recruiters - Update all recruiters
export async function PUT(request: NextRequest) {
  try {
    const recruiters = await request.json()
    
    if (!Array.isArray(recruiters)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    await RecruiterStorage.saveAll(recruiters)
    
    return NextResponse.json({
      success: true,
      message: 'Recruiters updated successfully',
      count: recruiters.length
    })
  } catch (error) {
    console.error('Error updating recruiters:', error)
    return NextResponse.json(
      { error: 'Failed to update recruiters' },
      { status: 500 }
    )
  }
}