import { LlmReadinessResult } from "@/types/analysis";
import { ScrapedPage, fetchRobotsTxt, extractText, CheerioAPI } from "../scraper";

export async function analyzeLlmReadiness(
  page: ScrapedPage
): Promise<LlmReadinessResult> {
  const { $ } = page;

  const structuredData = analyzeStructuredData($);
  const contentClarity = analyzeContentClarity($);
  const authorInfo = analyzeAuthorInfo($);
  const aiCrawlerAccess = await analyzeAiCrawlerAccess(page.url);
  const citability = analyzeCitability($, page);

  return {
    structuredData,
    contentClarity,
    authorInfo,
    aiCrawlerAccess,
    citability,
  };
}

function analyzeStructuredData($: CheerioAPI): LlmReadinessResult["structuredData"] {
  const issues: string[] = [];
  const types: string[] = [];
  let hasSchemaOrg = false;

  // Check for JSON-LD
  $('script[type="application/ld+json"]').each((_, el) => {
    hasSchemaOrg = true;
    try {
      const content = $(el).html();
      if (content) {
        const data = JSON.parse(content);
        if (data["@type"]) {
          const schemaTypes = Array.isArray(data["@type"]) ? data["@type"] : [data["@type"]];
          types.push(...schemaTypes);
        }
      }
    } catch {
      // Invalid JSON-LD
    }
  });

  // Check for microdata
  const itemtypes = $("[itemtype]");
  if (itemtypes.length > 0) {
    hasSchemaOrg = true;
    itemtypes.each((_, el) => {
      const itemtype = $(el).attr("itemtype");
      if (itemtype) {
        const match = itemtype.match(/schema\.org\/(\w+)/);
        if (match && !types.includes(match[1])) {
          types.push(match[1]);
        }
      }
    });
  }

  let score = hasSchemaOrg ? 70 : 0;

  if (!hasSchemaOrg) {
    issues.push("Ingen Schema.org markup hittad (JSON-LD eller microdata)");
  } else {
    // Bonus for common useful types
    const usefulTypes = ["Article", "FAQPage", "HowTo", "Organization", "Person", "Product"];
    const hasUsefulType = types.some((t) => usefulTypes.includes(t));
    if (hasUsefulType) {
      score += 30;
    } else {
      issues.push("Överväg att lägga till Article, FAQPage eller annan relevant schema-typ");
    }
  }

  return { hasSchemaOrg, types, score: Math.min(100, score), issues };
}

function analyzeContentClarity($: CheerioAPI): LlmReadinessResult["contentClarity"] {
  const issues: string[] = [];

  // Check paragraph lengths
  const paragraphs: number[] = [];
  $("p").each((_, el) => {
    const text = $(el).text().trim();
    if (text.length > 0) {
      paragraphs.push(text.length);
    }
  });

  const avgParagraphLength =
    paragraphs.length > 0
      ? Math.round(paragraphs.reduce((a, b) => a + b, 0) / paragraphs.length)
      : 0;

  // Check for FAQ section
  const hasFaq =
    $('[itemtype*="FAQPage"]').length > 0 ||
    $("h2, h3").filter((_, el) => /faq|frågor|vanliga/i.test($(el).text())).length > 0 ||
    $("details").length > 0;

  // Check for definitions (using definition lists or specific patterns)
  const hasDefinitions =
    $("dl").length > 0 ||
    $("abbr[title]").length > 0 ||
    $("[role='definition']").length > 0;

  let score = 50;

  // Scoring based on paragraph length (ideal: 100-300 chars)
  if (avgParagraphLength > 0) {
    if (avgParagraphLength >= 100 && avgParagraphLength <= 300) {
      score += 20;
    } else if (avgParagraphLength > 500) {
      issues.push("Stycken är för långa i genomsnitt - dela upp för bättre läsbarhet");
      score -= 10;
    }
  } else {
    issues.push("Inga textstycken hittade");
    score -= 20;
  }

  if (hasFaq) {
    score += 20;
  } else {
    issues.push("Ingen FAQ-sektion hittad - överväg att lägga till vanliga frågor");
  }

  if (hasDefinitions) {
    score += 10;
  }

  return {
    avgParagraphLength,
    hasFaq,
    hasDefinitions,
    score: Math.max(0, Math.min(100, score)),
    issues,
  };
}

