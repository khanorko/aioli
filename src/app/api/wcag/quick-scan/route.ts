import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getUserById,
  createWcagAudit,
  updateWcagAudit,
  initWcagAuditTable,
  isAdminEmail,
  consumeCredit,
} from "@/lib/db";
import { scrapePage } from "@/lib/scraper";
import { getCriteriaByLevelAndVersion } from "@/lib/wcag/criteria";
import { runAnalyzer, hasAnalyzer } from "@/lib/wcag/analyzers";
import { getWcagAnalysisPrompt, getAiAssistedPrompt } from "@/lib/wcag/prompts";
import type {
  WcagLevel,
  WcagVersion,
  WcagTestResult,
  WcagStatus,
  PourScores,
  WcagAuditSummary,
  WcagPrinciple,
} from "@/lib/wcag/types";

// Ensure table is initialized
let tableInitialized = false;

// Groq API for AI-assisted analysis
async function callGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

// Parse AI response to WcagTestResult
function parseAiResponse(response: string, criterionId: string): WcagTestResult {
  try {
    // Extract JSON from response (might have markdown code blocks)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      criterion: criterionId,
      status: parsed.status || "not-checked",
      confidence: parsed.confidence || 0.5,
      issues: parsed.issues || [],
      observations: parsed.observations || "",
      testedAt: new Date().toISOString(),
    };
  } catch {
    return {
      criterion: criterionId,
      status: "not-checked",
      confidence: 0,
      issues: [],
      observations: "Failed to parse AI response",
      testedAt: new Date().toISOString(),
    };
  }
}

// Calculate POUR scores from results
function calculatePourScores(
  results: Record<string, WcagTestResult>,
  level: WcagLevel,
  version: WcagVersion
): PourScores {
  const principles: Record<WcagPrinciple, { passed: number; total: number }> = {
    perceivable: { passed: 0, total: 0 },
    operable: { passed: 0, total: 0 },
    understandable: { passed: 0, total: 0 },
    robust: { passed: 0, total: 0 },
  };

  const criteria = getCriteriaByLevelAndVersion(level, version);

  for (const criterion of criteria) {
    const result = results[criterion.id];
    if (!result) continue;

    // Only count testable criteria (not needs-browser or needs-manual)
    if (result.status === "passed" || result.status === "failed" || result.status === "not-applicable") {
      principles[criterion.principle].total++;
      if (result.status === "passed" || result.status === "not-applicable") {
        principles[criterion.principle].passed++;
      }
    }
  }

  const calcPercent = (p: { passed: number; total: number }) =>
    p.total > 0 ? Math.round((p.passed / p.total) * 100) : 100;

  const scores: PourScores = {
    perceivable: calcPercent(principles.perceivable),
    operable: calcPercent(principles.operable),
    understandable: calcPercent(principles.understandable),
    robust: calcPercent(principles.robust),
    overall: 0,
  };

  // Calculate overall as weighted average
  const totalPassed = Object.values(principles).reduce((sum, p) => sum + p.passed, 0);
  const totalCriteria = Object.values(principles).reduce((sum, p) => sum + p.total, 0);
  scores.overall = totalCriteria > 0 ? Math.round((totalPassed / totalCriteria) * 100) : 100;

  return scores;
}

// Calculate summary from results
function calculateSummary(results: Record<string, WcagTestResult>): WcagAuditSummary {
  const summary: WcagAuditSummary = {
    total: Object.keys(results).length,
    passed: 0,
    failed: 0,
    needsBrowser: 0,
    needsManual: 0,
    notApplicable: 0,
  };

  for (const result of Object.values(results)) {
    switch (result.status) {
      case "passed":
        summary.passed++;
        break;
      case "failed":
        summary.failed++;
        break;
      case "needs-browser":
        summary.needsBrowser++;
        break;
      case "needs-manual":
        summary.needsManual++;
        break;
      case "not-applicable":
        summary.notApplicable++;
        break;
    }
  }

  return summary;
}

