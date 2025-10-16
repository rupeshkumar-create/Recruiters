import { NextRequest, NextResponse } from 'next/server';

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

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Convert file to base64 for temporary storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type;
    
    // Create data URL for immediate use
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // For production, you would upload to a cloud service like:
    // - Cloudinary
    // - AWS S3
    // - Supabase Storage
    // - Vercel Blob
    
    // For now, we'll use the data URL which works but has limitations
    console.log('Image uploaded successfully, size:', file.size, 'bytes');

    return NextResponse.json({ 
      url: dataUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      note: 'Using data URL for demo. For production, integrate with cloud storage.'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}