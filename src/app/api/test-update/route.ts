import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('🧪 Testing Supabase update functionality...');
    
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

    // Step 1: Get first recruiter
    console.log('📊 Getting first recruiter...');
    const { data: recruiters, error: fetchError } = await supabaseAdmin
      .from('recruiters')
      .select('*')
      .limit(1);

    if (fetchError) {
      console.error('❌ Failed to fetch recruiters:', fetchError);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch recruiters',
        details: fetchError.message
      }, { status: 500 });
    }

    if (!recruiters || recruiters.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No recruiters found in database',
        message: 'Run /api/populate-supabase first'
      }, { status: 404 });
    }

    const testRecruiter = recruiters[0];
    console.log('👤 Testing with recruiter:', testRecruiter.name);

    // Step 2: Try a simple update
    const testUpdate = {
      name: `${testRecruiter.name} - TEST ${Date.now()}`,
      updated_at: new Date().toISOString()
    };

    console.log('🔄 Attempting test update...');
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('recruiters')
      .update(testUpdate)
      .eq('id', testRecruiter.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Update failed:', updateError);
      return NextResponse.json({
        success: false,
        error: 'Update test failed',
        details: updateError.message,
        hint: updateError.hint,
        originalName: testRecruiter.name
      }, { status: 500 });
    }

    console.log('✅ Update test successful');

    // Step 3: Revert the change
    const revertUpdate = {
      name: testRecruiter.name,
      updated_at: new Date().toISOString()
    };

    await supabaseAdmin
      .from('recruiters')
      .update(revertUpdate)
      .eq('id', testRecruiter.id);

    console.log('🔄 Reverted test change');

    return NextResponse.json({
      success: true,
      message: 'Supabase update test completed successfully',
      testResults: {
        originalName: testRecruiter.name,
        testName: testUpdate.name,
        updateSuccessful: true,
        revertSuccessful: true
      }
    });

  } catch (error) {
    console.error('❌ Test update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test update failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Supabase Update Test API',
    usage: 'POST to /api/test-update to test Supabase update functionality',
    description: 'This endpoint tests if Supabase updates are working correctly'
  });
}