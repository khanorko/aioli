import { SeoResult } from "@/types/analysis";
import { ScrapedPage, fetchRobotsTxt, fetchSitemap, CheerioAPI } from "../scraper";

export async function analyzeSeo(page: ScrapedPage): Promise<SeoResult> {
  const { $, url, html } = page;

  const title = analyzeTitle($);
  const description = analyzeDescription($);
  const headings = analyzeHeadings($);
  const images = analyzeImages($);
  const links = analyzeLinks($, url);
  const technical = await analyzeTechnical($, page);
  const social = analyzeSocialMeta($);
  const content = analyzeContent($, html, title.value, headings.h1);
  const advanced = analyzeAdvanced($);

  return {
    title,
    description,
    headings,
    images,
    links,
    technical,
    social,
    content,
    advanced,
  };
}

function analyzeTitle($: CheerioAPI): SeoResult["title"] {
  const titleEl = $("title");
  const value = titleEl.text().trim() || null;
  const length = value?.length || 0;
  const issues: string[] = [];

  let score = 100;

  if (!value) {
    issues.push("No title tag found");
    score = 0;
  } else {
    if (length < 30) {
      issues.push("Title is too short (under 30 characters)");
      score -= 30;
    } else if (length > 60) {
      issues.push("Title is too long (over 60 characters)");
      score -= 20;
    }
  }

  return { value, length, score: Math.max(0, score), issues };
}

function analyzeDescription($: CheerioAPI): SeoResult["description"] {
  const descEl = $('meta[name="description"]');
  const value = descEl.attr("content")?.trim() || null;
  const length = value?.length || 0;
  const issues: string[] = [];

  let score = 100;

  if (!value) {
    issues.push("No meta description found");
    score = 0;
  } else {
    if (length < 70) {
      issues.push("Meta description is too short (under 70 characters)");
      score -= 30;
    } else if (length > 160) {
      issues.push("Meta description is too long (over 160 characters)");
      score -= 20;
    }
  }

  return { value, length, score: Math.max(0, score), issues };
}

function analyzeHeadings($: CheerioAPI): SeoResult["headings"] {
  const h1: string[] = [];
  const h2: string[] = [];
  const h3: string[] = [];
  const issues: string[] = [];

  $("h1").each((_, el) => h1.push($(el).text().trim()));
  $("h2").each((_, el) => h2.push($(el).text().trim()));
  $("h3").each((_, el) => h3.push($(el).text().trim()));

  let score = 100;

  if (h1.length === 0) {
    issues.push("No H1 heading found");
    score -= 40;
  } else if (h1.length > 1) {
    issues.push(`Multiple H1 headings found (${h1.length})`);
    score -= 20;
  }

  if (h2.length === 0) {
    issues.push("No H2 headings found");
    score -= 20;
  }

  return { h1, h2, h3, score: Math.max(0, score), issues };
}

function analyzeImages($: CheerioAPI): SeoResult["images"] {
  let total = 0;
  let withAlt = 0;
  let withoutAlt = 0;
  const issues: string[] = [];

  $("img").each((_, el) => {
    total++;
    const alt = $(el).attr("alt");
    if (alt && alt.trim().length > 0) {
      withAlt++;
    } else {
      withoutAlt++;
    }
  });

  let score = 100;

  if (total > 0 && withoutAlt > 0) {
    const percentage = Math.round((withoutAlt / total) * 100);
    issues.push(`${withoutAlt} of ${total} images missing alt text (${percentage}%)`);
    score -= Math.min(50, withoutAlt * 10);
  }

  return { total, withAlt, withoutAlt, score: Math.max(0, score), issues };
}

