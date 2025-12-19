"use client";

import { ReactNode } from "react";

interface AnalysisCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AnalysisCard({ title, description, children }: AnalysisCardProps) {
  return (
    <div className="retro-analysis-card">
      <div className="retro-analysis-card-header">
        <h2 className="text-xl font-bold" style={{ color: "var(--teal-dark)" }}>{title}</h2>
        {description && (
          <p className="text-sm" style={{ color: "var(--teal-dark)", opacity: 0.8 }}>{description}</p>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
