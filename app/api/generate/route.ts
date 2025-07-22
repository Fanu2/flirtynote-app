import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, tone } = await request.json();

    // You can replace this with your AI or other generation logic
    const message = `Hey ${name}, here's a ${tone} message just for you! 💌`;

    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to generate message.' }, { status: 500 });
  }
}
