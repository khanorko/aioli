"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Building2,
  Globe,
  Briefcase,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

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

// Industry options
const industries = [
  "Technology",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Real Estate",
  "Consulting",
  "Marketing",
  "Construction",
  "Retail",
  "Food & Beverage",
  "Travel & Tourism",
  "Other",
];

export function BrandCheckClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.email) {
      signIn("google");
      return;
    }

    if (!brandName.trim()) {
      setError("Please enter a brand name");
      return;
    }

    setIsLoading(true);
    setError("");

    // Process website URL
    let processedWebsite = website.trim();
    if (processedWebsite && !processedWebsite.startsWith("http://") && !processedWebsite.startsWith("https://")) {
      processedWebsite = "https://" + processedWebsite;
    }

    try {
      const response = await fetch("/api/brand-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim(),
          website: processedWebsite || undefined,
          industry: industry || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          router.push("/#pricing");
          return;
        }
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        throw new Error(errorMsg || "Something went wrong");
      }

      router.push(`/brand-check/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  const statusExamples = [
    {
      status: "known",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      label: "Known",
      description: "AI accurately describes your brand",
    },
    {
      status: "partial",
      icon: AlertCircle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      label: "Partial",
      description: "AI has some but incomplete info",
    },
    {
      status: "unknown",
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      label: "Unknown",
      description: "AI doesn't know your brand",
    },
    {
      status: "confused",
      icon: HelpCircle,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      label: "Confused",
      description: "AI confuses with another entity",
    },
  ];

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
        <section id="main" className="relative pt-32 pb-16 px-6 overflow-hidden">
          {/* Aurora effect */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] max-w-[1200px] h-[600px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 50% 35% at 50% 0%, rgba(59, 130, 246, 0.15), transparent 60%)",
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
                    background: "rgba(59, 130, 246, 0.1)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    color: "rgba(147, 197, 253, 1)",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                  AI Brand Visibility Check
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
                  Does AI know
                </span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, rgba(147, 197, 253, 0.9) 0%, rgba(59, 130, 246, 0.8) 100%)",
                  }}
                >
                  your business?
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl max-w-2xl mx-auto mb-12"
                style={{ color: "var(--text-muted)" }}
              >
                Check how ChatGPT, Claude, and other AI assistants perceive your brand.
                Get your visibility score and recommendations to improve.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="pb-20 px-6">
          <div className="max-w-xl mx-auto">
            {status === "loading" ? (
              <div className="glass-card p-8 animate-pulse">
                <div className="h-14 bg-white/5 rounded-lg mb-4" />
                <div className="h-14 bg-white/5 rounded-lg mb-4" />
                <div className="h-14 bg-white/5 rounded-lg" />
              </div>
            ) : session ? (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="glass-card p-8"
              >
                {/* Brand Name */}
                <div className="mb-6">
                  <label htmlFor="brandName" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Brand / Company Name *
                  </label>
                  <div className="relative">
                    <Building2
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <input
                      id="brandName"
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g., Swepac AB"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Website (optional) */}
                <div className="mb-6">
                  <label htmlFor="website" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Website <span className="text-zinc-600">(optional)</span>
                  </label>
                  <div className="relative">
                    <Globe
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <input
                      id="website"
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="example.com"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Industry (optional) */}
                <div className="mb-8">
                  <label htmlFor="industry" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Industry <span className="text-zinc-600">(optional)</span>
                  </label>
                  <div className="relative">
                    <Briefcase
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <select
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    >
                      <option value="" className="bg-zinc-900">
                        Select industry...
                      </option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind} className="bg-zinc-900">
                          {ind}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-zinc-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Credits info */}
                <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm text-blue-200">
                        This check uses <span className="font-medium">1 credit</span>
                      </p>
                      <p className="text-xs text-blue-300/60 mt-0.5">
                        You have {session.user.credits || 0} credits available
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
                  disabled={isLoading || !brandName.trim()}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Checking AI visibility...
                    </>
                  ) : (
                    <>
                      Check AI Visibility
                      <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                    </>
                  )}
                </button>

                {/* Need credits link */}
                {(session.user.credits || 0) < 1 && (
                  <p className="text-center text-sm text-zinc-500 mt-4">
                    Need credits?{" "}
                    <Link href="/#pricing" className="text-blue-400 hover:underline">
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
                  Sign in to check your brand visibility
                </p>
                <button
                  onClick={() => signIn("google")}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
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

        {/* Status Examples */}
        <section className="pb-24 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-4">
                What you&apos;ll discover
              </h2>
              <p className="text-[var(--text-secondary)]">
                We check if AI assistants know your brand
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statusExamples.map((item, i) => (
                <motion.div
                  key={item.status}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-2xl border border-white/10 ${item.bgColor}`}
                >
                  <item.icon className={`w-8 h-8 ${item.color} mb-4`} strokeWidth={1.5} />
                  <h3 className="font-medium mb-1">{item.label}</h3>
                  <p className="text-xs text-zinc-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
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
              <h3 className="text-xl font-medium mb-3">Also analyze your website</h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Check how AI-optimized your website content is with our SEO analysis tool.
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
              <p className="text-sm text-[var(--text-muted)]">
                AI Brand Visibility Check
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
