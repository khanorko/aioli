"use client";

interface ChecklistItem {
  label: string;
  passed: boolean;
  value?: string;
  issue?: string;
}

interface SeoChecklistProps {
  title: string;
  items: ChecklistItem[];
}

export function SeoChecklist({ title, items }: SeoChecklistProps) {
  return (
    <div className="rounded p-4" style={{ background: "var(--dark-surface)", border: "1px solid var(--dark-border)" }}>
      <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={`checklist-item flex items-start gap-3 ${item.passed ? "checklist-pass" : "checklist-fail"}`}
          >
            <span className="mt-0.5 flex-shrink-0">
              {item.passed ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--score-great)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--score-poor)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>
                {item.label}
              </span>
              {item.value && (
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                  {item.value}
                </p>
              )}
              {item.issue && !item.passed && (
                <p className="text-xs font-medium" style={{ color: "var(--score-poor)" }}>{item.issue}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
