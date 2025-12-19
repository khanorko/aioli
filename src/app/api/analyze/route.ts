import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapePage } from "@/lib/scraper";
import { analyzeSeo, calculateOverallSeoScore } from "@/lib/analyzers/seo";
import {
  analyzeLlmReadiness,
  calculateOverallLlmScore,
} from "@/lib/analyzers/llm-readiness";
import { generateSuggestions } from "@/lib/analyzers/suggestions";
import { AnalysisResults } from "@/types/analysis";

export async function POST(request: Request) {
  let requestBody;
  try {
    requestBody = await request.json();
  } catch (parseError) {
    console.error("JSON parse error:", parseError);
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url } = requestBody;

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // Create initial analysis record
    const analysis = await prisma.analysis.create({
      data: {
        url,
        status: "processing",
      },
    });

    // Run analysis in background (for now, synchronously)
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
      await prisma.analysis.update({
        where: { id: analysis.id },
        data: {
          seoScore,
          llmScore,
          results: JSON.stringify(results),
          suggestions: JSON.stringify({ suggestions, generatedAt: new Date().toISOString() }),
          status: "completed",
        },
      });

      return NextResponse.json({
        id: analysis.id,
        status: "completed",
        seoScore,
        llmScore,
      });
    } catch (analysisError) {
      console.error("Analysis error:", analysisError);

      await prisma.analysis.update({
        where: { id: analysis.id },
        data: {
          status: "failed",
          results: JSON.stringify({
            error: analysisError instanceof Error ? analysisError.message : "Unknown error",
          }),
        },
      });

      return NextResponse.json(
        { error: "Failed to analyze URL", id: analysis.id },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Database/Request error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Database error", details: errorMessage },
      { status: 500 }
    );
  }
}
