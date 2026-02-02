"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export function UrlInput({ onSubmit, isLoading = false }: UrlInputProps) {
  const { t } = useLanguage();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let processedUrl = url.trim();

    if (!processedUrl) {
      setError(t.urlInput.placeholder);
      return;
    }

    if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
      processedUrl = "https://" + processedUrl;
    }

    try {
      new URL(processedUrl);
      onSubmit(processedUrl);
    } catch {
      setError(t.urlInput.invalid);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            disabled={isLoading}
            aria-label="Enter website URL to analyze"
            className="input flex-1 px-5 py-4 text-lg font-medium"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary px-8 py-4 text-lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t.urlInput.analyzing}
              </span>
            ) : (
              t.urlInput.analyze
            )}
          </button>
        </div>
        {error && (
          <p className="font-medium" style={{ color: "var(--score-poor)" }}>
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
