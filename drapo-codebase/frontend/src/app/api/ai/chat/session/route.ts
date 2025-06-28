import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Placeholder session route.",
  });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: "Placeholder session route.",
  });
}
