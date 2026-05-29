"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const API = "https://prompta-backend.vercel.app/api"; // apna backend URL yahan

// ── HELPERS ───────────────────────────────────────────────────────────────────
 
// File → base64 string
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result); // "data:image/...;base64,..."
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Toast notification
function Toast({ msg, type }) {
  if (!msg) return null;
  const colors = {
    success: "border-emerald-500/40 bg-emerald-950/60 text-emerald-300",
    error:   "border-red-500/40   bg-red-950/60   text-red-300",
    loading: "border-blue-500/40  bg-blue-950/60  text-blue-300",
  };
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium backdrop-blur-sm shadow-xl transition-all ${colors[type]}`}>
      {type === "loading" && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      )}
      {type === "success" && <span>✓</span>}
      {type === "error"   && <span>✕</span>}
      {msg}
    </div>
  );
}

// ── SMALL UI PIECES ───────────────────────────────────────────────────────────

function Tag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-900/50 bg-blue-950/30 text-blue-300 hover:border-blue-500/50 hover:bg-blue-900/30 transition-all cursor-default">
      <span className="text-blue-500">#</span>
      {label}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 text-blue-500 hover:text-red-400 transition-colors leading-none">×</button>
      )}
    </span>
  );
}

function SectionCard({ icon, title, children, delay = "0ms" }) {
  return (
    <div
      className="rounded-2xl border border-white/5 p-6 transition-all duration-300 hover:border-blue-900/40"
      style={{
        background: "linear-gradient(145deg,#0d1529 0%,#080d1c 100%)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
        animation: "fadeUp 0.5s ease both",
        animationDelay: delay,
      }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span className="text-blue-400 text-lg">{icon}</span>
        <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'DM Sans',sans-serif" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Label({ text }) {
  return <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-blue-400 mb-2">{text}</p>;
}

function TextInput({ value, onChange, placeholder, className = "" }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-blue-900/50 outline-none border focus:border-blue-500/60 transition-all ${className}`}
      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
    />
  );
}

// ── IMAGE UPLOAD BOX ──────────────────────────────────────────────────────────

function ImageUploadBox({ label, preview, onFile }) {
  const ref = useRef();
  return (
    <div className="flex-1">
      <Label text={label} />
      <div
        onClick={() => ref.current.click()}
        className="relative rounded-xl border-2 border-dashed border-blue-900/50 bg-blue-950/10 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-900/10"
        style={{ height: 140 }}
      >
        {preview ? (
          <img src={preview} alt={label} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-blue-900">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span className="text-xs text-blue-800">Click to upload</span>
          </div>
        )}
        <div className="absolute inset-0 bg-blue-500/0 hover:bg-blue-500/5 transition-colors duration-200" />
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files[0];
          if (f) onFile(f); // pass actual File object
        }}
      />
    </div>
  );
}

// ── CATEGORY PICKER (from real DB) ───────────────────────────────────────────

