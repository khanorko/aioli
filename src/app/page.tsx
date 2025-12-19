"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardHeader,
  Title3,
  Body1,
  Caption1,
} from "@fluentui/react-components";
import {
  Search24Regular,
  BrainCircuit24Regular,
  Lightbulb24Regular,
} from "@fluentui/react-icons";
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt="AIoli"
            width={180}
            height={180}
            className="mb-4"
            priority
          />
          <Title3 className="mb-2" style={{ fontWeight: 400 }}>
            AI-stödd SEO-analys
          </Title3>
          <Body1 className="max-w-xl mb-12" style={{ color: "var(--colorNeutralForeground3)" }}>
            Analysera din webbplats för traditionell SEO och LLM-readiness.
            Se hur väl rustad din sajt är för både sökmotorer och AI-assistenter.
          </Body1>

          <UrlInput onSubmit={handleAnalyze} isLoading={isLoading} />

          {error && (
            <Caption1 className="mt-4" style={{ color: "var(--colorPaletteRedForeground1)" }}>
              {error}
            </Caption1>
          )}

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
            <Card className="p-6">
              <CardHeader
                image={
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Search24Regular style={{ color: "var(--colorBrandForeground1)" }} />
                  </div>
                }
                header={<Title3>Traditionell SEO</Title3>}
                description={
                  <Caption1>
                    Meta-taggar, rubriker, alt-texter, hastighet och tekniska aspekter.
                  </Caption1>
                }
              />
            </Card>

            <Card className="p-6">
              <CardHeader
                image={
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BrainCircuit24Regular style={{ color: "#8b5cf6" }} />
                  </div>
                }
                header={<Title3>LLM-readiness</Title3>}
                description={
                  <Caption1>
                    Schema.org, AI-crawler regler, citerbarhet och innehållsklarhet.
                  </Caption1>
                }
              />
            </Card>

            <Card className="p-6">
              <CardHeader
                image={
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Lightbulb24Regular style={{ color: "#22c55e" }} />
                  </div>
                }
                header={<Title3>AI-förslag</Title3>}
                description={
                  <Caption1>
                    Personliga förbättringsförslag genererade med AI (Groq/Ollama).
                  </Caption1>
                }
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
