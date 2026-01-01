/**
 * Sitemap parser for discovering pages on a website
 */

interface SitemapResult {
  pages: string[];
  source: "sitemap" | "crawl" | "single";
  error?: string;
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  } catch {
    return url;
  }
}

/**
 * Normalize URL to ensure consistent format
 */
function normalizeUrl(url: string, baseUrl: string): string {
  try {
    // Handle relative URLs
    if (url.startsWith("/")) {
      const base = new URL(baseUrl);
      return `${base.protocol}//${base.host}${url}`;
    }
    // Handle absolute URLs
    const urlObj = new URL(url);
    return urlObj.href.replace(/\/$/, ""); // Remove trailing slash
  } catch {
    return url;
  }
}

/**
 * Check if URL belongs to the same domain
 */
function isSameDomain(url: string, baseUrl: string): boolean {
  try {
    const urlHost = new URL(url).host;
    const baseHost = new URL(baseUrl).host;
    return urlHost === baseHost;
  } catch {
    return false;
  }
}

/**
 * Filter and prioritize pages
 */
function filterAndPrioritizePages(pages: string[], baseUrl: string): string[] {
  const dominated = extractDomain(baseUrl);

  // Filter: same domain, no fragments, no query params (usually), html-like
  const filtered = pages.filter((url) => {
    if (!isSameDomain(url, baseUrl)) return false;
    if (url.includes("#")) return false;

    // Skip common non-content URLs
    const lower = url.toLowerCase();
    if (lower.includes("/wp-admin")) return false;
    if (lower.includes("/wp-content")) return false;
    if (lower.includes("/feed")) return false;
    if (lower.includes("/tag/")) return false;
    if (lower.includes("/author/")) return false;
    if (lower.match(/\.(pdf|jpg|jpeg|png|gif|svg|css|js|xml|json)$/)) return false;

    return true;
  });

  // Remove duplicates
  const unique = [...new Set(filtered.map(url => normalizeUrl(url, baseUrl)))];

  // Prioritize: homepage first, then by path depth
  return unique.sort((a, b) => {
    const aPath = new URL(a).pathname;
    const bPath = new URL(b).pathname;

    // Homepage first
    if (aPath === "/" || aPath === "") return -1;
    if (bPath === "/" || bPath === "") return 1;

    // Shorter paths (more important pages) first
    const aDepth = aPath.split("/").filter(Boolean).length;
    const bDepth = bPath.split("/").filter(Boolean).length;

    return aDepth - bDepth;
  });
}

/**
 * Parse sitemap XML content
 */
function parseSitemapXml(xml: string, baseUrl: string): string[] {
  const urls: string[] = [];

  // Match <loc> tags in sitemap
  const locRegex = /<loc>([^<]+)<\/loc>/gi;
  let match;

  while ((match = locRegex.exec(xml)) !== null) {
    const url = match[1].trim();
    if (url) {
      urls.push(url);
    }
  }

  // Also check for sitemap index (nested sitemaps)
  const sitemapRegex = /<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/sitemap>/gi;
  const nestedSitemaps: string[] = [];

  while ((match = sitemapRegex.exec(xml)) !== null) {
    nestedSitemaps.push(match[1].trim());
  }

  return urls;
}

/**
 * Fetch and parse sitemap.xml
 */
async function fetchSitemap(baseUrl: string): Promise<string[]> {
  const domain = extractDomain(baseUrl);
  const sitemapUrls = [
    `${domain}/sitemap.xml`,
    `${domain}/sitemap_index.xml`,
    `${domain}/sitemap-index.xml`,
  ];

  for (const sitemapUrl of sitemapUrls) {
    try {
      const response = await fetch(sitemapUrl, {
        headers: {
          "User-Agent": "AIoli-Bot/1.0 (SEO Analysis Tool)",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const xml = await response.text();
        const urls = parseSitemapXml(xml, baseUrl);
        if (urls.length > 0) {
          return urls;
        }
      }
    } catch {
      // Try next sitemap URL
      continue;
    }
  }

  return [];
}

/**
 * Simple crawl to find links on homepage
 */
async function crawlHomepage(baseUrl: string): Promise<string[]> {
  try {
    const response = await fetch(baseUrl, {
      headers: {
        "User-Agent": "AIoli-Bot/1.0 (SEO Analysis Tool)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return [];

    const html = await response.text();
    const urls: string[] = [baseUrl];

    // Extract href links
    const hrefRegex = /href=["']([^"']+)["']/gi;
    let match;

    while ((match = hrefRegex.exec(html)) !== null) {
      const href = match[1];
      if (href && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
        const normalizedUrl = normalizeUrl(href, baseUrl);
        if (isSameDomain(normalizedUrl, baseUrl)) {
          urls.push(normalizedUrl);
        }
      }
    }

    return urls;
  } catch {
    return [baseUrl];
  }
}

/**
 * Main function to discover pages on a website
 */
export async function discoverPages(url: string, maxPages: number = 10): Promise<SitemapResult> {
  const baseUrl = url.startsWith("http") ? url : `https://${url}`;

  try {
    // Try sitemap first
    let pages = await fetchSitemap(baseUrl);
    let source: "sitemap" | "crawl" | "single" = "sitemap";

    // Fallback to crawling if no sitemap
    if (pages.length === 0) {
      pages = await crawlHomepage(baseUrl);
      source = pages.length > 1 ? "crawl" : "single";
    }

    // Filter and prioritize
    const filteredPages = filterAndPrioritizePages(pages, baseUrl);

    // Ensure homepage is included
    const domain = extractDomain(baseUrl);
    if (!filteredPages.some(p => new URL(p).pathname === "/" || new URL(p).pathname === "")) {
      filteredPages.unshift(domain);
    }

    // Limit to maxPages
    const limitedPages = filteredPages.slice(0, maxPages);

    return {
      pages: limitedPages,
      source,
    };
  } catch (error) {
    return {
      pages: [baseUrl],
      source: "single",
      error: error instanceof Error ? error.message : "Failed to discover pages",
    };
  }
}
