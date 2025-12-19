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

          <h2 className="retro-title text-3xl md:text-5xl mb-4">
            Din sajt. AI:ns syn.
          </h2>

          <p className="max-w-xl mb-10 text-lg" style={{ color: "var(--teal-dark)" }}>
            Se hur <strong>Google</strong> OCH <strong>ChatGPT</strong> uppfattar din sajt.
            <br />
            <span className="text-sm opacity-80">Få konkreta förslag på hur du blir mer synlig.</span>
          </p>

          <UrlInput onSubmit={handleAnalyze} isLoading={isLoading} />

          {error && (
            <p className="mt-4 font-bold" style={{ color: "#8B0000" }}>
              {error}
            </p>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
            {/* Card 1: Traditionell SEO */}
            <div className="retro-card p-6 transition-transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--teal-dark)" }}>
                Klassisk SEO
              </h3>
              <p className="text-sm" style={{ color: "var(--teal-dark)", opacity: 0.85 }}>
                Meta-taggar, rubriker, alt-texter och teknisk optimering som Google älskar.
              </p>
            </div>

            {/* Card 2: LLM-readiness */}
            <div className="retro-card p-6 transition-transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--teal-dark)" }}>
                AI-synlighet
              </h3>
              <p className="text-sm" style={{ color: "var(--teal-dark)", opacity: 0.85 }}>
                Schema.org, citerbarhet och hur väl AI-assistenter förstår ditt innehåll.
              </p>
            </div>

            {/* Card 3: AI-förslag */}
            <div className="retro-card p-6 transition-transform hover:-translate-y-1">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--teal-dark)" }}>
                Smarta förslag
              </h3>
              <p className="text-sm" style={{ color: "var(--teal-dark)", opacity: 0.85 }}>
                Konkreta förbättringsförslag genererade av AI baserat på din sajt.
              </p>
            </div>
          </div>

          {/* Tagline */}
          <div className="mt-12 flex items-center gap-2">
            <span className="sparkle sparkle-small"></span>
            <span className="text-sm font-bold" style={{ color: "var(--teal-medium)" }}>
              SEO & AI-SEARCHABLE
            </span>
            <span className="sparkle sparkle-small"></span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="retro-footer py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image src="/logo.png" alt="AIoli" width={30} height={30} />
            <span className="font-bold">AIoli</span>
          </div>
          <p className="text-sm opacity-80">Gjord med kärlek för bättre synlighet</p>
          <div className="flex justify-center gap-2 mt-3">
            <span className="sparkle sparkle-small"></span>
            <span className="sparkle sparkle-small" style={{ background: "var(--turquoise)" }}></span>
            <span className="sparkle sparkle-small"></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
