"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";

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
            <Image src="/logo.png" alt="AIoli" width={100} height={40} style={{ height: '32px', width: 'auto' }} />
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
      </div>
    </div>
  );
}
