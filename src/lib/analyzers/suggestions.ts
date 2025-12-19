import { Suggestion, AnalysisResults, SeoResult, LlmReadinessResult } from "@/types/analysis";
import { generateWithOllama, isOllamaAvailable } from "../ollama";

export async function generateSuggestions(
  results: AnalysisResults
): Promise<Suggestion[]> {
  const suggestions: Suggestion[] = [];

  // Generate rule-based suggestions
  const ruleBased = generateRuleBasedSuggestions(results);
  suggestions.push(...ruleBased);

  // Try to generate AI-powered suggestions
  const ollamaAvailable = await isOllamaAvailable();
  if (ollamaAvailable) {
    try {
      const aiSuggestions = await generateAiSuggestions(results);
      suggestions.push(...aiSuggestions);
    } catch (error) {
      console.error("Failed to generate AI suggestions:", error);
    }
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
      title: "Lägg till en title-tagg",
      description: "Din sida saknar en title-tagg. Detta är kritiskt för SEO.",
    });
  } else if (seo.title.length < 30) {
    suggestions.push({
      category: "seo",
      priority: "medium",
      title: "Förläng din title-tagg",
      description: "Din title är för kort. En optimal title är 50-60 tecken.",
      currentValue: seo.title.value,
    });
  } else if (seo.title.length > 60) {
    suggestions.push({
      category: "seo",
      priority: "low",
      title: "Korta ner din title-tagg",
      description: "Din title är för lång och kan klippas i sökresultat.",
      currentValue: `${seo.title.value.substring(0, 57)}...`,
    });
  }

  // Description suggestions
  if (!seo.description.value) {
    suggestions.push({
      category: "seo",
      priority: "high",
      title: "Lägg till en meta description",
      description: "Din sida saknar meta description. Detta påverkar klickfrekvensen i sökresultat.",
    });
  } else if (seo.description.length < 70) {
    suggestions.push({
      category: "seo",
      priority: "medium",
      title: "Förläng din meta description",
      description: "Din meta description är för kort. Optimal längd är 120-160 tecken.",
      currentValue: seo.description.value,
    });
  }

  // Headings suggestions
  if (seo.headings.h1.length === 0) {
    suggestions.push({
      category: "seo",
      priority: "high",
      title: "Lägg till en H1-rubrik",
      description: "Din sida saknar en H1-rubrik. Varje sida bör ha exakt en H1.",
    });
  } else if (seo.headings.h1.length > 1) {
    suggestions.push({
      category: "seo",
      priority: "medium",
      title: "Reducera till en H1-rubrik",
      description: `Din sida har ${seo.headings.h1.length} H1-rubriker. Best practice är att ha endast en.`,
    });
  }

  // Images suggestions
  if (seo.images.withoutAlt > 0) {
    suggestions.push({
      category: "seo",
      priority: seo.images.withoutAlt > 5 ? "high" : "medium",
      title: "Lägg till alt-text på bilder",
      description: `${seo.images.withoutAlt} av ${seo.images.total} bilder saknar alt-text.`,
    });
  }

  // Technical suggestions
  if (!seo.technical.https) {
    suggestions.push({
      category: "seo",
      priority: "high",
      title: "Aktivera HTTPS",
      description: "Din sida använder inte HTTPS. Detta är kritiskt för säkerhet och SEO.",
    });
  }

  if (!seo.technical.canonical) {
    suggestions.push({
      category: "seo",
      priority: "medium",
      title: "Lägg till canonical URL",
      description: "Ange en canonical URL för att undvika duplicerat innehåll.",
    });
  }

  if (!seo.technical.viewport) {
    suggestions.push({
      category: "seo",
      priority: "high",
      title: "Lägg till viewport meta-tagg",
      description: "Din sida saknar viewport-konfiguration för mobila enheter.",
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
      title: "Lägg till Schema.org markup",
      description:
        "Strukturerad data hjälper AI att förstå ditt innehåll bättre. Överväg JSON-LD format.",
    });
  }

  // FAQ
  if (!llm.contentClarity.hasFaq) {
    suggestions.push({
      category: "llm",
      priority: "medium",
      title: "Lägg till en FAQ-sektion",
      description:
        "FAQ-sektioner är utmärkta för AI-assistenter att citera. Använd gärna FAQPage schema.",
    });
  }

  // Author info
  if (!llm.authorInfo.hasAuthor) {
    suggestions.push({
      category: "llm",
      priority: "medium",
      title: "Lägg till författarinformation",
      description: "E-E-A-T signaler är viktiga. Visa vem som skrivit innehållet.",
    });
  }

  if (!llm.authorInfo.hasDate) {
    suggestions.push({
      category: "llm",
      priority: "medium",
      title: "Lägg till publiceringsdatum",
      description: "Datumstämplar visar att innehållet är aktuellt.",
      suggestedValue: '<time datetime="2024-01-15" itemprop="datePublished">15 januari 2024</time>',
    });
  }

  // AI crawler access
  if (!llm.aiCrawlerAccess.allowsGptBot || !llm.aiCrawlerAccess.allowsAnthropicBot) {
    suggestions.push({
      category: "llm",
      priority: "low",
      title: "Granska AI-crawler regler",
      description:
        "Vissa AI-crawlers är blockerade. Om du vill synas i AI-assistenter, överväg att tillåta dem.",
    });
  }

  // Citability
  if (!llm.citability.hasStatistics) {
    suggestions.push({
      category: "content",
      priority: "low",
      title: "Lägg till statistik och data",
      description:
        "Siffror och statistik gör innehållet mer citerbart för AI-assistenter.",
    });
  }

  if (!llm.citability.hasSources) {
    suggestions.push({
      category: "content",
      priority: "medium",
      title: "Lägg till källor och referenser",
      description: "Länka till primärkällor för att öka trovärdigheten.",
    });
  }

  return suggestions;
}

async function generateAiSuggestions(results: AnalysisResults): Promise<Suggestion[]> {
  const prompt = `Du är en SEO-expert. Analysera följande SEO-data och ge 2-3 konkreta förbättringsförslag på svenska.

URL: ${results.url}
SEO-poäng: ${results.overallSeoScore}/100
LLM-readiness: ${results.overallLlmScore}/100

Title: ${results.seo.title.value || "Saknas"}
Description: ${results.seo.description.value || "Saknas"}
H1: ${results.seo.headings.h1.join(", ") || "Saknas"}

Problem att fokusera på:
${results.seo.title.issues.join(", ")}
${results.seo.description.issues.join(", ")}
${results.llmReadiness.structuredData.issues.join(", ")}

Ge konkreta förslag i JSON-format:
[{"title": "Förbättring", "description": "Detaljer", "suggestedValue": "Exempel om tillämpligt"}]

Svara ENDAST med JSON-arrayen.`;

  try {
    const response = await generateWithOllama(prompt);

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
