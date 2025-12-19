"use client";

import { Suggestion } from "@/types/analysis";

interface SuggestionListProps {
  suggestions: Suggestion[];
}

export function SuggestionList({ suggestions }: SuggestionListProps) {
  const getPriorityClass = (priority: Suggestion["priority"]) => {
    switch (priority) {
      case "high":
        return "retro-suggestion-high";
      case "medium":
        return "retro-suggestion-medium";
      case "low":
        return "retro-suggestion-low";
    }
  };

  const getCategoryEmoji = (category: Suggestion["category"]) => {
    switch (category) {
      case "seo":
        return "🔍";
      case "llm":
        return "🤖";
      case "content":
        return "📝";
    }
  };

  const groupedSuggestions = suggestions.reduce(
    (acc, suggestion) => {
      acc[suggestion.priority].push(suggestion);
      return acc;
    },
    { high: [], medium: [], low: [] } as Record<Suggestion["priority"], Suggestion[]>
  );

  return (
    <div className="space-y-6">
      {(["high", "medium", "low"] as const).map((priority) => {
        const items = groupedSuggestions[priority];
        if (items.length === 0) return null;

        return (
          <div key={priority}>
            <h4 className="text-sm font-bold uppercase mb-3" style={{ color: "var(--teal-medium)" }}>
              {priority === "high" && "🔥 Hög prioritet"}
              {priority === "medium" && "⚡ Medium prioritet"}
              {priority === "low" && "💡 Tips"}
            </h4>
            <div className="space-y-3">
              {items.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${getPriorityClass(suggestion.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-0.5">{getCategoryEmoji(suggestion.category)}</div>
                    <div className="flex-1">
                      <h5 className="font-bold" style={{ color: "var(--teal-dark)" }}>{suggestion.title}</h5>
                      <p className="text-sm mt-1" style={{ color: "var(--teal-medium)" }}>{suggestion.description}</p>
                      {suggestion.currentValue && (
                        <div className="mt-3 text-sm">
                          <span style={{ color: "var(--teal-medium)" }}>Nuvarande:</span>{" "}
                          <code className="px-2 py-1 rounded font-mono text-xs" style={{ background: "var(--coral-light)", color: "var(--score-poor)" }}>
                            {suggestion.currentValue}
                          </code>
                        </div>
                      )}
                      {suggestion.suggestedValue && (
                        <div className="mt-2 text-sm">
                          <span style={{ color: "var(--teal-medium)" }}>Förslag:</span>{" "}
                          <code className="px-2 py-1 rounded font-mono text-xs" style={{ background: "#D1FAE5", color: "var(--score-great)" }}>
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
