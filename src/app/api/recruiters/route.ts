import { NextRequest, NextResponse } from 'next/server'
import { RecruiterStorage } from '../../../lib/recruiterStorage'
import { csvRecruiters } from '../../../lib/data'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

const RECRUITERS_FILE = join(process.cwd(), 'data', 'recruiters.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = join(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true })
  }
}

// Load recruiters from file (server-side)
async function loadRecruitersFromFile() {
  try {
    await ensureDataDirectory()
    if (existsSync(RECRUITERS_FILE)) {
      const data = await readFile(RECRUITERS_FILE, 'utf-8')
      const recruiters = JSON.parse(data)
      return recruiters
    }
  } catch (error) {
    console.error('Error loading recruiters from file:', error)
  }
  return csvRecruiters // Fallback to default data
}

// Save recruiters to file (server-side)
async function saveRecruitersToFile(recruiters: any[]) {
  try {
    await ensureDataDirectory()
    await writeFile(RECRUITERS_FILE, JSON.stringify(recruiters, null, 2))
  } catch (error) {
    console.error('Error saving recruiters to file:', error)
  }
}

// GET /api/recruiters - Get all recruiters
export async function GET() {
  try {
    // Try to load from file first, then fallback to RecruiterStorage
    const fileRecruiters = await loadRecruitersFromFile()
    if (fileRecruiters && fileRecruiters.length > 0) {
      return NextResponse.json(fileRecruiters)
    }
    
    // Fallback to RecruiterStorage
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

    // Save to file
    await saveRecruitersToFile(recruiters)
    
    // Also try to save via RecruiterStorage for localStorage sync
    try {
      await RecruiterStorage.saveAll(recruiters)
    } catch (error) {
      console.error('RecruiterStorage save failed:', error)
    }
    
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

// POST /api/recruiters - Add a new recruiter
export async function POST(request: NextRequest) {
  try {
    const newRecruiter = await request.json()
    
    // Load current recruiters
    const currentRecruiters = await loadRecruitersFromFile()
    
    // Check if recruiter already exists
    const existingIndex = currentRecruiters.findIndex((r: any) => r.id === newRecruiter.id)
    
    if (existingIndex >= 0) {
      // Update existing recruiter
      currentRecruiters[existingIndex] = newRecruiter
    } else {
      // Add new recruiter
      currentRecruiters.push(newRecruiter)
    }
    
    // Save updated list
    await saveRecruitersToFile(currentRecruiters)
    
    return NextResponse.json({
      success: true,
      message: 'Recruiter added successfully',
      id: newRecruiter.id
    })
  } catch (error) {
    console.error('Error adding recruiter:', error)
    return NextResponse.json(
      { error: 'Failed to add recruiter' },
      { status: 500 }
    )
  }
}