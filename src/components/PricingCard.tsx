"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Sparkles } from "lucide-react";

interface CreditPackage {
  id: string;
  name: string;
  tagline: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  popular?: boolean;
  features: string[];
  perfectFor: string;
  cta: string;
  variant: "basic" | "popular" | "premium";
}

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    name: "Try",
    tagline: "Test on a single page",
    credits: 1,
    price: 4.90,
    pricePerCredit: 4.90,
    features: [
      "1 page analysis",
      "Full SEO report",
      "AI visibility analysis",
      "Improvement suggestions",
      "PDF export"
    ],
    perfectFor: "a quick test of your homepage",
    cta: "Try one analysis",
    variant: "basic",
  },
  {
    id: "website",
    name: "Website",
    tagline: "Analyze your entire site",
    credits: 5,
    price: 14.90,
    pricePerCredit: 2.98,
    popular: true,
    features: [
      "5 page analyses",
      "Site scan (multiple pages)",
      "Aggregated site report",
      "All improvement suggestions",
      "PDF export"
    ],
    perfectFor: "small businesses and bloggers",
    cta: "Analyze your site",
    variant: "popular",
  },
  {
    id: "agency",
    name: "Agency",
    tagline: "For multiple websites",
    credits: 15,
    price: 29,
    pricePerCredit: 1.93,
    features: [
      "15 page analyses",
      "Analyze multiple sites",
      "Competitor analysis",
      "Premium features",
      "PDF export"
    ],
    perfectFor: "agencies and consultants",
    cta: "Get started",
    variant: "premium",
  },
];

export function CreditPackageCards() {
  const { data: session } = useSession();
  const userCredits = session?.user?.credits || 0;
  const isLoggedIn = !!session?.user;

  return (
    <div>
      {/* Credits Balance for logged-in users */}
      {isLoggedIn && (
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)"
            }}
          >
            <CreditIcon />
            <span style={{ color: "var(--text-secondary)" }}>
              You have{" "}
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {userCredits} {userCredits === 1 ? "credit" : "credits"}
              </span>
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-8 items-stretch">
        {CREDIT_PACKAGES.map((pkg) => (
          <CreditPackageCard key={pkg.id} package={pkg} userCredits={userCredits} />
        ))}
      </div>
    </div>
  );
}

function CreditPackageCard({ package: pkg, userCredits }: { package: CreditPackage; userCredits: number }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const hasCredits = userCredits > 0;

  const handlePurchase = async () => {
    if (!session?.user?.email) {
      signIn("google");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      console.error("Purchase error:", err);
      setError(err instanceof Error ? err.message : "Could not start purchase");
    } finally {
      setIsLoading(false);
    }
  };

  // Variant-based styles
  const getCardStyles = () => {
    if (pkg.variant === "popular") {
      return "ring-2 ring-emerald-500/50 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] bg-gradient-to-b from-emerald-500/[0.08] to-transparent";
    }
    if (pkg.variant === "premium") {
      return "";
    }
    return "";
  };

  const getButtonStyles = () => {
    if (pkg.variant === "basic") {
      return "btn-primary opacity-90 hover:opacity-100";
    }
    if (pkg.variant === "premium") {
      return "btn-primary bg-gradient-to-r from-emerald-600 to-emerald-500";
    }
    return "btn-primary";
  };

  // Get CTA text - use "Buy more" only if user has credits > 0
  const getCtaText = () => {
    if (isLoading) return "Loading...";
    if (hasCredits) return "Buy more";
    return pkg.cta;
  };

  return (
    <div className={`relative flex flex-col ${pkg.popular ? "pt-6" : ""}`}>
      {/* Popular Badge - positioned clearly above the card */}
      {pkg.popular && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-sm font-bold px-5 py-2 rounded-full whitespace-nowrap z-10 flex items-center gap-2 shadow-lg shadow-emerald-500/30">
          <StarIcon />
          Most popular
        </div>
      )}
      <div className={`card p-6 flex flex-col h-full ${getCardStyles()}`}>

      {/* Package Name & Tagline */}
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          {pkg.name}
        </h3>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {pkg.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="mb-4 pb-4 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <span className="text-lg" style={{ color: "var(--text-muted)" }}>€</span>
        <span className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
          {pkg.price}
        </span>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          €{pkg.pricePerCredit.toFixed(2)} per analysis
        </p>
      </div>

      {/* Features List */}
      <ul className="space-y-2.5 mb-6 flex-grow">
        {pkg.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Perfect For */}
      <p className="text-xs mb-4 px-3 py-2 rounded-lg" style={{
        background: "var(--bg-secondary)",
        color: "var(--text-muted)"
      }}>
        <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
          Perfect for:
        </span>{" "}
        {pkg.perfectFor}
      </p>

      {/* Error Message */}
      {error && (
        <p className="text-xs mb-3 text-center" style={{ color: "var(--score-poor)" }}>
          {error}
        </p>
      )}

      {/* CTA Button */}
      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${getButtonStyles()}`}
      >
        {getCtaText()}
      </button>
      </div>
    </div>
  );
}

// What you get with credits
export function CreditsExplainer() {
  return (
    <div className="card p-6 max-w-2xl mx-auto mt-10">
      <h3 className="font-semibold text-lg mb-4" style={{ color: "var(--text-primary)" }}>
        What do I get for 1 credit?
      </h3>
      <ul className="space-y-3">
        <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          <span>Full AI visibility analysis with details</span>
        </li>
        <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          <span>AI-generated improvement suggestions</span>
        </li>
        <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          <span>PDF export of the report</span>
        </li>
        <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          <span>Saved in your analysis history</span>
        </li>
      </ul>
      <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
        Free analysis includes: SEO score, AI visibility score (without details)
      </p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 mt-0.5 text-[var(--score-good)] flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function CreditIcon() {
  return <Sparkles className="w-4 h-4 text-amber-400" strokeWidth={1.5} />;
}
