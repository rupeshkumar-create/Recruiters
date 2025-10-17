import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { INITIAL_MIGRATION_RECRUITERS } from '../recruiters/route';

export async function POST() {
  try {
    console.log('🔄 Populating Supabase with initial recruiter data...');
    
    if (!supabaseAdmin || !process.env.SUPABASE_SERVICE_ROLE_KEY || 
        !process.env.NEXT_PUBLIC_SUPABASE_URL || 
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured properly',
        message: 'Please set up Supabase environment variables first'
      }, { status: 400 });
    }

    // Convert migration data to Supabase format
    const supabaseRecruiters = INITIAL_MIGRATION_RECRUITERS.map((recruiter: any) => ({
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

    console.log(`📡 Inserting ${supabaseRecruiters.length} recruiters to Supabase`);

    // Insert all recruiters to Supabase
    const { data, error } = await supabaseAdmin
      .from('recruiters')
      .upsert(supabaseRecruiters, { onConflict: 'id' });

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to populate Supabase',
        details: error.message
      }, { status: 500 });
    }

    console.log('✅ Successfully populated Supabase with initial data');
    
    return NextResponse.json({
      success: true,
      message: 'Supabase populated with initial recruiter data successfully',
      inserted: supabaseRecruiters.length,
      recruiters: supabaseRecruiters.map((r: any) => ({ id: r.id, name: r.name }))
    });

  } catch (error) {
    console.error('❌ Population error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to populate Supabase',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Supabase Population API',
    usage: 'POST to /api/populate-supabase to populate Supabase with initial recruiter data',
    status: 'Ready'
  });
}