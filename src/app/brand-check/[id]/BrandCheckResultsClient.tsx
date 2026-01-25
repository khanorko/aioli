"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Globe,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Share2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

interface BrandCheckResult {
  id: string;
  brandName: string;
  website: string | null;
  industry: string | null;
  status: "known" | "partial" | "unknown" | "confused";
  score: number;
  response: string;
  keyFacts: string[];
  recommendations: string[];
  createdAt: string;
}

const statusConfig = {
  known: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    label: "Known",
    description: "AI assistants have accurate information about your brand",
  },
  partial: {
    icon: AlertCircle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    label: "Partially Known",
    description: "AI has some information but it's incomplete or uncertain",
  },
  unknown: {
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    label: "Unknown",
    description: "AI assistants don't have specific information about your brand",
  },
  confused: {
    icon: HelpCircle,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    label: "Confused",
    description: "AI may confuse your brand with another entity",
  },
};

function getScoreColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

function getScoreGradient(score: number): string {
  if (score >= 70) return "from-emerald-500 to-emerald-400";
  if (score >= 40) return "from-amber-500 to-amber-400";
  return "from-red-500 to-red-400";
}

export function BrandCheckResultsClient() {
  const params = useParams();
  const router = useRouter();
  const { status: authStatus } = useSession();
  const [result, setResult] = useState<BrandCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/brand-check");
      return;
    }

    if (authStatus === "authenticated" && params.id) {
      fetchResult();
    }
  }, [authStatus, params.id]);

  const fetchResult = async () => {
    try {
      const response = await fetch(`/api/brand-check/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load results");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load results");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const shareText = `I checked my brand "${result?.brandName}" on Aioli AI Brand Visibility Check and got a score of ${result?.score}/100! Check yours at`;
    const shareUrl = "https://aioli.tools/brand-check";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Brand Visibility Check",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading || authStatus === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="pt-32 px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="glass-card p-8">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h1 className="text-xl font-medium mb-2">Failed to load results</h1>
              <p className="text-zinc-400 mb-6">{error || "Brand check not found"}</p>
              <Link
                href="/brand-check"
                className="btn-primary inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Try again
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[result.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/din-genererade-bild.jpg"
          alt=""
          fill
          className="object-cover mix-blend-overlay opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Header */}
        <section className="pt-32 pb-8 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                href="/brand-check"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                New check
              </Link>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2">
                    {result.brandName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                    {result.website && (
                      <a
                        href={result.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-white transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        {new URL(result.website).hostname}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {result.industry && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {result.industry}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 transition-colors text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Score Card */}
        <section className="pb-8 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Score */}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-48 h-48 -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(result.score / 100) * 553} 553`}
                      />
                      <defs>
                        <linearGradient
                          id="scoreGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            stopColor={
                              result.score >= 70
                                ? "#10b981"
                                : result.score >= 40
                                ? "#f59e0b"
                                : "#ef4444"
                            }
                          />
                          <stop
                            offset="100%"
                            stopColor={
                              result.score >= 70
                                ? "#34d399"
                                : result.score >= 40
                                ? "#fbbf24"
                                : "#f87171"
                            }
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-5xl font-light ${getScoreColor(result.score)}`}>
                        {result.score}
                      </span>
                      <span className="text-sm text-zinc-500">/ 100</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-zinc-400">AI Visibility Score</p>
                </div>

                {/* Status */}
                <div>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.bgColor} border ${statusInfo.borderColor} mb-4`}
                  >
                    <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                    <span className={statusInfo.color}>{statusInfo.label}</span>
                  </div>
                  <p className="text-zinc-300 mb-4">{statusInfo.description}</p>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {result.response}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Facts */}
        {result.keyFacts && result.keyFacts.length > 0 && (
          <section className="pb-8 px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-8"
              >
                <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  What AI Knows About You
                </h2>
                <ul className="space-y-3">
                  {result.keyFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-zinc-300">{fact}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </section>
        )}

        {/* Recommendations */}
        <section className="pb-24 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8"
            >
              <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                Recommendations to Improve AI Visibility
              </h2>
              <div className="space-y-4">
                {result.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <span className="text-amber-400 font-medium">{i + 1}</span>
                    </div>
                    <p className="text-zinc-300">{rec}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-8 text-center"
            >
              <h3 className="text-xl font-medium mb-3">Optimize your website for AI</h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Run an SEO analysis to see how well your website content is optimized for AI assistants.
              </p>
              <Link
                href="/"
                className="btn-primary inline-flex items-center gap-2"
              >
                Analyze Website
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Aioli"
                  width={100}
                  height={40}
                  className="h-8 w-auto opacity-60"
                />
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                AI Brand Visibility Check
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
