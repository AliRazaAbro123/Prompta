"use client";
import { useState, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const DB_CATEGORIES = [
  "Human Restoration",
  "Abstract Art",
  "Nature Scenes",
  "Building Decoration",
  "Character Design",
  "Architectural Visuals",
];

const INVENTORY = [
  { label: "Total Users", value: 0 },
  { label: "Vendors", value: 0 },
  { label: "Live Gallery", value: 9 },
  { label: "Prompt Library", value: 5 },
];

// ── SMALL HELPERS ─────────────────────────────────────────────────────────────
function Tag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-900/50 bg-blue-950/30 text-blue-300 transition-all hover:border-blue-500/50 hover:bg-blue-900/30 cursor-default">
      <span className="text-blue-500">#</span>
      {label}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 text-blue-500 hover:text-red-400 transition-colors text-xs leading-none">×</button>
      )}
    </span>
  );
}

function SectionCard({ icon, title, children, delay = "0ms" }) {
  return (
    <div
      className="rounded-2xl border border-white/5 p-6 transition-all duration-300 hover:border-blue-900/40"
      style={{
        background: "linear-gradient(145deg, #0d1529 0%, #080d1c 100%)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
        animation: `fadeUp 0.5s ease both`,
        animationDelay: delay,
      }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span className="text-blue-400 text-lg">{icon}</span>
        <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ImageUploadBox({ label, preview, onFile }) {
  const ref = useRef();
  return (
    <div className="flex-1">
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-400 mb-2">{label}</p>
      <div
        onClick={() => ref.current.click()}
        className="relative rounded-xl border-2 border-dashed border-blue-900/50 bg-blue-950/10 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-900/10"
        style={{ height: 140 }}
      >
        {preview ? (
          <img src={preview} alt={label} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-blue-900">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span className="text-xs text-blue-800">Click to upload</span>
          </div>
        )}
        <div className="absolute inset-0 bg-blue-500/0 hover:bg-blue-500/5 transition-colors duration-200" />
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => {
        const f = e.target.files[0];
        if (f) onFile(URL.createObjectURL(f));
      }} />
    </div>
  );
}

function CategoryGrid({ selected, onToggle }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {DB_CATEGORIES.map(cat => {
        const active = selected.includes(cat);
        return (
          <button
            key={cat}
            onClick={() => onToggle(cat)}
            className="px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200"
            style={{
              background: active ? "linear-gradient(135deg,#1e3a6e,#1d4ed8)" : "rgba(255,255,255,0.03)",
              borderColor: active ? "rgba(59,130,246,0.6)" : "rgba(255,255,255,0.07)",
              color: active ? "#93c5fd" : "#4e5f80",
              boxShadow: active ? "0 0 16px rgba(29,78,216,0.2)" : "none",
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

// ── TRANSFORMATION CARD ───────────────────────────────────────────────────────
function TransformationCard() {
  const [before, setBefore] = useState(null);
  const [after, setAfter] = useState(null);
  const [cats, setCats] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [saved, setSaved] = useState(false);

  const toggle = c => setCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  const handleNext = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SectionCard icon="⚡" title="Transformation Details" delay="0.15s">
      {/* Before / After */}
      <div className="flex gap-4 mb-6">
        <ImageUploadBox label="Before" preview={before} onFile={setBefore} />
        <ImageUploadBox label="After" preview={after} onFile={setAfter} />
      </div>

      {/* Category */}
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-400 mb-3">Choose Category</p>
      <CategoryGrid selected={cats} onToggle={toggle} />

      {/* Prompt */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-400">Master AI Prompt</p>
          <span className="text-[10px] text-blue-900">{prompt.length}/999</span>
        </div>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value.slice(0, 999))}
          placeholder="Paste the precise prompt..."
          rows={4}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-blue-900/60 resize-none outline-none transition-all duration-200 border focus:border-blue-500/60"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", fontFamily: "'DM Mono', monospace", fontSize: 12 }}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-5">
        <button className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-white/8 text-blue-400 hover:bg-white/5 transition-all">Back</button>
        <button
          onClick={handleNext}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300"
          style={{ background: saved ? "linear-gradient(135deg,#065f46,#059669)" : "linear-gradient(135deg,#1e3a6e,#1d4ed8)", boxShadow: "0 0 20px rgba(29,78,216,0.3)" }}
        >
          {saved ? "✓ Saved!" : "Next Step"}
        </button>
      </div>
    </SectionCard>
  );
}

// ── PROMPT LIBRARY SUBMISSION ─────────────────────────────────────────────────
function PromptLibraryCard() {
  const [photo, setPhoto] = useState(null);
  const [title, setTitle] = useState("");
  const [cats, setCats] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [published, setPublished] = useState(false);
  const photoRef = useRef();

  const toggle = c => setCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  const handlePublish = () => {
    setPublished(true);
    setTimeout(() => setPublished(false), 2500);
  };

  return (
    <SectionCard icon="📚" title="Prompt Library Submission" delay="0.25s">
      {/* Optional photo */}
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-400 mb-2">Optional Photo</p>
      <div
        onClick={() => photoRef.current.click()}
        className="relative rounded-xl border-2 border-dashed border-blue-900/50 bg-blue-950/10 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-500/50 transition-all duration-300 mb-5"
        style={{ height: 110 }}
      >
        {photo
          ? <img src={photo} alt="cover" className="w-full h-full object-cover rounded-xl" />
          : <div className="flex flex-col items-center gap-2 text-blue-900">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              <span className="text-xs">Click to upload cover image</span>
            </div>
        }
      </div>
      <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if(f) setPhoto(URL.createObjectURL(f)); }} />

      {/* Title */}
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-400 mb-2">Prompt Title</p>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="e.g. Architectural Restoration Master"
        className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-blue-900/50 outline-none border focus:border-blue-500/60 transition-all mb-5"
        style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
      />

      {/* Category */}
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-400 mb-3">Choose Category</p>
      <CategoryGrid selected={cats} onToggle={toggle} />

      {/* Prompt */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-400">The Master Prompt</p>
          <span className="text-[10px] text-blue-900">{prompt.length}/999</span>
        </div>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value.slice(0,999))}
          placeholder="Paste the precise prompt..."
          rows={4}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-blue-900/60 resize-none outline-none border focus:border-blue-500/60 transition-all"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", fontFamily: "'DM Mono', monospace", fontSize: 12 }}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-5">
        <button className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-white/8 text-blue-400 hover:bg-white/5 transition-all">Back</button>
        <button
          onClick={handlePublish}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300"
          style={{ background: published ? "linear-gradient(135deg,#065f46,#059669)" : "linear-gradient(135deg,#1e3a6e,#1d4ed8)", boxShadow: "0 0 20px rgba(29,78,216,0.3)" }}
        >
          {published ? "✓ Published!" : "Publish Prompt"}
        </button>
      </div>
    </SectionCard>
  );
}

