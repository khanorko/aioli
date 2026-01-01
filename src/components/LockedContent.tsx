"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LockedContentProps {
  children: React.ReactNode;
  analysisId: string;
  isUnlocked: boolean;
  title?: string;
  featureCount?: number;
}

export function LockedContent({
  children,
  analysisId,
  isUnlocked,
  title = "Pro-innehåll",
  featureCount
}: LockedContentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (isUnlocked) {
    return <>{children}</>;
  }

  const handleUnlock = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analysis/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId }),
      });

      const data = await response.json();

      if (data.needsCredits) {
        // Redirect to buy credits
        router.push("/#priser");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Något gick fel");
      }

      // Refresh the page to show unlocked content
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-[2px] rounded-xl">
        <div className="text-center p-6 max-w-sm">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--plasma-blue)]/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[var(--plasma-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text-primary)" }}>
            {title}
          </h3>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            {featureCount
              ? `${featureCount} insikter tillgängliga`
              : "Lås upp för att se detaljerna"
            }
          </p>

          {error && (
            <p className="text-sm mb-3" style={{ color: "var(--score-poor)" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleUnlock}
            disabled={isLoading}
            className="btn-primary px-6 py-2 text-sm mb-2 w-full"
          >
            {isLoading ? "Låser upp..." : "Lås upp (1 credit)"}
          </button>

          <Link
            href="/#priser"
            className="text-xs block"
            style={{ color: "var(--text-muted)" }}
          >
            Inga credits? Köp här →
          </Link>
        </div>
      </div>
    </div>
  );
}
