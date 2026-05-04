"use client";

type InterviewerAvatarProps = {
  /** True while TTS is playing (question or feedback). */
  speaking: boolean;
};

/**
 * Simple non-photoreal “interviewer” presence — distinct from user webcam video.
 */
export function InterviewerAvatar({ speaking }: InterviewerAvatarProps) {
  return (
    <div
      className={`relative mx-auto flex h-52 w-52 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white shadow-[0_24px_70px_rgba(31,41,51,0.1)] transition-transform duration-300 ${
        speaking ? "scale-[1.02] shadow-[0_28px_80px_rgba(216,157,91,0.24)]" : ""
      }`}
      aria-hidden
    >
      <div
        className={`absolute inset-0 rounded-full bg-cyan-500/10 blur-xl ${speaking ? "animate-pulse opacity-100" : "opacity-40"}`}
      />
      <svg
        viewBox="0 0 120 120"
        className="relative z-[1] h-36 w-36 text-cyan-100/90"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <ellipse cx="60" cy="52" rx="34" ry="40" className="text-slate-400/80" />
        <circle cx="44" cy="48" r="4" fill="currentColor" stroke="none" className="text-cyan-200" />
        <circle cx="76" cy="48" r="4" fill="currentColor" stroke="none" className="text-cyan-200" />
        {speaking ? (
          <path
            d="M 42 72 Q 60 82 78 72"
            className="text-cyan-300"
            strokeWidth="2.5"
          />
        ) : (
          <path d="M 44 72 H 76" className="text-slate-400/90" strokeWidth="2" />
        )}
        <path
          d="M 60 22 C 38 22 28 38 28 52"
          className="text-slate-600/60"
          strokeWidth="1.5"
        />
        <path
          d="M 60 22 C 82 22 92 38 92 52"
          className="text-slate-600/60"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
