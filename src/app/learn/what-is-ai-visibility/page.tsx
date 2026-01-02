import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "What is AI Visibility? Definition & Complete Guide | AIoli",
  description:
    "AI visibility is the measure of how well your website content can be discovered, understood, and cited by AI assistants like ChatGPT, Claude, and Perplexity. Learn the key factors.",
  alternates: {
    canonical: "/learn/what-is-ai-visibility",
  },
  openGraph: {
    title: "What is AI Visibility? Definition & Complete Guide",
    description:
      "AI visibility is the measure of how well your website content can be discovered, understood, and cited by AI assistants.",
    url: "https://aioli-one.vercel.app/learn/what-is-ai-visibility",
    type: "article",
  },
};

// JSON-LD for Article
const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What is AI Visibility? Definition & Complete Guide",
  description:
    "AI visibility is the measure of how well your website content can be discovered, understood, and cited by AI assistants like ChatGPT, Claude, and Perplexity.",
  author: {
    "@type": "Organization",
    name: "AIoli",
    url: "https://aioli-one.vercel.app",
  },
  publisher: {
    "@type": "Organization",
    name: "AIoli",
    url: "https://aioli-one.vercel.app",
  },
  datePublished: "2026-01-02",
  dateModified: "2026-01-02",
};

export default function WhatIsAIVisibilityPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* JSON-LD */}
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
              5 min read
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              January 2, 2026
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-8">
            What is AI Visibility?
          </h1>

          {/* Lead */}
          <p className="text-xl text-zinc-300 mb-12 leading-relaxed">
            <strong className="text-white">AI visibility</strong> is the measure of how well your
            website content can be discovered, understood, and cited by AI assistants like
            ChatGPT, Claude, Perplexity, and Google&apos;s AI Overviews.
          </p>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-2xl font-medium text-white mt-12 mb-4">
              Why AI Visibility Matters
            </h2>
            <p className="text-zinc-300 mb-6">
              In 2024, over 100 million people use ChatGPT weekly. When users ask AI assistants
              questions about topics your website covers, will your content be cited? AI visibility
              determines whether your website becomes a source that AI systems reference—or remains
              invisible to this new discovery channel.
            </p>

            <figure className="my-8 pl-6 border-l-2 border-emerald-500/50">
              <blockquote className="text-xl font-light italic text-zinc-300">
                &quot;AI visibility is to the 2020s what SEO was to the 2000s—the businesses that
                understand it early will dominate their niches.&quot;
              </blockquote>
            </figure>

            <h2 className="text-2xl font-medium text-white mt-12 mb-4">
              The 4 Pillars of AI Visibility
            </h2>

            <h3 className="text-xl font-medium text-white mt-8 mb-3">
              1. Structured Data (Schema.org)
            </h3>
            <p className="text-zinc-300 mb-6">
              AI systems rely heavily on structured data to understand your content. Schema.org
              markup tells AI exactly what your page is about—whether it&apos;s a product, article,
              FAQ, or organization. Pages with proper Schema.org markup are <strong className="text-white">3x more
              likely</strong> to be cited by AI assistants.
            </p>

            <h3 className="text-xl font-medium text-white mt-8 mb-3">
              2. Content Clarity
            </h3>
            <p className="text-zinc-300 mb-6">
              AI assistants extract information best from clear, well-structured content. This means:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2">
              <li>Short paragraphs (2-3 sentences)</li>
              <li>FAQ sections with clear questions and answers</li>
              <li>Definitions for key terms</li>
              <li>Logical heading hierarchy (H1 → H2 → H3)</li>
            </ul>

            <h3 className="text-xl font-medium text-white mt-8 mb-3">
              3. Citability
            </h3>
            <p className="text-zinc-300 mb-6">
              Citable content contains specific facts, statistics, and quotable statements that
              AI can reference. Content that says &quot;our product is great&quot; is not citable.
              Content that says &quot;our product reduces load time by 47% on average&quot; is highly citable.
            </p>

            <h3 className="text-xl font-medium text-white mt-8 mb-3">
              4. E-E-A-T Signals
            </h3>
            <p className="text-zinc-300 mb-6">
              Experience, Expertise, Authoritativeness, and Trustworthiness matter to AI systems
              just as they do to Google. AI assistants prefer citing sources that show:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2">
              <li>Author information and credentials</li>
              <li>Publication and update dates</li>
              <li>References to primary sources</li>
              <li>Clear organizational identity</li>
            </ul>

            <h2 className="text-2xl font-medium text-white mt-12 mb-4">
              How to Measure AI Visibility
            </h2>
            <p className="text-zinc-300 mb-6">
              Unlike traditional SEO where you can track rankings, AI visibility is harder to
              measure directly. However, you can assess your readiness by analyzing:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-6 space-y-2">
              <li><strong className="text-white">Schema.org implementation</strong> — Do you have structured data?</li>
              <li><strong className="text-white">Content structure</strong> — Are your pages easy to parse?</li>
              <li><strong className="text-white">Citable elements</strong> — Do you have quotable facts and statistics?</li>
              <li><strong className="text-white">Author signals</strong> — Is your expertise visible?</li>
            </ul>

            <div className="my-12 p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
              <h3 className="text-lg font-medium text-white mb-2">
                Check Your AI Visibility Score
              </h3>
              <p className="text-zinc-400 mb-4">
                AIoli analyzes your website for all four pillars and gives you an actionable
                score with specific recommendations.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Analyze your website free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <h2 className="text-2xl font-medium text-white mt-12 mb-4">
              AI Visibility vs Traditional SEO
            </h2>
            <p className="text-zinc-300 mb-6">
              AI visibility and traditional SEO are complementary but different. While SEO focuses
              on ranking in search results, AI visibility focuses on being cited as a source.
              The good news? Many AI visibility best practices also improve your SEO.
            </p>

            <table className="w-full my-8 text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 text-zinc-400 font-medium">Factor</th>
                  <th className="text-left py-3 text-zinc-400 font-medium">Traditional SEO</th>
                  <th className="text-left py-3 text-zinc-400 font-medium">AI Visibility</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-b border-white/5">
                  <td className="py-3">Goal</td>
                  <td className="py-3">Rank in search results</td>
                  <td className="py-3">Be cited by AI</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Keywords</td>
                  <td className="py-3">Very important</td>
                  <td className="py-3">Less important</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Schema.org</td>
                  <td className="py-3">Nice to have</td>
                  <td className="py-3">Essential</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3">Content length</td>
                  <td className="py-3">Longer is often better</td>
                  <td className="py-3">Clarity over length</td>
                </tr>
                <tr>
                  <td className="py-3">Backlinks</td>
                  <td className="py-3">Critical</td>
                  <td className="py-3">Helpful but less critical</td>
                </tr>
              </tbody>
            </table>

            <h2 className="text-2xl font-medium text-white mt-12 mb-4">
              Getting Started
            </h2>
            <p className="text-zinc-300 mb-6">
              Improving your AI visibility doesn&apos;t require a complete website overhaul. Start with
              these high-impact actions:
            </p>
            <ol className="list-decimal list-inside text-zinc-300 mb-6 space-y-2">
              <li>Add Schema.org markup (Organization, Article, FAQ)</li>
              <li>Create an FAQ section with clear Q&A format</li>
              <li>Include specific statistics and data in your content</li>
              <li>Add author information and publication dates</li>
              <li>Structure content with clear headings</li>
            </ol>
          </div>

          {/* Next Article */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <span className="text-sm text-zinc-500">Next article</span>
            <Link
              href="/learn/optimize-for-chatgpt"
              className="group flex items-center justify-between mt-2"
            >
              <span className="text-lg text-white group-hover:text-emerald-400 transition-colors">
                How to Optimize for ChatGPT
              </span>
              <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-3xl mx-auto text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} AIoli. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
