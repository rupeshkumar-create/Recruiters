import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const debug: any = {
    timestamp: new Date().toISOString(),
    environment: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'Not set',
      nodeEnv: process.env.NODE_ENV
    },
    supabaseConnection: {
      clientAvailable: !!supabase,
      adminAvailable: !!supabaseAdmin
    },
    tests: {}
  };

  // Test Supabase connection
  try {
    if (supabaseAdmin && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Test recruiters table
      const { data: recruiters, error: recruitersError } = await supabaseAdmin
        .from('recruiters')
        .select('id')
        .limit(1);
      
      debug.tests.recruitersTable = {
        accessible: !recruitersError,
        error: recruitersError?.message,
        hasData: recruiters && recruiters.length > 0
      };

      // Test submissions table
      const { data: submissions, error: submissionsError } = await supabaseAdmin
        .from('submissions')
        .select('id')
        .limit(1);
      
      debug.tests.submissionsTable = {
        accessible: !submissionsError,
        error: submissionsError?.message,
        hasData: submissions && submissions.length > 0
      };

      // Count total records
      if (!recruitersError) {
        const { count } = await supabaseAdmin
          .from('recruiters')
          .select('*', { count: 'exact', head: true });
        debug.tests.recruitersCount = count;
      }

      if (!submissionsError) {
        const { count } = await supabaseAdmin
          .from('submissions')
          .select('*', { count: 'exact', head: true });
        debug.tests.submissionsCount = count;
      }
    } else {
      debug.tests.supabaseConnection = 'Service role key missing or client not available';
    }
  } catch (error) {
    debug.tests.connectionError = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(debug, { 
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}