import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { discoverPages, extractDomain } from "@/lib/sitemap";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Discover pages (max 20 for discovery, user will choose how many to analyze)
    const result = await discoverPages(url, 20);

    return NextResponse.json({
      domain: extractDomain(url),
      pages: result.pages,
      totalFound: result.pages.length,
      source: result.source,
      error: result.error,
    });
  } catch (error) {
    console.error("Discover error:", error);
    return NextResponse.json(
      { error: "Failed to discover pages" },
      { status: 500 }
    );
  }
}
