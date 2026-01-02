import { NextResponse } from "next/server";
import { getQuizLeaderboard, initQuizTables } from "@/lib/db";

export async function GET() {
  try {
    await initQuizTables();

    const leaderboard = await getQuizLeaderboard(10);

    // Mask emails for privacy (show first 3 chars + domain)
    const maskedLeaderboard = leaderboard.map((entry, index) => {
      const emailParts = entry.userEmail.split("@");
      const maskedLocal = emailParts[0].slice(0, 3) + "***";
      const maskedEmail = `${maskedLocal}@${emailParts[1]}`;

      return {
        rank: index + 1,
        email: maskedEmail,
        score: entry.score,
        totalQuestions: entry.totalQuestions,
        isPerfect: entry.isPerfect,
        timeTakenSeconds: entry.timeTakenSeconds,
        createdAt: entry.createdAt.toISOString(),
      };
    });

    return NextResponse.json({ leaderboard: maskedLeaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}
