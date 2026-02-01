import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getWcagAudit, getUserWcagAudits, initWcagAuditTable } from "@/lib/db";
import { getCriterionById } from "@/lib/wcag/criteria";

// Ensure table is initialized
let tableInitialized = false;

export async function GET(request: Request) {
  // Check for localhost dev mode
  const isLocalhost = request.headers.get("host")?.includes("localhost");
  const isDev = process.env.NODE_ENV === "development";

  let userId: string;

  if (isLocalhost && isDev) {
    // Dev mode: bypass auth with mock user
    userId = "dev-user-localhost";
  } else {
    // Production: require authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to view WCAG audits" },
        { status: 401 }
      );
    }

    userId = session.user.id;
  }

  // Initialize table on first request
  if (!tableInitialized) {
    await initWcagAuditTable();
    tableInitialized = true;
  }

  const { searchParams } = new URL(request.url);
  const auditId = searchParams.get("id");

  // If ID provided, get specific audit
  if (auditId) {
    const audit = await getWcagAudit(auditId);

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    // Check ownership (skip in dev mode)
    if (!(isLocalhost && isDev) && audit.userId !== userId) {
      return NextResponse.json({ error: "Not authorized to view this audit" }, { status: 403 });
    }

    // Enrich results with criterion metadata
    const enrichedResults: Record<string, unknown> = {};
    for (const [criterionId, result] of Object.entries(audit.results)) {
      const criterion = getCriterionById(criterionId);
      enrichedResults[criterionId] = {
        ...result,
        title: criterion?.title || criterionId,
        level: criterion?.level,
        principle: criterion?.principle,
        guideline: criterion?.guideline,
        guidelineTitle: criterion?.guidelineTitle,
        testType: criterion?.testType,
        w3cUrl: criterion?.w3cUrl,
      };
    }

    return NextResponse.json({
      id: audit.id,
      url: audit.url,
      version: audit.version,
      level: audit.level,
      pourScores: audit.pourScores,
      summary: audit.summary,
      results: enrichedResults,
      status: audit.status,
      createdAt: audit.createdAt.toISOString(),
      updatedAt: audit.updatedAt.toISOString(),
    });
  }

  // Otherwise, return user's audit history
  const audits = await getUserWcagAudits(userId, 20);

  return NextResponse.json({
    total: audits.length,
    audits: audits.map((audit) => ({
      id: audit.id,
      url: audit.url,
      version: audit.version,
      level: audit.level,
      pourScores: audit.pourScores,
      summary: audit.summary,
      status: audit.status,
      createdAt: audit.createdAt.toISOString(),
    })),
  });
}
