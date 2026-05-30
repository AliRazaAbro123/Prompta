import { Search, MapPin } from "lucide-react";
import Link from "next/link";

const avatars = ["A", "B", "C", "D"];

export default function PromptaFooter() {
  return (
    <footer className="relative w-full bg-[#070b18] text-white overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-56 bg-blue-700/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/3 w-72 h-40 bg-cyan-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-80 h-32 bg-blue-900/20 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-0">
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-5">
            <Link
              href={"/"}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-400/50 transition-shadow duration-300">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span
                className="text-white font-semibold text-lg tracking-wide"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Prompta
              </span>
            </Link>

            <p className="text-[#6b7a9e] text-sm leading-relaxed max-w-[220px]">
              The intersection of AI creativity and professional restoration. We
              connect visionaries with the world&apos;s best AI artists.
            </p>

            <div className="flex gap-3 mt-1">
              {/* <button className="w-9 h-9 rounded-lg border border-blue-900/60 bg-blue-950/40 hover:bg-blue-900/40 hover:border-blue-400/50 flex items-center justify-center transition-all duration-200 group">
                <Search
                  size={15}
                  className="text-[#6b7a9e] group-hover:text-blue-300 transition-colors"
                />
              </button>
              <button className="w-9 h-9 rounded-lg border border-blue-900/60 bg-blue-950/40 hover:bg-blue-900/40 hover:border-blue-400/50 flex items-center justify-center transition-all duration-200 group">
                <MapPin
                  size={15}
                  className="text-[#6b7a9e] group-hover:text-blue-300 transition-colors"
                />
              </button> */}
            </div>
          </div>

          {/* Our Impact */}
          <div className="flex flex-col gap-5">
            <h3
              className="text-xs font-semibold tracking-[0.15em] uppercase text-blue-400"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Our Impact
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-1">
                <span
                  className="text-white font-bold text-4xl leading-none"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  12k
                </span>
                <span className="text-blue-400 font-bold text-2xl leading-none mb-0.5">
                  +
                </span>
              </div>
              <p className="text-[#6b7a9e] text-[10px] font-semibold uppercase tracking-[0.12em] -mt-2">
                Daily Creations
              </p>

              {/* Avatars */}
              <div className="flex items-center mt-1">
                {avatars.map((letter, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#070b18] -ml-2 first:ml-0 flex items-center justify-center"
                    style={{
                      zIndex: avatars.length - i,
                      background: [
                        "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                        "linear-gradient(135deg, #64748b, #334155)",
                        "linear-gradient(135deg, #06b6d4, #0284c7)",
                        "linear-gradient(135deg, #818cf8, #4f46e5)",
                      ][i],
                    }}
                  >
                    <span className="text-white text-[10px] font-bold">
                      {letter}
                    </span>
                  </div>
                ))}
                <div
                  className="w-8 h-8 rounded-full border-2 border-[#070b18] bg-blue-600 -ml-2 flex items-center justify-center"
                  style={{ zIndex: 0 }}
                >
                  <span className="text-white text-[9px] font-bold">400+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-5">
            <h3
              className="text-xs font-semibold tracking-[0.15em] uppercase text-blue-400"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Navigation
            </h3>
            <nav className="flex flex-col gap-3">
              {/* {["Gallery", "Prompts"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-[#6b7a9e] text-sm hover:text-blue-300 transition-all duration-200 hover:translate-x-1 transform inline-block w-fit"
                >
                  {item}
                </Link>
              ))} */}
              <Link
                href={"/"}
                className="text-[#6b7a9e] text-sm hover:text-blue-300 transition-all duration-200 hover:translate-x-1 transform inline-block w-fit"
              >
                Community Gallery
              </Link>
              <Link
                href={"/Library"}
                className="text-[#6b7a9e] text-sm hover:text-blue-300 transition-all duration-200 hover:translate-x-1 transform inline-block w-fit"
              >
                Prompt Library
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-5">
            <h3
              className="text-xs font-semibold tracking-[0.15em] uppercase text-blue-400"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Resources
            </h3>
            <nav className="flex flex-col gap-3">
              {["Community", "Security"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[#6b7a9e] text-sm hover:text-blue-300 transition-all duration-200 hover:translate-x-1 transform inline-block w-fit"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-900/60 to-transparent" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[#6b7a9e] text-xs tracking-wide">
              Systems Operational
            </span>
          </div>

          <p className="text-[#3a4566] text-xs tracking-wider uppercase">
            © 2026 Prompta Platform&nbsp;·&nbsp;Built for Artists
          </p>
        </div>
      </div>
    </footer>
  );
}