export async function POST(request: Request) {
  // Check for localhost dev mode
  const isLocalhost = request.headers.get("host")?.includes("localhost");
  const isDev = process.env.NODE_ENV === "development";

  let userId: string;
  let userEmail: string | null | undefined;
  let isDevBypass = false;

  if (isLocalhost && isDev) {
    // Dev mode: bypass auth with mock user
    userId = "dev-user-localhost";
    userEmail = "dev@localhost";
    isDevBypass = true;
  } else {
    // Production: require authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to run WCAG audits" },
        { status: 401 }
      );
    }

    userId = session.user.id;
    userEmail = session.user.email;
  }

  // Parse request
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url, level = "AA", version = "2.2" } = body;

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Validate level
  if (!["A", "AA", "AAA"].includes(level)) {
    return NextResponse.json({ error: "Invalid WCAG level" }, { status: 400 });
  }

  // Validate version
  if (!["2.1", "2.2"].includes(version)) {
    return NextResponse.json({ error: "Invalid WCAG version" }, { status: 400 });
  }

  try {
    // Initialize table on first request
    if (!tableInitialized) {
      await initWcagAuditTable();
      tableInitialized = true;
    }

    // Dev bypass: skip user lookup and credit check
    if (!isDevBypass) {
      // Get user and check credits
      const user = await getUserById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Check credits (1 credit for POUR scan) - admins bypass
      const isAdmin = isAdminEmail(userEmail);
      if (!isAdmin && user.credits < 1) {
        return NextResponse.json(
          { error: "Insufficient credits. Quick POUR scan costs 1 credit." },
          { status: 402 }
        );
      }
    }

    // Create audit record (skip in dev mode to avoid foreign key issues)
    let auditId: string;
    if (isDevBypass) {
      auditId = `dev-${Date.now()}`;
    } else {
      const audit = await createWcagAudit(url, userId, version as WcagVersion, level as WcagLevel);
      auditId = audit.id;
    }

    // Scrape page
    const page = await scrapePage(url);

    // Get criteria for requested level and version
    const criteria = getCriteriaByLevelAndVersion(level as WcagLevel, version as WcagVersion);

    // Run all analyzers
    const results: Record<string, WcagTestResult> = {};

    for (const criterion of criteria) {
      let result: WcagTestResult;

      if (criterion.testType === "automated" && hasAnalyzer(criterion.id)) {
        // Run automated analyzer
        result = runAnalyzer(criterion.id, page);
      } else if (criterion.testType === "ai-assisted") {
        // Run AI-assisted analysis
        try {
          const prompt = getAiAssistedPrompt(criterion.id, page.html) ||
            getWcagAnalysisPrompt(criterion, page.html);
          const aiResponse = await callGroq(prompt);
          result = parseAiResponse(aiResponse, criterion.id);
        } catch (error) {
          console.error(`AI analysis failed for ${criterion.id}:`, error);
          result = {
            criterion: criterion.id,
            status: "not-checked",
            confidence: 0,
            issues: [],
            observations: "AI analysis failed",
            testedAt: new Date().toISOString(),
          };
        }
      } else if (criterion.testType === "browser-required") {
        // Mark as needs browser testing
        result = {
          criterion: criterion.id,
          status: "needs-browser",
          confidence: 0,
          issues: [],
          observations: "Requires browser-based testing (computed styles, keyboard events)",
          testedAt: new Date().toISOString(),
        };
      } else {
        // Manual testing required
        result = {
          criterion: criterion.id,
          status: "needs-manual",
          confidence: 0,
          issues: [],
          observations: "Requires manual human testing",
          testedAt: new Date().toISOString(),
        };
      }

      results[criterion.id] = result;
    }

    // Calculate scores
    const pourScores = calculatePourScores(results, level as WcagLevel, version as WcagVersion);
    const summary = calculateSummary(results);

    // Update audit with results (skip in dev mode)
    if (!isDevBypass) {
      await updateWcagAudit(auditId, {
        pourScores,
        summary,
        results,
        status: "completed",
      });
    }

    // Deduct credit (unless admin or dev bypass)
    if (!isDevBypass) {
      const isAdmin = isAdminEmail(userEmail);
      if (!isAdmin) {
        await consumeCredit(userId);
      }
    }

    // Return results
    const responseData: Record<string, unknown> = {
      id: auditId,
      url,
      version,
      level,
      pourScores,
      summary,
      // Include top issues for quick view
      topIssues: Object.values(results)
        .filter((r) => r.status === "failed" && r.issues.length > 0)
        .flatMap((r) => r.issues)
        .sort((a, b) => {
          const severityOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
          return (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4);
        })
        .slice(0, 5),
      createdAt: new Date().toISOString(),
    };

    // In dev mode, include full results since they're not in DB
    if (isDevBypass) {
      responseData.results = results;
      responseData.status = "completed";
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("WCAG audit error:", error);
    return NextResponse.json(
      { error: "Failed to complete WCAG audit", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
