import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
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
    // Try Supabase first
    if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY && 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')) {
      
      const { data, error } = await supabaseAdmin
        .from('recruiters')
        .select('*')
        .eq('id', params.id)
        .single();

      if (!error && data) {
        return NextResponse.json(data);
      }
      
      console.log('Supabase GET error:', error);
    }

    // Fallback to file storage
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
    console.log('Updating recruiter:', params.id, 'with data:', updates);
    
    // Try Supabase first
    if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY && 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')) {
      
      console.log('Using Supabase for recruiter update');
      
      // Convert frontend format to Supabase format
      const supabaseData = {
        name: updates.name,
        job_title: updates.jobTitle,
        company: updates.company,
        email: updates.email,
        phone: updates.phone,
        linkedin: updates.linkedin,
        website: updates.website || null,
        specialization: updates.specialization,
        experience: updates.experience,
        location: updates.location,
        remote_available: updates.remoteAvailable || false,
        bio: updates.bio,
        avatar: updates.avatar,
        slug: updates.slug,
        featured: updates.featured || false,
        hidden: updates.hidden || false,
        approved: true,
        status: 'approved',
        rating: updates.rating || 0,
        review_count: updates.reviewCount || 0,
        placements: updates.placements || 0,
        avg_time_to_hire: updates.avgTimeToHire || 30,
        candidate_satisfaction: updates.candidateSatisfaction || 90,
        client_retention: updates.clientRetention || 85,
        badge: updates.badge || null,
        achievements: updates.achievements || [],
        work_experience: updates.workExperience || [],
        roles_placed: updates.rolesPlaced || [],
        industries: updates.industries || [],
        keywords: updates.keywords || [],
        languages: updates.languages || [],
        seniority_levels: updates.seniorityLevels || [],
        employment_types: updates.employmentTypes || [],
        regions: updates.regions || [],
        certifications: updates.certifications || [],
        testimonials: updates.testimonials || [],
        availability: updates.availability || { accepting: true, nextAvailable: '' },
        social_proof: updates.socialProof || { linkedinFollowers: 0, featuredIn: [] },
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabaseAdmin
        .from('recruiters')
        .update(supabaseData)
        .eq('id', params.id)
        .select()
        .single();

      if (!error && data) {
        console.log('✅ Recruiter updated in Supabase successfully');
        return NextResponse.json({
          success: true,
          message: 'Recruiter updated successfully',
          recruiter: data
        });
      }
      
      console.error('❌ Supabase update error:', error);
    }

    // Fallback to file storage
    console.log('Using file storage for recruiter update');
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