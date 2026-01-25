import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBrandCheck, isAdminEmail } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Get session
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  try {
    const brandCheck = await getBrandCheck(id);

    if (!brandCheck) {
      return NextResponse.json(
        { error: "Brand check not found" },
        { status: 404 }
      );
    }

    // Check ownership (unless admin)
    const isAdmin = isAdminEmail(session.user.email);
    if (!isAdmin && brandCheck.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to view this brand check" },
        { status: 403 }
      );
    }

    // Parse recommendations JSON
    let parsedRecommendations = { keyFacts: [], recommendations: [] };
    try {
      parsedRecommendations = JSON.parse(brandCheck.recommendations);
    } catch {
      // Use defaults
    }

    return NextResponse.json({
      id: brandCheck.id,
      brandName: brandCheck.brandName,
      website: brandCheck.website,
      industry: brandCheck.industry,
      status: brandCheck.status,
      score: brandCheck.overallScore,
      response: brandCheck.aiResponse,
      keyFacts: parsedRecommendations.keyFacts || [],
      recommendations: parsedRecommendations.recommendations || [],
      createdAt: brandCheck.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching brand check:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand check" },
      { status: 500 }
    );
  }
}
