"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  analysesUsed?: number;
}

export function UpgradeModal({ isOpen, onClose, email, analysesUsed = 3 }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="card p-8 mx-4">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                aria-label="Stäng"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--plasma-blue)]/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--plasma-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-center mb-2" style={{ color: "var(--text-primary)" }}>
                Analysgräns nådd
              </h2>

              <p className="text-center mb-6" style={{ color: "var(--text-secondary)" }}>
                Du har använt <strong>{analysesUsed}/3</strong> gratis analyser denna månad.
                Uppgradera till Pro för obegränsade analyser.
              </p>

              {/* Price */}
              <div className="text-center mb-6 p-4 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                <span className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>299</span>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}> kr/mån</span>
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <CheckIcon />
                  Obegränsade analyser
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <CheckIcon />
                  PDF-export av resultat
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <CheckIcon />
                  Analyshistorik
                </li>
              </ul>

              {/* CTA */}
              <button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="btn-primary w-full py-3 text-lg disabled:opacity-50"
              >
                {isLoading ? "Laddar..." : "Uppgradera till Pro"}
              </button>

              <p className="text-xs text-center mt-4" style={{ color: "var(--text-muted)" }}>
                Avbryt när som helst. Säker betalning via Stripe.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-[var(--score-good)]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
