export interface SeoResult {
  title: {
    value: string | null;
    length: number;
    score: number;
    issues: string[];
  };
  description: {
    value: string | null;
    length: number;
    score: number;
    issues: string[];
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    score: number;
    issues: string[];
  };
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    score: number;
    issues: string[];
  };
  links: {
    internal: number;
    external: number;
    broken: string[];
    score: number;
  };
  technical: {
    https: boolean;
    canonical: string | null;
    viewport: boolean;
    robotsTxt: boolean;
    sitemap: boolean;
    score: number;
    issues: string[];
  };
}

export interface LlmReadinessResult {
  structuredData: {
    hasSchemaOrg: boolean;
    types: string[];
    score: number;
    issues: string[];
  };
  contentClarity: {
    avgParagraphLength: number;
    hasFaq: boolean;
    hasDefinitions: boolean;
    score: number;
    issues: string[];
  };
  authorInfo: {
    hasAuthor: boolean;
    hasDate: boolean;
    hasLastModified: boolean;
    score: number;
    issues: string[];
  };
  aiCrawlerAccess: {
    allowsGptBot: boolean;
    allowsAnthropicBot: boolean;
    allowsPerplexityBot: boolean;
    score: number;
    issues: string[];
  };
  citability: {
    hasQuotes: boolean;
    hasStatistics: boolean;
    hasSources: boolean;
    score: number;
    issues: string[];
  };
}

export interface AnalysisResults {
  url: string;
  fetchedAt: string;
  seo: SeoResult;
  llmReadiness: LlmReadinessResult;
  overallSeoScore: number;
  overallLlmScore: number;
}

export interface Suggestion {
  category: "seo" | "llm" | "content";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  currentValue?: string;
  suggestedValue?: string;
}

export interface AnalysisSuggestions {
  suggestions: Suggestion[];
  generatedAt: string;
}
