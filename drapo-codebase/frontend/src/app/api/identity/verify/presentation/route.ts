import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { presentation } = body;

    if (!presentation) {
      return NextResponse.json(
        { success: false, message: "Presentation is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      "http://localhost:4000/api/identity/verify/presentation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ presentation }),
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error verifying presentation:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify presentation" },
      { status: 500 },
    );
  }
}
