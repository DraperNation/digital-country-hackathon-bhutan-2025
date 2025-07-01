import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceLanguage, targetLanguage, text, userId, serviceType } = body;

    if (!sourceLanguage || !targetLanguage || !text || !userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Source language, target language, text, and user ID are required",
        },
        { status: 400 },
      );
    }

    const response = await fetch(`${BACKEND_URL}/ai/dzongkha`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceLanguage,
        targetLanguage,
        text,
        userId,
        serviceType,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting Dzongkha translation:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get Dzongkha translation" },
      { status: 500 },
    );
  }
}
