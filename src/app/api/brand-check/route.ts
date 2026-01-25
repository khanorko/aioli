import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  createBrandCheck,
  updateBrandCheck,
  initDb,
  getUserById,
  consumeCredit,
  isAdminEmail,
} from "@/lib/db";
import { generateWithGroq, isGroqAvailable } from "@/lib/groq";

// Ensure database is initialized
let dbInitialized = false;

interface BrandCheckRequest {
  brandName: string;
  website?: string;
  industry?: string;
}

interface BrandAnalysis {
  status: 'known' | 'partial' | 'unknown' | 'confused';
  score: number;
  response: string;
  keyFacts: string[];
  recommendations: string[];
}

async function analyzeBrandWithAI(
  brandName: string,
  website?: string,
  industry?: string
): Promise<BrandAnalysis> {
  if (!isGroqAvailable()) {
    throw new Error("AI service not available");
  }

  const context = [
    website ? `Website: ${website}` : null,
    industry ? `Industry: ${industry}` : null,
  ].filter(Boolean).join(", ");

  const prompt = `You are an AI brand visibility analyst. Analyze how well-known the following brand/company is in AI knowledge bases.

Brand Name: ${brandName}
${context ? `Additional context: ${context}` : ''}

Tasks:
1. Describe what you know about this brand/company
2. Assess how well-known it is (known, partial, unknown, or confused with another entity)
3. List key facts you know about it (if any)
4. Provide recommendations to improve AI visibility

Respond in this exact JSON format:
{
  "status": "known|partial|unknown|confused",
  "description": "Your detailed response about what you know about this brand",
  "keyFacts": ["fact1", "fact2"],
  "recommendations": [
    "Create a Wikipedia article about your company",
    "Add Organization schema markup to your website",
    "Get mentioned in industry publications",
    "Complete your LinkedIn company page",
    "List in relevant business directories"
  ]
}

Status definitions:
- "known": You have accurate, detailed information about this brand
- "partial": You have some information but it's incomplete or uncertain
- "unknown": You don't have specific information about this brand
- "confused": The name matches multiple entities or you're unsure which one is meant

Be honest about your knowledge. If you don't know the brand, say so.
Respond ONLY with the JSON object.`;

  let response: string;

  try {
    response = await generateWithGroq(prompt);
  } catch (error) {
    console.error("Groq API error:", error);
    return {
      status: 'unknown' as const,
      score: 15,
      response: "Unable to check AI visibility at this time. Please try again later.",
      keyFacts: [],
      recommendations: getDefaultRecommendations(),
    };
  }

  try {
    // Parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Calculate score based on status
    const scoreMap: Record<string, number> = {
      known: 85,
      partial: 55,
      unknown: 15,
      confused: 35,
    };

    // Adjust score based on key facts
    let score = scoreMap[parsed.status] || 15;
    if (parsed.keyFacts && parsed.keyFacts.length > 0) {
      score = Math.min(100, score + parsed.keyFacts.length * 5);
    }

    return {
      status: parsed.status || 'unknown',
      score,
      response: parsed.description || "Unable to analyze brand visibility.",
      keyFacts: parsed.keyFacts || [],
      recommendations: parsed.recommendations || getDefaultRecommendations(),
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return {
      status: 'unknown',
      score: 15,
      response: response || "Unable to analyze brand visibility.",
      keyFacts: [],
      recommendations: getDefaultRecommendations(),
    };
  }
}

function getDefaultRecommendations(): string[] {
  return [
    "Create a Wikipedia article about your company to establish presence in AI knowledge bases",
    "Add Organization schema markup (JSON-LD) to your website",
    "Get mentioned in industry publications, news articles, and press releases",
    "Complete and optimize your LinkedIn company page",
    "List your company in relevant industry directories and business registries",
    "Ensure your website has clear, factual information about your company",
    "Build backlinks from authoritative sources in your industry",
  ];
}

export async function POST(request: Request) {
  // Get session - require authentication
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be logged in to check brand visibility" },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  const userEmail = session.user.email;

  // Parse request body
  let requestBody: BrandCheckRequest;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { brandName, website, industry } = requestBody;

  if (!brandName || brandName.trim().length === 0) {
    return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
  }

  try {
    // Initialize database on first request
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    // Get user and check credits (unless admin)
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has credits (admins bypass)
    const isAdmin = isAdminEmail(userEmail);
    if (!isAdmin) {
      if (user.credits < 1) {
        return NextResponse.json(
          { error: "Insufficient credits. Please purchase more credits to continue." },
          { status: 402 }
        );
      }

      // Consume credit
      const consumed = await consumeCredit(userId);
      if (!consumed) {
        return NextResponse.json(
          { error: "Failed to process credit" },
          { status: 500 }
        );
      }
    }

    // Create brand check record
    const brandCheck = await createBrandCheck(userId, brandName.trim(), website, industry);

    // Run AI analysis
    const analysis = await analyzeBrandWithAI(brandName.trim(), website, industry);

    // Update brand check with results
    await updateBrandCheck(brandCheck.id, {
      overallScore: analysis.score,
      status: analysis.status,
      aiResponse: analysis.response,
      recommendations: JSON.stringify({
        keyFacts: analysis.keyFacts,
        recommendations: analysis.recommendations,
      }),
    });

    return NextResponse.json({
      id: brandCheck.id,
      brandName: brandName.trim(),
      status: analysis.status,
      score: analysis.score,
      response: analysis.response,
      keyFacts: analysis.keyFacts,
      recommendations: analysis.recommendations,
      creditUsed: !isAdmin,
    });
  } catch (error) {
    console.error("Brand check error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to check brand visibility", details: errorMessage },
      { status: 500 }
    );
  }
}
