import { Suspense } from "react";
import { WcagResultsClient } from "./WcagResultsClient";

export const metadata = {
  title: "WCAG Audit Results | Aioli",
  description:
    "View your WCAG accessibility audit results. See POUR scores, failed criteria, and actionable fixes.",
};

export default function WcagResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-obsidian)]" />}>
      <WcagResultsClient />
    </Suspense>
  );
}
