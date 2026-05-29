"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://prompta-backend.vercel.app/api";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/6 bg-[#0d1529] animate-pulse p-5 flex flex-col gap-4">
      <div className="h-2.5 w-20 rounded bg-white/8" />
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-white/8 shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-3/4 rounded bg-white/8" />
          <div className="h-2.5 w-full rounded bg-white/5" />
          <div className="h-2.5 w-2/3 rounded bg-white/5" />
        </div>
      </div>
      <div className="h-9 w-full rounded-xl bg-white/5" />
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-500">No prompts in library yet</p>
        <p className="text-xs text-gray-700 mt-1">Admin panel se library prompts upload karo</p>
      </div>
    </div>
  );
}

// ── Placeholder Avatar ────────────────────────────────────────────────────────
function PlaceholderAvatar({ title }) {
  const initials = (title || "??").slice(0, 2).toUpperCase();
  return (
    <div
      className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
      style={{ background: "linear-gradient(135deg, #1e3a6e, #1d4ed8)" }}
    >
      {initials}
    </div>
  );
}

// ── Copy Icon ─────────────────────────────────────────────────────────────────
function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

// ── Prompt Card ───────────────────────────────────────────────────────────────
function PromptCard({ prompt, index }) {
  const [copied,  setCopied]  = useState(false);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  // Resolve category name (might be populated object)
  const categoryName = typeof prompt.category === "object"
    ? (prompt.category?.name || "General")
    : (prompt.category || "General");

  // Cover image — beforeImage used as cover in library prompts
  const coverImg = prompt.beforeImage && prompt.beforeImage !== "none"
    ? prompt.beforeImage
    : null;

  // ── Copy real promptText from backend (select: false — needs separate call)
  const handleCopy = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Fetch prompt with promptText included
      const res = await axios.get(`${API}/prompts/${prompt._id}/prompt-text`);
      const text = res.data?.promptText || "";
      if (text) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        setCopied(false);
        alert("Prompt text available nahi hai");
      }
    } catch (err) {
      console.error(err);
      alert("Copy fail ho gaya");
    } finally {
      setLoading(false);
    }
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

      {/* Glow orb */}
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
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-blue-400">
            ◈ {categoryName}
          </span>
        </div>

        {/* Content row */}
        <div className="flex items-start gap-4">
          {coverImg ? (
            <img
              src={coverImg}
              alt={prompt.title}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 ring-1 ring-white/10"
            />
          ) : (
            <PlaceholderAvatar title={prompt.title} />
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
              {categoryName} · Library Prompt
            </p>
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          disabled={loading}
          className="relative w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
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
          {loading ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          ) : (
            <CopyIcon />
          )}
          <span>{loading ? "Fetching..." : copied ? "Copied!" : "Copy Master Prompt"}</span>

          {hovered && !copied && !loading && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)" }}
            />
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function MasterPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      setError(false);
      try {
        const res  = await axios.get(`${API}/prompts/library`);
        const data = Array.isArray(res.data) ? res.data : (res.data.prompts ?? []);
        setPrompts(data);
      } catch (err) {
        console.error("Library fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

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
          50%      { opacity: 0.8; }
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
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(rgba(99,179,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-14" style={{ animation: "fadeSlideUp 0.6s ease both" }}>
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border"
              style={{ background: "rgba(29,78,216,0.1)", borderColor: "rgba(59,130,246,0.25)" }}>
              <span className="text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase">✦ Prompt Library</span>
            </div>

            <h2
              className="text-white text-4xl sm:text-5xl font-bold leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.01em" }}
            >
              Master{" "}
              <span style={{
                WebkitTextFillColor: "transparent", backgroundClip: "text", WebkitBackgroundClip: "text",
                backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #818cf8 50%, #38bdf8 100%)"
              }}>
                Prompts
              </span>
            </h2>

            <p className="mt-4 text-[#4e5f80] text-sm max-w-md mx-auto leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Curated high-performance prompts built for visionaries and AI creators.
            </p>

            <div className="mt-8 mx-auto w-24 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)" }} />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {loading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

            {!loading && error && (
              <div className="col-span-full text-center py-20">
                <p className="text-red-400 text-sm font-semibold">Backend se data nahi aaya</p>
                <p className="text-gray-700 text-xs mt-1">Server check karo</p>
              </div>
            )}

            {!loading && !error && prompts.length === 0 && <EmptyState />}

            {!loading && !error && prompts.map((prompt, i) => (
              <PromptCard key={prompt._id} prompt={prompt} index={i} />
            ))}

          </div>
        </div>
      </section>
    </>
  );
}
