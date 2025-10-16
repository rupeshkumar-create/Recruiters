import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/upload-logo - Upload logo to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 2MB for logos)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 2MB' }, { status: 400 });
    }

    // Try Supabase storage first
    if (supabase && process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_supabase')) {
      
      console.log('📤 Uploading logo to Supabase Storage...');
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop() || 'png';
      const fileName = `logo-${timestamp}.${fileExtension}`;
      
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('logos')
        .upload(fileName, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Supabase storage error:', error);
        // Fall back to placeholder
        const logoUrl = `https://ui-avatars.com/api/?name=Logo&background=F26B21&color=fff&size=48&t=${Date.now()}`;
        return NextResponse.json({ 
          success: true, 
          logoUrl,
          storage: 'placeholder',
          message: 'Logo upload failed, using placeholder'
        });
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      console.log('✅ Logo uploaded to Supabase Storage successfully');
      
      return NextResponse.json({ 
        success: true, 
        logoUrl: urlData.publicUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        storage: 'supabase',
        message: 'Logo uploaded successfully'
      });
    }

    // Fallback to placeholder
    console.log('📁 Using placeholder logo (Supabase not configured)');
    const logoUrl = `https://ui-avatars.com/api/?name=Logo&background=F26B21&color=fff&size=48&t=${Date.now()}`;

    return NextResponse.json({ 
      success: true, 
      logoUrl,
      storage: 'placeholder',
      message: 'Logo uploaded successfully (placeholder)'
    });
  } catch (error) {
    console.error('Error in POST /api/upload-logo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}