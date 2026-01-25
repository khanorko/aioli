import { Suspense } from "react";
import { BrandCheckClient } from "./BrandCheckClient";

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Brand Visibility Check",
  description:
    "Check how AI assistants like ChatGPT, Claude, and Perplexity perceive and describe your brand. Get visibility score and recommendations.",
  url: "https://aioli.tools/brand-check",
  applicationCategory: "Business Tool",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "3",
    priceCurrency: "EUR",
  },
  creator: {
    "@type": "Organization",
    name: "Aioli",
    url: "https://aioli.tools",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is AI brand visibility?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI brand visibility refers to how well AI assistants like ChatGPT, Claude, and Perplexity know about and can accurately describe your brand or business. High visibility means AI can provide accurate information about your company to users.",
      },
    },
    {
      "@type": "Question",
      name: "Why does AI brand visibility matter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "More users are asking AI assistants for recommendations and information. If AI doesn't know about your brand, you're invisible to these potential customers. Good AI visibility means your brand gets mentioned when relevant questions are asked.",
      },
    },
    {
      "@type": "Question",
      name: "How can I improve my AI brand visibility?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Key strategies include: creating a Wikipedia article, adding Organization schema to your website, getting mentioned in industry publications, completing your LinkedIn company page, and listing in business directories.",
      },
    },
  ],
};

export const metadata = {
  title: "AI Brand Visibility Check | Does AI Know Your Business? | Aioli",
  description:
    "Check if ChatGPT, Claude, and other AI assistants know about your brand. Get your AI visibility score and actionable recommendations to improve.",
  openGraph: {
    title: "AI Brand Visibility Check | Aioli",
    description: "Does AI know your business? Check your brand visibility in ChatGPT, Claude & more.",
    url: "https://aioli.tools/brand-check",
  },
};

export default function BrandCheckPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Server-rendered SEO content */}
      <div className="sr-only">
        <h1>AI Brand Visibility Check - Does AI Know Your Business?</h1>
        <p>
          Check how AI assistants like ChatGPT, Claude, and Perplexity perceive your brand.
          Get your visibility score and recommendations to improve your AI presence.
        </p>

        <h2>What is AI Brand Visibility?</h2>
        <p>
          AI brand visibility measures how well AI assistants know about and can describe
          your business. With more users relying on AI for recommendations, being visible
          to AI is becoming as important as traditional SEO.
        </p>

        <h2>Why It Matters</h2>
        <ul>
          <li>Users ask AI for product and service recommendations</li>
          <li>AI assistants cite sources when answering questions</li>
          <li>Unknown brands miss opportunities when AI can&apos;t recommend them</li>
        </ul>
      </div>

      <Suspense fallback={<div className="min-h-screen bg-[var(--bg-obsidian)]" />}>
        <BrandCheckClient />
      </Suspense>
    </>
  );
}
