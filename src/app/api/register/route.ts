import { NextResponse } from "next/server";

export async function POST() {
  // Registration disabled for now - analysis works without login
  return NextResponse.json(
    { error: "Registration is currently disabled" },
    { status: 503 }
  );
}
