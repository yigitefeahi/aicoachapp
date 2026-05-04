"use client";

type ScoreBadgeProps = {
  value: number | null | undefined;
  fallback?: string;
  className?: string;
};

export function ScoreBadge({ value, fallback = "-", className = "" }: ScoreBadgeProps) {
  const tone =
    typeof value !== "number"
      ? "text-slate-300"
      : value < 50
      ? "text-red-300"
      : value < 70
      ? "text-amber-300"
      : "text-emerald-300";
  return <span className={`${tone} ${className}`}>{typeof value === "number" ? value : fallback}</span>;
}
