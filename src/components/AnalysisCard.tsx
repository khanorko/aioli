"use client";

import { ReactNode } from "react";

interface AnalysisCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AnalysisCard({ title, description, children }: AnalysisCardProps) {
  return (
    <div className="analysis-card">
      <div className="analysis-card-header">
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h2>
        {description && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{description}</p>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
