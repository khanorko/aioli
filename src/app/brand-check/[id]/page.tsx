import { Suspense } from "react";
import { BrandCheckResultsClient } from "./BrandCheckResultsClient";

export const metadata = {
  title: "AI Brand Visibility Results | Aioli",
  description: "View your AI brand visibility score and recommendations to improve how AI assistants perceive your brand.",
};

export default function BrandCheckResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-obsidian)]" />}>
      <BrandCheckResultsClient />
    </Suspense>
  );
}
