"use client";

import { LlmReadinessResult } from "@/types/analysis";

interface LlmReadinessScoreProps {
  result: LlmReadinessResult;
}

export function LlmReadinessScore({ result }: LlmReadinessScoreProps) {
  const categories = [
    {
      name: "Strukturerad data",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
      score: result.structuredData.score,
      details: result.structuredData.hasSchemaOrg
        ? `Schema.org: ${result.structuredData.types.join(", ") || "Ja"}`
        : "Ingen Schema.org markup hittad",
      issues: result.structuredData.issues,
    },
    {
      name: "Innehållets klarhet",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      score: result.contentClarity.score,
      details: `FAQ: ${result.contentClarity.hasFaq ? "Ja" : "Nej"}, Definitioner: ${result.contentClarity.hasDefinitions ? "Ja" : "Nej"}`,
      issues: result.contentClarity.issues,
    },
    {
      name: "Författarinfo (E-E-A-T)",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      score: result.authorInfo.score,
      details: `Författare: ${result.authorInfo.hasAuthor ? "Ja" : "Nej"}, Datum: ${result.authorInfo.hasDate ? "Ja" : "Nej"}`,
      issues: result.authorInfo.issues,
    },
    {
      name: "AI-crawler åtkomst",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4H8"/>
          <rect width="16" height="12" x="4" y="8" rx="2"/>
          <path d="M2 14h2"/>
          <path d="M20 14h2"/>
          <path d="M15 13v2"/>
          <path d="M9 13v2"/>
        </svg>
      ),
      score: result.aiCrawlerAccess.score,
      details: `GPTBot: ${result.aiCrawlerAccess.allowsGptBot ? "Tillåten" : "Blockerad"}, Claude: ${result.aiCrawlerAccess.allowsAnthropicBot ? "Tillåten" : "Blockerad"}`,
      issues: result.aiCrawlerAccess.issues,
    },
    {
      name: "Citerbarhet",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z"/>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
        </svg>
      ),
      score: result.citability.score,
      details: `Statistik: ${result.citability.hasStatistics ? "Ja" : "Nej"}, Källor: ${result.citability.hasSources ? "Ja" : "Nej"}`,
      issues: result.citability.issues,
    },
  ];

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return "badge badge-great";
    if (score >= 60) return "badge badge-good";
    if (score >= 40) return "badge badge-okay";
    return "badge badge-poor";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "var(--score-great)";
    if (score >= 60) return "var(--score-good)";
    if (score >= 40) return "var(--score-okay)";
    return "var(--score-poor)";
  };

  return (
    <div className="space-y-3">
      {categories.map((category, index) => (
        <div
          key={index}
          className="rounded p-4"
          style={{ background: "var(--dark-surface)", border: "1px solid var(--dark-border)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
              {category.icon}
              <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{category.name}</span>
            </div>
            <span className={getScoreBadgeClass(category.score)}>
              {category.score}
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{category.details}</p>
          <div className="progress">
            <div
              className="progress-fill"
              style={{ width: `${category.score}%`, background: getProgressColor(category.score) }}
            />
          </div>
          {category.issues.length > 0 && (
            <ul className="mt-3 space-y-1">
              {category.issues.map((issue, i) => (
                <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--score-poor)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {issue}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
