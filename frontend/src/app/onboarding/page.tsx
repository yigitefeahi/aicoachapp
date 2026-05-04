"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type PreferencePayload = {
  target_company: string;
  interview_date: string;
  default_mode: "text" | "audio" | "video" | "presence" | "case";
  focus_area: string;
  difficulty: "Junior" | "Mid" | "Senior";
};

const focusAreas = ["Mixed", "Technical", "Behavioral", "Product Sense", "System Design", "Market Sizing"];

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState<PreferencePayload>({
    target_company: "",
    interview_date: "",
    default_mode: "text",
    focus_area: "Mixed",
    difficulty: "Junior",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(async () => {
      try {
        const res = await apiFetch("/account/preferences");
        const data = await res.json();
        setForm((current) => ({ ...current, ...data }));
      } catch {
        // New users may not have saved preferences yet.
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      setError(null);
      await apiFetch("/account/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      router.push("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not save onboarding");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen">
      <section className="container py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="step-label">Onboarding</p>
          <h1 className="section-title mt-3">Set your interview target</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            A short setup gives your dashboard, roadmap, and instant sessions better defaults.
          </p>
        </div>

        <div className="glass panel mx-auto mt-8 max-w-3xl">
          {error && <div className="mb-4 rounded-2xl bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="label">Target company</span>
              <input
                value={form.target_company}
                onChange={(e) => setForm({ ...form, target_company: e.target.value })}
                className="input mt-2"
                placeholder="Google, Meta, startup..."
              />
            </label>
            <label className="block">
              <span className="label">Interview date</span>
              <input
                type="date"
                value={form.interview_date}
                onChange={(e) => setForm({ ...form, interview_date: e.target.value })}
                className="input mt-2"
              />
            </label>
            <label className="block">
              <span className="label">Default mode</span>
              <select
                value={form.default_mode}
                onChange={(e) => setForm({ ...form, default_mode: e.target.value as PreferencePayload["default_mode"] })}
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
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value as PreferencePayload["difficulty"] })}
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
              <span className="label">Main focus</span>
              <select
                value={form.focus_area}
                onChange={(e) => setForm({ ...form, focus_area: e.target.value })}
                className="select mt-2"
              >
                {focusAreas.map((item) => (
                  <option key={item} value={item} className="text-black">
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={save} className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save and continue"}
            </button>
            <button type="button" onClick={() => router.push("/dashboard")} className="btn-secondary">
              Skip for now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
