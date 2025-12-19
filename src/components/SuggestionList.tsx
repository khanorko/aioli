"use client";

import { Suggestion } from "@/types/analysis";

interface SuggestionListProps {
  suggestions: Suggestion[];
}

export function SuggestionList({ suggestions }: SuggestionListProps) {
  const getPriorityColor = (priority: Suggestion["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getCategoryIcon = (category: Suggestion["category"]) => {
    switch (category) {
      case "seo":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
      case "llm":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "content":
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

  return (
    <div className="space-y-6">
      {(["high", "medium", "low"] as const).map((priority) => {
        const items = groupedSuggestions[priority];
        if (items.length === 0) return null;

        return (
          <div key={priority}>
            <h4 className="text-sm font-semibold uppercase text-gray-500 mb-3">
              {priority === "high" && "Hög prioritet"}
              {priority === "medium" && "Medium prioritet"}
              {priority === "low" && "Låg prioritet"}
            </h4>
            <div className="space-y-3">
              {items.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getPriorityColor(suggestion.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-gray-600 mt-0.5">{getCategoryIcon(suggestion.category)}</div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{suggestion.title}</h5>
                      <p className="text-sm text-gray-700 mt-1">{suggestion.description}</p>
                      {suggestion.currentValue && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-500">Nuvarande:</span>{" "}
                          <code className="bg-gray-100 px-1 py-0.5 rounded text-red-700">
                            {suggestion.currentValue}
                          </code>
                        </div>
                      )}
                      {suggestion.suggestedValue && (
                        <div className="mt-1 text-sm">
                          <span className="text-gray-500">Förslag:</span>{" "}
                          <code className="bg-gray-100 px-1 py-0.5 rounded text-green-700">
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