function CategoryPicker({ categories, selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {categories.length === 0 && (
        <p className="col-span-2 text-xs text-blue-900 py-2">No categories yet. Add one above first.</p>
      )}
      {categories.map((cat) => {
        const active = selected === cat._id;
        return (
          <button
            key={cat._id}
            onClick={() => onSelect(active ? "" : cat._id)}
            className="px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 text-left"
            style={{
              background:   active ? "linear-gradient(135deg,#1e3a6e,#1d4ed8)" : "rgba(255,255,255,0.03)",
              borderColor:  active ? "rgba(59,130,246,0.6)"                    : "rgba(255,255,255,0.07)",
              color:        active ? "#93c5fd"                                  : "#4e5f80",
              boxShadow:    active ? "0 0 16px rgba(29,78,216,0.2)"             : "none",
            }}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}

// ── COMMUNITY PROMPT CARD ─────────────────────────────────────────────────────

function CommunityPromptCard({ categories, onToast }) {
  const [beforeFile,  setBeforeFile]  = useState(null);
  const [afterFile,   setAfterFile]   = useState(null);
  const [beforePrev,  setBeforePrev]  = useState(null);
  const [afterPrev,   setAfterPrev]   = useState(null);
  const [title,       setTitle]       = useState("");
  const [categoryId,  setCategoryId]  = useState("");
  const [promptText,  setPromptText]  = useState("");
  const [loading,     setLoading]     = useState(false);

  const handleBeforeFile = (file) => {
    setBeforeFile(file);
    setBeforePrev(URL.createObjectURL(file));
  };
  const handleAfterFile = (file) => {
    setAfterFile(file);
    setAfterPrev(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!title.trim())    { onToast("Title likhna zaroori hai", "error"); return false; }
    if (!beforeFile)      { onToast("Before image select karo", "error"); return false; }
    if (!afterFile)       { onToast("After image select karo",  "error"); return false; }
    if (!categoryId)      { onToast("Category select karo",     "error"); return false; }
    if (!promptText.trim()){ onToast("Prompt text likhna zaroori hai", "error"); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    onToast("Upload ho raha hai...", "loading");
    try {
      // Convert images to base64
      const [b64Before, b64After] = await Promise.all([
        fileToBase64(beforeFile),
        fileToBase64(afterFile),
      ]);

      await axios.post(`${API}/prompts`, {
        title:        title.trim(),
        beforeImage:  b64Before,
        afterImage:   b64After,
        promptText:   promptText.trim(),
        categoryId,
        type:         "community",
      });

      onToast("Community prompt upload ho gaya! ✓", "success");

      // Reset
      setTitle(""); setPromptText(""); setCategoryId("");
      setBeforeFile(null); setAfterFile(null);
      setBeforePrev(null); setAfterPrev(null);
    } catch (err) {
      console.error(err);
      onToast(err?.response?.data?.message || "Upload fail ho gaya", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard icon="⚡" title="Community Prompt Upload" delay="0.15s">
      {/* Title */}
      <Label text="Prompt Title" />
      <div className="mb-5">
        <TextInput
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Portrait Elegance Restore"
        />
      </div>

      {/* Before / After Images */}
      <div className="flex gap-4 mb-6">
        <ImageUploadBox label="Before Image" preview={beforePrev} onFile={handleBeforeFile} />
        <ImageUploadBox label="After Image"  preview={afterPrev}  onFile={handleAfterFile}  />
      </div>

      {/* Category */}
      <Label text="Choose Category" />
      <div className="mb-5">
        <CategoryPicker categories={categories} selected={categoryId} onSelect={setCategoryId} />
      </div>

      {/* Prompt Text */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label text="AI Prompt Text" />
          <span className="text-[10px] text-blue-900">{promptText.length}/999</span>
        </div>
        <textarea
          value={promptText}
          onChange={e => setPromptText(e.target.value.slice(0, 999))}
          placeholder="Paste the precise AI prompt..."
          rows={4}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-blue-900/60 resize-none outline-none border focus:border-blue-500/60 transition-all"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", fontFamily: "'DM Mono',monospace", fontSize: 12 }}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-5 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
        style={{ background: "linear-gradient(135deg,#1e3a6e,#1d4ed8)", boxShadow: "0 0 20px rgba(29,78,216,0.3)" }}
      >
        {loading ? "Uploading..." : "🚀 Upload to Community Gallery"}
      </button>
    </SectionCard>
  );
}

// ── PROMPT LIBRARY CARD ───────────────────────────────────────────────────────

function PromptLibraryCard({ categories, onToast }) {
  const [photoFile,  setPhotoFile]  = useState(null);
  const [photoPrev,  setPhotoPrev]  = useState(null);
  const [title,      setTitle]      = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [promptText, setPromptText] = useState("");
  const [loading,    setLoading]    = useState(false);

  const handlePhotoFile = (file) => {
    setPhotoFile(file);
    setPhotoPrev(URL.createObjectURL(file));
  };

  const validate = () => {
    if (!title.trim())     { onToast("Title likhna zaroori hai", "error"); return false; }
    if (!categoryId)       { onToast("Category select karo",     "error"); return false; }
    if (!promptText.trim()){ onToast("Prompt text likhna zaroori hai", "error"); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    onToast("Upload ho raha hai...", "loading");
    try {
      let coverImage = "";
      if (photoFile) {
        coverImage = await fileToBase64(photoFile);
      }

      await axios.post(`${API}/prompts`, {
        title:        title.trim(),
        beforeImage:  coverImage || "none",  // library prompts mein before/after optional
        afterImage:   coverImage || "none",
        promptText:   promptText.trim(),
        categoryId,
        type:         "library",
      });

      onToast("Library prompt publish ho gaya! ✓", "success");

      // Reset
      setTitle(""); setPromptText(""); setCategoryId("");
      setPhotoFile(null); setPhotoPrev(null);
    } catch (err) {
      console.error(err);
      onToast(err?.response?.data?.message || "Publish fail ho gaya", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard icon="📚" title="Prompt Library Submission" delay="0.25s">

      {/* Optional cover photo */}
      <Label text="Cover Photo (Optional)" />
      <div
        onClick={() => document.getElementById("lib-photo-input").click()}
        className="relative rounded-xl border-2 border-dashed border-blue-900/50 bg-blue-950/10 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-500/50 transition-all duration-300 mb-5"
        style={{ height: 110 }}
      >
        {photoPrev
          ? <img src={photoPrev} alt="cover" className="w-full h-full object-cover rounded-xl" />
          : <div className="flex flex-col items-center gap-2 text-blue-900">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              <span className="text-xs">Click to upload cover image</span>
            </div>
        }
      </div>
      <input
        id="lib-photo-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files[0]; if (f) handlePhotoFile(f); }}
      />

      {/* Title */}
      <Label text="Prompt Title" />
      <div className="mb-5">
        <TextInput
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Architectural Restoration Master"
        />
      </div>

      {/* Category */}
      <Label text="Choose Category" />
      <div className="mb-5">
        <CategoryPicker categories={categories} selected={categoryId} onSelect={setCategoryId} />
      </div>

      {/* Prompt */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label text="The Master Prompt" />
          <span className="text-[10px] text-blue-900">{promptText.length}/999</span>
        </div>
        <textarea
          value={promptText}
          onChange={e => setPromptText(e.target.value.slice(0, 999))}
          placeholder="Paste the precise prompt..."
          rows={4}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-blue-900/60 resize-none outline-none border focus:border-blue-500/60 transition-all"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)", fontFamily: "'DM Mono',monospace", fontSize: 12 }}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-5 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
        style={{ background: "linear-gradient(135deg,#065f46,#059669)", boxShadow: "0 0 20px rgba(5,150,105,0.3)" }}
      >
        {loading ? "Publishing..." : "📚 Publish to Library"}
      </button>
    </SectionCard>
  );
}

// ── MAIN ADMIN PANEL ──────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [catName,    setCatName]    = useState("");
  const [categories, setCategories] = useState([]);  // { _id, name } from DB
  const [catLoading, setCatLoading] = useState(false);
  const [toast,      setToast]      = useState({ msg: "", type: "success" });

  // Show toast for 3 seconds
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    if (type !== "loading") {
      setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
    }
  }, []);

  // Fetch categories from backend
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      // Handle both { categories: [...] } and direct array
      const data = Array.isArray(res.data) ? res.data : (res.data.categories ?? []);
      setCategories(data);
    } catch (err) {
      console.error("Categories fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Add category to DB
  const addCategory = async () => {
    const name = catName.trim();
    if (!name) return;
    if (categories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
      showToast("Yeh category pehle se exist karti hai", "error");
      return;
    }
    setCatLoading(true);
    try {
      const res = await axios.post(`${API}/categories`, { name });
      const newCat = res.data.category || res.data;
      setCategories(p => [...p, newCat]);
      setCatName("");
      showToast(`"${name}" category add ho gayi ✓`, "success");
    } catch (err) {
      showToast(err?.response?.data?.message || "Category add fail", "error");
    } finally {
      setCatLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (id, name) => {
    try {
      await axios.delete(`${API}/categories/${id}`);
      setCategories(p => p.filter(c => c._id !== id));
      showToast(`"${name}" delete ho gayi`, "success");
    } catch (err) {
      showToast("Delete fail ho gayi", "error");
    }
  };

  return (
    <>
      <Toast msg={toast.msg} type={toast.type} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=DM+Mono&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseGlow { 0%,100%{opacity:.4} 50%{opacity:.9} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#1e3a6e; border-radius:2px; }
      `}</style>

      <div className="min-h-screen w-full mt-16" style={{ background:"linear-gradient(160deg,#070b18 0%,#06091a 100%)", fontFamily:"'DM Sans',sans-serif" }}>

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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </div>
                <h1 className="text-white text-2xl font-bold" style={{ fontFamily:"'DM Serif Display',serif" }}>Control Center</h1>
              </div>
              <p className="text-[#4e5f80] text-sm ml-12">Platform orchestration &amp; management</p>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-xs text-emerald-400 font-medium">Backend Connected</span>
            </div>
          </div>

          {/* ── TWO-COLUMN LAYOUT ── */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* LEFT COLUMN */}
            <div className="flex-1 flex flex-col gap-6">

              {/* ── CATEGORIES ── */}
              <SectionCard icon="⊞" title="Categories" delay="0.05s">
                <div className="flex gap-3 mb-5">
                  <input
                    value={catName}
                    onChange={e => setCatName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addCategory()}
                    placeholder="New category name..."
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder-blue-900/50 outline-none border focus:border-blue-500/60 transition-all"
                    style={{ background:"rgba(255,255,255,0.03)", borderColor:"rgba(255,255,255,0.07)" }}
                  />
                  <button
                    onClick={addCategory}
                    disabled={catLoading || !catName.trim()}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background:"linear-gradient(135deg,#1d4ed8,#2563eb)", boxShadow:"0 0 16px rgba(37,99,235,.3)" }}
                  >
                    {catLoading ? "..." : "Add"}
                  </button>
                </div>

                {/* Category tags */}
                {categories.length === 0 ? (
                  <p className="text-xs text-blue-900 py-2">Koi category nahi mili. Pehle add karo.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categories.map(c => (
                      <Tag
                        key={c._id}
                        label={c.name}
                        onRemove={() => deleteCategory(c._id, c.name)}
                      />
                    ))}
                  </div>
                )}
              </SectionCard>

              {/* ── COMMUNITY PROMPT ── */}
              <CommunityPromptCard categories={categories} onToast={showToast} />

              {/* ── LIBRARY PROMPT ── */}
              <PromptLibraryCard categories={categories} onToast={showToast} />

            </div>

            {/* RIGHT COLUMN — Stats */}
            <div className="w-full lg:w-72 flex flex-col gap-5">

              {/* Category count */}
              <div
                className="rounded-2xl border border-white/5 p-5"
                style={{ background:"linear-gradient(145deg,#0d1529,#080d1c)", boxShadow:"0 4px 32px rgba(0,0,0,.5)", animation:"fadeUp .5s ease both .1s" }}
              >
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-amber-400 mb-4">⬡ Inventory Health</p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Categories", value: categories.length },
                    { label: "Active Sessions", value: 3 },
                    { label: "Pending Review", value: 2 },
                  ].map(({ label, value }) => (
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

              {/* How to use guide */}
              <div
                className="rounded-2xl border border-white/5 p-5"
                style={{ background:"linear-gradient(145deg,#0d1529,#080d1c)", boxShadow:"0 4px 32px rgba(0,0,0,.5)", animation:"fadeUp .5s ease both .2s" }}
              >
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-blue-400 mb-4">◈ How to Upload</p>
                <div className="flex flex-col gap-3">
                  {[
                    { step:"1", text:"Pehle category add karo upar se", color:"#60a5fa" },
                    { step:"2", text:"Community prompt mein before/after images upload karo", color:"#a78bfa" },
                    { step:"3", text:"Category select karo aur AI prompt likho", color:"#34d399" },
                    { step:"4", text:"Library prompt mein sirf ek cover image kaafi hai", color:"#f59e0b" },
                  ].map(({ step, text, color }) => (
                    <div key={step} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                        style={{ background:`${color}22`, color, border:`1px solid ${color}44` }}>
                        {step}
                      </span>
                      <span className="text-[#6b7a9e] text-xs leading-relaxed">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platform Status */}
              <div
                className="rounded-2xl border border-white/5 p-5"
                style={{ background:"linear-gradient(145deg,#0d1529,#080d1c)", boxShadow:"0 4px 32px rgba(0,0,0,.5)", animation:"fadeUp .5s ease both .3s" }}
              >
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-blue-400 mb-4">● Platform Status</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { name:"Backend API",   ok: true  },
                    { name:"Image Upload",  ok: true  },
                    { name:"Database",      ok: true  },
                    { name:"Analytics",     ok: false },
                  ].map(({ name, ok }) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-[#6b7a9e] text-xs">{name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          {ok && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background:"#34d399" }} />}
                          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: ok ? "#34d399" : "#f87171" }} />
                        </span>
                        <span className="text-[10px]" style={{ color: ok ? "#34d399" : "#f87171" }}>
                          {ok ? "Operational" : "Degraded"}
                        </span>
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
