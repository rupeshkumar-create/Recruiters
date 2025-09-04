import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Simple query to test connection
    const { data, error } = await supabase.from('tools').select('count');
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect to Supabase' },
      { status: 500 }
    );
  }
}