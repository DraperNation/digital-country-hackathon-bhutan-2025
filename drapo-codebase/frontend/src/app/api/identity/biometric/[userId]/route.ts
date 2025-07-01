import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/identity/biometric/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting biometric data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get biometric data" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/identity/biometric/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating biometric enrollment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update biometric enrollment" },
      { status: 500 },
    );
  }
}
