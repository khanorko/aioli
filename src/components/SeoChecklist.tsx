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
    <div className="rounded-lg p-4" style={{ background: "var(--cream)", border: "2px solid var(--teal-dark)" }}>
      <h3 className="text-lg font-bold mb-3" style={{ color: "var(--teal-dark)" }}>{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className={`retro-checklist-item flex items-start gap-3 ${item.passed ? "retro-checklist-pass" : "retro-checklist-fail"}`}
          >
            <span className="mt-0.5 text-xl">
              {item.passed ? "✓" : "✗"}
            </span>
            <div className="flex-1">
              <span className="font-bold" style={{ color: "var(--teal-dark)" }}>
                {item.label}
              </span>
              {item.value && (
                <p className="text-sm truncate max-w-md" style={{ color: "var(--teal-medium)" }}>
                  {item.value}
                </p>
              )}
              {item.issue && !item.passed && (
                <p className="text-sm font-medium" style={{ color: "var(--score-poor)" }}>{item.issue}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
