import { Suggestion, AnalysisResults, SeoResult, LlmReadinessResult } from "@/types/analysis";
import { generateWithGroq, isGroqAvailable } from "../groq";
import { generateWithOllama, isOllamaAvailable } from "../ollama";

export async function generateSuggestions(
  results: AnalysisResults
): Promise<Suggestion[]> {
  const suggestions: Suggestion[] = [];

  // Generate rule-based suggestions
  const ruleBased = generateRuleBasedSuggestions(results);
  suggestions.push(...ruleBased);

  // Try to generate AI-powered suggestions (Groq first, then Ollama)
  try {
    const aiSuggestions = await generateAiSuggestions(results);
    suggestions.push(...aiSuggestions);
  } catch (error) {
    console.error("Failed to generate AI suggestions:", error);
  }

  return suggestions;
}

function generateRuleBasedSuggestions(results: AnalysisResults): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // SEO suggestions
  suggestions.push(...generateSeoSuggestions(results.seo));

  // LLM suggestions
  suggestions.push(...generateLlmSuggestions(results.llmReadiness));

  return suggestions;
}

function generateSeoSuggestions(seo: SeoResult): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Title suggestions
  if (!seo.title.value) {
    suggestions.push({
      category: "seo",
      priority: "high",
      title: "Add a title tag",
      description: "Your page is missing a title tag. This is critical for SEO.",
    });
  } else if (seo.title.length < 30) {
    suggestions.push({
      category: "seo",
      priority: "medium",
      title: "Extend your title tag",
      description: "Your title is too short. An optimal title is 50-60 characters.",
      currentValue: seo.title.value,
    });
  } else if (seo.title.length > 60) {
    suggestions.push({
      category: "seo",
      priority: "low",
      title: "Shorten your title tag",
      description: "Your title is too long and may be truncated in search results.",
      currentValue: `${seo.title.value.substring(0, 57)}...`,
    });
  }

  // Description suggestions
  if (!seo.description.value) {
    suggestions.push({
      category: "seo",
      priority: "high",
      title: "Add a meta description",
      description: "Your page is missing a meta description. This affects click-through rates in search results.",
    });
  } else if (seo.description.length < 70) {
    suggestions.push({
      category: "seo",
      priority: "medium",
      title: "Extend your meta description",
      description: "Your meta description is too short. Optimal length is 120-160 characters.",
      currentValue: seo.description.value,
    });
  }

  // Headings suggestions
  if (seo.headings.h1.length === 0) {
    suggestions.push({
      category: "seo",
      priority: "high",
      title: "Add an H1 heading",
      description: "Your page is missing an H1 heading. Every page should have exactly one H1.",
    });
  } else if (seo.headings.h1.length > 1) {
    suggestions.push({
      category: "seo",
      priority: "medium",
      title: "Reduce to one H1 heading",
      description: `Your page has ${seo.headings.h1.length} H1 headings. Best practice is to have only one.`,
    });
  }

  // Images suggestions
  if (seo.images.withoutAlt > 0) {
    suggestions.push({
      category: "seo",
      priority: seo.images.withoutAlt > 5 ? "high" : "medium",
      title: "Add alt text to images",
      description: `${seo.images.withoutAlt} of ${seo.images.total} images are missing alt text.`,
    });
  }

  // Technical suggestions
  if (!seo.technical.https) {
    suggestions.push({
      category: "seo",
      priority: "high",
      title: "Enable HTTPS",
      description: "Your page is not using HTTPS. This is critical for security and SEO.",
    });
  }

  if (!seo.technical.canonical) {
    suggestions.push({
      category: "seo",
      priority: "medium",
      title: "Add canonical URL",
      description: "Specify a canonical URL to avoid duplicate content issues.",
    });
  }

  if (!seo.technical.viewport) {
    suggestions.push({
      category: "seo",
      priority: "high",
      title: "Add viewport meta tag",
      description: "Your page is missing viewport configuration for mobile devices.",
      suggestedValue: '<meta name="viewport" content="width=device-width, initial-scale=1">',
    });
  }

  return suggestions;
}

