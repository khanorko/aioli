"use client";

import { Suggestion } from "@/types/analysis";

interface SuggestionListProps {
  suggestions: Suggestion[];
}

export function SuggestionList({ suggestions }: SuggestionListProps) {
  const getPriorityClass = (priority: Suggestion["priority"]) => {
    switch (priority) {
      case "high":
        return "suggestion-high";
      case "medium":
        return "suggestion-medium";
      case "low":
        return "suggestion-low";
    }
  };

  const getCategoryIcon = (category: Suggestion["category"]) => {
    switch (category) {
      case "seo":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        );
      case "llm":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--score-great)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8"/>
            <rect width="16" height="12" x="4" y="8" rx="2"/>
            <path d="M2 14h2"/>
            <path d="M20 14h2"/>
            <path d="M15 13v2"/>
            <path d="M9 13v2"/>
          </svg>
        );
      case "content":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--score-good)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        );
    }
  };

  const groupedSuggestions = suggestions.reduce(
    (acc, suggestion) => {
      acc[suggestion.priority].push(suggestion);
      return acc;
    },
    { high: [], medium: [], low: [] } as Record<Suggestion["priority"], Suggestion[]>
  );

  const priorityLabels = {
    high: "High Priority",
    medium: "Medium Priority",
    low: "Improvement Tips"
  };

  return (
    <div className="space-y-6">
      {(["high", "medium", "low"] as const).map((priority) => {
        const items = groupedSuggestions[priority];
        if (items.length === 0) return null;

        return (
          <div key={priority}>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
              {priorityLabels[priority]}
            </h4>
            <div className="space-y-3">
              {items.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-4 ${getPriorityClass(suggestion.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getCategoryIcon(suggestion.category)}</div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{suggestion.title}</h5>
                      <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{suggestion.description}</p>
                      {suggestion.currentValue && (
                        <div className="mt-3 text-xs">
                          <span style={{ color: "var(--text-muted)" }}>Current:</span>{" "}
                          <code className="px-2 py-1 rounded font-mono text-xs" style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--score-poor)" }}>
                            {suggestion.currentValue}
                          </code>
                        </div>
                      )}
                      {suggestion.suggestedValue && (
                        <div className="mt-2 text-xs">
                          <span style={{ color: "var(--text-muted)" }}>Suggestion:</span>{" "}
                          <code className="px-2 py-1 rounded font-mono text-xs" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--score-great)" }}>
                            {suggestion.suggestedValue}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
