export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    // Parse JSON body safely
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { name, tone } = body;
    // Validate inputs presence and type
    if (!name || !tone || typeof name !== 'string' || typeof tone !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid name/tone in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get API key and validate
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error('Mistral API key is not configured');
    }

    // Basic sanitization to prevent prompt injection
    const sanitizedName = name.replace(/[^a-zA-Z0-9\s]/g, '');
    const sanitizedTone = tone.replace(/[^a-zA-Z0-9\s]/g, '');

    // Compose prompt for Mistral
    const prompt = `Write a ${sanitizedTone} message to someone named ${sanitizedName}. Keep it under 3 sentences. Use poetic and romantic language.`;

    // Call Mistral API
    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.MISTRAL_MODEL || 'mistral-small',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
      }),
    });

    if (!mistralRes.ok) {
      throw new Error(`Mistral API error: ${mistralRes.status} ${mistralRes.statusText}`);
    }

    // Parse response JSON
    const data = await mistralRes.json();

    // Validate response content
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Mistral API');
    }

    // Extract and trim message
    const message = data.choices[0].message.content.trim();

    // Return successful response
    return new Response(
      JSON.stringify({ message }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API route error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