function generateLlmSuggestions(llm: LlmReadinessResult): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Structured data
  if (!llm.structuredData.hasSchemaOrg) {
    suggestions.push({
      category: "llm",
      priority: "high",
      title: "Add Schema.org markup",
      description:
        "Structured data helps AI understand your content better. Consider using JSON-LD format.",
    });
  }

  // FAQ
  if (!llm.contentClarity.hasFaq) {
    suggestions.push({
      category: "llm",
      priority: "medium",
      title: "Add an FAQ section",
      description:
        "FAQ sections are excellent for AI assistants to cite. Consider using FAQPage schema.",
    });
  }

  // Author info
  if (!llm.authorInfo.hasAuthor) {
    suggestions.push({
      category: "llm",
      priority: "medium",
      title: "Add author information",
      description: "E-E-A-T signals are important. Show who wrote the content.",
    });
  }

  if (!llm.authorInfo.hasDate) {
    suggestions.push({
      category: "llm",
      priority: "medium",
      title: "Add publication date",
      description: "Timestamps show that the content is current.",
      suggestedValue: '<time datetime="2024-01-15" itemprop="datePublished">January 15, 2024</time>',
    });
  }

  // AI crawler access
  if (!llm.aiCrawlerAccess.allowsGptBot || !llm.aiCrawlerAccess.allowsAnthropicBot) {
    suggestions.push({
      category: "llm",
      priority: "low",
      title: "Review AI crawler rules",
      description:
        "Some AI crawlers are blocked. If you want to appear in AI assistants, consider allowing them.",
    });
  }

  // Citability
  if (!llm.citability.hasStatistics) {
    suggestions.push({
      category: "content",
      priority: "low",
      title: "Add statistics and data",
      description:
        "Numbers and statistics make content more quotable for AI assistants.",
    });
  }

  if (!llm.citability.hasSources) {
    suggestions.push({
      category: "content",
      priority: "medium",
      title: "Add sources and references",
      description: "Link to primary sources to increase credibility.",
    });
  }

  return suggestions;
}

async function generateAiSuggestions(results: AnalysisResults): Promise<Suggestion[]> {
  const prompt = `You are an SEO expert. Analyze the following SEO data and provide 2-3 concrete improvement suggestions in English.

URL: ${results.url}
SEO Score: ${results.overallSeoScore}/100
LLM Readiness: ${results.overallLlmScore}/100

Title: ${results.seo.title.value || "Missing"}
Description: ${results.seo.description.value || "Missing"}
H1: ${results.seo.headings.h1.join(", ") || "Missing"}

Issues to focus on:
${results.seo.title.issues.join(", ")}
${results.seo.description.issues.join(", ")}
${results.llmReadiness.structuredData.issues.join(", ")}

Provide concrete suggestions in JSON format:
[{"title": "Improvement", "description": "Details", "suggestedValue": "Example if applicable"}]

Respond ONLY with the JSON array.`;

  let response: string;

  // Try Groq first (cloud), then Ollama (local)
  if (isGroqAvailable()) {
    try {
      response = await generateWithGroq(prompt);
    } catch (error) {
      console.error("Groq failed, trying Ollama:", error);
      const ollamaAvailable = await isOllamaAvailable();
      if (!ollamaAvailable) return [];
      response = await generateWithOllama(prompt);
    }
  } else {
    const ollamaAvailable = await isOllamaAvailable();
    if (!ollamaAvailable) return [];
    response = await generateWithOllama(prompt);
  }

  try {
    // Try to parse JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed.map(
      (item: { title: string; description: string; suggestedValue?: string }) => ({
        category: "content" as const,
        priority: "medium" as const,
        title: item.title,
        description: item.description,
        suggestedValue: item.suggestedValue,
      })
    );
  } catch {
    return [];
  }
}
