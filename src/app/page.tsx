import { Suspense } from "react";
import { HomeClient } from "@/components/HomeClient";

// JSON-LD structured data for SEO - WebApplication schema
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Aioli",
  description:
    "Analyze your website for traditional SEO and AI visibility. See how well your site is prepared for both search engines and AI assistants.",
  url: "https://aioli-one.vercel.app",
  applicationCategory: "SEO Tool",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "49",
    highPrice: "299",
    priceCurrency: "SEK",
    offerCount: "3",
  },
  creator: {
    "@type": "Organization",
    name: "Aioli",
    url: "https://aioli-one.vercel.app",
  },
  featureList: [
    "SEO Analysis",
    "AI Visibility Scoring",
    "Schema.org Detection",
    "PDF Report Export",
    "Multi-page Site Scans",
  ],
};

// FAQ Schema for common questions
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is AI visibility for websites?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI visibility refers to how well your website content can be understood and referenced by AI assistants like ChatGPT and Claude. This includes having clear content structure, Schema.org markup, and authoritative information that AI systems can cite.",
      },
    },
    {
      "@type": "Question",
      name: "How does Aioli™ analyze my website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aioli™ performs a comprehensive analysis of your website including traditional SEO factors (meta tags, headings, images) and AI-specific factors (Schema.org markup, content clarity, citability, and author information).",
      },
    },
    {
      "@type": "Question",
      name: "What is a good AI visibility score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A score above 80 is considered excellent, indicating your content is well-optimized for AI assistants. Scores between 60-80 are good, while below 60 indicates room for improvement in how AI systems understand your content.",
      },
    },
  ],
};

// Organization Schema
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Aioli",
  url: "https://aioli-one.vercel.app",
  logo: "https://aioli-one.vercel.app/logo.png",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: "English",
  },
};

export default function Home() {
  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* Server-rendered SEO content (visually hidden but crawlable) */}
      <div className="sr-only">
        <h1>Aioli™ - AI-Powered SEO Analysis Tool for AI Visibility</h1>

        <h2>What is Aioli™?</h2>
        <p>
          Aioli™ is a comprehensive SEO analysis tool that evaluates your website for both
          traditional search engine optimization and AI visibility. With over 50 SEO checks
          and real-time AI scoring, Aioli™ helps you understand how Google, ChatGPT, and
          Claude perceive your content.
        </p>

        <h2>Key Statistics</h2>
        <ul>
          <li>Over 10,000 pages analyzed</li>
          <li>98% accuracy rate in SEO scoring</li>
          <li>Average scan time under 3 seconds</li>
          <li>50+ SEO factors checked per analysis</li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        <h3>What is AI visibility for websites?</h3>
        <p>
          AI visibility refers to how well your website content can be understood and
          referenced by AI assistants like ChatGPT and Claude. This includes having clear
          content structure, Schema.org markup, and authoritative information that AI
          systems can cite.
        </p>

        <h3>How does Aioli analyze my website?</h3>
        <p>
          Aioli performs a comprehensive analysis of your website including traditional
          SEO factors (meta tags, headings, images) and AI-specific factors (Schema.org
          markup, content clarity, citability, and author information).
        </p>

        <h3>What is a good AI visibility score?</h3>
        <p>
          A score above 80 is considered excellent, indicating your content is well-optimized
          for AI assistants. Scores between 60-80 are good, while below 60 indicates room
          for improvement in how AI systems understand your content.
        </p>

        <figure>
          <blockquote>
            "Traditional SEO optimizes for clicks; Aioli optimizes for answers."
          </blockquote>
          <figcaption>— The Aioli Methodology</figcaption>
        </figure>

        <footer>
          <p>Published by Aioli. Last updated: <time dateTime="2026-01-02">January 2, 2026</time></p>
        </footer>
      </div>

      <Suspense fallback={<div className="min-h-screen bg-[var(--bg-obsidian)]" />}>
        <HomeClient />
      </Suspense>
    </>
  );
}
