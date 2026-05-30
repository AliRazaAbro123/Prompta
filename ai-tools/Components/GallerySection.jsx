"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Heart, Copy, Check, Filter, ImageOff } from "lucide-react";
import Image from "next/image";
import axios from "axios";

const API = "https://prompta-backend.vercel.app/api"; // apna base URL

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all",       label: "All Items", icon: <Filter className="w-3.5 h-3.5" /> },
  { id: "abstract",  label: "Abstract Art" },
  { id: "building",  label: "Building Decoration" },
  { id: "human",     label: "Human Restoration" },
  { id: "nature",    label: "Nature Scenes" },
  { id: "character", label: "Character Design" },
];

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-[#0f1024] border border-white/8 animate-pulse">
      <div className="h-64 sm:h-72 bg-white/5" />
      <div className="flex flex-col gap-3 px-4 pt-3 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-white/10 shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-2.5 w-24 rounded bg-white/10" />
            <div className="h-2 w-16 rounded bg-white/8" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-14 rounded-xl bg-white/8" />
          <div className="h-8 flex-1 rounded-xl bg-white/8" />
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <ImageOff className="w-7 h-7 text-gray-600" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-400">No prompts uploaded yet</p>
        <p className="text-xs text-gray-600 mt-1">Be the first to share your work with the community!</p>
      </div>
    </div>
  );
}

// ─── Before/After Card ────────────────────────────────────────────────────────

