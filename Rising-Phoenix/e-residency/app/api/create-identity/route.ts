import { NextRequest, NextResponse } from 'next/server';
import { createSovioIdentity } from '@/lib/sovio';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const identityData = {
      email: body.email || 'gabin.fay@gmail.com',
      name: body.name || 'Gabin',
      dob: body.dob || '1997-09-12',
      gender: body.gender || 'MALE',
      country: body.country || 'France',
      passportHash: body.passportHash || '1231393'
    };

    const sovioResponse = await createSovioIdentity(identityData);

    return NextResponse.json(sovioResponse);

  } catch (error: any) {
    return NextResponse.json(
      {
        message: 'Failed to create identity.',
        error: error.message
      },
      { status: 500 }
    );
  }
}