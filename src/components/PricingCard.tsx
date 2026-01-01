"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  popular?: boolean;
}

const CREDIT_PACKAGES: CreditPackage[] = [
  { id: "starter", name: "Prova", credits: 1, price: 49, pricePerCredit: 49 },
  { id: "standard", name: "Standard", credits: 5, price: 149, pricePerCredit: 30, popular: true },
  { id: "pro", name: "Pro", credits: 15, price: 299, pricePerCredit: 20 },
];

export function CreditPackageCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {CREDIT_PACKAGES.map((pkg) => (
        <CreditPackageCard key={pkg.id} package={pkg} />
      ))}
    </div>
  );
}

function CreditPackageCard({ package: pkg }: { package: CreditPackage }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        throw new Error("Ingen checkout-URL mottagen");
      }
    } catch (err) {
      console.error("Purchase error:", err);
      setError(err instanceof Error ? err.message : "Kunde inte starta köp");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`card p-6 relative overflow-visible ${pkg.popular ? "ring-2 ring-[var(--plasma-blue)] mt-4" : ""}`}>
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--plasma-blue)] text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap z-10">
          Populärast
        </div>
      )}

      <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
        {pkg.name}
      </h3>

      <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        {pkg.credits} {pkg.credits === 1 ? "credit" : "credits"}
      </p>

      <div className="mb-4">
        <span className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
          {pkg.price}
        </span>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}> kr</span>
      </div>

      <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        {pkg.pricePerCredit} kr per credit
      </p>

      {error && (
        <p className="text-xs mb-3 text-center" style={{ color: "var(--score-poor)" }}>
          {error}
        </p>
      )}

      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
          pkg.popular
            ? "btn-primary"
            : "bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]"
        }`}
        style={!pkg.popular ? { color: "var(--text-primary)" } : undefined}
      >
        {isLoading ? "Laddar..." : "Köp"}
      </button>
    </div>
  );
}

// What you get with credits
export function CreditsExplainer() {
  return (
    <div className="card p-6 max-w-2xl mx-auto mt-8">
      <h3 className="font-semibold text-lg mb-4" style={{ color: "var(--text-primary)" }}>
        Vad får jag för 1 credit?
      </h3>
      <ul className="space-y-3">
        <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          <span>Full AI-synlighetsanalys med detaljer</span>
        </li>
        <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          <span>AI-genererade förbättringsförslag</span>
        </li>
        <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          <span>PDF-export av rapporten</span>
        </li>
        <li className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          <CheckIcon />
          <span>Sparad i din analyshistorik</span>
        </li>
      </ul>
      <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
        Gratisanalys inkluderar: SEO-poäng, AI-synlighetspoäng (utan detaljer)
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
