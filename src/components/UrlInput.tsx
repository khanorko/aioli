"use client";

import { useState, useSyncExternalStore } from "react";

interface UrlInputProps {
  onSubmit: (url: string, email: string) => void;
  isLoading?: boolean;
  savedEmail?: string;
}

// Use useSyncExternalStore to safely read localStorage
function useStoredEmail() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => {
      if (typeof window === "undefined") return "";
      return localStorage.getItem("aioli_email") || "";
    },
    () => ""
  );
}

export function UrlInput({ onSubmit, isLoading = false, savedEmail = "" }: UrlInputProps) {
  const storedEmail = useStoredEmail();
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState(savedEmail || storedEmail);
  const [error, setError] = useState("");
  const [showEmailField, setShowEmailField] = useState(!storedEmail);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let processedUrl = url.trim();

    if (!processedUrl) {
      setError("Ange en webbadress");
      return;
    }

    if (!email.trim()) {
      setError("Ange din e-postadress för att fortsätta");
      setShowEmailField(true);
      return;
    }

    // Basic email validation
    if (!email.includes("@") || !email.includes(".")) {
      setError("Ogiltig e-postadress");
      return;
    }

    if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
      processedUrl = "https://" + processedUrl;
    }

    try {
      new URL(processedUrl);
      // Save email to localStorage
      localStorage.setItem("aioli_email", email);
      onSubmit(processedUrl, email);
    } catch {
      setError("Ogiltig webbadress");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-3">
        {showEmailField && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@email.se"
            disabled={isLoading}
            className="input px-5 py-4 text-lg font-medium"
          />
        )}
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            disabled={isLoading}
            className="input flex-1 px-5 py-4 text-lg font-medium"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary px-8 py-4 text-lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyserar...
              </span>
            ) : (
              "Analysera"
            )}
          </button>
        </div>
        {!showEmailField && email && (
          <button
            type="button"
            onClick={() => setShowEmailField(true)}
            className="text-xs text-left link"
            style={{ color: "var(--text-muted)" }}
          >
            Inloggad som {email}. Byt konto?
          </button>
        )}
        {error && (
          <p className="font-medium" style={{ color: "var(--score-poor)" }}>
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
