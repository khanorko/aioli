import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  createAnalysis,
  updateAnalysis,
  initDb,
  getUserById,
  consumeCredit,
  isAdminEmail,
  createSiteScan,
  updateSiteScan,
} from "@/lib/db";
import { scrapePage } from "@/lib/scraper";
import { analyzeSeo, calculateOverallSeoScore } from "@/lib/analyzers/seo";
import {
  analyzeLlmReadiness,
  calculateOverallLlmScore,
} from "@/lib/analyzers/llm-readiness";
import { generateSuggestions } from "@/lib/analyzers/suggestions";
import { AnalysisResults } from "@/types/analysis";
import { extractDomain } from "@/lib/sitemap";

// Ensure database is initialized
let dbInitialized = false;

async function analyzeUrl(
  url: string,
  userId: string,
  siteScanId?: string
): Promise<{
  id: string;
  seoScore: number;
  llmScore: number;
  status: string;
  error?: string;
}> {
  // Create initial analysis record
  const analysis = await createAnalysis(url, userId, siteScanId);

  try {
    // Scrape the page
    const page = await scrapePage(url);

    // Run SEO analysis
    const seoResult = await analyzeSeo(page);
    const seoScore = calculateOverallSeoScore(seoResult);

    // Run LLM readiness analysis
    const llmResult = await analyzeLlmReadiness(page);
    const llmScore = calculateOverallLlmScore(llmResult);

    // Create results object
    const results: AnalysisResults = {
      url: page.url,
      fetchedAt: new Date().toISOString(),
      seo: seoResult,
      llmReadiness: llmResult,
      overallSeoScore: seoScore,
      overallLlmScore: llmScore,
    };

    // Generate suggestions
    const suggestions = await generateSuggestions(results);

    // Update analysis with results
    await updateAnalysis(analysis.id, {
      seoScore,
      llmScore,
      results: JSON.stringify(results),
      suggestions: JSON.stringify({
        suggestions,
        generatedAt: new Date().toISOString(),
      }),
      status: "completed",
    });

    return {
      id: analysis.id,
      seoScore,
      llmScore,
      status: "completed",
    };
  } catch (error) {
    console.error("Analysis error for", url, ":", error);

    await updateAnalysis(analysis.id, {
      status: "failed",
      results: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    });

    return {
      id: analysis.id,
      seoScore: 0,
      llmScore: 0,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function POST(request: Request) {
  // Get session - require authentication
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be logged in to analyze" },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  const userEmail = session.user.email;

  // Parse request body
  let requestBody;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Support both single URL and multi-URL
  const { url, urls, scanType = "single" } = requestBody;

  // Determine URLs to analyze
  const urlsToAnalyze: string[] = urls || (url ? [url] : []);

  if (urlsToAnalyze.length === 0) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Limit to 10 URLs max
  const limitedUrls = urlsToAnalyze.slice(0, 10);
  const creditsNeeded = limitedUrls.length;

  try {
    // Initialize database on first request
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    // Get user
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check credits (admin bypasses)
    const isAdmin = isAdminEmail(userEmail);
    if (!isAdmin && user.credits < creditsNeeded) {
      return NextResponse.json(
        {
          error: "Not enough credits",
          needsCredits: true,
          creditsNeeded,
          creditsAvailable: user.credits,
        },
        { status: 402 }
      );
    }

    // Consume credits (one per page)
    if (!isAdmin) {
      for (let i = 0; i < creditsNeeded; i++) {
        const consumed = await consumeCredit(userId);
        if (!consumed) {
          return NextResponse.json(
            { error: "Could not use credits", needsCredits: true },
            { status: 402 }
          );
        }
      }
    }

    // Single page analysis
    if (scanType === "single" || limitedUrls.length === 1) {
      const result = await analyzeUrl(limitedUrls[0], userId);

      if (result.status === "failed") {
        return NextResponse.json(
          { error: "Failed to analyze URL", id: result.id },
          { status: 500 }
        );
      }

      return NextResponse.json({
        id: result.id,
        type: "single",
        status: "completed",
        seoScore: result.seoScore,
        llmScore: result.llmScore,
      });
    }

    // Multi-page site scan
    const domain = extractDomain(limitedUrls[0]);
    const siteScan = await createSiteScan(domain, userId, limitedUrls.length);

    // Analyze all pages
    const results: Array<{
      id: string;
      url: string;
      seoScore: number;
      llmScore: number;
      status: string;
    }> = [];

    let completedCount = 0;
    let totalSeoScore = 0;
    let totalLlmScore = 0;

    for (const pageUrl of limitedUrls) {
      const result = await analyzeUrl(pageUrl, userId, siteScan.id);
      results.push({
        id: result.id,
        url: pageUrl,
        seoScore: result.seoScore,
        llmScore: result.llmScore,
        status: result.status,
      });

      if (result.status === "completed") {
        completedCount++;
        totalSeoScore += result.seoScore;
        totalLlmScore += result.llmScore;
      }

      // Update site scan progress
      await updateSiteScan(siteScan.id, {
        completedPages: results.length,
      });
    }

    // Calculate averages and finalize site scan
    const avgSeoScore =
      completedCount > 0 ? Math.round(totalSeoScore / completedCount) : 0;
    const avgLlmScore =
      completedCount > 0 ? Math.round(totalLlmScore / completedCount) : 0;

    await updateSiteScan(siteScan.id, {
      completedPages: results.length,
      avgSeoScore,
      avgLlmScore,
      status: "completed",
    });

    return NextResponse.json({
      id: siteScan.id,
      type: "site",
      status: "completed",
      domain,
      totalPages: limitedUrls.length,
      completedPages: completedCount,
      avgSeoScore,
      avgLlmScore,
      analyses: results,
    });
  } catch (error) {
    console.error("Database error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Database error", details: errorMessage },
      { status: 500 }
    );
  }
}
