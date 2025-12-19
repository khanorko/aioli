import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AnalysisResults, AnalysisSuggestions } from "@/types/analysis";
import { ScoreGauge } from "@/components/ScoreGauge";
import { AnalysisCard } from "@/components/AnalysisCard";
import { SeoChecklist } from "@/components/SeoChecklist";
import { LlmReadinessScore } from "@/components/LlmReadinessScore";
import { SuggestionList } from "@/components/SuggestionList";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalysisPage({ params }: PageProps) {
  const { id } = await params;

  const analysis = await prisma.analysis.findUnique({
    where: { id },
  });

  if (!analysis) {
    notFound();
  }

  if (analysis.status === "processing") {
    return (
      <div className="min-h-screen circuit-bg flex items-center justify-center" style={{ background: "var(--coral-pink)" }}>
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="AIoli"
            width={120}
            height={120}
            className="mx-auto mb-6 retro-pulse"
          />
          <h1 className="retro-title text-2xl mb-2">Analyserar...</h1>
          <p style={{ color: "var(--teal-dark)" }}>Vänta medan vi granskar din sajt</p>
          <div className="flex justify-center gap-2 mt-4">
            <span className="sparkle sparkle-small" style={{ animationDelay: "0s" }}></span>
            <span className="sparkle sparkle-small" style={{ animationDelay: "0.2s" }}></span>
            <span className="sparkle sparkle-small" style={{ animationDelay: "0.4s" }}></span>
          </div>
        </div>
      </div>
    );
  }

  if (analysis.status === "failed") {
    return (
      <div className="min-h-screen circuit-bg flex items-center justify-center" style={{ background: "var(--coral-pink)" }}>
        <div className="text-center max-w-md retro-card p-8">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="retro-title text-2xl mb-2">Hoppsan!</h1>
          <p style={{ color: "var(--teal-dark)" }} className="mb-4">
            Vi kunde inte analysera den här sajten. Kontrollera adressen och försök igen.
          </p>
          <Link href="/" className="retro-button px-6 py-3 rounded-lg inline-block">
            ← Testa igen
          </Link>
        </div>
      </div>
    );
  }

  const results: AnalysisResults = JSON.parse(analysis.results || "{}");
  const suggestionsData: AnalysisSuggestions = JSON.parse(analysis.suggestions || '{"suggestions":[]}');

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return "🚀";
    if (score >= 60) return "👍";
    if (score >= 40) return "🤔";
    return "😬";
  };

  return (
    <div className="min-h-screen circuit-bg" style={{ background: "var(--coral-pink)" }}>
      {/* Header */}
      <div className="border-b-4" style={{ borderColor: "var(--teal-dark)", background: "var(--turquoise)" }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 retro-link">
              <Image src="/logo.png" alt="AIoli" width={50} height={50} />
              <span className="font-bold text-lg">← Ny analys</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="sparkle sparkle-small"></span>
              <span className="text-sm font-bold" style={{ color: "var(--teal-dark)" }}>
                SEO & AI-SEARCHABLE
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="retro-title text-3xl md:text-4xl mb-2">Analysresultat</h1>
          <p className="font-mono text-sm break-all px-4 py-2 rounded-lg inline-block"
             style={{ background: "var(--cream)", color: "var(--teal-dark)", border: "2px solid var(--teal-dark)" }}>
            {analysis.url}
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--teal-medium)" }}>
            Analyserad: {new Date(analysis.createdAt).toLocaleString("sv-SE")}
          </p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="retro-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--teal-dark)" }}>
                  {getScoreEmoji(analysis.seoScore || 0)} Klassisk SEO
                </h2>
                <p className="text-sm" style={{ color: "var(--teal-medium)" }}>
                  Så ser Google på din sajt
                </p>
              </div>
              <ScoreGauge score={analysis.seoScore || 0} label="" />
            </div>
          </div>

          <div className="retro-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold" style={{ color: "var(--teal-dark)" }}>
                  {getScoreEmoji(analysis.llmScore || 0)} AI-synlighet
                </h2>
                <p className="text-sm" style={{ color: "var(--teal-medium)" }}>
                  Så ser ChatGPT & Claude på din sajt
                </p>
              </div>
              <ScoreGauge score={analysis.llmScore || 0} label="" />
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* SEO Details */}
          <AnalysisCard
            title="🔍 SEO-detaljer"
            description="Vad sökmotorer tittar på"
          >
            <div className="space-y-4">
              <SeoChecklist
                title="Meta-taggar"
                items={[
                  {
                    label: "Title",
                    passed: results.seo?.title?.score >= 70,
                    value: results.seo?.title?.value || undefined,
                    issue: results.seo?.title?.issues?.[0],
                  },
                  {
                    label: "Meta description",
                    passed: results.seo?.description?.score >= 70,
                    value: results.seo?.description?.value || undefined,
                    issue: results.seo?.description?.issues?.[0],
                  },
                ]}
              />

              <SeoChecklist
                title="Rubriker"
                items={[
                  {
                    label: "H1-rubrik",
                    passed: results.seo?.headings?.h1?.length === 1,
                    value: results.seo?.headings?.h1?.[0],
                    issue: results.seo?.headings?.issues?.[0],
                  },
                  {
                    label: "H2-rubriker",
                    passed: (results.seo?.headings?.h2?.length || 0) > 0,
                    value: `${results.seo?.headings?.h2?.length || 0} st`,
                  },
                ]}
              />

              <SeoChecklist
                title="Bilder"
                items={[
                  {
                    label: "Alt-text",
                    passed: results.seo?.images?.withoutAlt === 0,
                    value: `${results.seo?.images?.withAlt || 0}/${results.seo?.images?.total || 0} med alt-text`,
                    issue: results.seo?.images?.issues?.[0],
                  },
                ]}
              />

              <SeoChecklist
                title="Tekniskt"
                items={[
                  { label: "HTTPS", passed: results.seo?.technical?.https ?? false },
                  { label: "Canonical URL", passed: !!results.seo?.technical?.canonical },
                  { label: "Viewport (mobil)", passed: results.seo?.technical?.viewport ?? false },
                  { label: "robots.txt", passed: results.seo?.technical?.robotsTxt ?? false },
                  { label: "sitemap.xml", passed: results.seo?.technical?.sitemap ?? false },
                ]}
              />
            </div>
          </AnalysisCard>

          {/* LLM Readiness Details */}
          <AnalysisCard
            title="🤖 AI-synlighet"
            description="Så uppfattar AI:n din sajt"
          >
            {results.llmReadiness && <LlmReadinessScore result={results.llmReadiness} />}
          </AnalysisCard>
        </div>

        {/* Suggestions */}
        {suggestionsData.suggestions.length > 0 && (
          <AnalysisCard
            title="💡 Förbättringsförslag"
            description="Så kan du bli ännu bättre"
          >
            <SuggestionList suggestions={suggestionsData.suggestions} />
          </AnalysisCard>
        )}

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="retro-card p-8 inline-block">
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--teal-dark)" }}>
              Vill du analysera en annan sajt?
            </h2>
            <p className="mb-4" style={{ color: "var(--teal-medium)" }}>
              AIoli är redo för nästa utmaning!
            </p>
            <Link href="/" className="retro-button px-8 py-3 rounded-lg inline-block text-lg">
              Kör ny analys →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="retro-footer py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Image src="/logo.png" alt="AIoli" width={30} height={30} />
            <span className="font-bold">AIoli</span>
          </div>
          <p className="text-sm opacity-80">SEO & AI-SEARCHABLE analys</p>
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
