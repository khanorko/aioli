import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAnalysis, unlockAnalysis, consumeCredit, getUserById } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Du måste vara inloggad" },
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
    return NextResponse.json({ error: "analysisId krävs" }, { status: 400 });
  }

  // Get analysis
  const analysis = await getAnalysis(analysisId);
  if (!analysis) {
    return NextResponse.json({ error: "Analys hittades inte" }, { status: 404 });
  }

  // Check if already unlocked
  if (analysis.unlocked) {
    return NextResponse.json({ success: true, alreadyUnlocked: true });
  }

  // Check if user owns this analysis
  if (analysis.userId !== userId) {
    return NextResponse.json(
      { error: "Du kan bara låsa upp dina egna analyser" },
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
        error: "Du har inga credits kvar",
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
