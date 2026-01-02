import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { QUIZ_QUESTIONS, QUESTIONS_PER_QUIZ } from "@/lib/quiz-data";
import {
  getUserByEmail,
  recordQuizAttempt,
  getUserQuizRewards,
  initQuizTables,
} from "@/lib/db";

interface SubmitRequest {
  answers: { questionId: string; answerIndex: number }[];
  timeTakenSeconds: number;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await initQuizTables();

    const body: SubmitRequest = await request.json();
    const { answers, timeTakenSeconds } = body;

    if (!answers || !Array.isArray(answers) || answers.length !== QUESTIONS_PER_QUIZ) {
      return NextResponse.json(
        { error: "Invalid answers format" },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate score
    let score = 0;
    const results = answers.map((answer) => {
      const question = QUIZ_QUESTIONS.find((q) => q.id === answer.questionId);
      if (!question) {
        return { questionId: answer.questionId, correct: false, explanation: "" };
      }

      const isCorrect = question.correctIndex === answer.answerIndex;
      if (isCorrect) score++;

      return {
        questionId: answer.questionId,
        correct: isCorrect,
        correctAnswer: question.options[question.correctIndex],
        explanation: question.explanation,
      };
    });

    // Record attempt and potentially award credit
    const { creditAwarded, attemptId } = await recordQuizAttempt(
      user.id,
      user.email,
      score,
      QUESTIONS_PER_QUIZ,
      timeTakenSeconds
    );

    // Get updated rewards status
    const rewards = await getUserQuizRewards(user.id);

    return NextResponse.json({
      score,
      totalQuestions: QUESTIONS_PER_QUIZ,
      isPerfect: score === QUESTIONS_PER_QUIZ,
      creditAwarded,
      attemptId,
      results,
      rewards,
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
