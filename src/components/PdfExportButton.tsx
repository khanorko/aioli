"use client";

import { useState } from "react";
import jsPDF from "jspdf";

interface PdfExportButtonProps {
  analysisData: {
    url: string;
    seoScore: number | null;
    llmScore: number | null;
    createdAt: string;
    results: string | null;
  };
  isUnlocked?: boolean;
}

export function PdfExportButton({ analysisData, isUnlocked = false }: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  if (!isUnlocked) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm opacity-50 cursor-not-allowed"
        style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}
        title="Lås upp analysen för att kunna exportera PDF"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Exportera PDF
      </button>
    );
  }

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const doc = new jsPDF();
      const results = JSON.parse(analysisData.results || "{}");

      // Header
      doc.setFontSize(24);
      doc.setTextColor(45, 91, 255);
      doc.text("AIoli", 20, 25);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("SEO & AI Visibility Analysis", 20, 32);

      // Title
      doc.setFontSize(18);
      doc.setTextColor(30);
      doc.text("Analysresultat", 20, 50);

      // URL
      doc.setFontSize(10);
      doc.setTextColor(80);
      const urlText = analysisData.url.length > 70 ? analysisData.url.substring(0, 70) + "..." : analysisData.url;
      doc.text(urlText, 20, 60);

      // Date
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Analyserad: ${new Date(analysisData.createdAt).toLocaleString("sv-SE")}`, 20, 67);

      // Scores
      doc.setFontSize(14);
      doc.setTextColor(30);
      doc.text("Resultatöversikt", 20, 85);

      // SEO Score
      doc.setFontSize(12);
      const seoScore = analysisData.seoScore ?? 0;
      doc.setTextColor(seoScore >= 80 ? 34 : seoScore >= 50 ? 180 : 220, seoScore >= 80 ? 197 : seoScore >= 50 ? 140 : 53, seoScore >= 80 ? 94 : seoScore >= 50 ? 0 : 69);
      doc.text(`SEO-poäng: ${seoScore}/100`, 20, 95);

      // LLM Score
      const llmScore = analysisData.llmScore ?? 0;
      doc.setTextColor(llmScore >= 80 ? 34 : llmScore >= 50 ? 180 : 220, llmScore >= 80 ? 197 : llmScore >= 50 ? 140 : 53, llmScore >= 80 ? 94 : llmScore >= 50 ? 0 : 69);
      doc.text(`AI-synlighet: ${llmScore}/100`, 20, 105);

      // SEO Details
      let yPos = 125;
      doc.setFontSize(14);
      doc.setTextColor(30);
      doc.text("SEO-detaljer", 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setTextColor(60);

      if (results.seo) {
        // Title
        const titleStatus = results.seo.title?.score >= 70 ? "OK" : "Saknas";
        doc.text(`• Title: ${titleStatus}${results.seo.title?.value ? ` - "${results.seo.title.value.substring(0, 40)}..."` : ""}`, 25, yPos);
        yPos += 7;

        // Description
        const descStatus = results.seo.description?.score >= 70 ? "OK" : "Saknas";
        doc.text(`• Meta description: ${descStatus}`, 25, yPos);
        yPos += 7;

        // H1
        const h1Count = results.seo.headings?.h1?.length || 0;
        doc.text(`• H1-rubriker: ${h1Count} st`, 25, yPos);
        yPos += 7;

        // Images
        const imagesWithAlt = results.seo.images?.withAlt || 0;
        const totalImages = results.seo.images?.total || 0;
        doc.text(`• Bilder med alt-text: ${imagesWithAlt}/${totalImages}`, 25, yPos);
        yPos += 7;

        // Technical
        doc.text(`• HTTPS: ${results.seo.technical?.https ? "Ja" : "Nej"}`, 25, yPos);
        yPos += 7;
        doc.text(`• Canonical: ${results.seo.technical?.canonical ? "Ja" : "Nej"}`, 25, yPos);
        yPos += 7;
        doc.text(`• robots.txt: ${results.seo.technical?.robotsTxt ? "Ja" : "Nej"}`, 25, yPos);
        yPos += 7;
        doc.text(`• sitemap.xml: ${results.seo.technical?.sitemap ? "Ja" : "Nej"}`, 25, yPos);
        yPos += 15;
      }

      // AI Details
      doc.setFontSize(14);
      doc.setTextColor(30);
      doc.text("AI-synlighet", 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setTextColor(60);

      if (results.llmReadiness) {
        doc.text(`• Schema.org: ${results.llmReadiness.schemaOrg?.hasSchema ? "Ja" : "Nej"}`, 25, yPos);
        yPos += 7;
        doc.text(`• Semantisk HTML: ${results.llmReadiness.semanticHtml?.score || 0}/100`, 25, yPos);
        yPos += 7;
        doc.text(`• Innehållsstruktur: ${results.llmReadiness.contentStructure?.score || 0}/100`, 25, yPos);
        yPos += 7;
        doc.text(`• Citerad information: ${results.llmReadiness.quotableContent?.score || 0}/100`, 25, yPos);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("Genererad av AIoli - aioli-one.vercel.app", 20, 280);

      // Save
      const domain = new URL(analysisData.url).hostname.replace(/\./g, "-");
      const date = new Date().toISOString().split("T")[0];
      doc.save(`aioli-${domain}-${date}.pdf`);
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
      style={{ background: "var(--plasma-blue)", color: "white" }}
    >
      {isExporting ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Exporterar...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportera PDF
        </>
      )}
    </button>
  );
}
