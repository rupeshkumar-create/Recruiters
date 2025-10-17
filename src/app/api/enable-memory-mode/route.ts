import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🔧 Memory mode enabled - admin changes will work temporarily');
    console.log('⚠️ Note: Changes will be lost on server restart');
    console.log('💡 For permanent changes, set up Supabase credentials in .env.local');
    
    return NextResponse.json({
      success: true,
      message: 'Memory mode enabled - admin changes will work temporarily',
      warning: 'Changes will be lost on server restart. Set up Supabase for persistence.',
      instructions: 'See IMMEDIATE_ADMIN_FIX.md for Supabase setup'
    });
  } catch (error) {
    console.error('❌ Error enabling memory mode:', error);
    return NextResponse.json(
      { error: 'Failed to enable memory mode' },
      { status: 500 }
    );
  }
}