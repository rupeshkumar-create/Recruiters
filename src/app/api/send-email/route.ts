import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Enhanced environment variable debugging
    console.log('Environment check:', {
      hasLoopsKey: !!process.env.LOOPS_API_KEY,
      keyLength: process.env.LOOPS_API_KEY?.length || 0,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || 'not-vercel'
    });

    // Check if API key is configured
    if (!process.env.LOOPS_API_KEY) {
      console.error('LOOPS_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured - LOOPS_API_KEY missing' },
        { status: 500 }
      );
    }

    const { transactionalId, email, dataVariables } = await request.json();

    if (!transactionalId || !email || !dataVariables) {
      return NextResponse.json(
        { error: 'Missing required fields: transactionalId, email, dataVariables' },
        { status: 400 }
      );
    }

    console.log('Sending email via Loops to:', email, 'Template ID:', transactionalId);
    console.log('Request payload:', { transactionalId, email, dataVariables });

    const response = await fetch('https://app.loops.so/api/v1/transactional', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transactionalId,
        email,
        dataVariables
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Loops API error:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });
      return NextResponse.json(
        { 
          error: 'Failed to send email via Loops', 
          details: data,
          status: response.status,
          statusText: response.statusText
        },
        { status: response.status }
      );
    }

    console.log('Email sent successfully via Loops:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to send email', details: errorMessage },
      { status: 500 }
    );
  }
}