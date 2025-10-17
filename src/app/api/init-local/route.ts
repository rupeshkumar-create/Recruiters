import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export async function POST() {
  try {
    console.log('🔄 Initializing local file storage...');
    
    // Get the current migration data from the main API
    const response = await fetch('http://localhost:3000/api/recruiters');
    if (!response.ok) {
      throw new Error('Failed to fetch migration data');
    }
    
    const recruiters = await response.json();
    
    // Ensure data directory exists
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }
    
    // Save to local file
    const RECRUITERS_FILE = join(process.cwd(), 'data', 'recruiters.json');
    await writeFile(RECRUITERS_FILE, JSON.stringify(recruiters, null, 2));
    
    console.log(`✅ Initialized local file with ${recruiters.length} recruiters`);
    
    return NextResponse.json({
      success: true,
      message: 'Local file storage initialized successfully',
      recruiters: recruiters.length,
      file: RECRUITERS_FILE
    });
    
  } catch (error) {
    console.error('❌ Failed to initialize local storage:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to initialize local storage',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Local Storage Initialization API',
    usage: 'POST to /api/init-local to initialize local file storage with migration data',
    status: 'Ready'
  });
}