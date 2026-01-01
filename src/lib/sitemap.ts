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
 * Check if URL belongs to the same domain (handles www/non-www)
 */
function isSameDomain(url: string, baseUrl: string): boolean {
  try {
    const urlHost = new URL(url).host.replace(/^www\./, "");
    const baseHost = new URL(baseUrl).host.replace(/^www\./, "");
    return urlHost === baseHost;
  } catch {
    return false;
  }
}

/**
 * Filter and prioritize pages
 */
function filterAndPrioritizePages(pages: string[], baseUrl: string): string[] {
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
    if (lower.includes("/sitemaps/")) return false; // Skip sitemap URLs
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
 * Check if XML is a sitemap index
 */
function isSitemapIndex(xml: string): boolean {
  return xml.includes("<sitemapindex") || xml.includes("<sitemap>");
}

/**
 * Parse sitemap index to get nested sitemap URLs
 */
function parseNestedSitemapUrls(xml: string): string[] {
  const sitemaps: string[] = [];
  const sitemapRegex = /<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/sitemap>/gi;
  let match;

  while ((match = sitemapRegex.exec(xml)) !== null) {
    sitemaps.push(match[1].trim());
  }

  return sitemaps;
}

/**
 * Parse sitemap XML content for page URLs
 */
function parseSitemapXml(xml: string): string[] {
  const urls: string[] = [];

  // Match <url><loc> tags (not <sitemap><loc>)
  const urlRegex = /<url>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/url>/gi;
  let match;

  while ((match = urlRegex.exec(xml)) !== null) {
    const url = match[1].trim();
    if (url && !url.endsWith(".xml")) {
      urls.push(url);
    }
  }

  // If no <url> tags found, try simple <loc> tags (but filter out .xml files)
  if (urls.length === 0) {
    const locRegex = /<loc>([^<]+)<\/loc>/gi;
    while ((match = locRegex.exec(xml)) !== null) {
      const url = match[1].trim();
      if (url && !url.endsWith(".xml")) {
        urls.push(url);
      }
    }
  }

  return urls;
}

/**
 * Fetch and parse sitemap.xml (handles sitemap indexes)
 */
async function fetchSitemap(baseUrl: string): Promise<string[]> {
  const domain = extractDomain(baseUrl);

  // Try both with and without www
  const domainNoWww = domain.replace("://www.", "://");
  const domainWithWww = domain.includes("://www.") ? domain : domain.replace("://", "://www.");

  const sitemapUrls = [
    `${domain}/sitemap.xml`,
    `${domainWithWww}/sitemap.xml`,
    `${domainNoWww}/sitemap.xml`,
    `${domain}/sitemap_index.xml`,
    `${domain}/sitemap-index.xml`,
  ];

  // Remove duplicates
  const uniqueSitemapUrls = [...new Set(sitemapUrls)];

  for (const sitemapUrl of uniqueSitemapUrls) {
    try {
      const response = await fetch(sitemapUrl, {
        headers: {
          "User-Agent": "AIoli-Bot/1.0 (SEO Analysis Tool)",
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.ok) {
        const xml = await response.text();

        // Check if this is a sitemap index
        if (isSitemapIndex(xml)) {
          const nestedSitemaps = parseNestedSitemapUrls(xml);

          if (nestedSitemaps.length > 0) {
            // For news sites, try to get the most recent sitemap (usually at the end)
            // Also try a few others to get diverse pages
            const sitemapsToFetch = [
              nestedSitemaps[nestedSitemaps.length - 1], // Most recent
              nestedSitemaps[0], // First (might be sections/categories)
            ].filter((v, i, a) => v && a.indexOf(v) === i); // Unique, non-null

            const allUrls: string[] = [];

            for (const nestedUrl of sitemapsToFetch) {
              try {
                const nestedResponse = await fetch(nestedUrl, {
                  headers: {
                    "User-Agent": "AIoli-Bot/1.0 (SEO Analysis Tool)",
                  },
                  signal: AbortSignal.timeout(10000),
                });

                if (nestedResponse.ok) {
                  const nestedXml = await nestedResponse.text();
                  const urls = parseSitemapXml(nestedXml);
                  allUrls.push(...urls);

                  // If we have enough URLs, stop fetching more sitemaps
                  if (allUrls.length >= 50) break;
                }
              } catch {
                continue;
              }
            }

            if (allUrls.length > 0) {
              return allUrls;
            }
          }
        }

        // Regular sitemap - parse directly
        const urls = parseSitemapXml(xml);
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
      redirect: "follow",
    });

    if (!response.ok) return [];

    // Use the final URL after redirects
    const finalUrl = response.url || baseUrl;
    const html = await response.text();
    const urls: string[] = [finalUrl];

    // Extract href links
    const hrefRegex = /href=["']([^"']+)["']/gi;
    let match;

    while ((match = hrefRegex.exec(html)) !== null) {
      const href = match[1];
      if (href && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:") && !href.startsWith("javascript:")) {
        const normalizedUrl = normalizeUrl(href, finalUrl);
        if (isSameDomain(normalizedUrl, finalUrl)) {
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

    // Fallback to crawling if no sitemap or only got a few pages
    if (pages.length < 3) {
      const crawledPages = await crawlHomepage(baseUrl);
      if (crawledPages.length > pages.length) {
        pages = crawledPages;
        source = pages.length > 1 ? "crawl" : "single";
      }
    }

    // Filter and prioritize
    const filteredPages = filterAndPrioritizePages(pages, baseUrl);

    // Ensure homepage is included
    const domain = extractDomain(baseUrl);
    const hasHomepage = filteredPages.some(p => {
      try {
        const pathname = new URL(p).pathname;
        return pathname === "/" || pathname === "";
      } catch {
        return false;
      }
    });

    if (!hasHomepage) {
      // Try to add the actual homepage (might be with www)
      filteredPages.unshift(domain);
    }

    // Limit to maxPages
    const limitedPages = filteredPages.slice(0, maxPages);

    return {
      pages: limitedPages,
      source: limitedPages.length > 1 ? source : "single",
    };
  } catch (error) {
    return {
      pages: [baseUrl],
      source: "single",
      error: error instanceof Error ? error.message : "Failed to discover pages",
    };
  }
}
