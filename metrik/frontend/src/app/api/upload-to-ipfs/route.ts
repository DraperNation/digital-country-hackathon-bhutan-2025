import { NextResponse } from 'next/server';
import { pinata } from '@/utils/config';

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPEG, and PNG files are allowed' },
        { status: 400 }
      );
    }

    const { cid } = await pinata.upload.public.file(file);
    const gatewayUrl = await pinata.gateways.public.convert(cid);

    return NextResponse.json({ 
      ipfsHash: cid,
      gatewayUrl
    });
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload to IPFS' },
      { status: 500 }
    );
  }
} 