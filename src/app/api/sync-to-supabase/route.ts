import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('🔄 Syncing migration data to Supabase...');
    
    if (!supabaseAdmin || !process.env.SUPABASE_SERVICE_ROLE_KEY || 
        !process.env.NEXT_PUBLIC_SUPABASE_URL || 
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured properly',
        message: 'Please set up Supabase environment variables first'
      }, { status: 400 });
    }

    // Get the current migration data from the main API
    const response = await fetch('http://localhost:3000/api/recruiters');
    if (!response.ok) {
      throw new Error('Failed to fetch migration data from main API');
    }
    
    const recruiters = await response.json();
    console.log(`📡 Got ${recruiters.length} recruiters from main API`);

    // Convert to Supabase format
    const supabaseRecruiters = recruiters.map((recruiter: any) => ({
      id: recruiter.id,
      name: recruiter.name,
      job_title: recruiter.jobTitle,
      company: recruiter.company,
      email: recruiter.email,
      phone: recruiter.phone,
      linkedin: recruiter.linkedin,
      website: recruiter.website || null,
      specialization: recruiter.specialization,
      experience: recruiter.experience,
      location: recruiter.location,
      remote_available: recruiter.remoteAvailable || false,
      bio: recruiter.bio,
      avatar: recruiter.avatar,
      slug: recruiter.slug,
      featured: recruiter.featured || false,
      hidden: recruiter.hidden || false,
      approved: true,
      status: 'approved',
      rating: recruiter.rating || 0,
      review_count: recruiter.reviewCount || 0,
      placements: recruiter.placements || 0,
      avg_time_to_hire: recruiter.avgTimeToHire || 30,
      candidate_satisfaction: recruiter.candidateSatisfaction || 90,
      client_retention: recruiter.clientRetention || 85,
      badge: recruiter.badge || null,
      achievements: recruiter.achievements || [],
      work_experience: recruiter.workExperience || [],
      roles_placed: recruiter.rolesPlaced || [],
      industries: recruiter.industries || [],
      keywords: recruiter.keywords || [],
      languages: recruiter.languages || [],
      seniority_levels: recruiter.seniorityLevels || [],
      employment_types: recruiter.employmentTypes || [],
      regions: recruiter.regions || [],
      certifications: recruiter.certifications || [],
      testimonials: recruiter.testimonials || [],
      availability: recruiter.availability || { accepting: true, nextAvailable: '' },
      social_proof: recruiter.socialProof || { linkedinFollowers: 0, featuredIn: [] },
      created_at: recruiter.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Upsert all recruiters to Supabase
    const { data, error } = await supabaseAdmin
      .from('recruiters')
      .upsert(supabaseRecruiters, { onConflict: 'id' });

    if (error) {
      console.error('❌ Supabase sync error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to sync to Supabase',
        details: error.message
      }, { status: 500 });
    }

    console.log('✅ Successfully synced to Supabase');
    
    return NextResponse.json({
      success: true,
      message: 'Migration data synced to Supabase successfully',
      synced: supabaseRecruiters.length,
      recruiters: supabaseRecruiters.map(r => ({ id: r.id, name: r.name }))
    });

  } catch (error) {
    console.error('❌ Sync error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to sync migration data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Supabase Sync API',
    usage: 'POST to /api/sync-to-supabase to sync current migration data to Supabase',
    status: 'Ready'
  });
}