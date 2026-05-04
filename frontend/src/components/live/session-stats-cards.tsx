"use client";

type SessionStatsCardsProps = {
  attemptsLeft: number;
  passesLeft: number;
};

export function SessionStatsCards({ attemptsLeft, passesLeft }: SessionStatsCardsProps) {
  return (
    <div className="mb-6 grid gap-3 md:grid-cols-2">
      <div className="card-soft p-4">
        <div className="text-sm text-slate-300">Retry Attempts Left (Current Question)</div>
        <div className="mt-1 text-2xl font-bold">{attemptsLeft}</div>
      </div>
      <div className="card-soft p-4">
        <div className="text-sm text-slate-300">Passes Left (Session)</div>
        <div className="mt-1 text-2xl font-bold">{passesLeft}</div>
      </div>
    </div>
  );
}
