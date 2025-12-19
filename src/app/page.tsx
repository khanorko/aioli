"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UrlInput } from "@/components/UrlInput";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Något gick fel");
      }

      router.push(`/analysis/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--coral-pink)" }}>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="AIoli"
            width={200}
            height={200}
            className="mb-6"
            priority
          />

          <h2 className="retro-title text-3xl md:text-4xl mb-3">
            AI-stödd SEO-analys
          </h2>

          <p className="max-w-xl mb-10 text-lg" style={{ color: "var(--teal-dark)" }}>
            Analysera din webbplats för traditionell SEO och LLM-readiness.
            Se hur väl rustad din sajt är för både sökmotorer och AI-assistenter.
          </p>

          <UrlInput onSubmit={handleAnalyze} isLoading={isLoading} />

          {error && (
            <p className="mt-4 font-bold" style={{ color: "#8B0000" }}>
              {error}
            </p>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
            {/* Card 1: Traditionell SEO */}
            <div className="retro-card p-6">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ background: "var(--coral-pink)" }}>
                <svg className="w-8 h-8" style={{ color: "var(--teal-dark)" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--teal-dark)" }}>
                Traditionell SEO
              </h3>
              <p className="text-sm" style={{ color: "var(--teal-dark)", opacity: 0.85 }}>
                Meta-taggar, rubriker, alt-texter, hastighet och tekniska aspekter.
              </p>
            </div>

            {/* Card 2: LLM-readiness */}
            <div className="retro-card p-6">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ background: "var(--coral-pink)" }}>
                <svg className="w-8 h-8" style={{ color: "var(--teal-dark)" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58s9.14-3.47 12.65 0L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--teal-dark)" }}>
                LLM-readiness
              </h3>
              <p className="text-sm" style={{ color: "var(--teal-dark)", opacity: 0.85 }}>
                Schema.org, AI-crawler regler, citerbarhet och innehållsklarhet.
              </p>
            </div>

            {/* Card 3: AI-förslag */}
            <div className="retro-card p-6">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-4" style={{ background: "var(--coral-pink)" }}>
                <svg className="w-8 h-8" style={{ color: "var(--teal-dark)" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--teal-dark)" }}>
                AI-förslag
              </h3>
              <p className="text-sm" style={{ color: "var(--teal-dark)", opacity: 0.85 }}>
                Personliga förbättringsförslag genererade med AI (Groq).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
