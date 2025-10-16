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
    
    // Check if file is too large for data URL (limit to 1MB for data URLs)
    if (buffer.length > 1024 * 1024) {
      // For larger files, use a placeholder and log the issue
      console.log('File too large for data URL, using placeholder:', file.size, 'bytes');
      const placeholderUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(file.name.split('.')[0])}&background=3B82F6&color=fff&size=128`;
      
      return NextResponse.json({ 
        url: placeholderUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
        note: 'File too large for data URL, using placeholder. Consider using cloud storage for production.'
      });
    }
    
    const base64 = buffer.toString('base64');
    const mimeType = file.type;
    
    // Create data URL for immediate use
    const dataUrl = `data:${mimeType};base64,${base64}`;

    console.log('Image uploaded successfully, size:', file.size, 'bytes');

    return NextResponse.json({ 
      url: dataUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      success: true
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}