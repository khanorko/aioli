import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, BarChart3, Brain, Trophy } from "lucide-react";

export const metadata: Metadata = {
  title: "Learn AI Visibility - Free Guides & Tutorials | Aioli™",
  description:
    "Master AI visibility with our free guides. Learn how to optimize your website for ChatGPT, Claude, and Perplexity. Includes practical tutorials on Schema.org, content structure, and E-E-A-T.",
  alternates: {
    canonical: "/learn",
  },
  openGraph: {
    title: "Learn AI Visibility - Free Guides & Tutorials | Aioli™",
    description:
      "Master AI visibility with our free guides. Learn how to optimize for ChatGPT, Claude, and other AI assistants.",
    url: "https://aioli-one.vercel.app/learn",
  },
};

// Schema.org CollectionPage for the learning center
const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "AI Visibility Learning Center",
  description:
    "Free educational resources about AI visibility, SEO optimization for AI assistants, and modern search strategies.",
  url: "https://aioli-one.vercel.app/learn",
  provider: {
    "@type": "Organization",
    name: "Aioli",
    url: "https://aioli-one.vercel.app",
  },
  hasPart: [
    {
      "@type": "Article",
      name: "What is AI Visibility?",
      url: "https://aioli-one.vercel.app/learn/what-is-ai-visibility",
      description:
        "Understand how AI assistants discover, interpret, and cite your website content.",
    },
    {
      "@type": "HowTo",
      name: "How to Optimize for ChatGPT",
      url: "https://aioli-one.vercel.app/learn/optimize-for-chatgpt",
      description:
        "A practical guide to making your website more likely to be cited by AI assistants.",
    },
    {
      "@type": "Article",
      name: "AI SEO vs Traditional SEO",
      url: "https://aioli-one.vercel.app/learn/ai-seo-vs-traditional-seo",
      description:
        "Key differences between optimizing for Google and optimizing for AI assistants.",
    },
  ],
};

// FAQ Schema for common questions
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is AI visibility?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI visibility measures how well your website content can be discovered, understood, and cited by AI assistants like ChatGPT, Claude, and Perplexity. High AI visibility means AI systems are more likely to reference your content when answering user questions.",
      },
    },
    {
      "@type": "Question",
      name: "How do I improve my AI visibility score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Improve AI visibility by implementing Schema.org structured data, creating FAQ sections, adding specific statistics and citable facts, showing author expertise (E-E-A-T), and ensuring AI crawlers can access your content through robots.txt.",
      },
    },
    {
      "@type": "Question",
      name: "Is AI SEO different from traditional SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, while they overlap, AI SEO focuses on being cited by AI assistants rather than ranking in search results. AI SEO prioritizes structured data, content clarity, and citability over keywords and backlinks.",
      },
    },
  ],
};

const articles = [
  {
    slug: "what-is-ai-visibility",
    title: "What is AI Visibility?",
    description:
      "Understand how AI assistants like ChatGPT and Claude discover, interpret, and cite your website content. Learn the key factors that determine your AI visibility score.",
    icon: Sparkles,
    readTime: "5 min read",
    category: "Fundamentals",
  },
  {
    slug: "optimize-for-chatgpt",
    title: "How to Optimize for ChatGPT",
    description:
      "A practical guide to making your website content more likely to be cited by ChatGPT, Claude, and other AI assistants. Actionable tips you can implement today.",
    icon: BookOpen,
    readTime: "8 min read",
    category: "Guide",
  },
  {
    slug: "ai-seo-vs-traditional-seo",
    title: "AI SEO vs Traditional SEO",
    description:
      "What's the difference between optimizing for Google and optimizing for AI? Learn how the two approaches complement each other and where they differ.",
    icon: BarChart3,
    readTime: "6 min read",
    category: "Comparison",
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Aioli™
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Learning Center
          </span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6">
            Master AI Visibility
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Learn how to optimize your website for the AI era. Free guides on
            making your content discoverable by ChatGPT, Claude, Perplexity, and
            other AI assistants.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/learn/${article.slug}`}
                className="group block p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <article.icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>

                <h2 className="text-xl font-medium text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {article.title}
                </h2>

                <p className="text-sm text-zinc-400 mb-4 line-clamp-3">
                  {article.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{article.readTime}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 flex-shrink-0">
                <Brain className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-medium text-white mb-2">
                  Test Your Knowledge
                </h2>
                <p className="text-zinc-400 mb-4">
                  Read the articles above, then take our AI Visibility Quiz! Score 100% to earn
                  a <span className="text-amber-400 font-medium">free credit</span>. Questions are
                  randomly selected from a pool of 20.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/quiz"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition-colors"
                  >
                    <Trophy className="w-4 h-4" />
                    Take the Quiz
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>+1 credit for perfect score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-light text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="group p-5 rounded-xl border border-white/10 bg-white/[0.02]">
              <summary className="flex items-center justify-between cursor-pointer list-none text-white font-medium">
                What is AI visibility?
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
                AI visibility measures how well your website content can be discovered, understood, and cited by AI assistants like ChatGPT, Claude, and Perplexity. High AI visibility means AI systems are more likely to reference your content when answering user questions.
              </p>
            </details>
            <details className="group p-5 rounded-xl border border-white/10 bg-white/[0.02]">
              <summary className="flex items-center justify-between cursor-pointer list-none text-white font-medium">
                How do I improve my AI visibility score?
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
                Improve AI visibility by implementing Schema.org structured data, creating FAQ sections, adding specific statistics and citable facts, showing author expertise (E-E-A-T), and ensuring AI crawlers can access your content through robots.txt.
              </p>
            </details>
            <details className="group p-5 rounded-xl border border-white/10 bg-white/[0.02]">
              <summary className="flex items-center justify-between cursor-pointer list-none text-white font-medium">
                Is AI SEO different from traditional SEO?
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
                Yes, while they overlap, AI SEO focuses on being cited by AI assistants rather than ranking in search results. AI SEO prioritizes structured data, content clarity, and citability over keywords and backlinks.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
            <h2 className="text-2xl font-light text-white mb-4">
              Ready to check your AI visibility?
            </h2>
            <p className="text-zinc-400 mb-6">
              Run a free analysis to see how AI assistants perceive your website.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
            >
              Analyze your site
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-5xl mx-auto text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} Aioli. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
