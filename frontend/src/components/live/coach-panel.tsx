"use client";

import { Brain, Sparkles, Volume2 } from "lucide-react";
import { ScoreBadge } from "@/components/score-badge";
import { safeText } from "@/lib/safe-text";

type CoachPanelProps = {
  mode: string;
  score: number | null;
  confidenceScore: number | null;
  feedback: unknown;
  scoreExplanation: unknown;
  canRetry: boolean;
  attemptsLeft: number;
  pendingNextQuestion: unknown;
  isSpeaking: boolean;
  strengths: unknown[];
  weaknesses: unknown[];
  suggestions: unknown[];
  redFlags: unknown[];
  scorecard?: Record<string, number>;
  toneSignals?: Record<string, unknown>;
  companyRubric?: { label?: string; rubric_focus?: string[] } | null;
  onReplayVoice: () => void;
  onContinueNextQuestion: () => void;
};

export function CoachPanel({
  mode,
  score,
  confidenceScore,
  feedback,
  scoreExplanation,
  canRetry,
  attemptsLeft,
  pendingNextQuestion,
  isSpeaking,
  strengths,
  weaknesses,
  suggestions,
  redFlags,
  scorecard = {},
  toneSignals = {},
  companyRubric,
  onReplayVoice,
  onContinueNextQuestion,
}: CoachPanelProps) {
  return (
    <aside className="glass panel">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-500/20 p-3">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-semibold">AI Coach Panel</h2>
          <p className="text-sm text-slate-300">Live feedback and response quality</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card-soft p-4">
          <div className="text-sm text-slate-300">Current Mode</div>
          <div className="mt-1 font-semibold">{mode.toUpperCase()}</div>
        </div>
        <div className="card-soft p-4">
          <div className="text-sm text-slate-300">Current Score</div>
          <div className="mt-1 font-semibold">{score ?? "-"}</div>
        </div>
        <div className="card-soft p-4">
          <div className="text-sm text-slate-300">Confidence</div>
          <div className="mt-1 font-semibold">
            <ScoreBadge value={confidenceScore} />
          </div>
        </div>

        {companyRubric?.label && (
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-4">
            <div className="text-sm text-cyan-100">Company Loop</div>
            <div className="mt-1 font-semibold">{companyRubric.label}</div>
            {!!companyRubric.rubric_focus?.length && (
              <p className="mt-2 text-sm text-slate-300">
                Focus: {companyRubric.rubric_focus.join(", ")}
              </p>
            )}
          </div>
        )}

        {Object.keys(scorecard).length > 0 && (
          <details className="card-soft p-4">
            <summary className="cursor-pointer font-medium">14-Dimension Scorecard</summary>
            <div className="grid gap-2">
              {Object.entries(scorecard).slice(0, 14).map(([key, value]) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>{key.replaceAll("_", " ")}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-cyan-500/20" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}

        {Object.keys(toneSignals).length > 0 && (
          <details className="card-soft p-4">
            <summary className="cursor-pointer font-medium">Tone Detection</summary>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• {safeText(toneSignals.summary, "Tone summary unavailable.")}</li>
              <li>• Fillers: {safeText(toneSignals.filler_count, "0")} · Hedging: {safeText(toneSignals.hedging_count, "0")}</li>
              <li>• Concision: {safeText(toneSignals.concision, "-")} · Confidence signal: {safeText(toneSignals.confidence_signal, "-")}</li>
            </ul>
          </details>
        )}

        <div className="card-soft p-4">
          <div className="mb-2 flex items-center gap-2">
            <Brain size={16} />
            <span className="font-medium">Live Feedback</span>
          </div>
          <p className="text-sm leading-6 text-slate-300">{safeText(feedback)}</p>
          {!!safeText(scoreExplanation) && (
            <div className="mt-3 rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-3 text-sm text-cyan-100">
              <span className="font-medium">Why this score:</span> {safeText(scoreExplanation)}
            </div>
          )}
          {canRetry && (
            <p className="mt-3 text-sm text-amber-300">
              Retry available for this question. Attempts left: {attemptsLeft}.
            </p>
          )}
          {!!safeText(pendingNextQuestion) && (
            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
              Next question preview: {safeText(pendingNextQuestion)}
            </div>
          )}
          <div className="mt-4">
            <button type="button" onClick={onReplayVoice} className="btn-secondary">
              <Volume2 size={16} />
              Replay Voice
            </button>
            {!!safeText(pendingNextQuestion) && (
              <button type="button" onClick={onContinueNextQuestion} className="btn-primary ml-3">
                Continue to Next Question
              </button>
            )}
          </div>
          {isSpeaking && (
            <div className="mt-4 flex items-center gap-2 text-sm text-cyan-300">
              <span className="animate-pulse">●</span>
              AI Coach Speaking...
            </div>
          )}
        </div>

        <details className="card-soft p-4" open={Boolean(score)}>
          <summary className="cursor-pointer font-medium">Detailed Notes</summary>
          <div className="mt-4 space-y-3">
            <ListCard title="Strengths" items={strengths} emptyText="No strengths yet." compact />
            <ListCard title="Weaknesses" items={weaknesses} emptyText="No weaknesses yet." compact />
            <ListCard title="Suggestions" items={suggestions} emptyText="No suggestions yet." compact />
          </div>
        </details>

        <div className="card-soft p-4">
          <div className="mb-2 font-medium">Red Flags</div>
          <ul className={`space-y-2 text-sm ${redFlags.length > 0 ? "text-rose-200" : "text-slate-300"}`}>
            {redFlags.length === 0 ? (
              <li>No red flags detected.</li>
            ) : (
              redFlags.map((item, i) => (
                <li key={i}>• {safeText(item).replaceAll("_", " ")}</li>
              ))
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
}

type ListCardProps = { title: string; items: unknown[]; emptyText: string; compact?: boolean };

function ListCard({ title, items, emptyText, compact = false }: ListCardProps) {
  return (
    <div className={compact ? "rounded-2xl border border-black/10 p-3" : "card-soft p-4"}>
      <div className="mb-2 font-medium">{title}</div>
      <ul className="space-y-2 text-sm text-slate-300">
        {items.length === 0 ? (
          <li>{emptyText}</li>
        ) : (
          items.map((item, i) => (
            <li key={i}>• {safeText(item)}</li>
          ))
        )}
      </ul>
    </div>
  );
}
