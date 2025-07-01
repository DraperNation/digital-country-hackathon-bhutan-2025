import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const personhoodData = await request.json();

    const response = await fetch(
      `http://localhost:4000/api/identity/credentials/${userId}/personhood`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personhoodData),
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error issuing proof of personhood credential:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to issue proof of personhood credential",
      },
      { status: 500 },
    );
  }
}