// ── MAIN PANEL ────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [catName, setCatName] = useState("");
  const [slugName, setSlugName] = useState("");
  const [categories, setCategories] = useState(DB_CATEGORIES);

  const addCategory = () => {
    const t = catName.trim();
    if (!t || categories.includes(t)) return;
    setCategories(p => [...p, t]);
    setCatName("");
    setSlugName("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=DM+Mono&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseGlow { 0%,100%{opacity:.4} 50%{opacity:.9} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e3a6e; border-radius: 2px; }
      `}</style>

      <div className="min-h-screen w-full mt-16" style={{ background: "linear-gradient(160deg,#070b18 0%,#06091a 100%)", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Background glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div style={{ position:"absolute", top:0, left:"20%", width:600, height:300, background:"radial-gradient(ellipse,rgba(29,78,216,0.07) 0%,transparent 70%)" }} />
          <div style={{ position:"absolute", top:200, right:0, width:400, height:400, background:"radial-gradient(circle,rgba(14,165,233,0.04) 0%,transparent 70%)", animation:"pulseGlow 5s ease-in-out infinite" }} />
          <div style={{ position:"absolute", inset:0, opacity:0.02, backgroundImage:"linear-gradient(rgba(99,179,237,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,1) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* ── TOP HEADER ── */}
          <div className="flex items-start justify-between mb-8" style={{ animation:"fadeUp .4s ease both" }}>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:"linear-gradient(135deg,#f59e0b,#d97706)", boxShadow:"0 0 20px rgba(245,158,11,.3)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
                <h1 className="text-white text-2xl font-bold" style={{ fontFamily:"'DM Serif Display',serif" }}>Control Center</h1>
              </div>
              <p className="text-[#4e5f80] text-sm ml-12">Platform orchestration &amp; management</p>
            </div>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{ background:"linear-gradient(135deg,#1d4ed8,#2563eb)", boxShadow:"0 0 24px rgba(37,99,235,.35)" }}
            >
              <span className="text-lg leading-none">+</span> Upload
            </button>
          </div>

          {/* ── TWO-COLUMN LAYOUT ── */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* LEFT COLUMN */}
            <div className="flex-1 flex flex-col gap-6">

              {/* CATEGORIES */}
              <SectionCard icon="⊞" title="Categories" delay="0.05s">
                <div className="flex gap-3 mb-5">
                  <input
                    value={catName}
                    onChange={e => { setCatName(e.target.value); setSlugName(e.target.value.toLowerCase().replace(/\s+/g,"-")); }}
                    placeholder="Category Name"
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder-blue-900/50 outline-none border focus:border-blue-500/60 transition-all"
                    style={{ background:"rgba(255,255,255,0.03)", borderColor:"rgba(255,255,255,0.07)" }}
                    onKeyDown={e => e.key === "Enter" && addCategory()}
                  />
                  <input
                    value={slugName}
                    onChange={e => setSlugName(e.target.value)}
                    placeholder="slug-name"
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder-blue-900/50 outline-none border focus:border-blue-500/60 transition-all"
                    style={{ background:"rgba(255,255,255,0.03)", borderColor:"rgba(255,255,255,0.07)" }}
                  />
                  <button
                    onClick={addCategory}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                    style={{ background:"linear-gradient(135deg,#1d4ed8,#2563eb)", boxShadow:"0 0 16px rgba(37,99,235,.3)" }}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <Tag key={c} label={c} onRemove={() => setCategories(p => p.filter(x => x !== c))} />
                  ))}
                </div>
              </SectionCard>

              {/* TRANSFORMATION */}
              <TransformationCard />

              {/* PROMPT LIBRARY SUBMISSION */}
              <PromptLibraryCard />
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-72 flex flex-col gap-5">

              {/* INVENTORY HEALTH */}
              <div
                className="rounded-2xl border border-white/5 p-5 transition-all duration-300 hover:border-blue-900/40"
                style={{ background:"linear-gradient(145deg,#0d1529,#080d1c)", boxShadow:"0 4px 32px rgba(0,0,0,.5)", animation:"fadeUp .5s ease both .1s" }}
              >
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-amber-400 mb-4">⬡ Inventory Health</p>
                <div className="flex flex-col gap-3">
                  {INVENTORY.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                      <span className="text-[#8b90a8] text-sm">{label}</span>
                      <span className="text-white font-bold text-lg w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background:"rgba(29,78,216,.15)", border:"1px solid rgba(59,130,246,.2)" }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUICK STATS */}
              <div
                className="rounded-2xl border border-white/5 p-5"
                style={{ background:"linear-gradient(145deg,#0d1529,#080d1c)", boxShadow:"0 4px 32px rgba(0,0,0,.5)", animation:"fadeUp .5s ease both .2s" }}
              >
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-blue-400 mb-4">◈ Quick Stats</p>
                <div className="flex flex-col gap-3">
                  {[
                    { label:"Categories", value: categories.length, color:"#60a5fa" },
                    { label:"Active Sessions", value:3, color:"#34d399" },
                    { label:"Pending Review", value:2, color:"#f59e0b" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width:`${Math.min(value*10,100)}%`, background: color }} />
                      </div>
                      <span className="text-[#6b7a9e] text-xs w-24 text-right">{label}</span>
                      <span className="text-white font-bold text-sm w-4">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* PLATFORM STATUS */}
              <div
                className="rounded-2xl border border-white/5 p-5"
                style={{ background:"linear-gradient(145deg,#0d1529,#080d1c)", boxShadow:"0 4px 32px rgba(0,0,0,.5)", animation:"fadeUp .5s ease both .3s" }}
              >
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-blue-400 mb-4">● Platform Status</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { name:"API Gateway", ok:true },
                    { name:"Image CDN", ok:true },
                    { name:"Auth Service", ok:true },
                    { name:"Analytics", ok:false },
                  ].map(({ name, ok }) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-[#6b7a9e] text-xs">{name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          {ok && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background:"#34d399" }} />}
                          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: ok ? "#34d399" : "#f87171" }} />
                        </span>
                        <span className="text-[10px]" style={{ color: ok ? "#34d399" : "#f87171" }}>{ok ? "Operational" : "Degraded"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
