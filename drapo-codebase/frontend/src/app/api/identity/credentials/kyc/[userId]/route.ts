import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const kycData = await request.json();

    const response = await fetch(
      `http://localhost:4000/api/identity/credentials/${userId}/kyc`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(kycData),
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error issuing KYC credential:", error);
    return NextResponse.json(
      { success: false, message: "Failed to issue KYC credential" },
      { status: 500 },
    );
  }
}
