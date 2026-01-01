"use client";

import { useState } from "react";

interface PricingCardProps {
  plan: "free" | "pro";
  currentPlan?: "free" | "pro";
  email?: string;
}

export function PricingCard({ plan, currentPlan, email }: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const isFree = plan === "free";
  const isCurrentPlan = plan === currentPlan;

  const handleUpgrade = async () => {
    if (!email || isFree) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`card p-6 relative ${!isFree ? "ring-2 ring-[var(--plasma-blue)]" : ""}`}
    >
      {!isFree && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--plasma-blue)] text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          Populärast
        </div>
      )}

      <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
        {isFree ? "Free" : "Pro"}
      </h3>

      <div className="mb-4">
        <span className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
          {isFree ? "0" : "299"}
        </span>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {isFree ? " kr" : " kr/mån"}
        </span>
      </div>

      <ul className="space-y-3 mb-6">
        <li className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          {isFree ? "3 analyser per månad" : "Obegränsade analyser"}
        </li>
        <li className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          SEO-analys
        </li>
        <li className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          AI-synlighetsanalys
        </li>
        {!isFree && (
          <>
            <li className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <CheckIcon />
              PDF-export
            </li>
            <li className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <CheckIcon />
              Analyshistorik
            </li>
          </>
        )}
      </ul>

      {isFree ? (
        <div
          className="w-full py-3 rounded-xl text-center text-sm font-medium"
          style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}
        >
          {isCurrentPlan ? "Nuvarande plan" : "Gratis"}
        </div>
      ) : (
        <button
          onClick={handleUpgrade}
          disabled={isLoading || isCurrentPlan}
          className="btn-primary w-full py-3 disabled:opacity-50"
        >
          {isLoading ? "Laddar..." : isCurrentPlan ? "Nuvarande plan" : "Uppgradera"}
        </button>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-[var(--score-good)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
