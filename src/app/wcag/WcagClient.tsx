"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  ArrowRight,
  Shield,
  Eye,
  Hand,
  Brain,
  Wrench,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

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

// POUR principles
const pourPrinciples = [
  {
    key: "perceivable",
    name: "Perceivable",
    icon: Eye,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    description: "Information must be presentable in ways users can perceive",
  },
  {
    key: "operable",
    name: "Operable",
    icon: Hand,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    description: "Interface components must be operable by all users",
  },
  {
    key: "understandable",
    name: "Understandable",
    icon: Brain,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    description: "Content must be readable and understandable",
  },
  {
    key: "robust",
    name: "Robust",
    icon: Wrench,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    description: "Content must work with assistive technologies",
  },
];

// WCAG Level options
const levelOptions = [
  { value: "A", label: "Level A", description: "30 criteria - Essential accessibility" },
  { value: "AA", label: "Level AA", description: "50 criteria - Recommended (EU/ADA)" },
  { value: "AAA", label: "Level AAA", description: "86 criteria - Maximum accessibility" },
];

export function WcagClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [url, setUrl] = useState("");
  const [level, setLevel] = useState("AA");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDevMode, setIsDevMode] = useState(false);

  // Dev mode bypass for localhost - must use useEffect to avoid hydration mismatch
  useEffect(() => {
    const isLocalhost = window.location.hostname === "localhost";
    setIsDevMode(isLocalhost && process.env.NODE_ENV === "development");
  }, []);

  const effectiveSession = isDevMode ? { user: { email: "dev@localhost", credits: 20 } } : session;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!effectiveSession?.user?.email) {
      signIn("google");
      return;
    }

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Validate URL
    let processedUrl = url.trim();
    if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
      processedUrl = "https://" + processedUrl;
    }

    try {
      new URL(processedUrl);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/wcag/quick-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: processedUrl,
          level,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          router.push("/#pricing");
          return;
        }
        throw new Error(data.error || "Something went wrong");
      }

      router.push(`/wcag/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/din-genererade-bild.jpg"
          alt=""
          fill
          className="object-cover mix-blend-overlay opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6 overflow-hidden">
          {/* Aurora effect - green for accessibility */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] max-w-[1200px] h-[600px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 50% 35% at 50% 0%, rgba(16, 185, 129, 0.15), transparent 60%)",
            }}
          />

          <div className="relative max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center"
            >
              {/* Badge */}
              <motion.div variants={fadeUp} className="mb-8">
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md"
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    color: "rgba(110, 231, 183, 1)",
                  }}
                >
                  <Shield className="w-3.5 h-3.5" strokeWidth={1.5} />
                  WCAG 2.2 Accessibility Audit
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-6"
                style={{ letterSpacing: "-0.03em" }}
              >
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.7) 100%)",
                  }}
                >
                  Is your site
                </span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, rgba(110, 231, 183, 0.9) 0%, rgba(16, 185, 129, 0.8) 100%)",
                  }}
                >
                  accessible?
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl max-w-2xl mx-auto mb-12"
                style={{ color: "var(--text-muted)" }}
              >
                AI-powered WCAG 2.2 accessibility audit. Test 50+ criteria and get actionable fixes
                to make your website accessible to everyone.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="pb-20 px-6">
          <div className="max-w-xl mx-auto">
            {status === "loading" && !isDevMode ? (
              <div className="glass-card p-8 animate-pulse">
                <div className="h-14 bg-white/5 rounded-lg mb-4" />
                <div className="h-14 bg-white/5 rounded-lg mb-4" />
                <div className="h-14 bg-white/5 rounded-lg" />
              </div>
            ) : effectiveSession ? (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="glass-card p-8"
              >
                {/* URL Input */}
                <div className="mb-6">
                  <label
                    htmlFor="wcag-url"
                    className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                  >
                    Website URL *
                  </label>
                  <div className="relative">
                    <Globe
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
                      strokeWidth={1.5}
                    />
                    <input
                      id="wcag-url"
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="example.com"
                      aria-label="Enter website URL to audit"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* WCAG Level Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                    WCAG Conformance Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {levelOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setLevel(option.value)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          level === option.value
                            ? "bg-emerald-500/10 border-emerald-500/50"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div
                          className={`font-medium mb-1 ${
                            level === option.value ? "text-emerald-400" : "text-white"
                          }`}
                        >
                          {option.label}
                        </div>
                        <div className="text-xs text-zinc-500">{option.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Credits info */}
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm text-emerald-200">
                        WCAG audit uses <span className="font-medium">1 credit</span>
                      </p>
                      <p className="text-xs text-emerald-300/60 mt-0.5">
                        You have {effectiveSession.user.credits || 0} credits available
                        {isDevMode && " (dev mode)"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || !url.trim()}
                  className="w-full flex items-center justify-center gap-2 py-4 text-base font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running WCAG audit...
                    </>
                  ) : (
                    <>
                      Run Accessibility Audit
                      <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                    </>
                  )}
                </button>

                {/* Need credits link */}
                {!isDevMode && (effectiveSession.user.credits || 0) < 1 && (
                  <p className="text-center text-sm text-zinc-500 mt-4">
                    Need credits?{" "}
                    <Link href="/#pricing" className="text-emerald-400 hover:underline">
                      Buy credits
                    </Link>
                  </p>
                )}
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 text-center"
              >
                <p className="text-[var(--text-secondary)] mb-6">
                  Sign in to run accessibility audits
                </p>
                <button
                  onClick={() => signIn("google")}
                  className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-xl transition-all"
                  style={{
                    background: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
                    boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
                  }}
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
              </motion.div>
            )}
          </div>
        </section>

        {/* POUR Principles */}
        <section className="pb-24 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-4">
                POUR Principles
              </h2>
              <p className="text-[var(--text-secondary)]">
                We analyze all four WCAG accessibility pillars
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pourPrinciples.map((principle, i) => (
                <motion.div
                  key={principle.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-2xl border ${principle.bgColor} ${principle.borderColor}`}
                >
                  <principle.icon
                    className={`w-8 h-8 ${principle.color} mb-4`}
                    strokeWidth={1.5}
                  />
                  <h3 className="font-medium mb-1">{principle.name}</h3>
                  <p className="text-xs text-zinc-400">{principle.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="pb-24 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-4">
                What you get
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-4" strokeWidth={1.5} />
                <h3 className="font-medium mb-2">Automated Testing</h3>
                <p className="text-sm text-zinc-400">
                  16 criteria tested automatically with code-level precision
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <Brain className="w-8 h-8 text-purple-400 mb-4" strokeWidth={1.5} />
                <h3 className="font-medium mb-2">AI Analysis</h3>
                <p className="text-sm text-zinc-400">
                  7 criteria analyzed by AI for context-aware accessibility insights
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <AlertTriangle className="w-8 h-8 text-amber-400 mb-4" strokeWidth={1.5} />
                <h3 className="font-medium mb-2">Clear Guidance</h3>
                <p className="text-sm text-zinc-400">
                  Know exactly which criteria need browser or manual testing
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Compliance Info */}
        <section className="pb-24 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8"
            >
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <h3 className="text-lg font-medium mb-2">Why accessibility matters</h3>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li>
                      <strong className="text-zinc-300">EU Accessibility Act 2025:</strong> All
                      digital products must be accessible
                    </li>
                    <li>
                      <strong className="text-zinc-300">ADA Compliance:</strong> Required for US
                      businesses
                    </li>
                    <li>
                      <strong className="text-zinc-300">SEO Benefits:</strong> Google rewards
                      accessible websites
                    </li>
                    <li>
                      <strong className="text-zinc-300">1 billion users:</strong> 15% of world
                      population has a disability
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA to SEO Analysis */}
        <section className="pb-24 px-6">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center"
            >
              <h3 className="text-xl font-medium mb-3">Also check your SEO</h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Analyze how your website performs for both search engines and AI assistants.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                Try SEO Analysis
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
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
                  alt="Aioli"
                  width={100}
                  height={40}
                  className="h-8 w-auto opacity-60"
                />
              </div>
              <p className="text-sm text-[var(--text-muted)]">WCAG 2.2 Accessibility Audit</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
