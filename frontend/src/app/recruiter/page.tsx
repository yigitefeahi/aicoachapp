"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

type CompareItem = {
  session_id: number;
  profession: string;
  average_score?: number;
  final_score?: number;
  confidence_score?: number;
  red_flags?: string[];
};

export default function RecruiterComparePage() {
  const [ids, setIds] = useState("");
  const [rows, setRows] = useState<CompareItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const compare = async () => {
    try {
      setError(null);
      const res = await apiFetch(`/recruiter/compare?session_ids=${encodeURIComponent(ids)}`);
      const json = await res.json();
      setRows(json.items || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Comparison failed");
    }
  };

  return (
    <main className="min-h-screen">
      <section className="container py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="step-label">Recruiter</p>
          <h1 className="section-title mt-3">Compare Sessions</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Compare multiple candidate sessions by session IDs.
          </p>
        </div>

        <div className="glass mx-auto mt-8 max-w-3xl rounded-[32px] p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={ids}
              onChange={(e) => setIds(e.target.value)}
              className="input"
              placeholder="e.g. 12,14,20"
            />
            <button className="btn-primary" onClick={compare} type="button">
              Compare
            </button>
          </div>
          {error && <div className="mt-4 rounded-2xl bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
          <div className="mt-6 space-y-3">
            {rows.map((r) => (
              <div key={r.session_id} className="card-soft p-4">
                <div className="font-semibold">
                  Session #{r.session_id} • {r.profession}
                </div>
                <div className="mt-1 text-sm text-slate-300">
                  Final: {r.final_score ?? "-"} | Avg: {r.average_score ?? "-"} | Confidence:{" "}
                  {r.confidence_score ?? "-"}
                </div>
                <div className="mt-1 text-sm text-slate-300">
                  Red flags: {(r.red_flags || []).join(", ") || "none"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
