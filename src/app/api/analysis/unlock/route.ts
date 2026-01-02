import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAnalysis, unlockAnalysis, consumeCredit, getUserById } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { analysisId } = body;

  if (!analysisId) {
    return NextResponse.json({ error: "analysisId is required" }, { status: 400 });
  }

  // Get analysis
  const analysis = await getAnalysis(analysisId);
  if (!analysis) {
    return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
  }

  // Check if already unlocked
  if (analysis.unlocked) {
    return NextResponse.json({ success: true, alreadyUnlocked: true });
  }

  // Check if user owns this analysis
  if (analysis.userId !== userId) {
    return NextResponse.json(
      { error: "You can only unlock your own analyses" },
      { status: 403 }
    );
  }

  // Try to use a credit
  const creditUsed = await consumeCredit(userId);
  if (!creditUsed) {
    // Get user to return current credits
    const user = await getUserById(userId);
    return NextResponse.json(
      {
        error: "You have no credits left",
        needsCredits: true,
        credits: user?.credits || 0
      },
      { status: 402 }
    );
  }

  // Unlock the analysis
  await unlockAnalysis(analysisId);

  // Get updated user credits
  const user = await getUserById(userId);

  return NextResponse.json({
    success: true,
    credits: user?.credits || 0,
  });
}
