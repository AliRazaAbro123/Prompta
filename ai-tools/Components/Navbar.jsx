"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { label: "Community Gallery", href: "/" },
    { label: "Prompt Library", href: "/Library" },
  ];

  const isActive = (href) => pathname === href;

  return (
    <>
      <style>{`
        @keyframes activeGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(99,102,241,0.4), inset 0 0 8px rgba(99,102,241,0.05); }
          50% { box-shadow: 0 0 16px rgba(139,92,246,0.6), inset 0 0 12px rgba(139,92,246,0.1); }
        }
        @keyframes activePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        @keyframes activeUnderline {
          0%, 100% { transform: scaleX(1); opacity: 1; }
          50% { transform: scaleX(0.7); opacity: 0.6; }
        }
        .nav-active-link {
          animation: activeGlow 2.5s ease-in-out infinite;
        }
        .nav-active-dot {
          animation: activePulse 2.5s ease-in-out infinite;
        }
        .nav-active-underline {
          animation: activeUnderline 2.5s ease-in-out infinite;
        }
      `}</style>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0b1a]/95 backdrop-blur-md shadow-[0_2px_24px_rgba(99,102,241,0.10)]"
            : "bg-[#0a0b1a]"
        } border-b border-white/5`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href={"/"} className="flex items-center gap-2.5 select-none">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                <span className="font-bold">Prompt</span>
                <span className="text-indigo-400 font-light"> Libs</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 overflow-hidden ${
                      active
                        ? "text-white bg-white/10 border border-indigo-500/40 nav-active-link"
                        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {link.label}
                    {/* Animated underline bar */}
                    {active && (
                      <span
                        className="nav-active-underline absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-400"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center gap-3">
              <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 active:scale-95">
                Login
              </button>
            </div>

            {/* Mobile: Search + Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              {/* <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button> */}
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                aria-label="Open menu"
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Slide-in Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] z-[70] bg-[#0d0e22] border-l border-white/8 shadow-2xl shadow-black/60 transition-transform duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden flex flex-col ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-base">
              <span className="font-bold">Vision</span>
              <span className="text-indigo-400 font-light">Master</span>
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-all"
            aria-label="Close menu"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden ${
                  active
                    ? "text-white bg-indigo-600/20 border border-indigo-500/30 nav-active-link"
                    : "text-gray-400 hover:text-white hover:bg-white/6 border border-transparent"
                }`}
              >
                <span>{link.label}</span>
                {active && (
                  <>
                    {/* Animated dot */}
                    <span className="nav-active-dot ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {/* Animated bottom bar */}
                    <span className="nav-active-underline absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-indigo-400 to-violet-400" />
                  </>
                )}
              </Link>
            );
          })}

          {/* Admin */}
          {/* <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-400 hover:bg-amber-400/10 transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>
            </svg>
            Admin
          </a> */}
        </div>

        {/* Drawer Footer — Login */}
        <div className="px-4 py-5 border-t border-white/8">
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-95">
            Login
          </button>
        </div>
      </div>
    </>
  );
}