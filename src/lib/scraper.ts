import * as cheerio from "cheerio";

export type CheerioAPI = ReturnType<typeof cheerio.load>;

export interface ScrapedPage {
  url: string;
  html: string;
  $: CheerioAPI;
  statusCode: number;
  redirectUrl?: string;
  responseTime: number;
  headers: Record<string, string>;
}

export interface RobotsTxt {
  raw: string;
  rules: {
    userAgent: string;
    allow: string[];
    disallow: string[];
  }[];
}

export async function scrapePage(url: string): Promise<ScrapedPage> {
  const startTime = Date.now();

  const response = await fetch(url, {
    headers: {
      "User-Agent": "AIoli-Bot/1.0 (SEO Analysis Tool)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    redirect: "follow",
  });

  const responseTime = Date.now() - startTime;
  const html = await response.text();
  const $ = cheerio.load(html);

  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    url: response.url,
    html,
    $,
    statusCode: response.status,
    redirectUrl: response.url !== url ? response.url : undefined,
    responseTime,
    headers,
  };
}

export async function fetchRobotsTxt(baseUrl: string): Promise<RobotsTxt | null> {
  try {
    const url = new URL("/robots.txt", baseUrl);
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "AIoli-Bot/1.0",
      },
    });

    if (!response.ok) {
      return null;
    }

    const raw = await response.text();
    const rules = parseRobotsTxt(raw);

    return { raw, rules };
  } catch {
    return null;
  }
}

function parseRobotsTxt(content: string): RobotsTxt["rules"] {
  const rules: RobotsTxt["rules"] = [];
  let currentRule: RobotsTxt["rules"][0] | null = null;

  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("#") || trimmed === "") {
      continue;
    }

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const directive = trimmed.substring(0, colonIndex).toLowerCase().trim();
    const value = trimmed.substring(colonIndex + 1).trim();

    if (directive === "user-agent") {
      if (currentRule) {
        rules.push(currentRule);
      }
      currentRule = {
        userAgent: value,
        allow: [],
        disallow: [],
      };
    } else if (currentRule) {
      if (directive === "allow") {
        currentRule.allow.push(value);
      } else if (directive === "disallow") {
        currentRule.disallow.push(value);
      }
    }
  }

  if (currentRule) {
    rules.push(currentRule);
  }

  return rules;
}

export async function fetchSitemap(baseUrl: string): Promise<string[] | null> {
  try {
    const url = new URL("/sitemap.xml", baseUrl);
    const response = await fetch(url.toString());

    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    const $ = cheerio.load(text, { xmlMode: true });

    const urls: string[] = [];
    $("url loc").each((_, el) => {
      urls.push($(el).text());
    });

    return urls.length > 0 ? urls : null;
  } catch {
    return null;
  }
}

export function extractText($: CheerioAPI): string {
  $("script, style, noscript").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
}
