import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json(
        { success: false, message: "Credential is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      "http://localhost:4000/api/identity/verify/credential",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error verifying credential:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify credential" },
      { status: 500 },
    );
  }
}