function analyzeLinks($: CheerioAPI, pageUrl: string): SeoResult["links"] {
  const baseUrl = new URL(pageUrl);
  let internal = 0;
  let external = 0;
  let nofollow = 0;
  let emptyAnchor = 0;
  const broken: string[] = [];
  const issues: string[] = [];

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    const rel = $(el).attr("rel") || "";
    const text = $(el).text().trim();

    if (!href) return;

    // Check for nofollow
    if (rel.includes("nofollow")) {
      nofollow++;
    }

    // Check for empty anchor text (excluding images)
    if (!text && !$(el).find("img").length) {
      emptyAnchor++;
    }

    try {
      const linkUrl = new URL(href, pageUrl);
      if (linkUrl.hostname === baseUrl.hostname) {
        internal++;
      } else {
        external++;
      }
    } catch {
      // Ignore invalid URLs
    }
  });

  let score = 100;

  if (emptyAnchor > 0) {
    issues.push(`${emptyAnchor} links with empty anchor text`);
    score -= Math.min(20, emptyAnchor * 5);
  }

  if (internal === 0) {
    issues.push("No internal links found");
    score -= 10;
  }

  return { internal, external, broken, nofollow, emptyAnchor, score: Math.max(0, score), issues };
}

async function analyzeTechnical(
  $: CheerioAPI,
  page: ScrapedPage
): Promise<SeoResult["technical"]> {
  const issues: string[] = [];
  let score = 100;

  // HTTPS
  const https = page.url.startsWith("https://");
  if (!https) {
    issues.push("Page is not using HTTPS");
    score -= 30;
  }

  // Canonical
  const canonicalEl = $('link[rel="canonical"]');
  const canonical = canonicalEl.attr("href") || null;
  if (!canonical) {
    issues.push("No canonical URL specified");
    score -= 10;
  }

  // Viewport
  const viewportEl = $('meta[name="viewport"]');
  const viewport = !!viewportEl.length;
  if (!viewport) {
    issues.push("No viewport meta tag (mobile optimization)");
    score -= 20;
  }

  // robots.txt
  const baseUrl = new URL(page.url).origin;
  const robotsTxt = await fetchRobotsTxt(baseUrl);
  const hasRobotsTxt = robotsTxt !== null;
  if (!hasRobotsTxt) {
    issues.push("No robots.txt found");
    score -= 10;
  }

  // sitemap
  const sitemap = await fetchSitemap(baseUrl);
  const hasSitemap = sitemap !== null;
  if (!hasSitemap) {
    issues.push("No sitemap.xml found");
    score -= 10;
  }

  return {
    https,
    canonical,
    viewport,
    robotsTxt: hasRobotsTxt,
    sitemap: hasSitemap,
    score: Math.max(0, score),
    issues,
  };
}

// New: Analyze social meta tags (Open Graph, Twitter Cards)
function analyzeSocialMeta($: CheerioAPI): SeoResult["social"] {
  const issues: string[] = [];
  let score = 100;

  // Open Graph
  const ogTitle = $('meta[property="og:title"]').attr("content") || null;
  const ogDescription = $('meta[property="og:description"]').attr("content") || null;
  const ogImage = $('meta[property="og:image"]').attr("content") || null;
  const ogType = $('meta[property="og:type"]').attr("content") || null;

  // Twitter Cards
  const twitterCard = $('meta[name="twitter:card"]').attr("content") || null;
  const twitterTitle = $('meta[name="twitter:title"]').attr("content") || null;
  const twitterDescription = $('meta[name="twitter:description"]').attr("content") || null;
  const twitterImage = $('meta[name="twitter:image"]').attr("content") || null;

  // Scoring
  if (!ogTitle) {
    issues.push("Missing og:title - needed for social sharing");
    score -= 20;
  }
  if (!ogDescription) {
    issues.push("Missing og:description");
    score -= 15;
  }
  if (!ogImage) {
    issues.push("Missing og:image - social shares won't have preview image");
    score -= 25;
  }
  if (!twitterCard) {
    issues.push("Missing twitter:card");
    score -= 10;
  }

  return {
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    score: Math.max(0, score),
    issues,
  };
}

