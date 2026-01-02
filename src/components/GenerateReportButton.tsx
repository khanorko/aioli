"use client";

import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Sparkles, Loader2, Download, CheckCircle } from "lucide-react";
import PrintView from "./PrintView";

interface GenerateReportButtonProps {
  analysisData: {
    url: string;
    seoScore: number | null;
    llmScore: number | null;
    createdAt: string;
    results: string | null;
    suggestions?: string | null;
  };
  analysisId: string;
  isUnlocked?: boolean;
}

type ExportState = "idle" | "preparing" | "generating" | "complete" | "error";

export function GenerateReportButton({
  analysisData,
  analysisId,
  isUnlocked = false,
}: GenerateReportButtonProps) {
  const [exportState, setExportState] = useState<ExportState>("idle");
  const [showPrintView, setShowPrintView] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const printRef = useRef<HTMLDivElement>(null);

  const generateReportId = useCallback(() => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const shortId = analysisId.slice(0, 8).toUpperCase();
    return `RPT-${date}-${shortId}`;
  }, [analysisId]);

  const handleGenerateReport = useCallback(async () => {
    if (exportState !== "idle" && exportState !== "error") return;

    setErrorMessage("");
    setExportState("preparing");
    setShowPrintView(true);

    // Wait for PrintView to render
    await new Promise((resolve) => setTimeout(resolve, 800));

    setExportState("generating");

    try {
      // Dynamic import of html2pdf to reduce bundle size
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default;

      if (!printRef.current) {
        throw new Error("Print view not ready");
      }

      const reportId = generateReportId();
      let domain = "website";
      try {
        domain = new URL(analysisData.url).hostname.replace(/\./g, "-");
      } catch {
        // Use default
      }

      const opt = {
        margin: 0,
        filename: `aioli-report-${domain}-${reportId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: "#FFFFFF",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait" as const,
        },
        pagebreak: { mode: ["css", "legacy"], before: ".page-break-before" },
      };

      await html2pdf().set(opt).from(printRef.current).save();

      setExportState("complete");
      setShowPrintView(false);
      setTimeout(() => {
        setExportState("idle");
      }, 2000);
    } catch (error) {
      console.error("PDF generation error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to generate PDF");
      setExportState("error");
      setShowPrintView(false);
      setTimeout(() => {
        setExportState("idle");
        setErrorMessage("");
      }, 3000);
    }
  }, [exportState, analysisData.url, generateReportId]);

  const buttonContent = {
    idle: (
      <>
        <FileText className="w-4 h-4" strokeWidth={1.5} />
        <span>Generate Report</span>
        <Sparkles className="w-3.5 h-3.5 opacity-60" strokeWidth={1.5} />
      </>
    ),
    preparing: (
      <>
        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
        <span>Preparing...</span>
      </>
    ),
    generating: (
      <>
        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
        <span>Assembling Report...</span>
      </>
    ),
    complete: (
      <>
        <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
        <span>Downloaded!</span>
      </>
    ),
    error: (
      <>
        <FileText className="w-4 h-4" strokeWidth={1.5} />
        <span>{errorMessage || "Error - Try again"}</span>
      </>
    ),
  };

  if (!isUnlocked) {
    return (
      <button
        disabled
        className="generate-report-btn generate-report-btn-disabled"
        title="Unlock the analysis to generate a PDF report"
      >
        <FileText className="w-4 h-4" strokeWidth={1.5} />
        <span>Generate Report</span>
        <svg
          className="w-3.5 h-3.5 opacity-60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </button>
    );
  }

  return (
    <>
      <motion.button
        onClick={handleGenerateReport}
        disabled={exportState !== "idle" && exportState !== "error"}
        className={`generate-report-btn ${
          exportState === "complete"
            ? "generate-report-btn-success"
            : exportState === "error"
            ? "generate-report-btn-error"
            : "generate-report-btn-primary"
        }`}
        whileHover={exportState === "idle" || exportState === "error" ? { scale: 1.02, y: -1 } : {}}
        whileTap={exportState === "idle" || exportState === "error" ? { scale: 0.98 } : {}}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={exportState}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            {buttonContent[exportState]}
          </motion.div>
        </AnimatePresence>

        {/* Shimmer effect overlay */}
        {(exportState === "idle" || exportState === "error") && (
          <div className="shimmer-overlay" aria-hidden="true" />
        )}
      </motion.button>

      {/* Hidden PrintView for PDF generation - positioned off-screen */}
      {showPrintView &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id="pdf-print-container"
            style={{
              position: "absolute",
              left: "-10000px",
              top: "0",
              width: "210mm",
              minHeight: "297mm",
              backgroundColor: "#FFFFFF",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <PrintView
              ref={printRef}
              analysisData={analysisData}
              reportId={generateReportId()}
            />
          </div>,
          document.body
        )}
    </>
  );
}

export default GenerateReportButton;
