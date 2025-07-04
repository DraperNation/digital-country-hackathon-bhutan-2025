import { NextRequest, NextResponse } from 'next/server';
import { requestSovioProof } from '@/lib/sovio-proof';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required.' },
        { status: 400 }
      );
    }

    const sovioResponse = await requestSovioProof(email);

    // The response will typically contain an invitationUrl which you can then
    // display as a QR code or send as a link to the user.
    return NextResponse.json(sovioResponse);

  } catch (error: any) {
    return NextResponse.json(
      {
        message: 'Failed to request proof.',
        error: error.message
      },
      { status: 500 }
    );
  }
}