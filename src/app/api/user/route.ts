import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, canUserAnalyze, initDb } from "@/lib/db";

let dbInitialized = false;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "E-postadress krävs" },
        { status: 400 }
      );
    }

    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({
        exists: false,
        subscriptionStatus: "free",
        analysesRemaining: 3,
        isPro: false,
      });
    }

    const { remaining } = await canUserAnalyze(user.id);

    return NextResponse.json({
      exists: true,
      subscriptionStatus: user.subscriptionStatus,
      analysesRemaining: remaining,
      isPro: user.subscriptionStatus === "pro",
      analysesThisMonth: user.analysesThisMonth,
    });
  } catch (error) {
    console.error("User status error:", error);
    return NextResponse.json(
      { error: "Kunde inte hämta användarstatus" },
      { status: 500 }
    );
  }
}