function analyzeAuthorInfo($: CheerioAPI): LlmReadinessResult["authorInfo"] {
  const issues: string[] = [];

  // Check for author
  const hasAuthor =
    $('meta[name="author"]').length > 0 ||
    $('[rel="author"]').length > 0 ||
    $('[itemprop="author"]').length > 0 ||
    $('[itemtype*="Person"]').length > 0;

  // Check for date
  const hasDate =
    $('meta[property="article:published_time"]').length > 0 ||
    $('[itemprop="datePublished"]').length > 0 ||
    $("time[datetime]").length > 0;

  // Check for last modified
  const hasLastModified =
    $('meta[property="article:modified_time"]').length > 0 ||
    $('[itemprop="dateModified"]').length > 0;

  let score = 30;

  if (hasAuthor) {
    score += 30;
  } else {
    issues.push("Ingen författarinformation hittad (viktigt för E-E-A-T)");
  }

  if (hasDate) {
    score += 25;
  } else {
    issues.push("Inget publiceringsdatum hittad");
  }

  if (hasLastModified) {
    score += 15;
  } else {
    issues.push("Inget senast uppdaterad-datum hittat");
  }

  return { hasAuthor, hasDate, hasLastModified, score: Math.min(100, score), issues };
}

async function analyzeAiCrawlerAccess(
  url: string
): Promise<LlmReadinessResult["aiCrawlerAccess"]> {
  const issues: string[] = [];
  const baseUrl = new URL(url).origin;
  const robotsTxt = await fetchRobotsTxt(baseUrl);

  let allowsGptBot = true;
  let allowsAnthropicBot = true;
  let allowsPerplexityBot = true;

  if (robotsTxt) {
    const checkBot = (botName: string): boolean => {
      for (const rule of robotsTxt.rules) {
        const ua = rule.userAgent.toLowerCase();
        if (ua === "*" || ua.includes(botName.toLowerCase())) {
          // Check if there's a disallow all
          if (rule.disallow.includes("/")) {
            return false;
          }
        }
      }
      return true;
    };

    allowsGptBot = checkBot("GPTBot");
    allowsAnthropicBot = checkBot("anthropic-ai") && checkBot("Claude-Web");
    allowsPerplexityBot = checkBot("PerplexityBot");
  }

  let score = 100;

  if (!allowsGptBot) {
    issues.push("GPTBot är blockerad i robots.txt");
    score -= 25;
  }
  if (!allowsAnthropicBot) {
    issues.push("Anthropic/Claude är blockerad i robots.txt");
    score -= 25;
  }
  if (!allowsPerplexityBot) {
    issues.push("PerplexityBot är blockerad i robots.txt");
    score -= 25;
  }

  if (score === 100 && robotsTxt === null) {
    issues.push("Ingen robots.txt - AI-crawlers har full åtkomst (standard)");
  }

  return {
    allowsGptBot,
    allowsAnthropicBot,
    allowsPerplexityBot,
    score: Math.max(0, score),
    issues,
  };
}

function analyzeCitability(
  $: CheerioAPI,
  page: ScrapedPage
): LlmReadinessResult["citability"] {
  const issues: string[] = [];
  const text = extractText($);

  // Check for quotes (blockquote or quotation marks)
  const hasQuotes = $("blockquote").length > 0 || /[""].*[""]/.test(text);

  // Check for statistics (numbers with context)
  const hasStatistics =
    /\d+\s*%/.test(text) || // Percentages
    /\d+\s*(million|miljon|billion|miljard)/i.test(text) || // Large numbers
    $("table").length > 0; // Data tables

  // Check for sources/citations
  const hasSources =
    $('a[rel="cite"]').length > 0 ||
    $("cite").length > 0 ||
    $("sup a").length > 0 || // Footnote style
    /källa|source|referens/i.test(text);

  let score = 30;

  if (hasQuotes) {
    score += 20;
  } else {
    issues.push("Inga citat hittade - överväg att lägga till citerbara uttalanden");
  }

  if (hasStatistics) {
    score += 30;
  } else {
    issues.push("Ingen statistik eller data hittad - siffror ökar trovärdigheten");
  }

  if (hasSources) {
    score += 20;
  } else {
    issues.push("Inga synliga källor - länka till primärkällor för högre trovärdighet");
  }

  return {
    hasQuotes,
    hasStatistics,
    hasSources,
    score: Math.min(100, score),
    issues,
  };
}

export function calculateOverallLlmScore(result: LlmReadinessResult): number {
  const weights = {
    structuredData: 0.25,
    contentClarity: 0.2,
    authorInfo: 0.2,
    aiCrawlerAccess: 0.2,
    citability: 0.15,
  };

  const weightedScore =
    result.structuredData.score * weights.structuredData +
    result.contentClarity.score * weights.contentClarity +
    result.authorInfo.score * weights.authorInfo +
    result.aiCrawlerAccess.score * weights.aiCrawlerAccess +
    result.citability.score * weights.citability;

  return Math.round(weightedScore);
}
