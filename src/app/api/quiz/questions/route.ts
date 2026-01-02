import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRandomQuestions, QUESTIONS_PER_QUIZ } from "@/lib/quiz-data";
import { getUserQuizRewards, getUserByEmail, initQuizTables } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Initialize quiz tables if needed
    await initQuizTables();

    // Get user to check rewards status
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const rewards = await getUserQuizRewards(user.id);

    // Get random questions (without correct answers for security)
    const questions = getRandomQuestions(QUESTIONS_PER_QUIZ).map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));

    return NextResponse.json({
      questions,
      rewards,
      totalQuestions: QUESTIONS_PER_QUIZ,
    });
  } catch (error) {
    console.error("Quiz questions error:", error);
    return NextResponse.json(
      { error: "Failed to load questions" },
      { status: 500 }
    );
  }
}
