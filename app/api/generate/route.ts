export async function POST(request: Request) {
  try {
    const { name, tone } = await request.json();

    const prompt = `Write a ${tone} message to someone named ${name}. Keep it under 3 sentences. Use poetic and romantic language.`;

    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-small',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
      }),
    });

    if (!mistralRes.ok) {
      const errorText = await mistralRes.text();
      console.error('Mistral API error:', mistralRes.status, errorText);
      throw new Error(`Mistral API error: ${mistralRes.status} - ${errorText}`);
    }

    const data = await mistralRes.json();
    const message = data.choices?.[0]?.message?.content?.trim() || 'Could not generate message.';

    return new Response(JSON.stringify({ message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API route error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
