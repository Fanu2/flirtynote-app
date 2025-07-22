import { NextRequest, NextResponse } from 'next/server';

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/generate';  // example URL, replace if needed
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { name, tone } = await request.json();

    // Compose your prompt for Mistral
    const prompt = `Write a ${tone} love note to a person named ${name}.`;

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Mistral API error:', errorDetails);
      return NextResponse.json({ message: 'Failed to generate message.' }, { status: 500 });
    }

    const data = await response.json();
    // Adjust this depending on Mistral’s actual response shape
    const message = data.choices?.[0]?.text?.trim() || 'Sorry, no message generated.';

    return NextResponse.json({ message });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ message: 'Failed to generate message.' }, { status: 500 });
  }
}
