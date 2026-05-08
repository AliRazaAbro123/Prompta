"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Heart, Copy, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import pic1 from "../public/coding.jpg"
import pic2 from "../public/download(5).jpg"
import axios from "axios"

// ─── Data ────────────────────────────────────────────────────────────────────


  

const CATEGORIES = [
  { id: "all", label: "All Items", icon: <Filter className="w-3.5 h-3.5" /> },
  { id: "abstract", label: "Abstract Art" },
  { id: "building1", label: "Building Decoration" },
  { id: "building2", label: "Building Decoration" },
  { id: "building3", label: "Building Decoration" },
  { id: "human1", label: "Human Restoration" },
  { id: "nature", label: "Nature Scenes" },
  { id: "abstract2", label: "Abstract Art" },
  { id: "human2", label: "Human Restoration" },
  { id: "character", label: "Character Design" },
];

const BEFORE_IMG = pic1;
const AFTER_IMG  = pic2;

const CARDS = [
  {
    id: 1,
    category: "Human Restoration",
    categoryColor: "from-indigo-500 to-violet-500",
    title: "Portrait Elegance Restore",
    author: "A Qadir (Kingbro)",
    likes: 13,
    before: BEFORE_IMG,
    after: AFTER_IMG,
  },
  {
    id: 2,
    category: "Human Restoration",
    categoryColor: "from-pink-500 to-rose-500",
    title: "Vivid Color Splash Art",
    author: "A Qadir (Kingbro)",
    likes: 4,
    before: BEFORE_IMG,
    after: AFTER_IMG,
  },
  {
    id: 3,
    category: "Human Restoration",
    categoryColor: "from-indigo-500 to-violet-500",
    title: "Classic Frame Enhancement",
    author: "A Qadir (Kingbro)",
    likes: 1,
    before: BEFORE_IMG,
    after: AFTER_IMG,
  },
  {
    id: 4,
    category: "Building Decoration",
    categoryColor: "from-amber-500 to-orange-500",
    title: "Architectural Facade Restore",
    author: "A Qadir (Kingbro)",
    likes: 5,
    before: BEFORE_IMG,
    after: AFTER_IMG,
  },
  {
    id: 5,
    category: "Human Restoration",
    categoryColor: "from-indigo-500 to-violet-500",
    title: "Infant Portrait Remaster",
    author: "A Qadir (Kingbro)",
    likes: 5,
    before: BEFORE_IMG,
    after: AFTER_IMG,
  },
];

// ─── Before/After Card ────────────────────────────────────────────────────────

function BeforeAfterCard({ card }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(card.likes);
  const containerRef = useRef(null);
  console.log(card.title);
  

  const updateSlider = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (isDragging) updateSlider(e.clientX);
  }, [isDragging, updateSlider]);

  const onMouseEnter = useCallback((e) => updateSlider(e.clientX), [updateSlider]);
  const onMouseLeave = useCallback(() => setSliderPos(50), []);

  const onTouchMove = useCallback((e) => {
    e.preventDefault();
    updateSlider(e.touches[0].clientX);
  }, [updateSlider]);

  const handleLike = () => {
    setLiked((p) => !p);
    setLikeCount((p) => liked ? p - 1 : p + 1);
  };

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-[#0f1024] border border-white/8 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">

      {/* Image Comparison */}
      <div
        ref={containerRef}
        className="relative h-64 sm:h-72 cursor-col-resize overflow-hidden select-none"
        onMouseMove={(e) => { onMouseEnter(e); onMouseMove(e); }}
        onMouseLeave={onMouseLeave}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onTouchMove={onTouchMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* After image (base) — FIX: use fill + sizes */}
        <Image
          src={card.afterImage}
          alt="After"
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover"
          draggable={false}
        />

        {/* Before image (clipped) — FIX: wrapper is absolute+clipped, Image uses fill */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <Image
            src={card.beforeImage}
            alt="Before"
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
            style={{ maxWidth: "none" }}
            draggable={false}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.8)] z-10 pointer-events-none"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          {/* Handle circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-700">
              <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Category badge */}
        <div className={`absolute top-3 left-3 z-20 px-2.5 py-1 rounded-md bg-gradient-to-r ${card.categoryColor} text-white text-[10px] font-bold uppercase tracking-widest shadow-lg`}>
          {card.category}
        </div>

        {/* More options */}
        <button className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[#1a1b35]/80 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600/60 transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>

        {/* Before / After labels */}
        <div className="absolute bottom-3 left-3 z-20 px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm text-[10px] font-bold tracking-widest text-white/80 uppercase">Before</div>
        <div className="absolute bottom-3 right-3 z-20 px-2 py-0.5 rounded bg-indigo-600/70 backdrop-blur-sm text-[10px] font-bold tracking-widest text-white uppercase">After</div>
      </div>

      {/* Card Footer */}
      <div className="flex flex-col gap-3 px-4 pt-3 pb-4">
        {/* Author */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            A
          </div>
          <div>
            <p className="text-xs font-semibold text-white leading-tight">{card.author}</p>
            <p className="text-[10px] text-gray-500">{card.title}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
              liked
                ? "bg-rose-500/20 border border-rose-500/40 text-rose-400"
                : "bg-white/5 border border-white/8 text-gray-400 hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-400"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 transition-all ${liked ? "fill-rose-400 text-rose-400 scale-110" : ""}`} />
            <span>{likeCount}</span>
          </button>

          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-95 hover:shadow-indigo-500/35">
            <Copy className="w-3.5 h-3.5" />
            <span>Prompt</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Gallery Section ─────────────────────────────────────────────────────

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollRef = useRef(null);

  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/prompts/community"
        );

        setPrompts(res.data.prompts);

      } catch (error) {
        console.log("Error fetching prompts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, []);

  const scrollCategories = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  return (
    <section className="bg-[#0a0b1a] px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Categories ── */}
      <div className="relative flex items-center gap-1 mb-3">
        <button
          onClick={() => scrollCategories(-1)}
          className="shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-500/40 transition-all z-10"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/30"
                  : "bg-white/4 border border-white/8 text-gray-400 hover:text-white hover:bg-white/8 hover:border-white/15"
              }`}
            >
              {cat.icon && cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollCategories(1)}
          className="shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-500/40 transition-all z-10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Decorative Scrollbar Track ── */}
      <div className="relative h-1.5 rounded-full mb-8 overflow-hidden"
        style={{ background: "linear-gradient(90deg, #1e1b4b, #312e81, #4338ca, #6d28d9, #7c3aed, #4338ca, #312e81, #1e1b4b)" }}
      >
        <div
          className="absolute inset-y-0 left-0 w-1/3 rounded-full animate-pulse"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.8), rgba(99,102,241,1), rgba(139,92,246,0.8), transparent)",
            animation: "slideGlow 3s ease-in-out infinite",
          }}
        />
        <style>{`
          @keyframes slideGlow {
            0%   { left: -33%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>

      {/* ── Cards Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {prompts.map((card) => (
          <BeforeAfterCard key={card._id} card={card} />
        ))}
      </div>
    </section>
  );
}