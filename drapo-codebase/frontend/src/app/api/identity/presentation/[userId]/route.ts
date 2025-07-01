import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const { credentialTypes } = body;

    const response = await fetch(
      `http://localhost:4000/api/identity/presentation/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentialTypes }),
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating identity presentation:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create identity presentation" },
      { status: 500 },
    );
  }
}
