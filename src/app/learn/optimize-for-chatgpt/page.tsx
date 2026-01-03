import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Calendar, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Optimize for ChatGPT: A Complete Guide | Aioli™",
  description:
    "Learn how to make your website content more likely to be cited by ChatGPT, Claude, and other AI assistants. Actionable tips with examples.",
  alternates: {
    canonical: "/learn/optimize-for-chatgpt",
  },
  openGraph: {
    title: "How to Optimize for ChatGPT: A Complete Guide",
    description:
      "Learn how to make your website content more likely to be cited by ChatGPT, Claude, and other AI assistants.",
    url: "https://aioli.tools/learn/optimize-for-chatgpt",
    type: "article",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Optimize for ChatGPT",
  description:
    "Learn how to make your website content more likely to be cited by ChatGPT, Claude, and other AI assistants.",
  step: [
    {
      "@type": "HowToStep",
      name: "Add Schema.org Markup",
      text: "Implement structured data to help AI understand your content.",
    },
    {
      "@type": "HowToStep",
      name: "Create FAQ Sections",
      text: "Add frequently asked questions in a clear Q&A format.",
    },
    {
      "@type": "HowToStep",
      name: "Include Citable Facts",
      text: "Add specific statistics, data, and quotable statements.",
    },
    {
      "@type": "HowToStep",
      name: "Show Expertise",
      text: "Add author information, dates, and source references.",
    },
  ],
};

export default function OptimizeForChatGPTPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Learn
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-zinc-500 mb-6">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              8 min read
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              January 2, 2026
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-8">
            How to Optimize for ChatGPT
          </h1>

          {/* Lead */}
          <p className="text-xl text-zinc-300 mb-12 leading-relaxed">
            Want ChatGPT, Claude, and Perplexity to cite your website when answering questions?
            Here&apos;s a practical guide to making your content AI-friendly.
          </p>

          {/* Quick Wins Box */}
          <div className="mb-12 p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h2 className="text-lg font-medium text-white mb-4">Quick Wins Checklist</h2>
            <ul className="space-y-3">
              {[
                "Add Schema.org JSON-LD markup",
                "Create an FAQ section",
                "Include specific statistics",
                "Add author and publication date",
                "Use clear heading structure",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-2xl font-medium text-white mt-12 mb-4">
              Understanding How ChatGPT Finds Information
            </h2>
            <p className="text-zinc-300 mb-6">
              ChatGPT (with browsing enabled), Claude, and Perplexity can access web content in
              real-time. When users ask questions, these AI assistants search the web and synthesize
              answers from multiple sources. To be cited, your content needs to be:
            </p>
            <ol className="list-decimal list-inside text-zinc-300 mb-6 space-y-2">
              <li><strong className="text-white">Discoverable</strong> — Indexed and crawlable</li>
              <li><strong className="text-white">Understandable</strong> — Well-structured with clear information</li>
              <li><strong className="text-white">Trustworthy</strong> — Showing expertise and authority</li>
              <li><strong className="text-white">Citable</strong> — Containing specific, quotable facts</li>
            </ol>

            <h2 className="text-2xl font-medium text-white mt-12 mb-4">
              Step 1: Implement Schema.org Markup
            </h2>
            <p className="text-zinc-300 mb-6">
              Schema.org structured data is the single most important factor for AI visibility.
              It tells AI systems exactly what your content is about in a machine-readable format.
            </p>

            <h3 className="text-xl font-medium text-white mt-8 mb-3">
              Essential Schema Types
            </h3>
            <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2">
              <li><strong className="text-white">Organization</strong> — For your company/brand</li>
              <li><strong className="text-white">Article/BlogPosting</strong> — For content pages</li>
              <li><strong className="text-white">FAQPage</strong> — For FAQ sections</li>
              <li><strong className="text-white">Product</strong> — For product pages</li>
              <li><strong className="text-white">HowTo</strong> — For tutorial content</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-8 mb-3">
              Example: FAQPage Schema
            </h3>
            <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-zinc-300 mb-6">
{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is AI visibility?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "AI visibility measures how well..."
    }
  }]
}`}
            </pre>

            <h2 className="text-2xl font-medium text-white mt-12 mb-4">
              Step 2: Create FAQ Sections
            </h2>
            <p className="text-zinc-300 mb-6">
              AI assistants love FAQ content because it&apos;s already in question-answer format—exactly
              how users interact with them. Every page on your site should consider having an FAQ section.
            </p>

            <div className="my-8 p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
              <h4 className="text-white font-medium mb-4">Good FAQ Example:</h4>
              <p className="text-zinc-400 mb-2">
                <strong className="text-zinc-300">Q: How long does shipping take?</strong>
              </p>
              <p className="text-zinc-400">
                A: Standard shipping takes 3-5 business days. Express shipping (additional $9.99)
                delivers within 1-2 business days. Free shipping on orders over $50.
              </p>
            </div>

            <p className="text-zinc-300 mb-6">
              Notice how the answer includes specific numbers and options. This is highly citable.
            </p>

            <h2 className="text-2xl font-medium text-white mt-12 mb-4">
              Step 3: Include Citable Facts
            </h2>
            <p className="text-zinc-300 mb-6">
              AI assistants prefer citing content that contains:
            </p>

            <div className="grid md:grid-cols-2 gap-4 my-8">
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <h4 className="text-red-400 font-medium mb-2">❌ Not Citable</h4>
                <p className="text-zinc-400 text-sm">
                  &quot;Our product is really fast and helps many businesses.&quot;
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <h4 className="text-emerald-400 font-medium mb-2">✓ Citable</h4>
                <p className="text-zinc-400 text-sm">
                  &quot;Our product reduces page load time by 47%, based on tests across 1,000 websites.&quot;
                </p>
              </div>
            </div>

            <h3 className="text-xl font-medium text-white mt-8 mb-3">
              Types of Citable Content
            </h3>
            <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2">
              <li><strong className="text-white">Statistics</strong> — &quot;87% of users reported...&quot;</li>
              <li><strong className="text-white">Definitions</strong> — &quot;AI visibility is defined as...&quot;</li>
              <li><strong className="text-white">Comparisons</strong> — &quot;Unlike X, our approach...&quot;</li>
              <li><strong className="text-white">Step-by-step processes</strong> — &quot;First... then... finally...&quot;</li>
              <li><strong className="text-white">Quotes</strong> — Memorable statements from experts</li>
            </ul>

            <h2 className="text-2xl font-medium text-white mt-12 mb-4">
              Step 4: Show Your Expertise (E-E-A-T)
            </h2>
            <p className="text-zinc-300 mb-6">
              AI systems evaluate source credibility. Demonstrate expertise by adding:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2">
              <li><strong className="text-white">Author bylines</strong> with credentials</li>
              <li><strong className="text-white">Publication dates</strong> (and &quot;last updated&quot; dates)</li>
              <li><strong className="text-white">Source citations</strong> and links to research</li>
              <li><strong className="text-white">About page</strong> with company/author information</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-8 mb-3">
              Example Author Section
            </h3>
            <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto text-sm text-zinc-300 mb-6">
{`<article>
  <header>
    <time datetime="2026-01-02">January 2, 2026</time>
    <span>By Jane Smith, SEO Director</span>
  </header>
  <!-- content -->
  <footer>
    <p>Last updated: January 2, 2026</p>
  </footer>
