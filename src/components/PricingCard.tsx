"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useLanguage } from "@/lib/LanguageContext";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  popular?: boolean;
}

const CREDIT_PACKAGES: CreditPackage[] = [
  { id: "starter", name: "starter", credits: 1, price: 49, pricePerCredit: 49 },
  { id: "standard", name: "standard", credits: 5, price: 149, pricePerCredit: 30, popular: true },
  { id: "pro", name: "pro", credits: 15, price: 299, pricePerCredit: 20 },
];

export function CreditPackageCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
      {CREDIT_PACKAGES.map((pkg) => (
        <CreditPackageCard key={pkg.id} package={pkg} />
      ))}
    </div>
  );
}

function CreditPackageCard({ package: pkg }: { package: CreditPackage }) {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const packageNames: Record<string, string> = {
    starter: t.pricing.packages.starter,
    standard: t.pricing.packages.standard,
    pro: t.pricing.packages.pro,
  };

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

  return (
    <div className={`card p-6 relative ${pkg.popular ? "ring-2 ring-[var(--plasma-blue)] mt-4" : ""}`}>
      {pkg.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--plasma-blue)] text-white text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap z-10">
          {t.pricing.popular}
        </div>
      )}

      <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
        {packageNames[pkg.name] || pkg.name}
      </h3>

      <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        {pkg.credits} {pkg.credits === 1 ? t.pricing.credit : t.pricing.credits}
      </p>

      <div className="mb-4">
        <span className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
          {pkg.price}
        </span>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}> kr</span>
      </div>

      <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        {pkg.pricePerCredit} kr {t.pricing.perCredit}
      </p>

      {error && (
        <p className="text-xs mb-3 text-center" style={{ color: "var(--score-poor)" }}>
          {error}
        </p>
      )}

      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className="btn-primary w-full py-3 rounded-xl text-sm font-medium"
      >
        {isLoading ? t.pricing.loading : t.pricing.buy}
      </button>
    </div>
  );
}

// What you get with credits
export function CreditsExplainer() {
  const { t } = useLanguage();

  return (
    <div className="card p-6 max-w-2xl mx-auto mt-8">
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
