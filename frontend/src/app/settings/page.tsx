"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type AccountSummary = {
  user: { name: string; email: string; profession: string };
  usage: {
    sessions: number;
    completed_sessions: number;
    turns: number;
    stories: number;
    completed_drills?: number;
    average_score?: number | null;
  };
  preferences: PreferencePayload;
  privacy: {
    cv_processing: string;
    interview_data: string;
    delete_data_endpoint: string;
  };
};

type PreferencePayload = {
  target_company: string;
  interview_date: string;
  default_mode: "text" | "audio" | "video" | "presence" | "case";
  focus_area: string;
  difficulty: "Junior" | "Mid" | "Senior";
};

type UsageGuards = {
  limits: Array<{
    scope: string;
    max_requests: number;
    window_seconds: number;
    used_in_window?: number | null;
  }>;
  cost_controls: string[];
  status: string;
};

const focusAreas = ["Mixed", "Technical", "Behavioral", "Product Sense", "System Design", "Market Sizing"];

export default function SettingsPage() {
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [preferences, setPreferences] = useState<PreferencePayload | null>(null);
  const [usageGuards, setUsageGuards] = useState<UsageGuards | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(async () => {
      const [res, guardRes] = await Promise.all([
        apiFetch("/account/summary"),
        apiFetch("/account/usage-guards"),
      ]);
      const [data, guards] = await Promise.all([res.json(), guardRes.json()]);
      setSummary(data);
      setPreferences(data.preferences);
      setUsageGuards(guards);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const deletePracticeData = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setStatus("Click once more to permanently delete sessions, reports, and saved stories.");
      return;
    }
    const res = await apiFetch("/account/data", { method: "DELETE" });
    const data = await res.json();
    setStatus(`Deleted ${data.deleted?.sessions || 0} sessions and ${data.deleted?.stories || 0} stories.`);
    setConfirmDelete(false);
    const next = await apiFetch("/account/summary");
    const nextData = await next.json();
    setSummary(nextData);
    setPreferences(nextData.preferences);
  };

  const savePreferences = async () => {
    if (!preferences) return;
    const res = await apiFetch("/account/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preferences),
    });
    const saved = await res.json();
    setPreferences(saved);
    setStatus("Product defaults saved.");
  };

  return (
    <main className="min-h-screen">
      <section className="container py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="step-label">Settings</p>
          <h1 className="section-title mt-3">Profile, Privacy, and Defaults</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Keep the product trustworthy: know what is stored, review usage, and clear practice data when needed.
          </p>
        </div>

        {!summary ? (
          <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-3">
            <div className="skeleton h-32" />
            <div className="skeleton h-32" />
            <div className="skeleton h-32" />
          </div>
        ) : (
          <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-[0.38fr_0.62fr]">
            <aside className="glass panel">
              <h2 className="text-xl font-semibold">{summary.user.name}</h2>
              <p className="mt-2 text-sm text-slate-300">{summary.user.email}</p>
              <div className="mt-5 card-soft p-4">
                <div className="text-sm text-slate-300">Default Role</div>
                <div className="mt-1 font-semibold">{summary.user.profession}</div>
              </div>
              <div className="mt-5 grid gap-3">
                <div className="card-soft p-4">
                  <div className="text-sm text-slate-300">Sessions</div>
                  <div className="stat-value mt-2">{summary.usage.sessions}</div>
                </div>
                <div className="card-soft p-4">
                  <div className="text-sm text-slate-300">Saved Stories</div>
                  <div className="stat-value mt-2">{summary.usage.stories}</div>
                </div>
                <div className="card-soft p-4">
                  <div className="text-sm text-slate-300">Completed Drills</div>
                  <div className="stat-value mt-2">{summary.usage.completed_drills ?? 0}</div>
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              <section className="glass panel">
                <h2 className="text-xl font-semibold">Privacy and Data</h2>
                <div className="mt-4 space-y-3">
                  <div className="privacy-note">{summary.privacy.cv_processing}</div>
                  <div className="privacy-note">{summary.privacy.interview_data}</div>
                  <div className="privacy-note">
                    You can delete practice data without deleting your login account. This clears sessions, reports,
                    turns, and Story Vault items.
                  </div>
                </div>
                {status && <div className="mt-4 rounded-2xl bg-cyan-500/10 p-3 text-sm text-cyan-100">{status}</div>}
                <button type="button" onClick={deletePracticeData} className="btn-secondary mt-5">
                  {confirmDelete ? "Confirm Delete Practice Data" : "Delete Practice Data"}
                </button>
              </section>

              <section className="glass panel">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="step-label">Cost & Usage Guards</p>
                    <h2 className="mt-2 text-xl font-semibold">Limits are active</h2>
                    <p className="mt-2 text-sm text-slate-300">
                      AI-heavy actions are protected with request windows so hints, voice, retries, and uploads stay controlled.
                    </p>
                  </div>
                  <span className="badge text-xs">{usageGuards?.status || "active"}</span>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {(usageGuards?.limits || []).slice(0, 6).map((limit) => (
                    <div key={limit.scope} className="card-soft p-4">
                      <div className="font-medium">{limit.scope.replaceAll("-", " ")}</div>
                      <div className="mt-1 text-sm text-slate-300">
                        {limit.max_requests} requests / {limit.window_seconds}s
                        {typeof limit.used_in_window === "number" ? ` · used ${limit.used_in_window}` : ""}
                      </div>
                    </div>
                  ))}
                </div>
                <ul className="mt-5 space-y-2 text-sm text-slate-300">
                  {(usageGuards?.cost_controls || []).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </section>

              <section className="glass panel">
                <h2 className="text-xl font-semibold">Product Defaults</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Your saved profile role is used for instant practice, roadmap defaults, and fallback interview setup.
                  Theme preference is stored only in this browser.
                </p>
                <div className="mt-5 insight-strip">
                  <div className="card-soft p-4">
                    <div className="text-sm text-slate-300">Completed</div>
                    <div className="mt-1 font-semibold">{summary.usage.completed_sessions} sessions</div>
                  </div>
                  <div className="card-soft p-4">
                    <div className="text-sm text-slate-300">Answers</div>
                    <div className="mt-1 font-semibold">{summary.usage.turns} turns</div>
                  </div>
                  <div className="card-soft p-4">
                    <div className="text-sm text-slate-300">Average</div>
                    <div className="mt-1 font-semibold">{summary.usage.average_score ?? "-"}</div>
                  </div>
                </div>
                {preferences && (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="label">Target company</span>
                      <input
                        value={preferences.target_company || ""}
                        onChange={(e) => setPreferences({ ...preferences, target_company: e.target.value })}
                        className="input mt-2"
                        placeholder="Target company"
                      />
                    </label>
                    <label className="block">
                      <span className="label">Interview date</span>
                      <input
                        type="date"
                        value={preferences.interview_date || ""}
                        onChange={(e) => setPreferences({ ...preferences, interview_date: e.target.value })}
                        className="input mt-2"
                      />
                    </label>
                    <label className="block">
                      <span className="label">Default mode</span>
                      <select
                        value={preferences.default_mode}
                        onChange={(e) =>
                          setPreferences({ ...preferences, default_mode: e.target.value as PreferencePayload["default_mode"] })
                        }
                        className="select mt-2"
                      >
                        {["text", "audio", "video", "presence", "case"].map((mode) => (
                          <option key={mode} value={mode} className="text-black">
                            {mode}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="label">Difficulty</span>
                      <select
                        value={preferences.difficulty}
                        onChange={(e) =>
                          setPreferences({ ...preferences, difficulty: e.target.value as PreferencePayload["difficulty"] })
                        }
                        className="select mt-2"
                      >
                        {["Junior", "Mid", "Senior"].map((item) => (
                          <option key={item} value={item} className="text-black">
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block md:col-span-2">
                      <span className="label">Primary focus</span>
                      <select
                        value={preferences.focus_area}
                        onChange={(e) => setPreferences({ ...preferences, focus_area: e.target.value })}
                        className="select mt-2"
                      >
                        {focusAreas.map((item) => (
                          <option key={item} value={item} className="text-black">
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button type="button" onClick={savePreferences} className="btn-primary md:col-span-2">
                      Save Defaults
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
