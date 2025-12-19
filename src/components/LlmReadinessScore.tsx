"use client";

import { LlmReadinessResult } from "@/types/analysis";

interface LlmReadinessScoreProps {
  result: LlmReadinessResult;
}

export function LlmReadinessScore({ result }: LlmReadinessScoreProps) {
  const categories = [
    {
      name: "Strukturerad data",
      score: result.structuredData.score,
      details: result.structuredData.hasSchemaOrg
        ? `Schema.org: ${result.structuredData.types.join(", ") || "Ja"}`
        : "Ingen Schema.org markup hittad",
      issues: result.structuredData.issues,
    },
    {
      name: "Innehållets klarhet",
      score: result.contentClarity.score,
      details: `FAQ: ${result.contentClarity.hasFaq ? "Ja" : "Nej"}, Definitioner: ${result.contentClarity.hasDefinitions ? "Ja" : "Nej"}`,
      issues: result.contentClarity.issues,
    },
    {
      name: "Författarinfo (E-E-A-T)",
      score: result.authorInfo.score,
      details: `Författare: ${result.authorInfo.hasAuthor ? "Ja" : "Nej"}, Datum: ${result.authorInfo.hasDate ? "Ja" : "Nej"}`,
      issues: result.authorInfo.issues,
    },
    {
      name: "AI-crawler åtkomst",
      score: result.aiCrawlerAccess.score,
      details: `GPTBot: ${result.aiCrawlerAccess.allowsGptBot ? "Tillåten" : "Blockerad"}, Anthropic: ${result.aiCrawlerAccess.allowsAnthropicBot ? "Tillåten" : "Blockerad"}`,
      issues: result.aiCrawlerAccess.issues,
    },
    {
      name: "Citerbarhet",
      score: result.citability.score,
      details: `Statistik: ${result.citability.hasStatistics ? "Ja" : "Nej"}, Källor: ${result.citability.hasSources ? "Ja" : "Nej"}`,
      issues: result.citability.issues,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">{category.name}</span>
            <span className={`px-2 py-1 rounded text-white text-sm font-medium ${getScoreColor(category.score)}`}>
              {category.score}/100
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{category.details}</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(category.score)}`}
              style={{ width: `${category.score}%` }}
            />
          </div>
          {category.issues.length > 0 && (
            <ul className="mt-2 space-y-1">
              {category.issues.map((issue, i) => (
                <li key={i} className="text-sm text-red-600 flex items-start gap-1">
                  <span className="text-red-500">•</span>
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
