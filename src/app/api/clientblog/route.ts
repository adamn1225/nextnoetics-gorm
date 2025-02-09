import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { status } = await req.json();

    if (status === 'published') {
        try {
            const response = await fetch('/.netlify/functions/triggerWebhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error(`Failed to trigger Netlify build. Status: ${response.status}`);
            }

            return NextResponse.json({ message: 'Netlify build triggered successfully' }, { status: 200 });
        } catch (error) {
            if (error instanceof Error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            } else {
                return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
            }
        }
    }

    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
}

export async function GET() {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}