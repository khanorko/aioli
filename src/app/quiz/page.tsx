import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { QuizPageClient } from "./QuizPageClient";
import { BookOpen, Trophy, Sparkles, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Visibility Quiz - Test Your SEO Knowledge & Earn Credits | Aioli™",
  description:
    "Test your knowledge of AI visibility and SEO! Answer 5 random questions from our learning articles, score 100% to earn free credits, and compete on the leaderboard.",
  alternates: {
    canonical: "/quiz",
  },
  openGraph: {
    title: "AI Visibility Quiz - Test Your SEO Knowledge | Aioli™",
    description:
      "Test your knowledge of AI visibility and SEO! Score 100% to earn free credits.",
    url: "https://aioli.tools/quiz",
  },
};

// Schema.org Quiz structured data
const quizJsonLd = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: "AI Visibility Knowledge Quiz",
  description:
    "Test your understanding of AI visibility, SEO optimization for AI assistants, and modern search strategies. 5 random questions from a pool of 20.",
  url: "https://aioli.tools/quiz",
  provider: {
    "@type": "Organization",
    name: "Aioli",
    url: "https://aioli.tools",
  },
  educationalLevel: "Beginner to Intermediate",
  about: [
    {
      "@type": "Thing",
      name: "AI Visibility",
    },
    {
      "@type": "Thing",
      name: "Search Engine Optimization",
    },
    {
      "@type": "Thing",
      name: "AI Assistants",
    },
  ],
};

// FAQ Schema for quiz-related questions
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the AI Visibility Quiz work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The quiz presents 5 random questions from a pool of 20 questions covering AI visibility, SEO for AI assistants, and optimization strategies. You need to answer correctly to earn points.",
      },
    },
    {
      "@type": "Question",
      name: "What rewards can I earn from the quiz?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Score 100% (5/5 correct) to earn 1 free credit. You can also earn an additional credit by sharing your quiz result. Credits can be used to unlock detailed website analysis.",
      },
    },
    {
      "@type": "Question",
      name: "Can I retake the quiz?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can retake the quiz as many times as you want. Each attempt features a new random selection of 5 questions from the pool of 20. However, the perfect score credit reward is only given once.",
      },
    },
  ],
};

export default async function QuizPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Aioli™
          </Link>
          <Link
            href="/learn"
            className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
          >
            Study Articles →
          </Link>
        </div>
      </header>

      {/* Quiz Section */}
      <section className="py-16 px-6">
        <div className="max-w-md mx-auto">
          <QuizPageClient isLoggedIn={!!session} />
        </div>
      </section>

      {/* About the Quiz - visible content for crawlers */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-medium text-white mb-6 text-center">
            About the AI Visibility Quiz
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
              <BookOpen className="w-5 h-5 text-emerald-400 mb-3" />
              <h3 className="text-white font-medium mb-2">Learn & Test</h3>
              <p className="text-sm text-zinc-400">
                5 random questions from our pool of 20, covering AI visibility, SEO for AI assistants, and optimization strategies.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
              <Trophy className="w-5 h-5 text-amber-400 mb-3" />
              <h3 className="text-white font-medium mb-2">Earn Rewards</h3>
              <p className="text-sm text-zinc-400">
                Score 100% to earn 1 free credit. Share your result for an additional credit. Credits unlock detailed website analysis.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
              <Sparkles className="w-5 h-5 text-blue-400 mb-3" />
              <h3 className="text-white font-medium mb-2">Compete</h3>
              <p className="text-sm text-zinc-400">
                See how you rank on the leaderboard. Retake the quiz anytime with new random questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-medium text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            <details className="group p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <summary className="flex items-center justify-between cursor-pointer list-none text-white font-medium">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                  How does the AI Visibility Quiz work?
                </span>
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-zinc-400 text-sm leading-relaxed pl-6">
                The quiz presents 5 random questions from a pool of 20 questions covering AI visibility, SEO for AI assistants, and optimization strategies. You need to answer correctly to earn points.
              </p>
            </details>
            <details className="group p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <summary className="flex items-center justify-between cursor-pointer list-none text-white font-medium">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                  What rewards can I earn from the quiz?
                </span>
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-zinc-400 text-sm leading-relaxed pl-6">
                Score 100% (5/5 correct) to earn 1 free credit. You can also earn an additional credit by sharing your quiz result. Credits can be used to unlock detailed website analysis.
              </p>
            </details>
            <details className="group p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <summary className="flex items-center justify-between cursor-pointer list-none text-white font-medium">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                  Can I retake the quiz?
                </span>
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-zinc-400 text-sm leading-relaxed pl-6">
                Yes! You can retake the quiz as many times as you want. Each attempt features a new random selection of 5 questions from the pool of 20. However, the perfect score credit reward is only given once.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-5xl mx-auto text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} Aioli. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
