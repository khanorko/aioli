"use client";

import { forwardRef } from "react";

interface PrintViewProps {
  analysisData: {
    url: string;
    seoScore: number | null;
    llmScore: number | null;
    createdAt: string;
    results: string | null;
    suggestions?: string | null;
  };
  reportId: string;
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Acceptable";
  return "Needs Improvement";
}

// Use hex colors instead of Tailwind classes for PDF compatibility
// (html2pdf doesn't support lab() color function used by modern Tailwind)
function getScoreColor(score: number): string {
  if (score >= 80) return "#059669"; // emerald-600
  if (score >= 60) return "#D97706"; // amber-600
  if (score >= 40) return "#EA580C"; // orange-600
  return "#DC2626"; // red-600
}

export const PrintView = forwardRef<HTMLDivElement, PrintViewProps>(
  ({ analysisData, reportId }, ref) => {
    const results = JSON.parse(analysisData.results || "{}");
    const suggestions = analysisData.suggestions
      ? JSON.parse(analysisData.suggestions)
      : { suggestions: [] };

    const seoScore = analysisData.seoScore ?? 0;
    const llmScore = analysisData.llmScore ?? 0;
    const analysisDate = new Date(analysisData.createdAt);

    let domain = "";
    try {
      domain = new URL(analysisData.url).hostname;
    } catch {
      domain = analysisData.url;
    }

    return (
      <div
        ref={ref}
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "20mm 15mm",
          fontSize: "10pt",
          lineHeight: "1.5",
          backgroundColor: "#FFFFFF",
          color: "#111111",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* ============ PAGE 1: COVER & EXECUTIVE SUMMARY ============ */}
        <div className="print-page">
          {/* Header */}
          <header className="flex justify-between items-start mb-12 pb-6 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-3">
              {/* Logo - Text version for PDF compatibility */}
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#111111",
                  letterSpacing: "-0.02em",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                AIoli
              </span>
              <span className="text-xs text-[#666666] tracking-wide uppercase">
                Analysis Report
              </span>
            </div>
            <div className="text-right text-xs text-[#666666] font-mono">
              <div>Report ID: {reportId}</div>
              <div>{analysisDate.toLocaleDateString("en-US")}</div>
            </div>
          </header>

          {/* Report Title */}
          <div className="mb-16">
            <h1
              className="text-4xl font-semibold tracking-tight mb-4"
              style={{ letterSpacing: "-0.03em" }}
            >
              SEO & AI Visibility
              <br />
              Analysis Report
            </h1>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1.5 bg-[#F5F5F5] rounded font-mono text-sm">
                {domain}
              </span>
            </div>
          </div>

          {/* Executive Summary Scores */}
          <div className="grid grid-cols-2 gap-8 mb-16">
            {/* SEO Score Card */}
            <div className="border border-[#E5E5E5] rounded-lg p-8">
              <div className="text-xs uppercase tracking-widest text-[#888888] mb-2">
                Traditional SEO
              </div>
              <div className="flex items-end gap-3 mb-2">
                <span
                  className="text-6xl font-light tracking-tight"
                  style={{ fontFamily: "var(--font-geist-mono), monospace", color: getScoreColor(seoScore) }}
                >
                  {seoScore}
                </span>
                <span className="text-2xl text-[#AAAAAA] mb-2">/100</span>
              </div>
              <div className="text-sm text-[#666666]">
                {getScoreLabel(seoScore)}
              </div>
            </div>

            {/* AI Visibility Score Card */}
            <div className="border border-[#E5E5E5] rounded-lg p-8">
              <div className="text-xs uppercase tracking-widest text-[#888888] mb-2">
                AI Visibility
              </div>
              <div className="flex items-end gap-3 mb-2">
                <span
                  className="text-6xl font-light tracking-tight"
                  style={{ fontFamily: "var(--font-geist-mono), monospace", color: getScoreColor(llmScore) }}
                >
                  {llmScore}
                </span>
                <span className="text-2xl text-[#AAAAAA] mb-2">/100</span>
              </div>
              <div className="text-sm text-[#666666]">
                {getScoreLabel(llmScore)}
              </div>
            </div>
          </div>

          {/* Executive Summary Text */}
          <div className="mb-12">
            <h2 className="text-lg font-semibold mb-4 tracking-tight">
              Executive Summary
            </h2>
            <p className="text-[#444444] leading-relaxed">
              {seoScore >= 80 && llmScore >= 80
                ? `Your website demonstrates excellent optimization for both traditional search engines and AI assistants. The analysis shows strong technical foundation and content structure. Continue maintaining and regularly updating your content to preserve these high standards.`
                : seoScore >= 50 && llmScore >= 50
                  ? `Your website has a solid foundation but shows room for improvement in key areas. Focus on the priority recommendations in this report to enhance visibility in both search engines and AI assistants.`
                  : `Your website requires significant improvements to achieve optimal visibility. The analysis has identified critical areas that need attention. Prioritize the high-priority recommendations listed in this report.`}
            </p>
          </div>

          {/* Key Findings */}
          <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: "#666666" }}>
              Key Findings
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span style={{ color: results.seo?.title?.score >= 70 ? "#059669" : "#DC2626" }}>
                  {results.seo?.title?.score >= 70 ? "✓" : "✗"}
                </span>
                <span>
                  Title tag: {results.seo?.title?.score >= 70 ? "Properly configured" : "Needs improvement"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: results.seo?.description?.score >= 70 ? "#059669" : "#DC2626" }}>
                  {results.seo?.description?.score >= 70 ? "✓" : "✗"}
                </span>
                <span>
                  Meta description: {results.seo?.description?.score >= 70 ? "Present and optimized" : "Missing or too short"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: results.llmReadiness?.structuredData?.hasSchemaOrg ? "#059669" : "#DC2626" }}>
                  {results.llmReadiness?.structuredData?.hasSchemaOrg ? "✓" : "✗"}
                </span>
                <span>
                  Schema.org: {results.llmReadiness?.structuredData?.hasSchemaOrg ? "Implemented" : "Not found"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: (results.llmReadiness?.contentClarity?.score || 0) >= 70 ? "#059669" : "#D97706" }}>
                  {(results.llmReadiness?.contentClarity?.score || 0) >= 70 ? "✓" : "○"}
                </span>
                <span>
                  Content Clarity: Score {results.llmReadiness?.contentClarity?.score || 0}/100
                </span>
              </li>
            </ul>
          </div>

          {/* Page Footer - positioned at bottom of page */}
          <footer className="print-footer flex justify-between text-xs text-[#AAAAAA] font-mono">
            <span>Generated by AIoli Engine</span>
            <span>Page 1</span>
          </footer>
        </div>

        {/* ============ PAGE 2: SEO ANALYSIS ============ */}
        <div className="print-page page-break-before">
          <header className="flex justify-between items-center mb-8 pb-4 border-b border-[#E5E5E5]">
            <span className="text-sm font-medium" style={{ color: "#111111" }}>SEO Analysis</span>
            <span className="text-xs font-mono" style={{ color: "#888888" }}>{domain}</span>
          </header>

          <h2 className="text-2xl font-semibold tracking-tight mb-6" style={{ color: "#111111" }}>
            Search Engine Optimization
          </h2>

          <p className="text-[#666666] mb-8 text-sm">
            Traditional SEO ensures your website is discoverable by search engines like Google.
            Below is a detailed breakdown of the key factors analyzed.
          </p>

          {/* Meta Tags Section */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 pb-2 border-b border-[#E5E5E5]" style={{ color: "#666666" }}>
              Meta Tags
            </h3>

            <div className="space-y-4">
              {/* Title */}
              <div className="grid grid-cols-[120px_1fr] gap-4 items-start">
                <div className="text-sm font-medium">Title Tag</div>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: results.seo?.title?.score >= 70 ? "#059669" : "#DC2626" }}>
                    {results.seo?.title?.score >= 70 ? "✓ Pass" : "✗ Needs Attention"}
                  </div>
                  {results.seo?.title?.value && (
                    <div className="text-xs text-[#666666] font-mono bg-[#F5F5F5] p-2 rounded break-all">
                      "{results.seo.title.value}"
                    </div>
                  )}
                  <div className="text-xs text-[#888888] mt-1">
                    Optimal length: 50-60 characters
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-[120px_1fr] gap-4 items-start">
                <div className="text-sm font-medium">Meta Description</div>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: results.seo?.description?.score >= 70 ? "#059669" : "#DC2626" }}>
                    {results.seo?.description?.score >= 70 ? "✓ Pass" : "✗ Needs Attention"}
                  </div>
                  {results.seo?.description?.value && (
                    <div className="text-xs text-[#666666] font-mono bg-[#F5F5F5] p-2 rounded break-all">
                      "{results.seo.description.value.substring(0, 160)}
                      {results.seo.description.value.length > 160 ? "..." : ""}"
                    </div>
                  )}
                  <div className="text-xs text-[#888888] mt-1">
                    Optimal length: 150-160 characters
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Headings Section */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 pb-2 border-b border-[#E5E5E5]" style={{ color: "#666666" }}>
              Heading Structure
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: results.seo?.headings?.h1?.length === 1 ? "#059669" : "#DC2626" }}>
                    {results.seo?.headings?.h1?.length === 1 ? "✓" : "✗"}
                  </span>
                  <span className="text-sm font-medium">H1 Headings</span>
                </div>
                <div className="text-2xl font-mono font-light">
                  {results.seo?.headings?.h1?.length || 0}
                </div>
                <div className="text-xs text-[#888888]">Should be exactly 1</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: (results.seo?.headings?.h2?.length || 0) > 0 ? "#059669" : "#D97706" }}>
                    {(results.seo?.headings?.h2?.length || 0) > 0 ? "✓" : "○"}
                  </span>
                  <span className="text-sm font-medium">H2 Headings</span>
                </div>
                <div className="text-2xl font-mono font-light">
                  {results.seo?.headings?.h2?.length || 0}
                </div>
                <div className="text-xs text-[#888888]">For content structure</div>
              </div>
            </div>
          </section>

          {/* Images Section */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 pb-2 border-b border-[#E5E5E5]" style={{ color: "#666666" }}>
              Image Optimization
            </h3>

            <div className="flex items-center gap-8">
              <div>
                <div className="text-3xl font-mono font-light mb-1">
                  {results.seo?.images?.withAlt || 0}
                  <span className="text-lg text-[#AAAAAA]">/{results.seo?.images?.total || 0}</span>
                </div>
                <div className="text-xs text-[#888888]">Images with alt text</div>
              </div>
              <div className="text-sm" style={{ color: results.seo?.images?.withoutAlt === 0 ? "#059669" : "#DC2626" }}>
                {results.seo?.images?.withoutAlt === 0 ? "✓ All images have alt text" : `✗ ${results.seo?.images?.withoutAlt} images missing alt text`}
              </div>
            </div>
          </section>

          {/* Technical SEO */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 pb-2 border-b border-[#E5E5E5]" style={{ color: "#666666" }}>
              Technical SEO
            </h3>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {[
                { label: "HTTPS", value: results.seo?.technical?.https },
                { label: "Canonical URL", value: !!results.seo?.technical?.canonical },
                { label: "Viewport Meta", value: results.seo?.technical?.viewport },
                { label: "robots.txt", value: results.seo?.technical?.robotsTxt },
                { label: "sitemap.xml", value: results.seo?.technical?.sitemap },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#F0F0F0]">
                  <span className="text-[#666666]">{item.label}</span>
                  <span className="font-medium" style={{ color: item.value ? "#059669" : "#DC2626" }}>
                    {item.value ? "✓ Yes" : "✗ No"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <footer className="print-footer flex justify-between text-xs text-[#AAAAAA] font-mono">
            <span>Generated by AIoli Engine</span>
            <span>Page 2</span>
          </footer>
        </div>

        {/* ============ PAGE 3: AI VISIBILITY ============ */}
        <div className="print-page page-break-before">
          <header className="flex justify-between items-center mb-8 pb-4 border-b border-[#E5E5E5]">
            <span className="text-sm font-medium" style={{ color: "#111111" }}>AI Visibility Analysis</span>
            <span className="text-xs font-mono" style={{ color: "#888888" }}>{domain}</span>
          </header>

          <h2 className="text-2xl font-semibold tracking-tight mb-6" style={{ color: "#111111" }}>
            AI Assistant Optimization
          </h2>

          <p className="text-[#666666] mb-8 text-sm">
            AI assistants like ChatGPT and Claude are becoming increasingly important for how users
            discover information. This analysis shows how well your site is optimized to be cited
            and referenced by AI systems.
          </p>

          {/* Schema.org */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 pb-2 border-b border-[#E5E5E5]" style={{ color: "#666666" }}>
              Structured Data (Schema.org)
            </h3>

            <div className="flex items-start gap-4 mb-4">
              <div className="text-lg" style={{ color: results.llmReadiness?.structuredData?.hasSchemaOrg ? "#059669" : "#DC2626" }}>
                {results.llmReadiness?.structuredData?.hasSchemaOrg ? "✓" : "✗"}
              </div>
              <div>
                <div className="font-medium mb-1">
                  {results.llmReadiness?.structuredData?.hasSchemaOrg ? "Schema.org markup found" : "No Schema.org markup detected"}
                </div>
                <p className="text-xs text-[#888888]">
                  Schema.org helps AI systems understand your content structure, including business info,
                  products, reviews, and contact details.
                </p>
              </div>
            </div>

            {results.llmReadiness?.structuredData?.types?.length > 0 && (
              <div className="bg-[#F5F5F5] rounded p-3 text-xs font-mono">
                Detected types: {results.llmReadiness.structuredData.types.join(", ")}
              </div>
            )}
          </section>

          {/* Content Clarity */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 pb-2 border-b border-[#E5E5E5]" style={{ color: "#666666" }}>
              Content Clarity
            </h3>

            <div className="flex items-center gap-6 mb-4">
              <div>
                <div className="text-4xl font-mono font-light mb-1">
                  {results.llmReadiness?.contentClarity?.score || 0}
                  <span className="text-lg text-[#AAAAAA]">/100</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${results.llmReadiness?.contentClarity?.score || 0}%`,
                      backgroundColor: (results.llmReadiness?.contentClarity?.score || 0) >= 70 ? "#10B981" : (results.llmReadiness?.contentClarity?.score || 0) >= 40 ? "#F59E0B" : "#EF4444"
                    }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-[#888888]">
              Clear content with well-structured paragraphs, FAQ sections, and definitions
              helps AI systems extract and summarize information effectively.
            </p>
          </section>

          {/* Author Info (E-E-A-T) */}
          <section className="mb-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 pb-2 border-b border-[#E5E5E5]" style={{ color: "#666666" }}>
              Author Info (E-E-A-T)
            </h3>

            <div className="flex items-center gap-6 mb-4">
              <div>
                <div className="text-4xl font-mono font-light mb-1">
                  {results.llmReadiness?.authorInfo?.score || 0}
                  <span className="text-lg text-[#AAAAAA]">/100</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${results.llmReadiness?.authorInfo?.score || 0}%`,
                      backgroundColor: (results.llmReadiness?.authorInfo?.score || 0) >= 70 ? "#10B981" : (results.llmReadiness?.authorInfo?.score || 0) >= 40 ? "#F59E0B" : "#EF4444"
                    }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-[#888888]">
              Author information, publication dates, and expertise signals help establish
              credibility and trust with both AI systems and users.
            </p>
          </section>

          {/* Citability */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 pb-2 border-b border-[#E5E5E5]" style={{ color: "#666666" }}>
              Citability
            </h3>

            <div className="flex items-center gap-6 mb-4">
              <div>
                <div className="text-4xl font-mono font-light mb-1">
                  {results.llmReadiness?.citability?.score || 0}
                  <span className="text-lg text-[#AAAAAA]">/100</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${results.llmReadiness?.citability?.score || 0}%`,
                      backgroundColor: (results.llmReadiness?.citability?.score || 0) >= 70 ? "#10B981" : (results.llmReadiness?.citability?.score || 0) >= 40 ? "#F59E0B" : "#EF4444"
                    }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-[#888888]">
              Citable content includes quotes, statistics, and sources that AI can
              easily reference. Include specific numbers, data, and clear explanations.
            </p>
          </section>

          <footer className="print-footer flex justify-between text-xs text-[#AAAAAA] font-mono">
            <span>Generated by AIoli Engine</span>
            <span>Page 3</span>
          </footer>
        </div>

        {/* ============ PAGE 4: RECOMMENDATIONS ============ */}
        <div className="print-page page-break-before">
          <header className="flex justify-between items-center mb-8 pb-4 border-b border-[#E5E5E5]">
            <span className="text-sm font-medium" style={{ color: "#111111" }}>Recommendations</span>
            <span className="text-xs font-mono" style={{ color: "#888888" }}>{domain}</span>
          </header>

          <h2 className="text-2xl font-semibold tracking-tight mb-6" style={{ color: "#111111" }}>
            Priority Actions
          </h2>

          <p className="text-[#666666] mb-8 text-sm">
            Based on the analysis, here are the recommended actions to improve your visibility,
            ordered by priority.
          </p>

          {/* Suggestions List - Limited to 6 to fit on page */}
          <div className="space-y-5 mb-8">
            {(suggestions.suggestions?.length > 0
              ? suggestions.suggestions.slice(0, 6)
              : generateDefaultRecommendations(results, seoScore, llmScore).slice(0, 6)
            ).map((suggestion: { title: string; description: string; priority: string }, index: number) => (
              <div key={index} className="border-l-2 pl-4" style={{
                borderColor: suggestion.priority === "high" ? "#EF4444" : suggestion.priority === "medium" ? "#F59E0B" : "#10B981"
              }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold">
                    {index + 1}. {suggestion.title}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{
                      backgroundColor: suggestion.priority === "high" ? "#FEE2E2" : suggestion.priority === "medium" ? "#FEF3C7" : "#D1FAE5",
                      color: suggestion.priority === "high" ? "#B91C1C" : suggestion.priority === "medium" ? "#B45309" : "#047857"
                    }}
                  >
                    {suggestion.priority === "high" ? "High" : suggestion.priority === "medium" ? "Medium" : "Low"}
                  </span>
                </div>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {suggestion.description}
                </p>
              </div>
            ))}
          </div>

          {/* Next Steps */}
          <section className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: "#666666" }}>
              Next Steps
            </h3>
            <ol className="space-y-2 text-sm text-[#444444]">
              <li className="flex gap-3">
                <span className="font-mono text-[#888888]">1.</span>
                Start with high-priority items first
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[#888888]">2.</span>
                Implement changes and wait 1-2 weeks for indexing
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[#888888]">3.</span>
                Run a new analysis to measure improvement
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-[#888888]">4.</span>
                Continue iterating until target scores are reached
              </li>
            </ol>
          </section>

          {/* Final Footer */}
          <footer className="print-footer">
            <div className="border-t border-[#E5E5E5] pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-sm mb-1">AIoli</div>
                  <div className="text-xs text-[#888888]">SEO & AI Visibility Analysis</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#888888] font-mono">
                    Generated on {analysisDate.toLocaleDateString("en-US")}
                  </div>
                  <div className="text-xs text-[#AAAAAA] font-mono">
                    aioli-one.vercel.app
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right mt-2 text-xs text-[#AAAAAA] font-mono">
              Page 4
            </div>
          </footer>
        </div>
      </div>
    );
  }
);

PrintView.displayName = "PrintView";

// Helper function to generate default recommendations
function generateDefaultRecommendations(
  results: Record<string, unknown>,
  seoScore: number,
  llmScore: number
): { title: string; description: string; priority: string }[] {
  const recommendations: { title: string; description: string; priority: string }[] = [];

  const seo = results.seo as Record<string, unknown> | undefined;
  const llmReadiness = results.llmReadiness as Record<string, unknown> | undefined;

  const titleScore = (seo?.title as { score?: number } | undefined)?.score;
  if (titleScore !== undefined && titleScore < 70) {
    recommendations.push({
      title: "Optimize Title Tag",
      description: "Create a unique, descriptive title between 50-60 characters that includes your main keywords. The title should clearly communicate the page's purpose.",
      priority: "high",
    });
  }

  const descriptionScore = (seo?.description as { score?: number } | undefined)?.score;
  if (descriptionScore !== undefined && descriptionScore < 70) {
    recommendations.push({
      title: "Add Meta Description",
      description: "Write a compelling description of 150-160 characters that summarizes the page content and encourages clicks from search results.",
      priority: "high",
    });
  }

  const hasSchemaOrg = (llmReadiness?.structuredData as { hasSchemaOrg?: boolean } | undefined)?.hasSchemaOrg;
  if (!hasSchemaOrg) {
    recommendations.push({
      title: "Implement Schema.org Markup",
      description: "Add structured data to help search engines and AI systems better understand your content. Start with Organization, WebPage, or Article schemas.",
      priority: "medium",
    });
  }

  const citabilityScore = (llmReadiness?.citability as { score?: number } | undefined)?.score || 0;
  if (citabilityScore < 50) {
    recommendations.push({
      title: "Improve Content Citability",
      description: "Include specific facts, statistics, and clear sources that AI systems can easily cite. Structure information in digestible, quotable segments.",
      priority: "medium",
    });
  }

  const contentClarityScore = (llmReadiness?.contentClarity as { score?: number } | undefined)?.score || 0;
  if (contentClarityScore < 60) {
    recommendations.push({
      title: "Enhance Content Clarity",
      description: "Add FAQ sections, use clear definitions, and structure content with appropriate paragraph lengths for better AI understanding.",
      priority: "low",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Maintain Current Standards",
      description: "Your website is well-optimized. Continue regularly updating content and monitoring for any issues that may arise.",
      priority: "low",
    });
  }

  return recommendations;
}

export default PrintView;