</article>`}
            </pre>

            <h2 className="text-2xl font-medium text-white mt-12 mb-4">
              Step 5: Optimize Technical Factors
            </h2>
            <p className="text-zinc-300 mb-6">
              Make sure AI crawlers can access your content:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2">
              <li><strong className="text-white">robots.txt</strong> — Allow GPTBot and ClaudeBot</li>
              <li><strong className="text-white">sitemap.xml</strong> — Help crawlers find all pages</li>
              <li><strong className="text-white">Fast loading</strong> — Slow pages may be skipped</li>
              <li><strong className="text-white">Clean HTML</strong> — Avoid JavaScript-only content</li>
            </ul>

            <div className="my-8 p-6 rounded-2xl bg-zinc-900/50 border border-white/5">
              <h4 className="text-white font-medium mb-2">robots.txt Example:</h4>
              <pre className="text-zinc-400 text-sm">
{`User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: *
Allow: /

Sitemap: https://yoursite.com/sitemap.xml`}
              </pre>
            </div>

            <h2 className="text-2xl font-medium text-white mt-12 mb-4">
              Measuring Your Progress
            </h2>
            <p className="text-zinc-300 mb-6">
              Unlike traditional SEO rankings, it&apos;s hard to track when AI cites you. However, you can:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2">
              <li>Use Aioli™ to measure your AI visibility score</li>
              <li>Monitor referral traffic from ai.com, perplexity.ai, etc.</li>
              <li>Periodically ask ChatGPT questions about your niche and check if you&apos;re cited</li>
              <li>Track brand mentions using tools like Google Alerts</li>
            </ul>

            <div className="my-12 p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
              <h3 className="text-lg font-medium text-white mb-2">
                Check Your AI Visibility Score
              </h3>
              <p className="text-zinc-400 mb-4">
                See how well your website is optimized for ChatGPT, Claude, and other AI assistants.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Analyze your website free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-16 pt-8 border-t border-white/10 flex justify-between">
            <div>
              <span className="text-sm text-zinc-500">Previous</span>
              <Link
                href="/learn/what-is-ai-visibility"
                className="group flex items-center gap-2 mt-2"
              >
                <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:-translate-x-1 transition-all" />
                <span className="text-white group-hover:text-emerald-400 transition-colors">
                  What is AI Visibility?
                </span>
              </Link>
            </div>
            <div className="text-right">
              <span className="text-sm text-zinc-500">Next</span>
              <Link
                href="/learn/ai-seo-vs-traditional-seo"
                className="group flex items-center gap-2 mt-2"
              >
                <span className="text-white group-hover:text-emerald-400 transition-colors">
                  AI SEO vs Traditional SEO
                </span>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-3xl mx-auto text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} Aioli. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
