import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAnalysis, isAdminEmail } from "@/lib/db";
import { AnalysisResults, AnalysisSuggestions } from "@/types/analysis";
import { ScoreGauge } from "@/components/ScoreGauge";
import { AnalysisCard } from "@/components/AnalysisCard";
import { SeoChecklist } from "@/components/SeoChecklist";
import { LlmReadinessScore } from "@/components/LlmReadinessScore";
import { SuggestionList } from "@/components/SuggestionList";
import { PdfExportButton } from "@/components/PdfExportButton";
import { LockedContent } from "@/components/LockedContent";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalysisPage({ params }: PageProps) {
  const { id } = await params;

  const [analysis, session] = await Promise.all([
    getAnalysis(id),
    getServerSession(authOptions),
  ]);

  const isAdmin = isAdminEmail(session?.user?.email);

  if (!analysis) {
    notFound();
  }

  if (analysis.status === "processing") {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="AIoli"
            width={80}
            height={80}
            className="mx-auto mb-6 animate-pulse"
          />
          <h1 className="section-title text-2xl mb-2">Analyserar...</h1>
          <p style={{ color: "var(--text-muted)" }}>Vänta medan vi granskar din sajt</p>
          <div className="flex justify-center gap-2 mt-6">
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--text-secondary)", animationDelay: "0s" }}></span>
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--text-secondary)", animationDelay: "0.2s" }}></span>
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--text-secondary)", animationDelay: "0.4s" }}></span>
          </div>
        </div>
      </div>
    );
  }

  if (analysis.status === "failed") {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center max-w-md card p-8">
          <div className="icon-container icon-container-amber mx-auto mb-4" style={{ width: "56px", height: "56px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
          </div>
          <h1 className="section-title text-2xl mb-2">Analysen misslyckades</h1>
          <p style={{ color: "var(--text-muted)" }} className="mb-6">
            Vi kunde inte analysera den här sajten. Kontrollera adressen och försök igen.
          </p>
          <Link href="/" className="btn-primary px-6 py-3 inline-block">
            Försök igen
          </Link>
        </div>
      </div>
    );
  }

  const results: AnalysisResults = JSON.parse(analysis.results || "{}");
  const suggestionsData: AnalysisSuggestions = JSON.parse(analysis.suggestions || '{"suggestions":[]}');

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 link hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="AIoli"
                width={160}
                height={64}
                style={{ height: '48px', width: 'auto' }}
              />
              <span className="font-medium text-sm" style={{ color: "var(--text-secondary)" }}>← Ny analys</span>
            </Link>
            <span className="text-sm hidden sm:block" style={{ color: "var(--text-muted)" }}>
              SEO & AI Visibility Analysis
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-14 text-center">
          <h1 className="section-title text-3xl md:text-4xl mb-4">Analysresultat</h1>
          <p className="url-badge font-mono text-sm break-all px-4 py-2 inline-block">
            {analysis.url}
          </p>
          <p className="text-sm mt-3" style={{ color: "var(--text-muted)" }}>
            Analyserad: {new Date(analysis.createdAt).toLocaleString("sv-SE")}
          </p>
          <div className="mt-4">
            <PdfExportButton
              analysisData={{
                url: analysis.url,
                seoScore: analysis.seoScore,
                llmScore: analysis.llmScore,
                createdAt: analysis.createdAt.toISOString(),
                results: analysis.results,
              }}
              isUnlocked={analysis.unlocked || isAdmin}
            />
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div className="score-card p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  Traditionell SEO
                </h2>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Så ser sökmotorer på din sajt
                </p>
              </div>
              <ScoreGauge score={analysis.seoScore || 0} label="" />
            </div>
          </div>

          <div className="score-card p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  AI-synlighet
                </h2>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Så ser ChatGPT & Claude på din sajt
                </p>
              </div>
              <ScoreGauge score={analysis.llmScore || 0} label="" />
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          {/* SEO Details */}
          <AnalysisCard
            title="SEO-detaljer"
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
            title="AI-synlighet"
            description="Så uppfattar AI:n din sajt"
          >
            <LockedContent
              analysisId={analysis.id}
              isUnlocked={analysis.unlocked || isAdmin}
              title="AI-synlighetsdetaljer"
              featureCount={4}
            >
              {results.llmReadiness && <LlmReadinessScore result={results.llmReadiness} />}
            </LockedContent>
          </AnalysisCard>
        </div>

        {/* Suggestions */}
        {suggestionsData.suggestions.length > 0 && (
          <AnalysisCard
            title="Förbättringsförslag"
            description="Rekommendationer baserat på analysen"
          >
            <LockedContent
              analysisId={analysis.id}
              isUnlocked={analysis.unlocked || isAdmin}
              title="AI-genererade förslag"
              featureCount={suggestionsData.suggestions.length}
            >
              <SuggestionList suggestions={suggestionsData.suggestions} />
            </LockedContent>
          </AnalysisCard>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="card p-8 inline-block">
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Vill du analysera en annan sajt?
            </h2>
            <p className="mb-5" style={{ color: "var(--text-muted)" }}>
              Testa hur din eller dina konkurrenters sajter presterar.
            </p>
            <Link href="/" className="btn-primary px-8 py-3 inline-block text-lg">
              Ny analys
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Image
              src="/logo.png"
              alt="AIoli"
              width={160}
              height={64}
              style={{ height: '48px', width: 'auto' }}
            />
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            SEO & AI Visibility Analysis
          </p>
        </div>
      </footer>
    </div>
  );
}
