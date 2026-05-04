"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Story = {
  id: number;
  session_id?: number | null;
  title: string;
  tags: string[];
  question?: string | null;
  answer: string;
  score?: number | null;
  created_at: string;
};

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);

  const applyStarTemplate = () => {
    setAnswer(
      "Situation:\n\nTask:\n\nAction:\n\nResult:\n\nMetric / impact:\n"
    );
    if (!tags.trim()) setTags("STAR, impact");
  };

  const loadStories = useCallback(async (search = query) => {
    try {
      setError(null);
      const params = search.trim() ? `?q=${encodeURIComponent(search.trim())}` : "";
      const res = await apiFetch(`/stories${params}`);
      const data = await res.json();
      setStories(data.stories || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not load stories");
    }
  }, [query]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void loadStories("");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [loadStories]);

  const saveStory = async () => {
    if (!title.trim() || !answer.trim()) return;
    try {
      setError(null);
      await apiFetch("/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          question,
          answer,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });
      setTitle("");
      setQuestion("");
      setAnswer("");
      setTags("");
      await loadStories("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not save story");
    }
  };

  const deleteStory = async (id: number) => {
    await apiFetch(`/stories/${id}`, { method: "DELETE" });
    await loadStories();
  };

  const storyUseCase = (story: Story) => {
    const tagsText = story.tags.join(" ").toLowerCase();
    if (tagsText.includes("conflict")) return "Best for conflict or stakeholder alignment questions.";
    if (tagsText.includes("leadership") || tagsText.includes("ownership")) return "Best for leadership and ownership questions.";
    if (tagsText.includes("impact") || tagsText.includes("metric")) return "Best for impact, execution, and results questions.";
    if (tagsText.includes("technical")) return "Best for technical depth and problem-solving follow-ups.";
    return "Best for behavioral questions where a concrete example helps.";
  };

  return (
    <main className="min-h-screen">
      <section className="container py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="step-label">Story Vault</p>
          <h1 className="section-title mt-3">Searchable Answer Library</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            Save STAR stories, strong answers, and reusable examples for future interviews.
          </p>
        </div>

        {error && <div className="mt-6 rounded-2xl bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
          <aside className="glass panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Add Story</h2>
              <button type="button" onClick={applyStarTemplate} className="btn-secondary">
                STAR Template
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-300">
              Save reusable stories with tags so you can pull them into behavioral, leadership, conflict, or impact answers.
            </p>
            <div className="mt-5 space-y-3">
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Title" />
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input"
                placeholder="Tags: leadership, conflict, impact"
              />
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="textarea min-h-24"
                placeholder="Question or prompt"
              />
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="textarea min-h-48"
                placeholder="Your STAR answer"
              />
              <button type="button" onClick={saveStory} className="btn-primary" disabled={!title.trim() || !answer.trim()}>
                Save Story
              </button>
            </div>
          </aside>

          <div className="glass panel">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input"
                placeholder="Search conflict, leadership, metric..."
              />
              <button type="button" onClick={() => loadStories()} className="btn-secondary">
                Search
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {stories.length === 0 ? (
                <div className="empty-state">
                  <h3 className="font-semibold">No saved stories yet</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
                    Save your best answers from Results, or add a STAR story here manually. Your future self will thank you before behavioral interviews.
                  </p>
                </div>
              ) : (
                stories.map((story) => (
                  <article key={story.id} className="card-soft p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{story.title}</h3>
                        <p className="mt-1 text-xs text-slate-300">{new Date(story.created_at).toLocaleString()}</p>
                      </div>
                      <button type="button" onClick={() => deleteStory(story.id)} className="btn-secondary">
                        Delete
                      </button>
                    </div>
                    {story.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {story.tags.map((tag) => (
                          <span key={tag} className="badge text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {story.question && <p className="mt-4 text-sm font-medium">{story.question}</p>}
                    <div className="mt-3 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-3 text-sm text-cyan-100">
                      {storyUseCase(story)}
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">{story.answer}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
