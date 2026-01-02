"use client";

import { useState } from "react";

interface DiscoveredPages {
  domain: string;
  pages: string[];
  totalFound: number;
  source: "sitemap" | "crawl" | "single";
}

interface ScanSelectorProps {
  onAnalyze: (urls: string[], scanType: "single" | "site") => void;
  isLoading?: boolean;
  userCredits: number;
}

type Step = "input" | "selecting" | "analyzing";

export function ScanSelector({ onAnalyze, isLoading = false, userCredits }: ScanSelectorProps) {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [discovered, setDiscovered] = useState<DiscoveredPages | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [error, setError] = useState("");
  const [scanType, setScanType] = useState<"single" | "site">("single");

  const handleDiscover = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let processedUrl = url.trim();
    if (!processedUrl) {
      setError("Enter a web address");
      return;
    }

    if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
      processedUrl = "https://" + processedUrl;
    }

    try {
      new URL(processedUrl);
    } catch {
      setError("Invalid web address");
      return;
    }

    setIsDiscovering(true);

    try {
      const response = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: processedUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to discover pages");
      }

      setDiscovered(data);
      setStep("selecting");

      // Auto-select based on discovered pages
      if (data.totalFound > 1) {
        setScanType("site");
      } else {
        setScanType("single");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleStartAnalysis = () => {
    if (!discovered) return;

    const urlsToAnalyze = scanType === "single"
      ? [discovered.pages[0]]
      : discovered.pages.slice(0, 10);

    onAnalyze(urlsToAnalyze, scanType);
    setStep("analyzing");
  };

  const handleReset = () => {
    setStep("input");
    setDiscovered(null);
    setUrl("");
    setError("");
    setScanType("single");
  };

  const getCreditsNeeded = () => {
    if (!discovered) return 1;
    return scanType === "single" ? 1 : Math.min(discovered.pages.length, 10);
  };

  const creditsNeeded = getCreditsNeeded();
  const hasEnoughCredits = userCredits >= creditsNeeded;

  // Step 1: Enter URL - The Power Bar
  if (step === "input") {
    return (
      <form onSubmit={handleDiscover} className="w-full max-w-2xl">
        {/* The Power Bar */}
        <div className="relative group">
          {/* Glow effect behind */}
          <div
            className="absolute -inset-1 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-all duration-500"
            style={{
              background: "linear-gradient(90deg, rgba(245, 245, 240, 0.15), rgba(245, 245, 240, 0.08))",
            }}
          />

          {/* The capsule */}
          <div
            className="relative flex items-center rounded-full p-2 shadow-2xl border"
            style={{
              background: "rgba(10, 10, 10, 0.9)",
              borderColor: "rgba(255, 255, 255, 0.1)",
              boxShadow: "0 0 40px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Input */}
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              disabled={isDiscovering}
              className="flex-1 bg-transparent px-6 h-12 focus:outline-none font-mono text-sm"
              style={{
                color: "var(--text-primary)",
                lineHeight: "48px",
              }}
            />

            {/* Button inside capsule */}
            <button
              type="submit"
              disabled={isDiscovering}
              className="flex items-center justify-center gap-2 font-medium px-8 h-12 rounded-full transition-all hover:scale-105"
              style={{
                background: isDiscovering ? "rgba(255, 255, 255, 0.8)" : "var(--accent-cream)",
                color: "var(--bg-obsidian)",
                boxShadow: "0 0 30px -5px rgba(255, 255, 255, 0.5), 0 0 60px -10px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {isDiscovering ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <>Analyze</>
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-center font-medium mt-4" style={{ color: "var(--score-poor)" }}>
            {error}
          </p>
        )}
      </form>
    );
  }

  // Step 2: Select scan type
  if (step === "selecting" && discovered) {
    return (
      <div className="w-full max-w-2xl">
        <div className="card p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                {discovered.domain}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Found {discovered.totalFound} {discovered.totalFound === 1 ? "page" : "pages"} via {discovered.source}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-sm px-3 py-1 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              Change
            </button>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {/* Single page option */}
            <label
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                scanType === "single"
                  ? "border-[var(--plasma-blue)] bg-[var(--plasma-blue)]/5"
                  : "border-[var(--border-primary)] hover:border-[var(--border-secondary)]"
              }`}
            >
              <input
                type="radio"
                name="scanType"
                value="single"
                checked={scanType === "single"}
                onChange={() => setScanType("single")}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                scanType === "single" ? "border-[var(--plasma-blue)]" : "border-[var(--text-muted)]"
              }`}>
                {scanType === "single" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--plasma-blue)]" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                  Quick analysis
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Homepage only
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>1 credit</p>
              </div>
            </label>

            {/* Site scan option */}
            {discovered.totalFound > 1 && (
              <label
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  scanType === "site"
                    ? "border-[var(--plasma-blue)] bg-[var(--plasma-blue)]/5"
                    : "border-[var(--border-primary)] hover:border-[var(--border-secondary)]"
                }`}
              >
                <input
                  type="radio"
                  name="scanType"
                  value="site"
                  checked={scanType === "site"}
                  onChange={() => setScanType("site")}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  scanType === "site" ? "border-[var(--plasma-blue)]" : "border-[var(--text-muted)]"
                }`}>
                  {scanType === "site" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--plasma-blue)]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                      Site scan
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--plasma-blue)] text-white font-medium">
                      Recommended
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Analyze up to {Math.min(discovered.totalFound, 10)} pages
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {Math.min(discovered.totalFound, 10)} credits
                  </p>
                </div>
              </label>
            )}
          </div>

          {/* Pages preview for site scan */}
          {scanType === "site" && discovered.totalFound > 1 && (
            <div className="mb-6 p-4 rounded-xl bg-[var(--bg-secondary)]">
              <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>
                Pages to analyze:
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {discovered.pages.slice(0, 10).map((page, i) => (
                  <p key={i} className="text-xs font-mono truncate" style={{ color: "var(--text-secondary)" }}>
                    {new URL(page).pathname || "/"}
                  </p>
                ))}
              </div>
              {discovered.totalFound > 10 && (
                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                  +{discovered.totalFound - 10} more pages found
                </p>
              )}
            </div>
          )}

          {/* Credits warning */}
          {!hasEnoughCredits && (
            <div className="mb-4 p-3 rounded-lg bg-[var(--score-poor)]/10 border border-[var(--score-poor)]/20">
              <p className="text-sm" style={{ color: "var(--score-poor)" }}>
                You need {creditsNeeded} credits but only have {userCredits}.{" "}
                <a href="/#pricing" className="underline font-medium">
                  Buy more credits
                </a>
              </p>
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handleStartAnalysis}
            disabled={isLoading || !hasEnoughCredits}
            className="btn-primary w-full py-4 text-lg font-medium"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              <>
                Start analysis
                <span className="ml-2 opacity-75">({creditsNeeded} credits)</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Analyzing (shown while loading)
  return (
    <div className="w-full max-w-2xl">
      <div className="card p-8 text-center">
        <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-[var(--plasma-blue)]" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
          Analyzing your site...
        </p>
        <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
          This may take up to a minute
        </p>
      </div>
    </div>
  );
}