// New: Analyze content quality
function analyzeContent(
  $: CheerioAPI,
  html: string,
  title: string | null,
  h1List: string[]
): SeoResult["content"] {
  const issues: string[] = [];
  let score = 100;

  // Get text content (remove scripts, styles, etc.)
  const bodyText = $("body").clone();
  bodyText.find("script, style, noscript").remove();
  const textContent = bodyText.text().replace(/\s+/g, " ").trim();

  // Word count
  const words = textContent.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Reading time (average 200 words per minute)
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  // Text to HTML ratio
  const textLength = textContent.length;
  const htmlLength = html.length;
  const textToHtmlRatio = htmlLength > 0 ? Math.round((textLength / htmlLength) * 100) : 0;

  // Check if main keyword appears in title and H1
  // Simple heuristic: use first significant word from title
  let hasKeywordInTitle = false;
  let hasKeywordInH1 = false;

  if (title && h1List.length > 0) {
    const titleLower = title.toLowerCase();
    const h1Lower = h1List[0].toLowerCase();
    // Check if they share significant words (3+ chars)
    const titleWords = titleLower.split(/\s+/).filter(w => w.length >= 3);
    hasKeywordInTitle = true; // Title always has its own keywords
    hasKeywordInH1 = titleWords.some(word => h1Lower.includes(word));
  }

  // Scoring
  if (wordCount < 300) {
    issues.push(`Thin content: only ${wordCount} words (aim for 300+)`);
    score -= 30;
  } else if (wordCount < 500) {
    issues.push(`Content could be longer: ${wordCount} words`);
    score -= 10;
  }

  if (textToHtmlRatio < 10) {
    issues.push(`Low text-to-HTML ratio (${textToHtmlRatio}%) - too much code, not enough content`);
    score -= 20;
  }

  if (h1List.length > 0 && !hasKeywordInH1) {
    issues.push("Title and H1 don't share keywords");
    score -= 10;
  }

  return {
    wordCount,
    readingTimeMinutes,
    textToHtmlRatio,
    hasKeywordInTitle,
    hasKeywordInH1,
    score: Math.max(0, score),
    issues,
  };
}

// New: Analyze advanced technical aspects
function analyzeAdvanced($: CheerioAPI): SeoResult["advanced"] {
  const issues: string[] = [];
  let score = 100;

  // Language
  const language = $("html").attr("lang") || null;
  if (!language) {
    issues.push("Missing lang attribute on <html>");
    score -= 15;
  }

  // Charset
  const charsetMeta = $('meta[charset]').attr("charset") ||
                      $('meta[http-equiv="Content-Type"]').attr("content")?.match(/charset=([^;]+)/)?.[1] ||
                      null;
  const charset = charsetMeta?.toLowerCase() || null;
  if (!charset) {
    issues.push("No charset declaration found");
    score -= 10;
  } else if (charset !== "utf-8") {
    issues.push(`Charset is ${charset}, consider using UTF-8`);
    score -= 5;
  }

  // Favicon
  const favicon = !!$('link[rel="icon"], link[rel="shortcut icon"]').length;
  if (!favicon) {
    issues.push("No favicon found");
    score -= 10;
  }

  // Apple Touch Icon
  const appleTouchIcon = !!$('link[rel="apple-touch-icon"]').length;
  if (!appleTouchIcon) {
    issues.push("No apple-touch-icon for iOS devices");
    score -= 5;
  }

  // Theme Color
  const themeColor = $('meta[name="theme-color"]').attr("content") || null;
  if (!themeColor) {
    issues.push("No theme-color meta tag");
    score -= 5;
  }

  // Meta Robots
  const metaRobots = $('meta[name="robots"]').attr("content") || null;

  return {
    language,
    charset,
    favicon,
    appleTouchIcon,
    themeColor,
    metaRobots,
    score: Math.max(0, score),
    issues,
  };
}

export function calculateOverallSeoScore(result: SeoResult): number {
  const weights = {
    title: 0.15,
    description: 0.12,
    headings: 0.12,
    images: 0.10,
    links: 0.08,
    technical: 0.18,
    social: 0.10,
    content: 0.10,
    advanced: 0.05,
  };

  const weightedScore =
    result.title.score * weights.title +
    result.description.score * weights.description +
    result.headings.score * weights.headings +
    result.images.score * weights.images +
    result.links.score * weights.links +
    result.technical.score * weights.technical +
    result.social.score * weights.social +
    result.content.score * weights.content +
    result.advanced.score * weights.advanced;

  return Math.round(weightedScore);
}
