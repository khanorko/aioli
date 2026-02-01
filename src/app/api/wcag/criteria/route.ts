import { NextResponse } from "next/server";
import { WCAG_CRITERIA, getCriteriaByLevel, getCriteriaByPrinciple } from "@/lib/wcag/criteria";
import type { WcagLevel, WcagPrinciple } from "@/lib/wcag/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level") as WcagLevel | null;
  const principle = searchParams.get("principle") as WcagPrinciple | null;

  let criteria = WCAG_CRITERIA;

  // Filter by level if specified
  if (level && ["A", "AA", "AAA"].includes(level)) {
    criteria = getCriteriaByLevel(level);
  }

  // Filter by principle if specified
  if (principle && ["perceivable", "operable", "understandable", "robust"].includes(principle)) {
    criteria = getCriteriaByPrinciple(principle);

    // If both level and principle, apply both filters
    if (level) {
      const levelCriteria = getCriteriaByLevel(level);
      const levelIds = new Set(levelCriteria.map((c) => c.id));
      criteria = criteria.filter((c) => levelIds.has(c.id));
    }
  }

  return NextResponse.json({
    version: "2.2",
    total: criteria.length,
    criteria: criteria.map((c) => ({
      id: c.id,
      title: c.title,
      level: c.level,
      principle: c.principle,
      guideline: c.guideline,
      guidelineTitle: c.guidelineTitle,
      description: c.description,
      testType: c.testType,
      w3cUrl: c.w3cUrl,
    })),
  });
}
