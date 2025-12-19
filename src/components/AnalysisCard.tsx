"use client";

import { ReactNode } from "react";

interface AnalysisCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function AnalysisCard({ title, description, children, icon }: AnalysisCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {icon && <div className="text-blue-600">{icon}</div>}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
