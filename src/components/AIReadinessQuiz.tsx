"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  Trophy,
  Share2,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Award,
  Loader2,
  BookOpen,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface QuizResult {
  questionId: string;
  correct: boolean;
  correctAnswer: string;
  explanation: string;
}

interface Rewards {
  earnedQuizCredit: boolean;
  earnedShareCredit: boolean;
}

interface LeaderboardEntry {
  rank: number;
  email: string;
  score: number;
  totalQuestions: number;
  isPerfect: boolean;
  timeTakenSeconds: number;
}

type QuizState = "intro" | "playing" | "results" | "leaderboard";

export function AIReadinessQuiz() {
  const [state, setState] = useState<QuizState>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answerIndex: number }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [score, setScore] = useState(0);
  const [creditAwarded, setCreditAwarded] = useState(false);
  const [rewards, setRewards] = useState<Rewards>({ earnedQuizCredit: false, earnedShareCredit: false });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state === "playing") {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state, startTime]);

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/quiz/questions");
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
        setRewards(data.rewards);
      }
    } catch (error) {
      console.error("Failed to load questions:", error);
    }
    setIsLoading(false);
  }, []);

  const loadLeaderboard = useCallback(async () => {
    try {
      const res = await fetch("/api/quiz/leaderboard");
      const data = await res.json();
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    }
  }, []);

  const startQuiz = async () => {
    await loadQuestions();
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setStartTime(Date.now());
    setElapsedTime(0);
    setResults([]);
    setScore(0);
    setCreditAwarded(false);
    setState("playing");
  };

  const selectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const nextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = [...answers, { questionId: currentQuestion.id, answerIndex: selectedAnswer! }];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      // Submit quiz
      setIsLoading(true);
      try {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        const res = await fetch("/api/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: newAnswers, timeTakenSeconds: timeTaken }),
        });
        const data = await res.json();
        setResults(data.results);
        setScore(data.score);
        setCreditAwarded(data.creditAwarded);
        setRewards(data.rewards);
        setState("results");
      } catch (error) {
        console.error("Failed to submit quiz:", error);
      }
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);

    const quizUrl = "https://aioli-one.vercel.app/quiz";
    const shareText = `I scored ${score}/${questions.length} on the AI Visibility Quiz! Test your knowledge:`;

    // Try native share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Visibility Quiz",
          text: shareText,
          url: quizUrl,
        });
      } catch {
        // User cancelled or error - copy to clipboard instead
        await navigator.clipboard.writeText(`${shareText} ${quizUrl}`);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${shareText} ${quizUrl}`);
    }

    // Record share for credit
    if (!rewards.earnedShareCredit) {
      try {
        const res = await fetch("/api/quiz/share", { method: "POST" });
        const data = await res.json();
        if (data.creditAwarded) {
          setRewards(data.rewards);
          setShareSuccess(true);
        }
      } catch (error) {
        console.error("Failed to record share:", error);
      }
    }

    setIsSharing(false);
  };

  const showLeaderboard = async () => {
    await loadLeaderboard();
    setState("leaderboard");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Intro screen
  if (state === "intro") {
    return (
      <div className="quiz-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-emerald-500/10">
            <Brain className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Visibility Quiz</h3>
            <p className="text-sm text-zinc-400">Test your knowledge!</p>
          </div>
        </div>

        <p className="text-zinc-300 mb-6">
          5 random questions from our learning articles. Score 100% to earn{" "}
          <span className="text-amber-400 font-medium">+1 free credit</span>!
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>5 questions from a pool of 20</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              {rewards.earnedQuizCredit ? (
                <span className="text-zinc-500 line-through">+1 credit for perfect score (earned!)</span>
              ) : (
                "+1 credit for perfect score"
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <Share2 className="w-4 h-4 text-blue-400" />
            <span>
              {rewards.earnedShareCredit ? (
                <span className="text-zinc-500 line-through">+1 credit for sharing (earned!)</span>
              ) : (
                "+1 credit for sharing your result"
              )}
            </span>
          </div>
        </div>

        {/* Study link */}
        <Link
          href="/learn"
          className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 mb-4 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Study the articles first
        </Link>

        <div className="flex gap-3">
          <button
            onClick={startQuiz}
            disabled={isLoading}
            className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Start Quiz
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
          <button
            onClick={showLeaderboard}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <Trophy className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>
    );
  }

  // Playing state
  if (state === "playing") {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="quiz-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-zinc-400">
            Question {currentQuestionIndex + 1}/{questions.length}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Clock className="w-4 h-4" />
            {formatTime(elapsedTime)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h4 className="text-lg font-medium text-white mb-6">
              {currentQuestion.question}
            </h4>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(index)}
                  className={`w-full p-4 rounded-xl text-left text-sm transition-all ${
                    selectedAnswer === index
                      ? "bg-emerald-500/20 border-emerald-500 text-white"
                      : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                  } border`}
                >
                  <span className="font-mono text-xs text-zinc-500 mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        <button
          onClick={nextQuestion}
          disabled={selectedAnswer === null || isLoading}
          className="w-full mt-6 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : currentQuestionIndex === questions.length - 1 ? (
            "Submit Quiz"
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    );
  }

  // Results state
  if (state === "results") {
    const isPerfect = score === questions.length;

    return (
      <div className="quiz-card">
        {/* Score header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
              isPerfect ? "bg-emerald-500/20" : score >= 3 ? "bg-amber-500/20" : "bg-red-500/20"
            }`}
          >
            {isPerfect ? (
              <Trophy className="w-10 h-10 text-emerald-400" />
            ) : (
              <span className="text-3xl font-bold text-white">{score}/{questions.length}</span>
            )}
          </motion.div>
          <h3 className="text-xl font-semibold text-white mb-1">
            {isPerfect ? "Perfect Score!" : score >= 3 ? "Good Job!" : "Keep Learning!"}
          </h3>
          <p className="text-zinc-400 text-sm">
            Completed in {formatTime(elapsedTime)}
          </p>
        </div>

        {/* Credit notification */}
        {creditAwarded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-emerald-300 text-sm">
              +1 credit earned for perfect score!
            </span>
          </motion.div>
        )}

        {/* Results breakdown */}
        <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={result.questionId}
              className={`p-3 rounded-lg text-sm ${
                result.correct ? "bg-emerald-500/10" : "bg-red-500/10"
              }`}
            >
              <div className="flex items-start gap-2">
                {result.correct ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <span className="text-zinc-300">Q{index + 1}: </span>
                  {!result.correct && (
                    <span className="text-zinc-400">
                      Correct: {result.correctAnswer}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* Share button */}
          <button
            onClick={handleShare}
            disabled={isSharing}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              shareSuccess
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
            }`}
          >
            {isSharing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : shareSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Shared! {!rewards.earnedShareCredit && "+1 credit earned"}
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share Result {!rewards.earnedShareCredit && "(+1 credit)"}
              </>
            )}
          </button>

          <div className="flex gap-3">
            <button
              onClick={startQuiz}
              className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={showLeaderboard}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <Trophy className="w-5 h-5 text-amber-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Leaderboard state
  if (state === "leaderboard") {
    return (
      <div className="quiz-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-amber-500/10">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
            <p className="text-sm text-zinc-400">Top quiz performers</p>
          </div>
        </div>

        {leaderboard.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">
            No scores yet. Be the first!
          </p>
        ) : (
          <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  entry.rank <= 3 ? "bg-amber-500/10" : "bg-white/5"
                }`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10">
                  {entry.rank <= 3 ? (
                    <Award className={`w-4 h-4 ${
                      entry.rank === 1 ? "text-yellow-400" :
                      entry.rank === 2 ? "text-zinc-300" :
                      "text-amber-600"
                    }`} />
                  ) : (
                    <span className="text-xs text-zinc-400">#{entry.rank}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{entry.email}</div>
                  <div className="text-xs text-zinc-500">
                    {formatTime(entry.timeTakenSeconds)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${entry.isPerfect ? "text-emerald-400" : "text-white"}`}>
                    {entry.score}/{entry.totalQuestions}
                  </div>
                  {entry.isPerfect && (
                    <div className="text-xs text-emerald-400">Perfect!</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setState("intro")}
          className="w-full btn-primary py-3"
        >
          Back to Quiz
        </button>
      </div>
    );
  }

  return null;
}
