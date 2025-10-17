import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
import { RecruiterStorage } from '../../../../lib/recruiterStorage'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

// Migration data is imported from the main route to ensure consistency

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
      const fileData = JSON.parse(data)
      console.log(`📁 Loaded ${fileData.length} recruiters from file`);
      return fileData
    }
  } catch (error) {
    console.error('Error loading recruiters from file:', error)
  }
  
  console.log('📁 No file found, loading from migration data via API');
  // Fallback to getting data from the main API
  try {
    const response = await fetch('http://localhost:3000/api/recruiters');
    if (response.ok) {
      const apiData = await response.json();
      console.log(`📡 Loaded ${apiData.length} recruiters from API`);
      // Save to file for future use
      await saveRecruitersToFile(apiData);
      return apiData;
    }
  } catch (apiError) {
    console.error('Error loading from API:', apiError);
  }
  
  // Final fallback to RecruiterStorage
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
    // Always try Supabase first in production
    if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY && 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase') &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      
      console.log(`📡 Loading recruiter ${params.id} from Supabase...`);
      const { data, error } = await supabaseAdmin
        .from('recruiters')
        .select('*')
        .eq('id', params.id)
        .single();

      if (!error && data) {
        console.log(`✅ Found recruiter ${data.name} in Supabase`);
        return NextResponse.json(data);
      }
      
      console.log('❌ Supabase GET error:', error);
      
      // In production, return 404 if not found in Supabase
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Recruiter not found' },
          { status: 404 }
        );
      }
    }

    // Fallback to migration data only if Supabase not configured
    console.log('📁 Falling back to migration data...');
    
    // Use global data directly to avoid circular dependency
    if (!global.recruitersData) {
      // Import initial data
      const { INITIAL_MIGRATION_RECRUITERS } = await import('../route');
      global.recruitersData = [...INITIAL_MIGRATION_RECRUITERS];
    }
    
    const recruiter = global.recruitersData.find((r: any) => r.id === params.id);
    
    if (!recruiter) {
      return NextResponse.json(
        { error: 'Recruiter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(recruiter);

  } catch (error) {
    console.error('❌ Error fetching recruiter:', error)
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
    console.log('🔄 PUT request received for recruiter:', params.id);
    
    const updates = await request.json()
    
    // Validate avatar size if it's a data URL
    if (updates.avatar && updates.avatar.startsWith('data:')) {
      const avatarSize = updates.avatar.length
      console.log('📷 Avatar data URL size:', avatarSize, 'characters')
      
      // Limit data URL size to prevent database issues (1MB = ~1.3M characters in base64)
      if (avatarSize > 1000000) { // 1MB limit
        console.error('❌ Avatar data URL too large:', avatarSize)
        return NextResponse.json({
          success: false,
          error: 'Avatar image is too large',
          details: 'Please use a smaller image or upload via URL',
          hint: 'Images should be under 500KB for direct upload'
        }, { status: 400 });
      }
    }
    
    console.log('📝 Update data received:', {
      id: params.id,
      name: updates.name,
      company: updates.company,
      fieldsCount: Object.keys(updates).length,
      hasAvatar: !!updates.avatar,
      avatarType: updates.avatar ? (updates.avatar.startsWith('data:') ? 'data-url' : 'url') : 'none'
    });
    
    // Try Supabase first (primary storage) - only if properly configured
    if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY && 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase') &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      
      console.log('📡 Using Supabase for recruiter update');
      
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

      console.log('📡 Attempting Supabase update for recruiter:', params.id);
      
      const { data, error } = await supabaseAdmin
        .from('recruiters')
        .update(supabaseData)
        .eq('id', params.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase update error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        return NextResponse.json({
          success: false,
          error: 'Failed to update recruiter in Supabase',
          details: error.message,
          hint: error.hint || 'Check Supabase connection and table schema'
        }, { status: 500 });
      }

      if (!data) {
        console.error('❌ No data returned from Supabase update');
        return NextResponse.json({
          success: false,
          error: 'Update completed but no data returned',
          details: 'Recruiter may not exist or update failed silently'
        }, { status: 404 });
      }

      console.log('✅ Recruiter updated in Supabase successfully:', data.name);
      return NextResponse.json({
        success: true,
        message: 'Recruiter updated successfully in Supabase',
        recruiter: data
      });
    }

    // Fallback: Update in-memory migration data
    console.log('📝 Updating in-memory migration data...');
    
    // Get current recruiters from the main API
    const response = await fetch('http://localhost:3000/api/recruiters');
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch current recruiters' },
        { status: 500 }
      );
    }
    
    const currentRecruiters = await response.json();
    const recruiterIndex = currentRecruiters.findIndex((r: any) => r.id === params.id);
    
    if (recruiterIndex === -1) {
      return NextResponse.json(
        { error: 'Recruiter not found' },
        { status: 404 }
      );
    }

    // Update the recruiter
    const updatedRecruiter = { 
      ...currentRecruiters[recruiterIndex], 
      ...updates, 
      updated_at: new Date().toISOString() 
    };
    
    currentRecruiters[recruiterIndex] = updatedRecruiter;
    
    // Update the main API with the new data
    const updateResponse = await fetch('http://localhost:3000/api/recruiters', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentRecruiters)
    });
    
    if (!updateResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to update recruiters data' },
        { status: 500 }
      );
    }
    
    console.log('✅ Recruiter updated in memory successfully:', updatedRecruiter.name);
    return NextResponse.json({
      success: true,
      message: 'Recruiter updated successfully in memory (temporary)',
      recruiter: updatedRecruiter,
      note: 'Changes will be lost on server restart. Set up Supabase for persistence.'
    });

  } catch (error) {
    console.error('❌ Error updating recruiter:', error)
    return NextResponse.json(
      { error: 'Failed to update recruiter' },
      { status: 500 }
    )
  }
}