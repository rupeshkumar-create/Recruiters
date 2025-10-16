import { NextRequest, NextResponse } from 'next/server'
import { RecruiterStorage } from '../../../../lib/recruiterStorage'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const RECRUITERS_FILE = join(process.cwd(), 'data', 'recruiters.json')

// Load recruiters from file (server-side)
async function loadRecruitersFromFile() {
  try {
    const dataDir = join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }
    
    if (existsSync(RECRUITERS_FILE)) {
      const data = await readFile(RECRUITERS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading recruiters from file:', error)
  }
  
  // Fallback to RecruiterStorage
  return await RecruiterStorage.getAll()
}

// Save recruiters to file (server-side)
async function saveRecruitersToFile(recruiters: any[]) {
  try {
    const dataDir = join(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }
    await writeFile(RECRUITERS_FILE, JSON.stringify(recruiters, null, 2))
  } catch (error) {
    console.error('Error saving recruiters to file:', error)
  }
}

// GET /api/recruiters/[id] - Get specific recruiter
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recruiters = await loadRecruitersFromFile()
    const recruiter = recruiters.find((r: any) => r.id === params.id)
    
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
    
    // Load current recruiters
    const recruiters = await loadRecruitersFromFile()
    const recruiterIndex = recruiters.findIndex((r: any) => r.id === params.id)
    
    if (recruiterIndex === -1) {
      return NextResponse.json(
        { error: 'Recruiter not found' },
        { status: 404 }
      )
    }

    // Update the recruiter
    const updatedRecruiter = { ...recruiters[recruiterIndex], ...updates, updated_at: new Date().toISOString() }
    recruiters[recruiterIndex] = updatedRecruiter
    
    // Save back to file
    await saveRecruitersToFile(recruiters)

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