"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Eye,
  Hand,
  Brain,
  Wrench,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

interface WcagIssue {
  element: string;
  description: string;
  severity: "critical" | "serious" | "moderate" | "minor";
  fix: string;
}

interface TestedElement {
  type: string;
  count: number;
  passed: number;
  details?: string[];
}

interface WcagTestResult {
  criterion: string;
  status: "passed" | "failed" | "not-applicable" | "not-checked" | "needs-browser" | "needs-manual";
  confidence: number;
  issues: WcagIssue[];
  testedElements?: TestedElement[];
  observations?: string;
  testedAt: string;
  title?: string;
  description?: string;
  fullText?: string;
  exceptions?: string[];
  level?: string;
  principle?: string;
  guideline?: string;
  guidelineTitle?: string;
  testType?: string;
  w3cUrl?: string;
}

interface PourScores {
  perceivable: number;
  operable: number;
  understandable: number;
  robust: number;
  overall: number;
}

interface WcagAuditSummary {
  total: number;
  passed: number;
  failed: number;
  needsBrowser: number;
  needsManual: number;
  notApplicable: number;
}

interface WcagAuditResult {
  id: string;
  url: string;
  version: string;
  level: string;
  pourScores: PourScores;
  summary: WcagAuditSummary;
  results: Record<string, WcagTestResult>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const pourConfig = {
  perceivable: {
    icon: Eye,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    gradientFrom: "from-purple-500",
    gradientTo: "to-purple-400",
  },
  operable: {
    icon: Hand,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-400",
  },
  understandable: {
    icon: Brain,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-emerald-400",
  },
  robust: {
    icon: Wrench,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    gradientFrom: "from-amber-500",
    gradientTo: "to-amber-400",
  },
};

const statusConfig = {
  passed: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    label: "Passed",
  },
  failed: {
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    label: "Failed",
  },
  "not-applicable": {
    icon: Info,
    color: "text-zinc-400",
    bgColor: "bg-zinc-500/10",
    label: "N/A",
  },
  "needs-browser": {
    icon: AlertTriangle,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    label: "Browser Test",
  },
  "needs-manual": {
    icon: AlertTriangle,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    label: "Manual Test",
  },
  "not-checked": {
    icon: Info,
    color: "text-zinc-500",
    bgColor: "bg-zinc-500/10",
    label: "Not Checked",
  },
};

const severityColors = {
  critical: "text-red-400 bg-red-500/10 border-red-500/30",
  serious: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  moderate: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  minor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
};

