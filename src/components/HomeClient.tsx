"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Cpu,
  FileText,
  Zap,
  BarChart3,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ScanSelector } from "@/components/ScanSelector";
import { CreditPackageCards, CreditsExplainer } from "@/components/PricingCard";
import { AIReadinessQuiz } from "@/components/AIReadinessQuiz";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setSuccessMessage("Payment successful! Your credits have been added.");
      window.history.replaceState({}, "", "/");
      setTimeout(() => setSuccessMessage(""), 5000);
    }
    if (searchParams.get("canceled") === "true") {
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams]);

  const handleAnalyze = async (urls: string[], scanType: "single" | "site") => {
    if (!session?.user?.email) {
      signIn("google");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls, scanType }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsCredits) {
          router.push("/#pricing");
          setIsLoading(false);
          return;
        }
        throw new Error(data.error || "Something went wrong");
      }

      if (data.type === "site") {
        router.push(`/scan/${data.id}`);
      } else {
        router.push(`/analysis/${data.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Search,
      title: "SEO Analysis",
      description: "Deep scan of meta tags, headings, and technical optimization.",
      stat: "50+",
      statLabel: "checks",
    },
    {
      icon: Cpu,
      title: "AI Visibility",
      description: "How ChatGPT & Claude perceive your content.",
      stat: "Real-time",
      statLabel: "scoring",
    },
    {
      icon: FileText,
      title: "Smart Reports",
      description: "AI-powered suggestions with priority ranking.",
      stat: "PDF",
      statLabel: "export",
    },
  ];

  const metrics = [
    { value: "10K+", label: "Pages Analyzed" },
    { value: "98%", label: "Accuracy Rate" },
    { value: "<3s", label: "Avg. Scan Time" },
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Background texture image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/din-genererade-bild.jpg"
          alt=""
          fill
          className="object-cover mix-blend-overlay opacity-40"
          priority
        />
        {/* Gradient fade so text remains readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]" />
      </div>

      {/* Content layer */}
      <div className="relative z-10">
        {/* Navbar */}
        <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Aurora glow effect - enhanced */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] max-w-[1200px] h-[600px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 35% at 50% 0%, rgba(245, 245, 240, 0.15), transparent 60%)",
          }}
        />
        {/* Primary light halo behind headline */}
        <div
          className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(255, 255, 255, 0.08), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Secondary aurora blob - blue tint */}
        <div
          className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(100, 130, 200, 0.12), transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center"
          >
            {/* Badge - enhanced with border and blur */}
            <motion.div variants={fadeUp} className="mb-8">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "var(--text-secondary)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
                AI-Powered SEO Analysis
              </span>
            </motion.div>

            {/* Headline - visual h1 (actual h1 is in server component) */}
            <motion.div
              variants={fadeUp}
              className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6"
              style={{ letterSpacing: "-0.03em" }}
              aria-hidden="true"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.7) 100%)",
                }}
              >
                How visible is your site
              </span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(180deg, rgba(161, 161, 170, 0.9) 0%, rgba(113, 113, 122, 0.8) 100%)",
                }}
              >
                to AI assistants?
              </span>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl max-w-2xl mx-auto mb-14"
              style={{ color: "var(--text-muted)" }}
            >
              Analyze your website for both traditional SEO and AI visibility.
              Get insights into how Google, ChatGPT, and Claude perceive your content.
            </motion.p>

            {/* CTA Section */}
            <motion.div variants={fadeUp} className="max-w-2xl mx-auto">
              {status === "loading" ? (
                <div className="glass-card p-4 animate-pulse">
                  <div className="h-14 bg-white/5 rounded-lg" />
                </div>
              ) : session ? (
                <ScanSelector
                  onAnalyze={handleAnalyze}
                  isLoading={isLoading}
                  userCredits={session.user.credits || 0}
                />
              ) : (
                <div className="glass-card p-8 text-center">
                  <p className="text-[var(--text-secondary)] mb-6">
                    Sign in to start analyzing your website
                  </p>
                  <button
                    onClick={() => signIn("google")}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                    <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Messages */}
            {successMessage && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-[var(--score-great)]"
              >
                {successMessage}
              </motion.p>
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-[var(--score-poor)]"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-8 px-6">
        <figure className="max-w-3xl mx-auto pl-6 border-l-2 border-emerald-500/50">
          <blockquote className="text-xl font-light italic text-zinc-300 tracking-wide">
            "Traditional SEO optimizes for clicks; AIoli optimizes for answers."
          </blockquote>
          <figcaption className="mt-4 text-sm font-mono text-zinc-500">
            — The AIoli Methodology
          </figcaption>
        </figure>
      </section>

      {/* Metrics Bar - Bento Cards */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Glass card */}
                <div
                  className="p-6 rounded-2xl text-center backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02]"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.10)",
                  }}
                >
                  <div
                    className="font-mono text-3xl font-light mb-1 bg-clip-text text-transparent"
                    style={{
                      backgroundImage: "linear-gradient(180deg, #EDEDED 0%, #A1A1AA 100%)",
                    }}
                  >
                    {metric.value}
                  </div>
                  <div className="text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                    {metric.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Bento Grid */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              Everything you need to optimize
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Comprehensive analysis tools designed for the AI era
            </p>
          </motion.div>

          <div className="bento-grid">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bento-item"
              >
                <div className="icon-box mb-6">
                  <feature.icon
                    className="w-5 h-5 text-[var(--text-secondary)]"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  {feature.description}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-light">{feature.stat}</span>
                  <span className="stat-label">{feature.statLabel}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Section - Only visible when logged in */}
      {session && (
        <section id="quiz" className="py-16 px-6 border-t border-white/5">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <AIReadinessQuiz />
            </motion.div>
          </div>
        </section>
      )}

      {/* Why AIoli Section */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6">
                Built for the
                <br />
                <span className="text-[var(--text-secondary)]">AI-first web</span>
              </h2>
              <p className="text-[var(--text-secondary)] mb-8">
                Traditional SEO tools miss how AI assistants interpret your content.
                AIoli bridges that gap with dual analysis for search engines and LLMs.
              </p>
              <div className="space-y-4">
                {[
                  { icon: BarChart3, text: "Comprehensive scoring system" },
                  { icon: Shield, text: "Schema.org & structured data analysis" },
                  { icon: Zap, text: "Real-time AI crawler compatibility" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <div className="text-center">
                <div className="stat-value mb-2">87</div>
                <div className="stat-label mb-6">AI Visibility Score</div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--score-good)] to-[var(--score-great)] rounded-full"
                    style={{ width: "87%" }}
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Example score from aioli.se analysis
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
              Buy credits
            </h2>
            <p className="text-[var(--text-secondary)]">Analyze free - unlock details with credits</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <CreditPackageCards />
            <CreditsExplainer />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="AIoli"
                width={100}
                height={40}
                className="h-8 w-auto opacity-60"
              />
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              SEO & AI Visibility Analysis
            </p>
          </div>
        </div>
      </footer>
      </div>{/* End content layer */}
    </div>
  );
}
