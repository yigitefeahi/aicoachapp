"use client";

import { Building2, Crosshair, Gauge, Layers, Sparkles, Target } from "lucide-react";

type SessionControlBarProps = {
  questionIndex?: number | null;
  totalQuestions?: number | null;
  passesLeft?: number | null;
  retriesLeft?: number | null;
  mode: string;
  focusArea: string;
  confidence?: number | null;
  profession?: string;
  sector?: string;
  targetCompany?: string;
  difficulty?: string;
  length?: string;
};

function Chip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  const v = value?.trim() || "—";
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-2xl border border-black/10 bg-white px-3 py-2.5 sm:px-4">
      <div className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500">
        <Icon size={12} className="shrink-0 opacity-80" aria-hidden />
        {label}
      </div>
      <div className="truncate text-sm font-medium text-slate-100" title={v}>
        {v}
      </div>
    </div>
  );
}

export function SessionControlBar({
  questionIndex,
  totalQuestions,
  passesLeft,
  retriesLeft,
  mode,
  focusArea,
  confidence,
  profession,
  sector,
  targetCompany,
  difficulty,
  length,
}: SessionControlBarProps) {
  const q = questionIndex != null && totalQuestions != null ? `${questionIndex} / ${totalQuestions}` : "—";

  return (
    <div className="sticky top-3 z-40 mb-5 rounded-[28px] border border-black/10 bg-white/90 px-3 py-4 shadow-sm backdrop-blur sm:px-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-[#f7f3ed] p-1.5 text-cyan-300">
            <Sparkles size={16} aria-hidden />
          </span>
          <span className="step-label">Session</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="rounded-full border border-black/10 bg-white px-2.5 py-1 font-medium text-slate-200">
            Q {q}
          </span>
          <span className="rounded-full border border-black/10 bg-white px-2.5 py-1">
            Passes <strong className="text-slate-100">{passesLeft ?? "—"}</strong>/3
          </span>
          <span className="rounded-full border border-black/10 bg-white px-2.5 py-1">
            Retries <strong className="text-slate-100">{retriesLeft ?? "—"}</strong>/2
          </span>
          <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-100/95">
            Confidence <strong>{confidence != null ? confidence : "—"}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <Chip icon={Target} label="Role" value={profession ?? ""} />
        <Chip icon={Layers} label="Sector" value={sector ?? ""} />
        <Chip icon={Building2} label="Target company" value={targetCompany ?? ""} />
        <Chip icon={Gauge} label="Difficulty" value={difficulty ?? ""} />
        <Chip icon={Crosshair} label="Length" value={length ?? ""} />
        <Chip icon={Crosshair} label="Focus" value={focusArea} />
        <div className="flex min-w-0 flex-col gap-1 rounded-2xl border border-black/10 bg-[#f7f3ed] px-3 py-2.5 sm:px-4 xl:col-span-1">
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-200/90">Mode</div>
          <div className="truncate text-sm font-semibold text-cyan-50">{mode.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}
