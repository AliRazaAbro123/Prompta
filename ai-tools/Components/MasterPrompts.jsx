"use client";
import { useState } from "react";

const prompts = [
  {
    id: 1,
    category: "OTHER",
    categoryColor: "#6b7a9e",
    title: "YouTube Channel",
    description: "Egejutnfnwmtnwg fgwtjwtjwy",
    image: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
  },
  {
    id: 2,
    category: "OTHER",
    categoryColor: "#6b7a9e",
    title: "dfbjdnvjnlgdk",
    description: "cghfghjhtr",
    image: null,
  },
  {
    id: 3,
    category: "HUMAN",
    categoryColor: "#38bdf8",
    title: "Vvip master prompt 🤩",
    description: "Djdkshdk dhfkfkffo",
    image: null,
  },
  {
    id: 4,
    category: "ARCHITECTURE",
    categoryColor: "#a78bfa",
    title: "Ali dkdlkfkfo",
    description: "Akdlormxxhxosows",
    image: null,
  },
  {
    id: 5,
    category: "HUMAN",
    categoryColor: "#38bdf8",
    title: "Best master prompt 🤩",
    description: "Jdsidkfodfofо dkdlabdoffo dododod",
    image: null,
  },
  {
    id: 6,
    category: "CREATIVE",
    categoryColor: "#34d399",
    title: "Creative Vision Pro",
    description: "Unlocks next-level creative generation for any medium",
    image: null,
  },
];

const categoryIcons = {
  OTHER: "◈",
  HUMAN: "◉",
  ARCHITECTURE: "⬡",
  CREATIVE: "✦",
};

function PlaceholderAvatar({ title, category }) {
  const colors = {
    OTHER: ["#1e3a5f", "#2563eb"],
    HUMAN: ["#0c2a4a", "#0ea5e9"],
    ARCHITECTURE: ["#1e1b4b", "#7c3aed"],
    CREATIVE: ["#064e3b", "#059669"],
  };
  const [from, to] = colors[category] || ["#1e3a5f", "#2563eb"];
  const initials = title.slice(0, 2).toUpperCase();
  return (
    <div
      className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials}
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function PromptCard({ prompt, index }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.title + " - " + prompt.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group relative rounded-2xl border overflow-hidden transition-all duration-500 cursor-default"
      style={{
        background: "linear-gradient(145deg, #0d1529 0%, #0a1020 100%)",
        borderColor: hovered ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.06)",
        boxShadow: hovered
          ? "0 0 0 1px rgba(59,130,246,0.2), 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(59,130,246,0.08)"
          : "0 4px 24px rgba(0,0,0,0.4)",
        animationDelay: `${index * 80}ms`,
        animation: "fadeSlideUp 0.5s ease both",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)",
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Glow orb on hover */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="p-5 flex flex-col gap-4">
        {/* Category badge */}
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-bold tracking-[0.18em] uppercase"
            style={{ color: prompt.categoryColor }}
          >
            {categoryIcons[prompt.category]} {prompt.category}
          </span>
        </div>

        {/* Content row */}
        <div className="flex items-start gap-4">
          {prompt.image ? (
            <img
              src={prompt.image}
              alt={prompt.title}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 ring-1 ring-white/10"
            />
          ) : (
            <PlaceholderAvatar title={prompt.title} category={prompt.category} />
          )}

          <div className="flex flex-col gap-1 min-w-0">
            <h3
              className="text-white font-semibold text-base leading-snug truncate"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {prompt.title}
            </h3>
            <p
              className="text-[#4e5f80] text-xs leading-relaxed line-clamp-2"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {prompt.description}
            </p>
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="relative w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden"
          style={{
            background: copied
              ? "linear-gradient(135deg, #065f46, #059669)"
              : hovered
              ? "linear-gradient(135deg, #1e3a6e, #1d4ed8)"
              : "rgba(255,255,255,0.04)",
            border: copied
              ? "1px solid rgba(52,211,153,0.4)"
              : hovered
              ? "1px solid rgba(59,130,246,0.4)"
              : "1px solid rgba(255,255,255,0.08)",
            color: copied ? "#6ee7b7" : hovered ? "#93c5fd" : "#6b7a9e",
          }}
        >
          <CopyIcon />
          <span>{copied ? "Copied!" : "Copy Master Prompt"}</span>

          {/* Button shimmer */}
          {hovered && !copied && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
              }}
            />
          )}
        </button>
      </div>
    </div>
  );
}

export default function MasterPrompts() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=DM+Mono&display=swap');

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes shimmerX {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <section
        className="relative min-h-screen w-full py-20 px-4 sm:px-6 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #070b18 0%, #080d1c 60%, #06091a 100%)" }}
      >
        {/* Background atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(29,78,216,0.08) 0%, transparent 70%)" }} />
          <div className="absolute top-32 left-10 w-64 h-64 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)", animation: "pulseGlow 4s ease-in-out infinite" }} />
          <div className="absolute top-20 right-10 w-48 h-48 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)", animation: "pulseGlow 5s ease-in-out infinite 1s" }} />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(rgba(99,179,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14" style={{ animation: "fadeSlideUp 0.6s ease both" }}>
            {/* Label pill */}
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border"
              style={{ background: "rgba(29,78,216,0.1)", borderColor: "rgba(59,130,246,0.25)" }}>
              <span className="text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase">✦ Prompt Library</span>
            </div>

            <h2
              className="text-white text-4xl sm:text-5xl font-bold leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.01em" }}
            >
              Master{" "}
              <span
                className="relative inline-block"
                style={{ WebkitTextFillColor: "transparent", backgroundClip: "text", WebkitBackgroundClip: "text",
                  backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #38bdf8 100%)" }}
              >
                Prompts
              </span>
            </h2>

            <p className="mt-4 text-[#4e5f80] text-sm max-w-md mx-auto leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Curated high-performance prompts built for visionaries and AI creators.
            </p>

            {/* Divider */}
            <div className="mt-8 mx-auto w-24 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)" }} />
          </div>

          {/* Cards grid — 2 cols desktop, 1 col mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {prompts.map((prompt, i) => (
              <PromptCard key={prompt.id} prompt={prompt} index={i} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 text-center" style={{ animation: "fadeSlideUp 0.7s ease both 0.4s" }}>
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #2563eb)",
                boxShadow: "0 0 30px rgba(37,99,235,0.3), 0 4px 16px rgba(0,0,0,0.4)",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 40px rgba(37,99,235,0.5), 0 8px 24px rgba(0,0,0,0.5)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 30px rgba(37,99,235,0.3), 0 4px 16px rgba(0,0,0,0.4)"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
              Browse All Prompts
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
