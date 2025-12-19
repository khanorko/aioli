"use client";

interface ScoreGaugeProps {
  score: number;
  label: string;
  maxScore?: number;
}

export function ScoreGauge({ score, label, maxScore = 100 }: ScoreGaugeProps) {
  const percentage = Math.round((score / maxScore) * 100);

  const getStrokeColor = () => {
    if (percentage >= 80) return "var(--score-great)";
    if (percentage >= 60) return "var(--score-good)";
    if (percentage >= 40) return "var(--score-okay)";
    return "var(--score-poor)";
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-2">
      <div className="relative w-28 h-28 retro-gauge">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="var(--cream-dark)"
            strokeWidth="12"
            fill="none"
          />
          {/* Border circle */}
          <circle
            cx="64"
            cy="64"
            r="51"
            stroke="var(--teal-dark)"
            strokeWidth="3"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke={getStrokeColor()}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: "stroke-dashoffset 0.8s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-3xl font-black"
            style={{ color: "var(--teal-dark)" }}
          >
            {percentage}
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-1 text-sm font-bold" style={{ color: "var(--teal-dark)" }}>{label}</span>
      )}
    </div>
  );
}
