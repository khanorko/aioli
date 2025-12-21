"use client";

interface SparkleEffectProps {
  count?: number;
  color?: string;
}

// Generate sparkle positions deterministically based on index
function generateSparkle(i: number) {
  // Simple deterministic pseudo-random based on index
  const hash = (n: number) => ((n * 9301 + 49297) % 233280) / 233280;
  return {
    id: i,
    x: 70 + hash(i) * 25,
    y: 20 + hash(i * 2) * 60,
    size: hash(i * 3) * 16 + 8,
    delay: hash(i * 4) * 3,
    duration: 2 + hash(i * 5) * 2,
  };
}

// Pre-generate sparkles at module level
const DEFAULT_SPARKLES = Array.from({ length: 10 }, (_, i) => generateSparkle(i));

export function SparkleEffect({ count = 6, color = "#FFFFFF" }: SparkleEffectProps) {
  const sparkles = DEFAULT_SPARKLES.slice(0, count);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-5">
      {sparkles.map((sparkle) => (
        <svg
          key={sparkle.id}
          className="absolute sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: sparkle.size,
            height: sparkle.size,
            color: color,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
            opacity: 0,
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      ))}
    </div>
  );
}

// Single sparkle star for positioning manually
interface SparkleStarProps {
  className?: string;
  size?: number;
  color?: string;
  delay?: number;
}

export function SparkleStar({
  className,
  size = 24,
  color = "#FFFFFF",
  delay = 0,
}: SparkleStarProps) {
  return (
    <svg
      className={`sparkle ${className || ""}`}
      style={{
        width: size,
        height: size,
        color: color,
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}
