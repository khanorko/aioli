"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useLanguage } from "@/lib/LanguageContext";

interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  popular?: boolean;
  variant: "basic" | "popular" | "premium";
}

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    credits: 1,
    price: 49,
    pricePerCredit: 49,
    variant: "basic",
  },
  {
    id: "website",
    credits: 5,
    price: 149,
    pricePerCredit: 30,
    popular: true,
    variant: "popular",
  },
  {
    id: "agency",
    credits: 15,
    price: 299,
    pricePerCredit: 20,
    variant: "premium",
  },
];

export function CreditPackageCards() {
  const { data: session } = useSession();
  const { t } = useLanguage();
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
              {t.pricing.youHave}{" "}
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {userCredits} {userCredits === 1 ? t.pricing.credit : t.pricing.credits}
              </span>
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-2 items-end">
        {CREDIT_PACKAGES.map((pkg) => (
          <CreditPackageCard key={pkg.id} package={pkg} userCredits={userCredits} />
        ))}
      </div>
    </div>
  );
}

function CreditPackageCard({ package: pkg, userCredits }: { package: CreditPackage; userCredits: number }) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const packageData = t.pricing.packages[pkg.id as keyof typeof t.pricing.packages];
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
        throw new Error(data.error || "Något gick fel");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(t.errors.noCheckoutUrl);
      }
    } catch (err) {
      console.error("Purchase error:", err);
      setError(err instanceof Error ? err.message : t.errors.couldNotStartPurchase);
    } finally {
      setIsLoading(false);
    }
  };

  // Variant-based styles
  const getCardStyles = () => {
    if (pkg.variant === "popular") {
      return "ring-2 ring-[var(--plasma-blue)] scale-105 shadow-lg shadow-[var(--plasma-blue)]/10";
    }
    if (pkg.variant === "premium") {
      return "bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]";
    }
    return "";
  };

  const getButtonStyles = () => {
    if (pkg.variant === "basic") {
      return "btn-secondary";
    }
    if (pkg.variant === "premium") {
      return "btn-primary bg-gradient-to-r from-[var(--plasma-blue)] to-[#6366f1]";
    }
    return "btn-primary";
  };

  // Get CTA text - use "Buy more" if user has credits
  const getCtaText = () => {
    if (isLoading) return t.pricing.loading;
    if (hasCredits) return t.pricing.buyMore;
    return packageData.cta;
  };

  return (
    <div className={`card p-6 relative flex flex-col ${getCardStyles()}`}>
      {/* Popular Badge */}
      {pkg.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--plasma-blue)] text-white text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap z-10 flex items-center gap-1.5">
          <StarIcon />
          {t.pricing.popular}
        </div>
      )}

      {/* Package Name & Tagline */}
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          {packageData.name}
        </h3>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {packageData.tagline}
        </p>
      </div>

      {/* Price */}
      <div className="mb-4 pb-4 border-b" style={{ borderColor: "var(--border-primary)" }}>
        <span className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
          {pkg.price}
        </span>
        <span className="text-lg" style={{ color: "var(--text-muted)" }}> kr</span>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          {pkg.pricePerCredit} kr {t.pricing.perAnalysis}
        </p>
      </div>

      {/* Features List */}
      <ul className="space-y-2.5 mb-6 flex-grow">
        {packageData.features.map((feature: string, index: number) => (
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
          {t.pricing.perfectFor}
        </span>{" "}
        {packageData.perfectFor}
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
  );
}

// What you get with credits
export function CreditsExplainer() {
  const { t } = useLanguage();

  return (
    <div className="card p-6 max-w-2xl mx-auto mt-10">
      <h3 className="font-semibold text-lg mb-4" style={{ color: "var(--text-primary)" }}>
        {t.pricing.whatYouGet}
      </h3>
      <ul className="space-y-3">
        <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          <span>{t.pricing.benefits.analysis}</span>
        </li>
        <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          <span>{t.pricing.benefits.suggestions}</span>
        </li>
        <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          <span>{t.pricing.benefits.pdf}</span>
        </li>
        <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          <span>{t.pricing.benefits.history}</span>
        </li>
      </ul>
      <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
        {t.pricing.freeIncludes}
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
      className="w-3.5 h-3.5"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function CreditIcon() {
  return (
    <svg
      className="w-4 h-4"
      style={{ color: "var(--plasma-blue)" }}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
