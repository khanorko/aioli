import { SeoResult } from "@/types/analysis";
import { ScrapedPage, fetchRobotsTxt, fetchSitemap, CheerioAPI } from "../scraper";

export async function analyzeSeo(page: ScrapedPage): Promise<SeoResult> {
  const { $, url } = page;

  const title = analyzeTitle($);
  const description = analyzeDescription($);
  const headings = analyzeHeadings($);
  const images = analyzeImages($);
  const links = analyzeLinks($, url);
  const technical = await analyzeTechnical($, page);

  return {
    title,
    description,
    headings,
    images,
    links,
    technical,
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
  const broken: string[] = [];

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

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

  const score = 100; // Basic scoring, could be enhanced with broken link checking

  return { internal, external, broken, score };
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

export function calculateOverallSeoScore(result: SeoResult): number {
  const weights = {
    title: 0.2,
    description: 0.15,
    headings: 0.15,
    images: 0.15,
    links: 0.1,
    technical: 0.25,
  };

  const weightedScore =
    result.title.score * weights.title +
    result.description.score * weights.description +
    result.headings.score * weights.headings +
    result.images.score * weights.images +
    result.links.score * weights.links +
    result.technical.score * weights.technical;

  return Math.round(weightedScore);
}
