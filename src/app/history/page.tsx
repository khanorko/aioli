"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { HelpCircle, Clock, TrendingUp, RefreshCw } from "lucide-react";

interface Analysis {
  id: string;
  url: string;
  seoScore: number | null;
  llmScore: number | null;
  status: string;
  createdAt: string;
}

function getScoreColor(score: number | null): string {
  if (score === null) return "var(--text-muted)";
  if (score >= 80) return "var(--score-good)";
  if (score >= 50) return "var(--score-ok)";
  return "var(--score-poor)";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    fetchAnalyses();
  }, [session, status, router]);

  const fetchAnalyses = async () => {
    try {
      const response = await fetch("/api/user/analyses");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch analyses");
      }

      setAnalyses(data.analyses);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[var(--bg-secondary)] rounded w-1/3" />
            <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/2" />
            <div className="space-y-3 mt-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-[var(--bg-secondary)] rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="Aioli" width={100} height={40} style={{ height: '32px', width: 'auto' }} />
          </Link>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Analysis History
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Your previous SEO and AI visibility analyses
          </p>
        </div>

        {error && (
          <div className="card p-4 mb-6" style={{ borderColor: "var(--score-poor)" }}>
            <p style={{ color: "var(--score-poor)" }}>{error}</p>
          </div>
        )}

        {/* Features overview for crawlers */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="card p-4">
            <Clock className="w-5 h-5 text-emerald-400 mb-2" />
            <h2 className="text-white font-medium mb-1">Track Over Time</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              All your analyses are saved indefinitely for tracking progress.
            </p>
          </div>
          <div className="card p-4">
            <TrendingUp className="w-5 h-5 text-blue-400 mb-2" />
            <h2 className="text-white font-medium mb-1">Compare Results</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              See how your SEO and AI visibility scores improve over time.
            </p>
          </div>
          <div className="card p-4">
            <RefreshCw className="w-5 h-5 text-amber-400 mb-2" />
            <h2 className="text-white font-medium mb-1">Re-analyze Anytime</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Run new analyses to measure the impact of your optimizations.
            </p>
          </div>
        </div>

        {analyses.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-lg mb-4" style={{ color: "var(--text-secondary)" }}>
              No analyses yet
            </p>
            <Link href="/" className="btn-primary inline-block px-6 py-3">
              Start your first analysis
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((analysis) => (
              <Link
                key={analysis.id}
                href={`/analysis/${analysis.id}`}
                className="card p-4 flex items-center justify-between hover:ring-2 hover:ring-[var(--plasma-blue)] transition-all"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {extractDomain(analysis.url)}
                  </p>
                  <p className="text-sm truncate" style={{ color: "var(--text-muted)" }}>
                    {analysis.url}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {formatDate(analysis.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  <div className="text-center">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>SEO</p>
                    <p
                      className="text-lg font-bold"
                      style={{ color: getScoreColor(analysis.seoScore) }}
                    >
                      {analysis.seoScore ?? "-"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>AI</p>
                    <p
                      className="text-lg font-bold"
                      style={{ color: getScoreColor(analysis.llmScore) }}
                    >
                      {analysis.llmScore ?? "-"}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5"
                    style={{ color: "var(--text-muted)" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-xl font-medium text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <details className="card group">
              <summary className="p-4 flex items-center justify-between cursor-pointer list-none text-white font-medium">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                  How long is my analysis history saved?
                </span>
                <span style={{ color: "var(--text-muted)" }} className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Your analysis history is saved indefinitely. You can access all your past analyses at any time to track your progress and compare results.
              </p>
            </details>
            <details className="card group">
              <summary className="p-4 flex items-center justify-between cursor-pointer list-none text-white font-medium">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                  Can I re-analyze a previously scanned website?
                </span>
                <span style={{ color: "var(--text-muted)" }} className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Yes! You can return to the homepage and analyze any URL again. This lets you track improvements over time after implementing SEO and AI visibility optimizations.
              </p>
            </details>
            <details className="card group">
              <summary className="p-4 flex items-center justify-between cursor-pointer list-none text-white font-medium">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                  What do the SEO and AI scores mean?
                </span>
                <span style={{ color: "var(--text-muted)" }} className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-4 pb-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                The SEO score (0-100) measures traditional search engine optimization factors like meta tags, headings, and technical SEO. The AI score measures how well your content can be discovered and cited by AI assistants like ChatGPT and Claude.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
