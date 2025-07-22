import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    // Replace this with your actual Mistral API call logic
    const response = await fetch('https://api.mistral.ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Mistral API');
    }

    const data = await response.json();

    return NextResponse.json({ result: data.generated_text });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Internal Server Error';
    return new NextResponse(
      JSON.stringify({ error: errMsg }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
