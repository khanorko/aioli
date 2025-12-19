"use client";

import { LlmReadinessResult } from "@/types/analysis";

interface LlmReadinessScoreProps {
  result: LlmReadinessResult;
}

export function LlmReadinessScore({ result }: LlmReadinessScoreProps) {
  const categories = [
    {
      name: "📊 Strukturerad data",
      score: result.structuredData.score,
      details: result.structuredData.hasSchemaOrg
        ? `Schema.org: ${result.structuredData.types.join(", ") || "Ja"}`
        : "Ingen Schema.org markup hittad",
      issues: result.structuredData.issues,
    },
    {
      name: "📝 Innehållets klarhet",
      score: result.contentClarity.score,
      details: `FAQ: ${result.contentClarity.hasFaq ? "Ja" : "Nej"}, Definitioner: ${result.contentClarity.hasDefinitions ? "Ja" : "Nej"}`,
      issues: result.contentClarity.issues,
    },
    {
      name: "👤 Författarinfo (E-E-A-T)",
      score: result.authorInfo.score,
      details: `Författare: ${result.authorInfo.hasAuthor ? "Ja" : "Nej"}, Datum: ${result.authorInfo.hasDate ? "Ja" : "Nej"}`,
      issues: result.authorInfo.issues,
    },
    {
      name: "🤖 AI-crawler åtkomst",
      score: result.aiCrawlerAccess.score,
      details: `GPTBot: ${result.aiCrawlerAccess.allowsGptBot ? "✓" : "✗"}, Claude: ${result.aiCrawlerAccess.allowsAnthropicBot ? "✓" : "✗"}`,
      issues: result.aiCrawlerAccess.issues,
    },
    {
      name: "📚 Citerbarhet",
      score: result.citability.score,
      details: `Statistik: ${result.citability.hasStatistics ? "Ja" : "Nej"}, Källor: ${result.citability.hasSources ? "Ja" : "Nej"}`,
      issues: result.citability.issues,
    },
  ];

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return "retro-badge retro-badge-great";
    if (score >= 60) return "retro-badge retro-badge-good";
    if (score >= 40) return "retro-badge retro-badge-okay";
    return "retro-badge retro-badge-poor";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "var(--score-great)";
    if (score >= 60) return "var(--score-good)";
    if (score >= 40) return "var(--score-okay)";
    return "var(--score-poor)";
  };

  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <div
          key={index}
          className="rounded-lg p-4"
          style={{ background: "var(--cream)", border: "2px solid var(--teal-dark)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold" style={{ color: "var(--teal-dark)" }}>{category.name}</span>
            <span className={getScoreBadgeClass(category.score)}>
              {category.score}
            </span>
          </div>
          <p className="text-sm mb-3" style={{ color: "var(--teal-medium)" }}>{category.details}</p>
          <div className="retro-progress">
            <div
              className="retro-progress-fill"
              style={{ width: `${category.score}%`, background: getProgressColor(category.score) }}
            />
          </div>
          {category.issues.length > 0 && (
            <ul className="mt-3 space-y-1">
              {category.issues.map((issue, i) => (
                <li key={i} className="text-sm flex items-start gap-2" style={{ color: "var(--score-poor)" }}>
                  <span>⚠️</span>
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
