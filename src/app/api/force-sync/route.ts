import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { INITIAL_MIGRATION_RECRUITERS } from '../recruiters/route';

export async function POST() {
  try {
    console.log('🔄 Force sync - Ensuring data consistency...');
    
    if (!supabaseAdmin || !process.env.SUPABASE_SERVICE_ROLE_KEY || 
        !process.env.NEXT_PUBLIC_SUPABASE_URL || 
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase') ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured properly',
        message: 'Please check environment variables'
      }, { status: 400 });
    }

    // Step 1: Check current Supabase data
    console.log('📊 Checking current Supabase data...');
    const { data: currentData, error: fetchError } = await supabaseAdmin
      .from('recruiters')
      .select('*');

    if (fetchError) {
      console.error('❌ Failed to fetch current data:', fetchError);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch current data from Supabase',
        details: fetchError.message
      }, { status: 500 });
    }

    console.log(`📊 Found ${currentData?.length || 0} recruiters in Supabase`);

    // Step 2: If no data or less than expected, populate with migration data
    if (!currentData || currentData.length < 5) {
      console.log('📥 Populating Supabase with migration data...');
      
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

      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('recruiters')
        .upsert(supabaseRecruiters, { onConflict: 'id' });

      if (insertError) {
        console.error('❌ Failed to populate Supabase:', insertError);
        return NextResponse.json({
          success: false,
          error: 'Failed to populate Supabase',
          details: insertError.message
        }, { status: 500 });
      }

      console.log(`✅ Populated Supabase with ${supabaseRecruiters.length} recruiters`);
    }

    // Step 3: Clear global cache to force refresh
    if ((global as any).recruitersData) {
      delete (global as any).recruitersData;
      console.log('🧹 Cleared global cache');
    }

    // Step 4: Verify final state
    const { data: finalData, error: finalError } = await supabaseAdmin
      .from('recruiters')
      .select('id, name, company')
      .eq('approved', true)
      .eq('hidden', false);

    if (finalError) {
      console.error('❌ Failed to verify final state:', finalError);
      return NextResponse.json({
        success: false,
        error: 'Failed to verify final state',
        details: finalError.message
      }, { status: 500 });
    }

    console.log(`✅ Force sync complete - ${finalData?.length || 0} recruiters ready`);

    return NextResponse.json({
      success: true,
      message: 'Data sync completed successfully',
      before: {
        supabaseCount: currentData?.length || 0
      },
      after: {
        supabaseCount: finalData?.length || 0,
        sampleData: finalData?.slice(0, 3) || []
      },
      actions: [
        currentData?.length === 0 ? 'Populated empty Supabase database' : 'Verified existing data',
        'Cleared global cache',
        'Verified data consistency'
      ]
    });

  } catch (error) {
    console.error('❌ Force sync error:', error);
    return NextResponse.json({
      success: false,
      error: 'Force sync failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Force Sync API',
    usage: 'POST to /api/force-sync to ensure data consistency between Supabase and application',
    description: 'This endpoint will populate Supabase if empty and clear caches to ensure consistency'
  });
}