import { NextRequest, NextResponse } from 'next/server'

// POST /api/upload-logo - Mock logo upload (local storage)
export async function POST(request: NextRequest) {
  try {
    // Mock logo upload - return a placeholder URL
    const logoUrl = `https://ui-avatars.com/api/?name=Logo&background=F26B21&color=fff&size=48&t=${Date.now()}`

    console.log('Logo uploaded (mock):', logoUrl)

    return NextResponse.json({ 
      success: true, 
      logoUrl,
      message: 'Logo uploaded successfully (mock)'
    })
  } catch (error) {
    console.error('Error in POST /api/upload-logo:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}