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
    suggestions?: string | null;
  };
  isUnlocked?: boolean;
}

// Helper to get score color RGB values
function getScoreColor(score: number): [number, number, number] {
  if (score >= 80) return [34, 197, 94]; // Green
  if (score >= 50) return [234, 179, 8]; // Yellow
  return [239, 68, 68]; // Red
}

// Helper to wrap text
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = doc.getTextWidth(testLine);
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) lines.push(currentLine);
  return lines;
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
      const suggestions = analysisData.suggestions ? JSON.parse(analysisData.suggestions) : { suggestions: [] };
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // ============ PAGE 1: OVERVIEW ============

      // Header with logo text
      doc.setFontSize(28);
      doc.setTextColor(45, 91, 255);
      doc.text("AIoli", margin, 30);

      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text("SEO & AI Synlighetsanalys", margin, 38);

      // Horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, 45, pageWidth - margin, 45);

      // Report title
      doc.setFontSize(20);
      doc.setTextColor(30, 30, 30);
      doc.text("Analysrapport", margin, 60);

      // URL and date
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const urlLines = wrapText(doc, analysisData.url, contentWidth);
      let yPos = 70;
      urlLines.forEach((line) => {
        doc.text(line, margin, yPos);
        yPos += 5;
      });

      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`Analyserad: ${new Date(analysisData.createdAt).toLocaleString("sv-SE")}`, margin, yPos + 5);

      // Score boxes
      yPos = 95;
      const seoScore = analysisData.seoScore ?? 0;
      const llmScore = analysisData.llmScore ?? 0;
      const boxWidth = (contentWidth - 10) / 2;

      // SEO Score Box
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin, yPos, boxWidth, 45, 3, 3, "F");
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text("Traditionell SEO", margin + 10, yPos + 12);
      doc.setFontSize(32);
      const [sr, sg, sb] = getScoreColor(seoScore);
      doc.setTextColor(sr, sg, sb);
      doc.text(`${seoScore}`, margin + 10, yPos + 35);
      doc.setFontSize(14);
      doc.setTextColor(120, 120, 120);
      doc.text("/100", margin + 35 + (seoScore >= 100 ? 10 : seoScore >= 10 ? 5 : 0), yPos + 35);

      // AI Score Box
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin + boxWidth + 10, yPos, boxWidth, 45, 3, 3, "F");
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.text("AI-synlighet", margin + boxWidth + 20, yPos + 12);
      doc.setFontSize(32);
      const [lr, lg, lb] = getScoreColor(llmScore);
      doc.setTextColor(lr, lg, lb);
      doc.text(`${llmScore}`, margin + boxWidth + 20, yPos + 35);
      doc.setFontSize(14);
      doc.setTextColor(120, 120, 120);
      doc.text("/100", margin + boxWidth + 45 + (llmScore >= 100 ? 10 : llmScore >= 10 ? 5 : 0), yPos + 35);

      // What the scores mean
      yPos = 155;
      doc.setFontSize(14);
      doc.setTextColor(30, 30, 30);
      doc.text("Vad betyder poängen?", margin, yPos);

      yPos += 10;
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);

      const scoreExplanations = [
        "• 80-100: Utmärkt - Din sajt följer best practices och är väl optimerad.",
        "• 50-79: Godkänt - Det finns förbättringspotential men grunden är bra.",
        "• 0-49: Behöver åtgärdas - Viktiga element saknas eller är felaktigt implementerade.",
      ];

      scoreExplanations.forEach((text) => {
        doc.text(text, margin + 5, yPos);
        yPos += 6;
      });

      // Executive summary
      yPos += 10;
      doc.setFontSize(14);
      doc.setTextColor(30, 30, 30);
      doc.text("Sammanfattning", margin, yPos);

      yPos += 10;
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);

      const summaryText = seoScore >= 80 && llmScore >= 80
        ? "Din webbplats presterar utmärkt både för traditionella sökmotorer och AI-assistenter. Fortsätt underhålla och uppdatera innehållet regelbundet."
        : seoScore >= 50 && llmScore >= 50
        ? "Din webbplats har en solid grund men det finns utrymme för förbättring. Fokusera på de åtgärder som listas i denna rapport för att öka din synlighet."
        : "Din webbplats behöver förbättringar för att synas bättre i både traditionella sökmotorer och AI-assistenter. Prioritera de kritiska åtgärderna som listas nedan.";

      const summaryLines = wrapText(doc, summaryText, contentWidth);
      summaryLines.forEach((line) => {
        doc.text(line, margin, yPos);
        yPos += 5;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("AIoli - aioli-one.vercel.app", margin, 285);
      doc.text("Sida 1", pageWidth - margin - 15, 285);

      // ============ PAGE 2: SEO DETAILS ============
      doc.addPage();
      yPos = 25;

      doc.setFontSize(18);
      doc.setTextColor(30, 30, 30);
      doc.text("SEO-analys", margin, yPos);

      yPos += 8;
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const seoIntro = "Traditionell sökmotoroptimering (SEO) handlar om att göra din webbplats synlig för sökmotorer som Google. Nedan följer en detaljerad genomgång av de viktigaste faktorerna.";
      wrapText(doc, seoIntro, contentWidth).forEach((line) => {
        doc.text(line, margin, yPos);
        yPos += 5;
      });

      if (results.seo) {
        // Title tag
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text("Title-tagg", margin, yPos);

        yPos += 7;
        doc.setFontSize(9);
        const titleOk = results.seo.title?.score >= 70;
        doc.setTextColor(...getScoreColor(titleOk ? 80 : 40));
        doc.text(titleOk ? "✓ OK" : "✗ Behöver åtgärdas", margin, yPos);

        yPos += 6;
        doc.setTextColor(60, 60, 60);
        if (results.seo.title?.value) {
          const titleLines = wrapText(doc, `Nuvarande: "${results.seo.title.value}"`, contentWidth - 10);
          titleLines.forEach((line) => {
            doc.text(line, margin + 5, yPos);
            yPos += 5;
          });
        }

        yPos += 3;
        doc.setTextColor(80, 80, 80);
        const titleExplanation = "Title-taggen visas i sökresultaten och webbläsarfliken. Den bör vara 50-60 tecken lång och innehålla dina viktigaste nyckelord.";
        wrapText(doc, titleExplanation, contentWidth - 10).forEach((line) => {
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });

        // Meta description
        yPos += 8;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text("Meta-beskrivning", margin, yPos);

        yPos += 7;
        doc.setFontSize(9);
        const descOk = results.seo.description?.score >= 70;
        doc.setTextColor(...getScoreColor(descOk ? 80 : 40));
        doc.text(descOk ? "✓ OK" : "✗ Behöver åtgärdas", margin, yPos);

        yPos += 6;
        doc.setTextColor(60, 60, 60);
        if (results.seo.description?.value) {
          const descLines = wrapText(doc, `Nuvarande: "${results.seo.description.value.substring(0, 150)}${results.seo.description.value.length > 150 ? "..." : ""}"`, contentWidth - 10);
          descLines.forEach((line) => {
            doc.text(line, margin + 5, yPos);
            yPos += 5;
          });
        }

        yPos += 3;
        doc.setTextColor(80, 80, 80);
        const descExplanation = "Meta-beskrivningen visas under titeln i sökresultaten. Den bör vara 150-160 tecken och locka användare att klicka.";
        wrapText(doc, descExplanation, contentWidth - 10).forEach((line) => {
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });

        // Headings
        yPos += 8;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text("Rubriker (H1-H6)", margin, yPos);

        yPos += 7;
        doc.setFontSize(9);
        const h1Count = results.seo.headings?.h1?.length || 0;
        const h1Ok = h1Count === 1;
        doc.setTextColor(...getScoreColor(h1Ok ? 80 : 40));
        doc.text(h1Ok ? "✓ OK" : "✗ Behöver åtgärdas", margin, yPos);

        yPos += 6;
        doc.setTextColor(60, 60, 60);
        doc.text(`H1-rubriker: ${h1Count} st ${h1Count !== 1 ? "(bör vara exakt 1)" : ""}`, margin + 5, yPos);
        yPos += 5;
        doc.text(`H2-rubriker: ${results.seo.headings?.h2?.length || 0} st`, margin + 5, yPos);

        yPos += 6;
        doc.setTextColor(80, 80, 80);
        const headingExplanation = "Varje sida bör ha exakt en H1-rubrik som beskriver sidans huvudinnehåll. Använd H2-H6 för att strukturera underrubriker hierarkiskt.";
        wrapText(doc, headingExplanation, contentWidth - 10).forEach((line) => {
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });

        // Images
        yPos += 8;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text("Bilder", margin, yPos);

        yPos += 7;
        doc.setFontSize(9);
        const imagesTotal = results.seo.images?.total || 0;
        const imagesWithAlt = results.seo.images?.withAlt || 0;
        const imagesOk = imagesTotal === 0 || results.seo.images?.withoutAlt === 0;
        doc.setTextColor(...getScoreColor(imagesOk ? 80 : 40));
        doc.text(imagesOk ? "✓ OK" : "✗ Behöver åtgärdas", margin, yPos);

        yPos += 6;
        doc.setTextColor(60, 60, 60);
        doc.text(`${imagesWithAlt} av ${imagesTotal} bilder har alt-text`, margin + 5, yPos);

        yPos += 6;
        doc.setTextColor(80, 80, 80);
        const imageExplanation = "Alt-text beskriver bildens innehåll för sökmotorer och synskadade användare. Alla bilder bör ha beskrivande alt-attribut.";
        wrapText(doc, imageExplanation, contentWidth - 10).forEach((line) => {
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });

        // Technical SEO
        yPos += 8;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text("Teknisk SEO", margin, yPos);

        yPos += 8;
        doc.setFontSize(9);

        const technicalItems = [
          { label: "HTTPS", value: results.seo.technical?.https, explanation: "Säker anslutning är ett rankingkriterie för Google." },
          { label: "Canonical URL", value: !!results.seo.technical?.canonical, explanation: "Förhindrar duplicerat innehåll genom att ange den primära URL:en." },
          { label: "Viewport meta", value: results.seo.technical?.viewport, explanation: "Krävs för mobilanpassning och bättre ranking." },
          { label: "robots.txt", value: results.seo.technical?.robotsTxt, explanation: "Styr vilka sidor sökmotorer får indexera." },
          { label: "sitemap.xml", value: results.seo.technical?.sitemap, explanation: "Hjälper sökmotorer hitta alla dina sidor." },
        ];

        technicalItems.forEach((item) => {
          doc.setTextColor(...getScoreColor(item.value ? 80 : 40));
          doc.text(item.value ? "✓" : "✗", margin + 5, yPos);
          doc.setTextColor(60, 60, 60);
          doc.text(`${item.label}: ${item.value ? "Ja" : "Nej"} - ${item.explanation}`, margin + 15, yPos);
          yPos += 6;
        });
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("AIoli - aioli-one.vercel.app", margin, 285);
      doc.text("Sida 2", pageWidth - margin - 15, 285);

      // ============ PAGE 3: AI VISIBILITY ============
      doc.addPage();
      yPos = 25;

      doc.setFontSize(18);
      doc.setTextColor(30, 30, 30);
      doc.text("AI-synlighetsanalys", margin, yPos);

      yPos += 8;
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const aiIntro = "AI-assistenter som ChatGPT och Claude blir allt viktigare för hur användare hittar information. Denna analys visar hur väl din sajt är optimerad för att citeras och refereras av AI-system.";
      wrapText(doc, aiIntro, contentWidth).forEach((line) => {
        doc.text(line, margin, yPos);
        yPos += 5;
      });

      if (results.llmReadiness) {
        // Schema.org
        yPos += 10;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text("Schema.org strukturerad data", margin, yPos);

        yPos += 7;
        doc.setFontSize(9);
        const schemaOk = results.llmReadiness.schemaOrg?.hasSchema;
        doc.setTextColor(...getScoreColor(schemaOk ? 80 : 40));
        doc.text(schemaOk ? "✓ Implementerad" : "✗ Saknas", margin, yPos);

        yPos += 6;
        doc.setTextColor(80, 80, 80);
        const schemaExplanation = "Schema.org-märkning hjälper AI-system förstå vad din sida handlar om. Det strukturerar information som företagsnamn, produkter, recensioner och kontaktuppgifter på ett maskinläsbart sätt.";
        wrapText(doc, schemaExplanation, contentWidth - 10).forEach((line) => {
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });

        if (results.llmReadiness.schemaOrg?.types?.length > 0) {
          yPos += 3;
          doc.setTextColor(60, 60, 60);
          doc.text(`Hittade schematyper: ${results.llmReadiness.schemaOrg.types.join(", ")}`, margin + 5, yPos);
          yPos += 5;
        }

        // Semantic HTML
        yPos += 8;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text("Semantisk HTML", margin, yPos);

        yPos += 7;
        doc.setFontSize(9);
        const semanticScore = results.llmReadiness.semanticHtml?.score || 0;
        doc.setTextColor(...getScoreColor(semanticScore));
        doc.text(`Poäng: ${semanticScore}/100`, margin, yPos);

        yPos += 6;
        doc.setTextColor(80, 80, 80);
        const semanticExplanation = "Semantisk HTML använder beskrivande element som <article>, <nav>, <header>, <footer> istället för generiska <div>-taggar. Detta hjälper AI förstå sidans struktur och innehållstyper.";
        wrapText(doc, semanticExplanation, contentWidth - 10).forEach((line) => {
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });

        // Content Structure
        yPos += 8;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text("Innehållsstruktur", margin, yPos);

        yPos += 7;
        doc.setFontSize(9);
        const contentScore = results.llmReadiness.contentStructure?.score || 0;
        doc.setTextColor(...getScoreColor(contentScore));
        doc.text(`Poäng: ${contentScore}/100`, margin, yPos);

        yPos += 6;
        doc.setTextColor(80, 80, 80);
        const contentExplanation = "God innehållsstruktur innebär tydliga rubriker, korta stycken, punktlistor och en logisk informationsordning. AI-system kan lättare extrahera och sammanfatta välstrukturerat innehåll.";
        wrapText(doc, contentExplanation, contentWidth - 10).forEach((line) => {
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });

        // Quotable Content
        yPos += 8;
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text("Citerbar information", margin, yPos);

        yPos += 7;
        doc.setFontSize(9);
        const quotableScore = results.llmReadiness.quotableContent?.score || 0;
        doc.setTextColor(...getScoreColor(quotableScore));
        doc.text(`Poäng: ${quotableScore}/100`, margin, yPos);

        yPos += 6;
        doc.setTextColor(80, 80, 80);
        const quotableExplanation = "Citerbar information är konkreta fakta, definitioner och påståenden som AI enkelt kan referera till. Inkludera specifika siffror, datum, namn och tydliga förklaringar som kan citeras ordagrant.";
        wrapText(doc, quotableExplanation, contentWidth - 10).forEach((line) => {
          doc.text(line, margin + 5, yPos);
          yPos += 5;
        });
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("AIoli - aioli-one.vercel.app", margin, 285);
      doc.text("Sida 3", pageWidth - margin - 15, 285);

      // ============ PAGE 4: RECOMMENDATIONS ============
      doc.addPage();
      yPos = 25;

      doc.setFontSize(18);
      doc.setTextColor(30, 30, 30);
      doc.text("Rekommendationer", margin, yPos);

      yPos += 8;
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const recsIntro = "Baserat på analysen rekommenderar vi följande åtgärder för att förbättra din synlighet:";
      wrapText(doc, recsIntro, contentWidth).forEach((line) => {
        doc.text(line, margin, yPos);
        yPos += 5;
      });

      yPos += 8;

      // Add AI-generated suggestions if available
      if (suggestions.suggestions && suggestions.suggestions.length > 0) {
        suggestions.suggestions.forEach((suggestion: { title: string; description: string; priority: string }, index: number) => {
          if (yPos > 250) {
            doc.addPage();
            yPos = 25;
          }

          doc.setFontSize(11);
          doc.setTextColor(30, 30, 30);
          doc.text(`${index + 1}. ${suggestion.title}`, margin, yPos);

          yPos += 6;
          doc.setFontSize(9);

          // Priority badge
          const priorityColor = suggestion.priority === "high" ? [239, 68, 68] : suggestion.priority === "medium" ? [234, 179, 8] : [34, 197, 94];
          doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
          doc.text(`Prioritet: ${suggestion.priority === "high" ? "Hög" : suggestion.priority === "medium" ? "Medium" : "Låg"}`, margin + 5, yPos);

          yPos += 6;
          doc.setTextColor(60, 60, 60);
          wrapText(doc, suggestion.description, contentWidth - 10).forEach((line) => {
            doc.text(line, margin + 5, yPos);
            yPos += 5;
          });

          yPos += 8;
        });
      } else {
        // Default recommendations based on scores
        const defaultRecs = [];

        if (results.seo?.title?.score < 70) {
          defaultRecs.push({
            title: "Förbättra title-taggen",
            description: "Skapa en unik, beskrivande titel på 50-60 tecken som innehåller dina viktigaste nyckelord.",
            priority: "high"
          });
        }

        if (results.seo?.description?.score < 70) {
          defaultRecs.push({
            title: "Lägg till meta-beskrivning",
            description: "Skriv en lockande beskrivning på 150-160 tecken som sammanfattar sidans innehåll och uppmanar till klick.",
            priority: "high"
          });
        }

        if (!results.llmReadiness?.schemaOrg?.hasSchema) {
          defaultRecs.push({
            title: "Implementera Schema.org",
            description: "Lägg till strukturerad data för att hjälpa sökmotorer och AI-system förstå ditt innehåll bättre.",
            priority: "medium"
          });
        }

        if ((results.llmReadiness?.quotableContent?.score || 0) < 50) {
          defaultRecs.push({
            title: "Gör innehållet mer citerbart",
            description: "Inkludera specifika fakta, siffror och tydliga definitioner som AI-system kan referera till.",
            priority: "medium"
          });
        }

        defaultRecs.forEach((rec, index) => {
          doc.setFontSize(11);
          doc.setTextColor(30, 30, 30);
          doc.text(`${index + 1}. ${rec.title}`, margin, yPos);

          yPos += 6;
          doc.setFontSize(9);
          const priorityColor = rec.priority === "high" ? [239, 68, 68] : [234, 179, 8];
          doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
          doc.text(`Prioritet: ${rec.priority === "high" ? "Hög" : "Medium"}`, margin + 5, yPos);

          yPos += 6;
          doc.setTextColor(60, 60, 60);
          wrapText(doc, rec.description, contentWidth - 10).forEach((line) => {
            doc.text(line, margin + 5, yPos);
            yPos += 5;
          });

          yPos += 10;
        });
      }

      // Next steps
      yPos += 5;
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.text("Nästa steg", margin, yPos);

      yPos += 8;
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      const nextSteps = [
        "1. Prioritera åtgärder markerade som \"Hög prioritet\" först",
        "2. Implementera ändringarna och vänta 1-2 veckor",
        "3. Kör en ny analys för att mäta förbättringen",
        "4. Fortsätt iterera tills du når önskad poängnivå",
      ];

      nextSteps.forEach((step) => {
        doc.text(step, margin + 5, yPos);
        yPos += 6;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("AIoli - aioli-one.vercel.app", margin, 285);
      doc.text("Sida 4", pageWidth - margin - 15, 285);

      // Save
      const domain = new URL(analysisData.url).hostname.replace(/\./g, "-");
      const date = new Date().toISOString().split("T")[0];
      doc.save(`aioli-rapport-${domain}-${date}.pdf`);
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
