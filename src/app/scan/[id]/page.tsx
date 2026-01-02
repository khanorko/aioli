import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSiteScan, getSiteScanAnalyses, isAdminEmail } from "@/lib/db";
import { ScoreGauge } from "@/components/ScoreGauge";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getScoreColor(score: number | null): string {
  if (score === null) return "var(--text-muted)";
  if (score >= 80) return "var(--score-good)";
  if (score >= 60) return "var(--score-ok)";
  return "var(--score-poor)";
}

export default async function SiteScanPage({ params }: PageProps) {
  const { id } = await params;

  const [siteScan, session] = await Promise.all([
    getSiteScan(id),
    getServerSession(authOptions),
  ]);

  const isAdmin = isAdminEmail(session?.user?.email);

  if (!siteScan) {
    notFound();
  }

  const analyses = await getSiteScanAnalyses(id);

  if (siteScan.status === "processing") {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Aioli"
            width={80}
            height={80}
            className="mx-auto mb-6 animate-pulse"
          />
          <h1 className="section-title text-2xl mb-2">Analyzing site...</h1>
          <p style={{ color: "var(--text-muted)" }}>
            {siteScan.completedPages} of {siteScan.totalPages} pages completed
          </p>
          <div className="flex justify-center gap-2 mt-6">
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--text-secondary)", animationDelay: "0s" }}></span>
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--text-secondary)", animationDelay: "0.2s" }}></span>
            <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--text-secondary)", animationDelay: "0.4s" }}></span>
          </div>
        </div>
      </div>
    );
  }

  const completedAnalyses = analyses.filter((a) => a.status === "completed");
  const failedAnalyses = analyses.filter((a) => a.status === "failed");

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 link hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="Aioli"
                width={160}
                height={64}
                style={{ height: '48px', width: 'auto' }}
              />
              <span className="font-medium text-sm" style={{ color: "var(--text-secondary)" }}>
                ← Back
              </span>
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
          <h1 className="section-title text-3xl md:text-4xl mb-4">Site Analysis</h1>
          <p className="url-badge font-mono text-sm break-all px-4 py-2 inline-block">
            {siteScan.domain}
          </p>
          <p className="text-sm mt-3" style={{ color: "var(--text-muted)" }}>
            {siteScan.totalPages} pages analyzed • {new Date(siteScan.createdAt).toLocaleString("en-US")}
          </p>
        </div>

        {/* Average Scores Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          <div className="score-card p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  Average SEO
                </h2>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Average across {completedAnalyses.length} pages
                </p>
              </div>
              <ScoreGauge score={siteScan.avgSeoScore || 0} label="" />
            </div>
          </div>

          <div className="score-card p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  Average AI Visibility
                </h2>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Average across {completedAnalyses.length} pages
                </p>
              </div>
              <ScoreGauge score={siteScan.avgLlmScore || 0} label="" />
            </div>
          </div>
        </div>

        {/* Page-by-page Results */}
        <div className="card p-8 mb-14">
          <h2 className="text-xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
            Results by Page
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border-primary)" }}>
                  <th className="text-left py-3 px-4 font-medium text-sm" style={{ color: "var(--text-muted)" }}>
                    Page
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-sm" style={{ color: "var(--text-muted)" }}>
                    SEO
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-sm" style={{ color: "var(--text-muted)" }}>
                    AI
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-sm" style={{ color: "var(--text-muted)" }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((analysis) => {
                  let pathname = "/";
                  try {
                    pathname = new URL(analysis.url).pathname || "/";
                  } catch {
                    pathname = analysis.url;
                  }

                  return (
                    <tr
                      key={analysis.id}
                      className="border-b hover:bg-[var(--bg-secondary)] transition-colors"
                      style={{ borderColor: "var(--border-primary)" }}
                    >
                      <td className="py-4 px-4">
                        <Link
                          href={`/analysis/${analysis.id}`}
                          className="font-mono text-sm hover:underline"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {pathname}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {analysis.status === "completed" ? (
                          <span
                            className="font-semibold"
                            style={{ color: getScoreColor(analysis.seoScore) }}
                          >
                            {analysis.seoScore}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {analysis.status === "completed" ? (
                          <span
                            className="font-semibold"
                            style={{ color: getScoreColor(analysis.llmScore) }}
                          >
                            {analysis.llmScore}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {analysis.status === "completed" ? (
                          <Link
                            href={`/analysis/${analysis.id}`}
                            className="text-sm px-3 py-1 rounded-full"
                            style={{
                              background: "var(--plasma-blue)",
                              color: "white",
                            }}
                          >
                            View
                          </Link>
                        ) : (
                          <span
                            className="text-sm px-3 py-1 rounded-full"
                            style={{
                              background: "var(--score-poor)",
                              color: "white",
                            }}
                          >
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {failedAnalyses.length > 0 && (
            <p className="text-sm mt-4" style={{ color: "var(--text-muted)" }}>
              {failedAnalyses.length} pages could not be analyzed
            </p>
          )}
        </div>

        {/* Score Distribution */}
        {completedAnalyses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
            {/* SEO Distribution */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                SEO Score Distribution
              </h3>
              <div className="space-y-3">
                <ScoreDistributionBar
                  label="Good (80+)"
                  count={completedAnalyses.filter((a) => (a.seoScore || 0) >= 80).length}
                  total={completedAnalyses.length}
                  color="var(--score-good)"
                />
                <ScoreDistributionBar
                  label="OK (60-79)"
                  count={completedAnalyses.filter((a) => (a.seoScore || 0) >= 60 && (a.seoScore || 0) < 80).length}
                  total={completedAnalyses.length}
                  color="var(--score-ok)"
                />
                <ScoreDistributionBar
                  label="Needs Improvement (<60)"
                  count={completedAnalyses.filter((a) => (a.seoScore || 0) < 60).length}
                  total={completedAnalyses.length}
                  color="var(--score-poor)"
                />
              </div>
            </div>

            {/* AI Distribution */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                AI Visibility Distribution
              </h3>
              <div className="space-y-3">
                <ScoreDistributionBar
                  label="Good (80+)"
                  count={completedAnalyses.filter((a) => (a.llmScore || 0) >= 80).length}
                  total={completedAnalyses.length}
                  color="var(--score-good)"
                />
                <ScoreDistributionBar
                  label="OK (60-79)"
                  count={completedAnalyses.filter((a) => (a.llmScore || 0) >= 60 && (a.llmScore || 0) < 80).length}
                  total={completedAnalyses.length}
                  color="var(--score-ok)"
                />
                <ScoreDistributionBar
                  label="Needs Improvement (<60)"
                  count={completedAnalyses.filter((a) => (a.llmScore || 0) < 60).length}
                  total={completedAnalyses.length}
                  color="var(--score-poor)"
                />
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="card p-8 inline-block">
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Want to analyze another site?
            </h2>
            <p className="mb-5" style={{ color: "var(--text-muted)" }}>
              Test how your or your competitors&apos; sites perform.
            </p>
            <Link href="/" className="btn-primary px-8 py-3 inline-block text-lg">
              New analysis
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
              alt="Aioli"
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

function ScoreDistributionBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span style={{ color: "var(--text-muted)" }}>{count} pages</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}
