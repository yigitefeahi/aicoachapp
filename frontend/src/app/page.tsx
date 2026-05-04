"use client";

import { motion } from "framer-motion";
import { Mic, Brain, Video, BarChart3, Sparkles } from "lucide-react";

const features = [
  {
    title: "Adaptive AI Interview",
    description: "Dynamic role-based questions with targeted follow-ups and scenario-driven interviewing.",
    icon: Brain,
  },
  {
    title: "Voice + Video Practice",
    description: "Practice across text, audio, and video modes with tailored coaching loops.",
    icon: Video,
  },
  {
    title: "Advanced RAG",
    description: "Role-specific retrieval engine delivers grounded, context-aware evaluation.",
    icon: Sparkles,
  },
  {
    title: "Detailed Analytics",
    description: "Rubric scores, strengths, weaknesses, progression graphs, and exportable reports.",
    icon: BarChart3,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="container flex min-h-screen flex-col py-8">
        <nav className="flex items-center justify-between rounded-full border border-black/10 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
          <div className="text-xl font-extrabold tracking-tight">AI Coach</div>
          <div className="flex gap-3">
            <a href="/login" className="btn-secondary">
              Login
            </a>
            <a href="/register" className="btn-primary">
              Start Free
            </a>
          </div>
        </nav>

        <div className="grid flex-1 gap-10 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="mx-auto max-w-2xl text-center lg:text-left">
            <p className="step-label">01 — Hello there</p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 max-w-3xl text-5xl font-extrabold leading-[0.98] tracking-[-0.055em] sm:text-6xl"
            >
              Practice interviews with a calm, focused{" "}
              <span className="gradient-text">AI coach</span>
            </motion.h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300 lg:mx-0">
              Set up your role, choose how you want to answer, and get practical feedback without
              changing the interview workflow you already use.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <a href="/register" className="btn-primary">
                Create Account
              </a>
              <a href="/login" className="btn-secondary">
                Continue to App
              </a>
            </div>
            <div className="mx-auto mt-8 max-w-lg card-soft p-5 text-left lg:mx-0">
              <div className="font-semibold">Flow stays the same</div>
              <p className="mt-2 text-sm text-slate-300">
                Users sign in, run a session, receive scored feedback, and track progress across past interviews.
              </p>
            </div>
          </div>

          <div className="glass mx-auto w-full max-w-xl rounded-[32px] p-6">
            <div className="mb-6 text-center">
              <p className="step-label">02 — Choose your practice</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em]">What do you want to improve?</h2>
            </div>
            <div className="mb-5 flex items-center gap-3 rounded-3xl bg-[#f7f3ed] p-4">
              <div className="rounded-2xl bg-white p-3 shadow-sm">
                <Mic size={22} />
              </div>
              <div>
                <div className="font-semibold">Live Coaching Panel</div>
                <div className="text-sm text-slate-300">Voice, video and instant feedback</div>
              </div>
            </div>

            <div className="grid gap-3">
              {features.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 rounded-3xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5"
                  >
                    <div className="rounded-2xl bg-[#f7f3ed] p-3">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-300">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}