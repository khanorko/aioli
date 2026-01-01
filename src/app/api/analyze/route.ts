import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAnalysis, updateAnalysis, initDb, getUserById, canUserAnalyze, incrementAnalysisCount } from "@/lib/db";
import { scrapePage } from "@/lib/scraper";
import { analyzeSeo, calculateOverallSeoScore } from "@/lib/analyzers/seo";
import {
  analyzeLlmReadiness,
  calculateOverallLlmScore,
} from "@/lib/analyzers/llm-readiness";
import { generateSuggestions } from "@/lib/analyzers/suggestions";
import { AnalysisResults } from "@/types/analysis";

// Ensure database is initialized
let dbInitialized = false;

export async function POST(request: Request) {
  // Get session - require authentication
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Du måste vara inloggad för att analysera" },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  // Parse request body
  let requestBody;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url } = requestBody;

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // Initialize database on first request
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    // Check user limits
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Användare hittades inte" },
        { status: 404 }
      );
    }

    const { allowed, remaining } = await canUserAnalyze(userId);
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Analysgräns nådd",
          limitReached: true,
          remaining: 0,
          message: "Du har använt alla dina gratis analyser denna månad. Uppgradera till Pro för obegränsade analyser."
        },
        { status: 403 }
      );
    }

    // Create initial analysis record with userId
    const analysis = await createAnalysis(url, userId);

    // Run analysis
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
        suggestions: JSON.stringify({ suggestions, generatedAt: new Date().toISOString() }),
        status: "completed",
      });

      // Increment usage AFTER successful analysis
      await incrementAnalysisCount(userId);

      return NextResponse.json({
        id: analysis.id,
        status: "completed",
        seoScore,
        llmScore,
        remaining: remaining > 0 ? remaining - 1 : -1,
      });
    } catch (analysisError) {
      console.error("Analysis error:", analysisError);

      await updateAnalysis(analysis.id, {
        status: "failed",
        results: JSON.stringify({
          error: analysisError instanceof Error ? analysisError.message : "Unknown error",
        }),
      });

      return NextResponse.json(
        { error: "Failed to analyze URL", id: analysis.id },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Database error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Database error", details: errorMessage },
      { status: 500 }
    );
  }
}