function PourScoreRing({
  score,
  label,
  icon: Icon,
  config,
}: {
  score: number;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  config: (typeof pourConfig)[keyof typeof pourConfig];
}) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={config.gradientFrom} stopColor="currentColor" />
              <stop offset="100%" className={config.gradientTo} stopColor="currentColor" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${config.color}`}>{score}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <Icon className={`w-4 h-4 ${config.color}`} strokeWidth={1.5} />
        <span className="text-sm text-zinc-300">{label}</span>
      </div>
    </div>
  );
}

// Test type display config
const testTypeConfig: Record<string, { label: string; color: string }> = {
  automated: { label: "Automated", color: "text-emerald-400" },
  "ai-assisted": { label: "AI Analysis", color: "text-purple-400" },
  "browser-required": { label: "Browser Test", color: "text-amber-400" },
  manual: { label: "Manual Test", color: "text-blue-400" },
};

function CriterionCard({
  criterion,
  result,
  isExpanded,
  onToggle,
}: {
  criterion: string;
  result: WcagTestResult;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const status = statusConfig[result.status] || statusConfig["not-checked"];
  const StatusIcon = status.icon;
  const testType = testTypeConfig[result.testType || "manual"];

  return (
    <div className={`rounded-xl border border-white/10 overflow-hidden ${status.bgColor}`}>
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-5 h-5 ${status.color}`} strokeWidth={1.5} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-zinc-400">{criterion}</span>
              {result.level && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-zinc-400">
                  Level {result.level}
                </span>
              )}
            </div>
            <div className="text-sm text-white font-medium">{result.title || criterion}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-zinc-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-white/5">
          {/* Description */}
          {(result.fullText || result.description) && (
            <div className="mt-4">
              <p className="text-sm text-zinc-300 leading-relaxed">
                {result.fullText || result.description}
              </p>
              {result.exceptions && result.exceptions.length > 0 && (
                <div className="mt-2 text-xs text-zinc-500">
                  <span className="font-medium">Exceptions: </span>
                  {result.exceptions.join(" • ")}
                </div>
              )}
            </div>
          )}

          {/* Test info */}
          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">Test:</span>
              <span className={testType.color}>{testType.label}</span>
            </div>
            {result.confidence > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500">Confidence:</span>
                <span className="text-zinc-300">{Math.round(result.confidence * 100)}%</span>
              </div>
            )}
          </div>

          {/* What was tested */}
          {result.testedElements && result.testedElements.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-zinc-400 mb-2">What was tested</h4>
              <div className="space-y-1">
                {result.testedElements.map((el, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {el.passed === el.count ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span className="text-zinc-300">
                      {el.count} {el.type} - {el.passed} passed
                      {el.count !== el.passed && `, ${el.count - el.passed} failed`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {result.issues && result.issues.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-zinc-400 mb-2">Issues Found ({result.issues.length})</h4>
              <div className="space-y-2">
                {result.issues.map((issue, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border ${severityColors[issue.severity]}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <code className="text-xs bg-black/30 px-1.5 py-0.5 rounded break-all">
                        {issue.element}
                      </code>
                      <span className="text-xs font-medium uppercase flex-shrink-0">{issue.severity}</span>
                    </div>
                    <p className="text-sm mb-2">{issue.description}</p>
                    <div className="text-xs text-zinc-400">
                      <strong>Fix:</strong> {issue.fix}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Observations */}
          {result.observations && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-zinc-400 mb-2">Observations</h4>
              <p className="text-sm text-zinc-300">{result.observations}</p>
            </div>
          )}

          {/* W3C Link */}
          {result.w3cUrl && (
            <div className="mt-4 pt-3 border-t border-white/5">
              <a
                href={result.w3cUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
              >
                W3C Understanding {criterion}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function WcagResultsClient() {
  const params = useParams();
  const router = useRouter();
  const { status: authStatus } = useSession();
  const [audit, setAudit] = useState<WcagAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCriteria, setExpandedCriteria] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPrinciple, setFilterPrinciple] = useState<string>("all");

  // Dev mode bypass for localhost - use state to avoid hydration mismatch
  const [isDevMode, setIsDevMode] = useState(false);
  const [devModeChecked, setDevModeChecked] = useState(false);

  useEffect(() => {
    const isLocalhost = window.location.hostname === "localhost";
    // Treat localhost as dev mode for easier testing
    setIsDevMode(isLocalhost);
    setDevModeChecked(true);
  }, []);

  useEffect(() => {
    // Wait until dev mode check is complete
    if (!devModeChecked) return;

    if (!isDevMode && authStatus === "unauthenticated") {
      router.push("/wcag");
      return;
    }

    if ((isDevMode || authStatus === "authenticated") && params.id) {
      fetchAudit();
    }
  }, [authStatus, params.id, router, isDevMode, devModeChecked]);

  const fetchAudit = async () => {
    try {
      // For dev mode audits, check sessionStorage first (not saved to DB)
      const auditId = params.id as string;
      if (auditId?.startsWith("dev-")) {
        const cached = sessionStorage.getItem(`wcag-audit-${auditId}`);
        if (cached) {
          const data = JSON.parse(cached);
          setAudit(data);
          // Auto-expand failed criteria
          const failed = Object.entries(data.results || {})
            .filter(([, r]) => (r as WcagTestResult).status === "failed")
            .map(([id]) => id);
          setExpandedCriteria(new Set(failed.slice(0, 5)));
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(`/api/wcag/audit?id=${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load audit");
      }

      setAudit(data);

      // Auto-expand failed criteria
      const failed = Object.entries(data.results)
        .filter(([, r]) => (r as WcagTestResult).status === "failed")
        .map(([id]) => id);
      setExpandedCriteria(new Set(failed.slice(0, 5)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audit");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCriterion = (id: string) => {
    setExpandedCriteria((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filter results
  const filteredResults = audit
    ? Object.entries(audit.results).filter(([, result]) => {
        if (filterStatus !== "all" && result.status !== filterStatus) return false;
        if (filterPrinciple !== "all" && result.principle !== filterPrinciple) return false;
        return true;
      })
    : [];

  // Group by guideline
  const groupedResults = filteredResults.reduce(
    (acc, [id, result]) => {
      const guideline = result.guideline || "other";
      if (!acc[guideline]) {
        acc[guideline] = {
          title: result.guidelineTitle || guideline,
          criteria: [],
        };
      }
      acc[guideline].criteria.push({ id, result });
      return acc;
    },
    {} as Record<string, { title: string; criteria: { id: string; result: WcagTestResult }[] }>
  );

  if (isLoading || (!isDevMode && authStatus === "loading")) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading audit results...</p>
        </div>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="pt-32 px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="glass-card p-8">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h1 className="text-xl font-medium mb-2">Failed to load audit</h1>
              <p className="text-zinc-400 mb-6">{error || "Audit not found"}</p>
              <Link
                href="/wcag"
                className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-xl"
                style={{
                  background: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
                }}
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
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Link
                href="/wcag"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Run another audit
              </Link>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-light tracking-tight mb-2">
                    WCAG {audit.version} Level {audit.level} Audit
                  </h1>
                  <p className="text-zinc-400 text-sm break-all">{audit.url}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      audit.pourScores.overall >= 80
                        ? "bg-emerald-500/20 text-emerald-400"
                        : audit.pourScores.overall >= 60
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {audit.pourScores.overall}% Overall
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* POUR Tabs - Clickable */}
        <section className="pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                POUR Principles
                <span className="text-xs text-zinc-500 font-normal ml-2">Click to filter</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { key: "perceivable", label: "Perceivable", icon: Eye, config: pourConfig.perceivable },
                  { key: "operable", label: "Operable", icon: Hand, config: pourConfig.operable },
                  { key: "understandable", label: "Understandable", icon: Brain, config: pourConfig.understandable },
                  { key: "robust", label: "Robust", icon: Wrench, config: pourConfig.robust },
                ].map(({ key, label, icon: Icon, config }) => {
                  const score = audit.pourScores[key as keyof PourScores];
                  const isSelected = filterPrinciple === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setFilterPrinciple(isSelected ? "all" : key)}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        isSelected
                          ? `${config.bgColor} ${config.borderColor} ring-2 ring-offset-2 ring-offset-[#0a0a0a] ${config.borderColor.replace('border-', 'ring-')}`
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${config.color}`} strokeWidth={1.5} />
                        <span className={`text-2xl font-bold ${config.color}`}>{score}%</span>
                      </div>
                      <div className="text-sm text-zinc-300">{label}</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Summary Stats */}
        <section className="pb-12 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
            >
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{audit.summary.passed}</div>
                <div className="text-xs text-zinc-400">Passed</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{audit.summary.failed}</div>
                <div className="text-xs text-zinc-400">Failed</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-amber-400">{audit.summary.needsBrowser}</div>
                <div className="text-xs text-zinc-400">Browser Test</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{audit.summary.needsManual}</div>
                <div className="text-xs text-zinc-400">Manual Test</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-zinc-400">{audit.summary.notApplicable}</div>
                <div className="text-xs text-zinc-400">N/A</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="pb-6 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white appearance-none cursor-pointer"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="failed">Failed</option>
                <option value="passed">Passed</option>
                <option value="needs-browser">Needs Browser</option>
                <option value="needs-manual">Needs Manual</option>
                <option value="not-applicable">N/A</option>
              </select>
              <select
                value={filterPrinciple}
                onChange={(e) => setFilterPrinciple(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white appearance-none cursor-pointer"
                aria-label="Filter by principle"
              >
                <option value="all">All Principles</option>
                <option value="perceivable">Perceivable</option>
                <option value="operable">Operable</option>
                <option value="understandable">Understandable</option>
                <option value="robust">Robust</option>
              </select>
            </div>
          </div>
        </section>

        {/* Results by Guideline */}
        <section className="pb-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              {Object.entries(groupedResults)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([guideline, { title, criteria }]) => (
                  <div key={guideline}>
                    <h3 className="text-sm font-medium text-zinc-400 mb-3">
                      {guideline} {title}
                    </h3>
                    <div className="space-y-2">
                      {criteria
                        .sort((a, b) => a.id.localeCompare(b.id))
                        .map(({ id, result }) => (
                          <CriterionCard
                            key={id}
                            criterion={id}
                            result={result}
                            isExpanded={expandedCriteria.has(id)}
                            onToggle={() => toggleCriterion(id)}
                          />
                        ))}
                    </div>
                  </div>
                ))}

              {filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <Info className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400">No criteria match your filters</p>
                </div>
              )}
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
              <h3 className="text-xl font-medium mb-3">Need help fixing issues?</h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Our AI-powered SEO analysis can help you improve your website overall.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Try SEO Analysis
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
              <p className="text-sm text-[var(--text-muted)]">WCAG 2.2 Accessibility Audit</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
