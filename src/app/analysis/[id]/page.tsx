import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AnalysisResults, AnalysisSuggestions } from "@/types/analysis";
import { ScoreGauge } from "@/components/ScoreGauge";
import { AnalysisCard } from "@/components/AnalysisCard";
import { SeoChecklist } from "@/components/SeoChecklist";
import { LlmReadinessScore } from "@/components/LlmReadinessScore";
import { SuggestionList } from "@/components/SuggestionList";
import Link from "next/link";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900">Analyserar...</h1>
          <p className="text-gray-600 mt-2">Detta kan ta några sekunder</p>
        </div>
      </div>
    );
  }

  if (analysis.status === "failed") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">!</div>
          <h1 className="text-xl font-semibold text-gray-900">Analysen misslyckades</h1>
          <p className="text-gray-600 mt-2">
            Vi kunde inte analysera denna URL. Kontrollera att adressen är korrekt och försök igen.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Försök igen
          </Link>
        </div>
      </div>
    );
  }

  const results: AnalysisResults = JSON.parse(analysis.results || "{}");
  const suggestionsData: AnalysisSuggestions = JSON.parse(analysis.suggestions || '{"suggestions":[]}');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            &larr; Ny analys
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Analysresultat</h1>
          <p className="text-gray-600 mt-1 break-all">{analysis.url}</p>
          <p className="text-sm text-gray-500 mt-1">
            Analyserad: {new Date(analysis.createdAt).toLocaleString("sv-SE")}
          </p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">SEO-poäng</h2>
                <p className="text-sm text-gray-500">Traditionell sökmotoroptimering</p>
              </div>
              <ScoreGauge score={analysis.seoScore || 0} label="" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">LLM-readiness</h2>
                <p className="text-sm text-gray-500">Synlighet för AI-assistenter</p>
              </div>
              <ScoreGauge score={analysis.llmScore || 0} label="" />
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* SEO Details */}
          <AnalysisCard
            title="SEO-analys"
            description="Tekniska och innehållsmässiga SEO-faktorer"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
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
            title="LLM-readiness"
            description="Hur väl förberedd för AI-assistenter"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          >
            {results.llmReadiness && <LlmReadinessScore result={results.llmReadiness} />}
          </AnalysisCard>
        </div>

        {/* Suggestions */}
        {suggestionsData.suggestions.length > 0 && (
          <AnalysisCard
            title="Förbättringsförslag"
            description="Prioriterade åtgärder för bättre synlighet"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          >
            <SuggestionList suggestions={suggestionsData.suggestions} />
          </AnalysisCard>
        )}
      </div>
    </div>
  );
}
