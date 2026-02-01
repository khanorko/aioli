// WCAG AI Analysis Prompts for Groq
import type { WcagCriterion } from './types';

export function getWcagAnalysisPrompt(criterion: WcagCriterion, html: string): string {
  const truncatedHtml = html.slice(0, 15000); // Limit HTML size for API

  return `You are a WCAG 2.2 accessibility expert. Analyze the following HTML against success criterion ${criterion.id}.

## Criterion: ${criterion.id} - ${criterion.title}
**Level:** ${criterion.level}
**Description:** ${criterion.description}

## HTML to Analyze:
\`\`\`html
${truncatedHtml}
\`\`\`

## Your Task:
1. Analyze if this HTML meets the WCAG criterion
2. Identify specific issues if any
3. Provide actionable fixes

## Response Format (JSON only):
{
  "status": "passed" | "failed" | "not-applicable",
  "confidence": 0.0-1.0,
  "issues": [
    {
      "element": "CSS selector or HTML snippet",
      "description": "What is wrong",
      "severity": "critical" | "serious" | "moderate" | "minor",
      "fix": "How to fix it with code example"
    }
  ],
  "observations": "Additional notes"
}

Be specific and provide concrete code examples in your fixes. Only return valid JSON.`;
}

// Specific prompts for AI-assisted criteria
export const AI_ASSISTED_PROMPTS: Record<string, (html: string) => string> = {
  // 1.3.3 Sensory Characteristics
  "1.3.3": (html: string) => `Analyze this HTML for WCAG 1.3.3 Sensory Characteristics.

Look for instructions that rely ONLY on:
- Shape ("click the round button")
- Color ("the red items are errors")
- Size ("the large text is important")
- Visual location ("in the right sidebar")
- Sound ("when you hear the beep")

Instructions should include text alternatives.

HTML:
${html.slice(0, 10000)}

Return JSON: { status, confidence, issues: [{ element, description, severity, fix }], observations }`,

  // 1.4.1 Use of Color
  "1.4.1": (html: string) => `Analyze this HTML for WCAG 1.4.1 Use of Color.

Check if color is used as the ONLY means to convey information:
- Links that are only distinguished by color (not underlined)
- Error states shown only with red color
- Required fields marked only with color
- Status indicators using only color

Color can be used, but must be accompanied by another indicator (text, icon, pattern).

HTML:
${html.slice(0, 10000)}

Return JSON: { status, confidence, issues: [{ element, description, severity, fix }], observations }`,

  // 1.4.5 Images of Text
  "1.4.5": (html: string) => `Analyze this HTML for WCAG 1.4.5 Images of Text.

Look for:
- Images that appear to contain text (logos are excepted)
- Background images that might contain text
- SVGs or canvas elements with text that should be real text

Text should be real HTML text, not images of text.

HTML:
${html.slice(0, 10000)}

Return JSON: { status, confidence, issues: [{ element, description, severity, fix }], observations }`,

  // 2.4.4 Link Purpose (In Context)
  "2.4.4": (html: string) => `Analyze this HTML for WCAG 2.4.4 Link Purpose (In Context).

Check links for clear purpose:
- "Click here", "Read more", "Learn more" alone are unclear
- Purpose should be clear from link text OR surrounding context
- Links with same text should go to same destination

HTML:
${html.slice(0, 10000)}

Return JSON: { status, confidence, issues: [{ element, description, severity, fix }], observations }`,

  // 2.4.6 Headings and Labels
  "2.4.6": (html: string) => `Analyze this HTML for WCAG 2.4.6 Headings and Labels.

Check that headings and labels:
- Describe the topic or purpose of content
- Are not generic ("Section 1", "Untitled")
- Form a logical outline
- Labels clearly describe input purpose

HTML:
${html.slice(0, 10000)}

Return JSON: { status, confidence, issues: [{ element, description, severity, fix }], observations }`,

  // 3.1.2 Language of Parts
  "3.1.2": (html: string) => `Analyze this HTML for WCAG 3.1.2 Language of Parts.

Look for:
- Text in different languages than the page language
- Foreign words or phrases that need lang attribute
- Technical terms, proper nouns in other languages

If found, they should have lang="xx" attribute.

HTML:
${html.slice(0, 10000)}

Return JSON: { status, confidence, issues: [{ element, description, severity, fix }], observations }`,

  // 3.3.3 Error Suggestion
  "3.3.3": (html: string) => `Analyze this HTML for WCAG 3.3.3 Error Suggestion.

Look for:
- Form validation patterns
- Error message areas
- Required field indicators
- Format instructions

If errors can be detected, suggestions for correction should be provided.

HTML:
${html.slice(0, 10000)}

Return JSON: { status, confidence, issues: [{ element, description, severity, fix }], observations }`,
};

export function getAiAssistedPrompt(criterionId: string, html: string): string | null {
  const promptFn = AI_ASSISTED_PROMPTS[criterionId];
  return promptFn ? promptFn(html) : null;
}
