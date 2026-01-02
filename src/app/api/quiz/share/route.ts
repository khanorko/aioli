import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserByEmail, recordQuizShare, getUserQuizRewards, initQuizTables } from "@/lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await initQuizTables();

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Record share and award credit if first time
    const creditAwarded = await recordQuizShare(user.id);

    // Get updated rewards status
    const rewards = await getUserQuizRewards(user.id);

    return NextResponse.json({
      creditAwarded,
      rewards,
    });
  } catch (error) {
    console.error("Quiz share error:", error);
    return NextResponse.json(
      { error: "Failed to record share" },
      { status: 500 }
    );
  }
}