function BeforeAfterCard({ card }) {
  const [sliderPos,  setSliderPos]  = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Like state
  const [liked,     setLiked]     = useState(false);
  const [likeCount, setLikeCount] = useState(card.likes ?? 0);
  const [likeLoading, setLikeLoading] = useState(false);

  // Copy state
  const [copyState, setCopyState] = useState("idle"); // "idle" | "loading" | "done"

  const containerRef = useRef(null);

  // ── Like status on mount ──
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await axios.get(`${API}/interactions/like/${card._id}`, {
          withCredentials: true, // cookie bhejo
        });
        setLiked(res.data.liked);
        setLikeCount(res.data.likeCount);
      } catch (err) {
        // silently fail — default values rehenge
      }
    };
    if (card._id) fetchLikeStatus();
  }, [card._id]);

  // ── Like toggle ──
  const handleLike = async () => {
    if (likeLoading) return;
    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => wasLiked ? c - 1 : c + 1);
    setLikeLoading(true);
    try {
      const res = await axios.post(
        `${API}/interactions/like/${card._id}`,
        {},
        { withCredentials: true }
      );
      // Server se actual values sync karo
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) {
      // Revert on error
      setLiked(wasLiked);
      setLikeCount((c) => wasLiked ? c + 1 : c - 1);
    } finally {
      setLikeLoading(false);
    }
  };

  // ── Copy prompt ──
  const handleCopy = async () => {
    if (copyState !== "idle") return;
    setCopyState("loading");
    try {
      const res = await axios.post(
        `${API}/interactions/copy/${card._id}`,
        {},
        { withCredentials: true }
      );
      // Clipboard mein copy karo
      await navigator.clipboard.writeText(res.data.promptText);
      setCopyState("done");
      // 2 second baad reset
      setTimeout(() => setCopyState("idle"), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      setCopyState("idle");
    }
  };

  // ── Slider logic ──
  const updateSlider = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x    = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseMove  = useCallback((e) => { if (isDragging) updateSlider(e.clientX); }, [isDragging, updateSlider]);
  const onMouseEnter = useCallback((e) => updateSlider(e.clientX), [updateSlider]);
  const onMouseLeave = useCallback(() => setSliderPos(50), []);
  const onTouchMove  = useCallback((e) => { e.preventDefault(); updateSlider(e.touches[0].clientX); }, [updateSlider]);

  // ── Helpers ──
  const resolveStr = (field, fallback = "") => {
    if (!field) return fallback;
    if (typeof field === "string") return field;
    if (typeof field === "object")
      return field.name || field.title || field.label || field.username || fallback;
    return String(field);
  };

  const beforeSrc     = card.beforeImage || card.before || null;
  const afterSrc      = card.afterImage  || card.after  || null;
  const authorName    = resolveStr(card.author || card.authorName || card.createdBy, "Unknown");
  const authorInitial = authorName.charAt(0).toUpperCase();
  const categoryLabel = resolveStr(card.category, "General");
  const badgeColor    = card.categoryColor || "from-indigo-500 to-violet-500";

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-[#0f1024] border border-white/8 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">

      {/* ── Image Comparison ── */}
      <div
        ref={containerRef}
        className="relative h-64 sm:h-72 cursor-col-resize overflow-hidden select-none"
        onMouseMove={(e)  => { onMouseEnter(e); onMouseMove(e); }}
        onMouseLeave={onMouseLeave}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={()   => setIsDragging(false)}
        onTouchMove={onTouchMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={()  => setIsDragging(false)}
      >
        {/* After image — base layer */}
        {afterSrc ? (
          <Image
            src={afterSrc}
            alt="After"
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-violet-900/40 flex items-center justify-center">
            <span className="text-[10px] text-gray-600 uppercase tracking-widest">After</span>
          </div>
        )}

        {/* Before image — clipped layer */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
          {beforeSrc ? (
            <Image
              src={beforeSrc}
              alt="Before"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover"
              style={{ maxWidth: "none" }}
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-gray-800/60 flex items-center justify-center">
              <span className="text-[10px] text-gray-600 uppercase tracking-widest">Before</span>
            </div>
          )}
        </div>

        {/* Slider line + handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.8)] z-10 pointer-events-none"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-700">
              <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Category badge */}
        <div className={`absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md bg-gradient-to-r ${badgeColor} text-white text-[10px] font-bold uppercase tracking-widest shadow-lg`}>
          {categoryLabel}
        </div>

        {/* Before / After labels */}
        <div className="absolute bottom-3 left-3 z-20 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm text-[10px] font-bold tracking-widest text-white/80 uppercase">Before</div>
        <div className="absolute bottom-3 right-3 z-20 px-2 py-0.5 rounded bg-indigo-600/70 backdrop-blur-sm text-[10px] font-bold tracking-widest text-white uppercase">After</div>
      </div>

      {/* ── Card Footer ── */}
      <div className="flex flex-col gap-3 px-4 pt-3 pb-4">
        {/* Author */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {authorInitial}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white leading-tight truncate">{authorName}</p>
            <p className="text-[10px] text-gray-500 truncate">{resolveStr(card.title, "Untitled")}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">

          {/* ── Like Button ── */}
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60 ${
              liked
                ? "bg-rose-500/20 border border-rose-500/40 text-rose-400"
                : "bg-white/5 border border-white/8 text-gray-400 hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-400"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-all ${
                liked ? "fill-rose-400 text-rose-400 scale-110" : ""
              }`}
            />
            <span>{likeCount}</span>
          </button>

          {/* ── Copy Button ── */}
          <button
            onClick={handleCopy}
            disabled={copyState !== "idle"}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 disabled:opacity-70 ${
              copyState === "done"
                ? "bg-green-500/20 border border-green-500/40 text-green-400"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35"
            }`}
          >
            {copyState === "done" ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : copyState === "loading" ? (
              <>
                {/* Simple spinner */}
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                <span>Copying…</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Prompt</span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}

// ─── Main Gallery Section ─────────────────────────────────────────────────────

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [prompts,        setPrompts]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(false);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      setError(false);
      try {
        const res  = await axios.get(`${API}/prompts/community`);
        const data = Array.isArray(res.data) ? res.data : (res.data.prompts ?? []);
        setPrompts(data);
      } catch (err) {
        console.error("Error fetching prompts:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  const filteredPrompts =
    activeCategory === "all"
      ? prompts
      : prompts.filter(
          (p) =>
            p.category?.toLowerCase().includes(activeCategory.toLowerCase()) ||
            p.categoryId === activeCategory
        );

  return (
    <section className="bg-[#0a0b1a] px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

        {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}

        {!loading && error && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 gap-3">
            <p className="text-sm text-red-400 font-semibold">Failed to load prompts</p>
            <p className="text-xs text-gray-600">Backend se connection nahi ho saka. Server check karo.</p>
          </div>
        )}

        {!loading && !error && filteredPrompts.length === 0 && <EmptyState />}

        {!loading && !error &&
          filteredPrompts.map((card) => (
            <BeforeAfterCard key={card._id} card={card} />
          ))
        }

      </div>
    </section>
  );
}