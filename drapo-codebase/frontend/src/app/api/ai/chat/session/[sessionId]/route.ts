import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

function extractSessionId(pathname: string): string | null {
  const match = pathname.match(/\/session\/([^/]+)/);
  return match ? match[1] : null;
}

export async function GET(request: NextRequest) {
  const sessionId = extractSessionId(request.nextUrl.pathname);
  if (!sessionId) {
    return NextResponse.json(
      { success: false, message: "Missing sessionId" },
      { status: 400 },
    );
  }
  try {
    const response = await fetch(`${BACKEND_URL}/ai/session/${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying chat history request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const sessionId = extractSessionId(request.nextUrl.pathname);
  if (!sessionId) {
    return NextResponse.json(
      { success: false, message: "Missing sessionId" },
      { status: 400 },
    );
  }
  try {
    const response = await fetch(`${BACKEND_URL}/ai/session/${sessionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying clear chat session request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
