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
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className={`mt-0.5 ${item.passed ? "text-green-500" : "text-red-500"}`}>
              {item.passed ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </span>
            <div className="flex-1">
              <span className={`font-medium ${item.passed ? "text-gray-700" : "text-gray-900"}`}>
                {item.label}
              </span>
              {item.value && (
                <p className="text-sm text-gray-500 truncate max-w-md">{item.value}</p>
              )}
              {item.issue && !item.passed && (
                <p className="text-sm text-red-600">{item.issue}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
