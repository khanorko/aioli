import { Suspense } from "react";
import { WcagClient } from "./WcagClient";

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WCAG Accessibility Audit",
  description:
    "AI-powered WCAG 2.2 accessibility audit tool. Test your website against 50+ criteria and get actionable recommendations to improve accessibility.",
  url: "https://aioli.tools/wcag",
  applicationCategory: "Accessibility Tool",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "5",
    priceCurrency: "EUR",
  },
  creator: {
    "@type": "Organization",
    name: "Aioli",
    url: "https://aioli.tools",
  },
  featureList: [
    "WCAG 2.2 Compliance Testing",
    "POUR Principle Analysis",
    "Automated Accessibility Checks",
    "AI-Assisted Analysis",
    "Actionable Fix Recommendations",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is WCAG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WCAG (Web Content Accessibility Guidelines) is an internationally recognized standard for web accessibility. Version 2.2 includes 86 success criteria across three conformance levels (A, AA, AAA) that help make web content accessible to people with disabilities.",
      },
    },
    {
      "@type": "Question",
      name: "What WCAG level should I aim for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Level AA is the recommended target for most websites. It's required by the EU Accessibility Act 2025 and US ADA compliance. Level A is the minimum, while Level AAA is aspirational for most sites.",
      },
    },
    {
      "@type": "Question",
      name: "What are the POUR principles?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "POUR stands for Perceivable (users can perceive content), Operable (users can navigate), Understandable (content is readable), and Robust (works with assistive technologies). These four principles form the foundation of WCAG guidelines.",
      },
    },
    {
      "@type": "Question",
      name: "Can all WCAG criteria be tested automatically?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, about 30% of WCAG criteria can be fully automated, 20% can be AI-assisted, and 50% require browser testing or manual evaluation. Our tool clearly identifies which tests need additional verification.",
      },
    },
  ],
};

export const metadata = {
  title: "WCAG Accessibility Audit | Test Your Website for WCAG 2.2 Compliance | Aioli",
  description:
    "Free AI-powered WCAG 2.2 accessibility audit. Test your website against 50+ criteria, get POUR scores, and actionable fixes. EU Accessibility Act & ADA compliant.",
  openGraph: {
    title: "WCAG Accessibility Audit | Aioli",
    description:
      "Test your website for WCAG 2.2 accessibility compliance. Get POUR scores and actionable fixes.",
    url: "https://aioli.tools/wcag",
  },
};

export default function WcagPage() {
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
        <h1>WCAG 2.2 Accessibility Audit - Test Your Website Compliance</h1>
        <p>
          Analyze your website against WCAG 2.2 accessibility standards using AI-powered analysis.
          Get detailed POUR scores and actionable recommendations to make your website accessible to
          everyone.
        </p>

        <h2>What is WCAG?</h2>
        <p>
          WCAG (Web Content Accessibility Guidelines) is the international standard for web
          accessibility. Version 2.2 includes 86 success criteria organized under four principles:
          Perceivable, Operable, Understandable, and Robust (POUR).
        </p>

        <h2>POUR Principles Explained</h2>
        <ul>
          <li>Perceivable: Information must be presentable in ways users can perceive</li>
          <li>Operable: Interface components must be operable by all users</li>
          <li>Understandable: Content must be readable and understandable</li>
          <li>Robust: Content must work with assistive technologies</li>
        </ul>

        <h2>Conformance Levels</h2>
        <ul>
          <li>Level A: 30 criteria - Essential minimum accessibility</li>
          <li>Level AA: 50 criteria - Recommended for EU/ADA compliance</li>
          <li>Level AAA: 86 criteria - Maximum accessibility standard</li>
        </ul>

        <h2>Why Accessibility Matters</h2>
        <ul>
          <li>EU Accessibility Act 2025 requires digital products to be accessible</li>
          <li>ADA compliance is required for US businesses</li>
          <li>15% of world population (1 billion people) has a disability</li>
          <li>Google rewards accessible websites with better rankings</li>
        </ul>

        <h2>Frequently Asked Questions</h2>

        <h3>What WCAG level should I aim for?</h3>
        <p>
          Level AA is the recommended target for most websites and is required by the EU
          Accessibility Act 2025 and US ADA compliance requirements.
        </p>

        <h3>Can all WCAG criteria be tested automatically?</h3>
        <p>
          No, about 30% can be automated, 20% AI-assisted, and 50% require browser or manual
          testing. Our tool identifies which tests need additional verification.
        </p>
      </div>

      <Suspense fallback={<div className="min-h-screen bg-[var(--bg-obsidian)]" />}>
        <WcagClient />
      </Suspense>
    </>
  );
}
