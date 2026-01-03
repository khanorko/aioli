import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analysis History - Track Your SEO & AI Visibility Progress | Aioli™",
  description:
    "View your website analysis history. Track SEO and AI visibility scores over time, compare results, and monitor your optimization progress.",
  alternates: {
    canonical: "/history",
  },
  openGraph: {
    title: "Analysis History - Track Your Progress | Aioli™",
    description:
      "View your website analysis history and track SEO and AI visibility scores over time.",
    url: "https://aioli.tools/history",
  },
};

// Schema.org structured data
const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Analysis History",
  description:
    "View your website analysis history. Track SEO and AI visibility scores over time, compare results, and monitor your optimization progress.",
  url: "https://aioli.tools/history",
  isPartOf: {
    "@type": "WebSite",
    name: "Aioli",
    url: "https://aioli.tools",
  },
  provider: {
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
      name: "How long is my analysis history saved?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your analysis history is saved indefinitely. You can access all your past analyses at any time to track your progress and compare results.",
      },
    },
    {
      "@type": "Question",
      name: "Can I re-analyze a previously scanned website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can return to the homepage and analyze any URL again. This lets you track improvements over time after implementing SEO and AI visibility optimizations.",
      },
    },
    {
      "@type": "Question",
      name: "What do the SEO and AI scores mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The SEO score (0-100) measures traditional search engine optimization factors like meta tags, headings, and technical SEO. The AI score measures how well your content can be discovered and cited by AI assistants like ChatGPT and Claude.",
      },
    },
  ],
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
