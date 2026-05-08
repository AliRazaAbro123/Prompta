import { Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function HeroPortal() {
  return (
    <section className="relative flex flex-col items-center justify-center py-16 mt-10 px-4 overflow-hidden bg-[#0a0b1a]">

      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-10 left-1/3 w-[300px] h-[150px] bg-violet-500/8 rounded-full blur-[60px] pointer-events-none" />

      {/* H1 — Big gradient headline */}
      <h1 className="relative z-10 text-center text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.1]"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        <span
          className="inline-block"
          style={{
            background: "linear-gradient(135deg, #a78bfa 0%, #818cf8 25%, #60a5fa 50%, #34d399 75%, #fbbf24 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 32px rgba(139,92,246,0.4))",
          }}
        >
          Find any prompt
        </span>
        <br />
        <span
          className="inline-block"
          style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #f472b6 40%, #a78bfa 80%, #60a5fa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 24px rgba(244,114,182,0.3))",
          }}
        >
          that you want —{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #4ade80, #34d399)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            free!
          </span>
        </span>
      </h1>

      {/* AI Vision Portal badge */}
      <div className="relative z-10 flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-indigo-500/25 bg-indigo-500/10 backdrop-blur-sm">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-indigo-300">
          AI Vision Portal
        </span>
      </div>

      {/* CTA Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl">

        {/* Primary — Explore Community Gallery */}
        <button className="group relative flex items-center justify-center gap-3 w-full sm:flex-1 px-6 py-4 rounded-2xl font-semibold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40"
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #6d28d9 50%, #7c3aed 100%)",
          }}
        >
          {/* Shimmer */}
          <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
          <RefreshCw className="w-4 h-4 text-indigo-200 group-hover:rotate-180 transition-transform duration-500" />
          <Link href="/" className="text-white">
            Explore Community Gallery
          </Link>
        </button>

        {/* Secondary — Access Prompt Library */}
        <button className="group relative flex items-center justify-center gap-3 w-full sm:flex-1 px-6 py-4 rounded-2xl font-semibold text-sm text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-white/10 hover:border-indigo-400/40 hover:bg-white/5"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
          <Sparkles className="w-4 h-4 text-indigo-300 group-hover:text-indigo-200 transition-colors" />
          <Link href="/Library" className="text-gray-200 group-hover:text-white transition-colors">
            Access Prompt Library
          </Link>
        </button>

      </div>

      {/* Bottom subtle line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
    </section>
  );
}
