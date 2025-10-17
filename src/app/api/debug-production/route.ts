import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Production Debug - Checking Supabase connection...');
    
    // Check environment variables
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    };
    
    console.log('Environment variables:', envCheck);
    
    // Check Supabase connection
    let supabaseStatus = 'NOT CONNECTED';
    let supabaseData = [];
    let supabaseError = null;
    
    if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY && 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase') &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id')) {
      
      console.log('✅ Supabase configuration looks valid');
      
      try {
        const { data, error } = await supabaseAdmin
          .from('recruiters')
          .select('id, name, company')
          .limit(20);
        
        if (error) {
          supabaseError = error.message;
          console.log('❌ Supabase query error:', error);
        } else {
          supabaseStatus = 'CONNECTED';
          supabaseData = data || [];
          console.log(`✅ Supabase connected, found ${supabaseData.length} recruiters`);
        }
      } catch (queryError) {
        supabaseError = queryError instanceof Error ? queryError.message : 'Unknown error';
        console.log('❌ Supabase query exception:', queryError);
      }
    } else {
      console.log('❌ Supabase configuration invalid');
    }
    
    // Check fallback data
    const { INITIAL_MIGRATION_RECRUITERS } = await import('../recruiters/route');
    const fallbackCount = INITIAL_MIGRATION_RECRUITERS?.length || 0;
    
    // Check global data
    const globalCount = (global as any).recruitersData?.length || 0;
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      supabase: {
        status: supabaseStatus,
        error: supabaseError,
        dataCount: supabaseData.length,
        sampleData: supabaseData.slice(0, 3)
      },
      fallback: {
        migrationDataCount: fallbackCount,
        globalDataCount: globalCount
      },
      environment_variables: envCheck,
      diagnosis: {
        issue: supabaseStatus === 'CONNECTED' && supabaseData.length === 0 
          ? 'Supabase connected but no data - need to populate'
          : supabaseStatus !== 'CONNECTED' 
          ? 'Supabase not connected - using fallback data'
          : 'Normal operation',
        recommendation: supabaseStatus === 'CONNECTED' && supabaseData.length === 0
          ? 'Run /api/populate-supabase to add initial data'
          : supabaseStatus !== 'CONNECTED'
          ? 'Check Supabase environment variables'
          : 'System working correctly'
      }
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}