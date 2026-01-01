"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { UrlInput } from "@/components/UrlInput";
import { Navigation } from "@/components/Navigation";
import { AnimatedElement, StaggerContainer, StaggerItem } from "@/components/motion/AnimatedElement";
import { HeroParallax } from "@/components/motion/ParallaxSection";
import { SparkleEffect } from "@/components/decorative/SparkleEffect";
import { CreditPackageCards, CreditsExplainer } from "@/components/PricingCard";
import { useLanguage } from "@/lib/LanguageContext";

// Lazy load 3D components (no SSR)
const Scene3D = dynamic(
  () => import("@/components/three/Scene3D").then((mod) => mod.Scene3D),
  { ssr: false }
);
const ParticleNetwork = dynamic(
  () => import("@/components/three/ParticleNetwork").then((mod) => mod.ParticleNetwork),
  { ssr: false }
);

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Check for success/canceled query params from Stripe
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setSuccessMessage(t.success.upgraded);
      // Clean URL
      window.history.replaceState({}, "", "/");
      // Auto-dismiss after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    }
    if (searchParams.get("canceled") === "true") {
      // Clean URL
      window.history.replaceState({}, "", "/");
    }
  }, [searchParams, t.success.upgraded]);

  const handleAnalyze = async (url: string) => {
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
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.errors.generic);
      }

      router.push(`/analysis/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.generic);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed 3D Background */}
      <div className="canvas-container">
        <Scene3D>
          <ParticleNetwork count={90} connectionDistance={2.5} />
        </Scene3D>
      </div>

      {/* Gradient overlay */}
      <div
        className="fixed inset-0 z-1 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(45, 91, 255, 0.12), transparent),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(45, 91, 255, 0.08), transparent)
          `,
        }}
      />

      {/* Sparkle decorations */}
      <SparkleEffect count={5} />

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <Navigation />

        {/* Hero Section */}
        <HeroParallax className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <AnimatedElement delay={0.1} animation="scaleIn">
              <Image
                src="/logo.png"
                alt="AIoli"
                width={120}
                height={120}
                className="mb-6"
                priority
              />
            </AnimatedElement>

            <AnimatedElement delay={0.2}>
              <h1 className="section-title text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight">
                {t.hero.title}
              </h1>
            </AnimatedElement>

            <AnimatedElement delay={0.3}>
              <p className="max-w-2xl mb-12 text-xl md:text-2xl" style={{ color: "var(--text-secondary)" }}>
                {t.hero.subtitle}
              </p>
              <p className="max-w-xl mb-12 text-base md:text-lg" style={{ color: "var(--text-muted)" }}>
                {t.hero.description}
              </p>
            </AnimatedElement>

            <AnimatedElement delay={0.4}>
              {status === "loading" ? (
                <div className="w-full max-w-2xl h-16 rounded-xl bg-[var(--bg-secondary)] animate-pulse" />
              ) : session ? (
                <UrlInput onSubmit={handleAnalyze} isLoading={isLoading} />
              ) : (
                <button
                  onClick={() => signIn("google")}
                  className="btn-primary px-8 py-4 text-lg flex items-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  {t.hero.loginButton}
                </button>
              )}
            </AnimatedElement>

            {successMessage && (
              <AnimatedElement animation="fadeIn">
                <p className="mt-4 font-medium" style={{ color: "var(--score-good)" }}>
                  {successMessage}
                </p>
              </AnimatedElement>
            )}

            {error && (
              <AnimatedElement animation="fadeIn">
                <p className="mt-4 font-medium" style={{ color: "var(--score-poor)" }}>
                  {error}
                </p>
              </AnimatedElement>
            )}
          </div>
        </HeroParallax>

        {/* Feature Cards */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Card 1: Traditional SEO */}
            <StaggerItem>
              <div className="feature-card h-full">
                <div className="icon-container icon-container-cyan mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {t.features.seo.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {t.features.seo.description}
                </p>
              </div>
            </StaggerItem>

            {/* Card 2: AI Visibility */}
            <StaggerItem>
              <div className="feature-card h-full">
                <div className="icon-container icon-container-emerald mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8V4H8"/>
                    <rect width="16" height="12" x="4" y="8" rx="2"/>
                    <path d="M2 14h2"/>
                    <path d="M20 14h2"/>
                    <path d="M15 13v2"/>
                    <path d="M9 13v2"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {t.features.ai.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {t.features.ai.description}
                </p>
              </div>
            </StaggerItem>

            {/* Card 3: AI Suggestions */}
            <StaggerItem>
              <div className="feature-card h-full">
                <div className="icon-container icon-container-amber mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {t.features.suggestions.title}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {t.features.suggestions.description}
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>

        {/* Pricing Section */}
        <div id="priser" className="max-w-7xl mx-auto px-6 py-20">
          <AnimatedElement>
            <div className="text-center mb-12">
              <h2 className="section-title text-3xl md:text-4xl mb-4">{t.pricing.title}</h2>
              <p style={{ color: "var(--text-secondary)" }}>
                {t.pricing.subtitle}
              </p>
            </div>
          </AnimatedElement>

          <AnimatedElement delay={0.1}>
            <CreditPackageCards />
          </AnimatedElement>

          <AnimatedElement delay={0.2}>
            <CreditsExplainer />
          </AnimatedElement>
        </div>

        {/* Footer */}
        <footer className="footer py-8 mt-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Image
                src="/logo.png"
                alt="AIoli"
                width={160}
                height={64}
                style={{ height: '48px', width: 'auto' }}
              />
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              SEO & AI Visibility Analysis
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen gradient-bg" />}>
      <HomeContent />
    </Suspense>
  );
}
