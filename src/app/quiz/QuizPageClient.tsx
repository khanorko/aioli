"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { Brain, BookOpen, Sparkles, Share2, Trophy, ArrowRight } from "lucide-react";
import { AIReadinessQuiz } from "@/components/AIReadinessQuiz";

interface QuizPageClientProps {
  isLoggedIn: boolean;
}

export function QuizPageClient({ isLoggedIn }: QuizPageClientProps) {
  if (!isLoggedIn) {
    return (
      <div className="quiz-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-emerald-500/10">
            <Brain className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">AI Visibility Quiz</h1>
            <p className="text-sm text-zinc-400">Test your knowledge!</p>
          </div>
        </div>

        <p className="text-zinc-300 mb-6">
          5 random questions from our learning articles. Score 100% to earn{" "}
          <span className="text-amber-400 font-medium">+1 free credit</span>!
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Questions from 3 AI visibility articles</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>+1 credit for perfect score</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <Share2 className="w-4 h-4 text-blue-400" />
            <span>+1 credit for sharing your result</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Compete on the leaderboard</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
          <p className="text-sm text-zinc-400 text-center">
            Sign in to take the quiz and earn credits
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => signIn("google")}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <Link
            href="/learn"
            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-zinc-300"
          >
            <BookOpen className="w-4 h-4" />
            Study Articles First
          </Link>
        </div>
      </div>
    );
  }

  return <AIReadinessQuiz />;
}
