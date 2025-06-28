import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { legalArea, question, userId } = body;

    if (!legalArea || !question || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Legal area, question, and user ID are required",
        },
        { status: 400 },
      );
    }

    const response = await fetch(`${BACKEND_URL}/ai/legal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ legalArea, question, userId }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting legal guidance:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get legal guidance" },
      { status: 500 },
    );
  }
}
