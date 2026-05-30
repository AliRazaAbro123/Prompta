import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../Components/Navbar";
import PromptaFooter from "@/Components/PromptaFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://promptlibs.vercel.app";

export const metadata = {
  // ── Basic ──────────────────────────────────────────────────────────────────
  title: {
    default: "PromptLibs – Free AI Prompts Library | No Ads, 100% Free",
    template: "%s | PromptLibs",
  },
  description:
    "PromptLibs is a completely free library of unique, high-quality AI prompts for ChatGPT, Claude, Midjourney, and more. No ads, no sign-up, no price — just great prompts.",
  keywords: [
    "free AI prompts",
    "ChatGPT prompts",
    "Claude prompts",
    "Midjourney prompts",
    "prompt library",
    "AI prompt generator",
    "free prompts no ads",
    "best AI prompts 2025",
    "prompt engineering",
    "promptlibs",
  ],
  authors: [{ name: "PromptLibs", url: siteUrl }],
  creator: "PromptLibs",
  publisher: "PromptLibs",
  category: "Technology",

  // ── Canonical / Alternate ──────────────────────────────────────────────────
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },

  // ── Open Graph (Facebook, WhatsApp, LinkedIn) ──────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "PromptLibs",
    title: "PromptLibs – Free AI Prompts Library | No Ads, 100% Free",
    description:
      "Discover thousands of unique, free AI prompts. No ads, no sign-up — just the best prompts for ChatGPT, Claude, Midjourney & more.",
    // images: [
    //   {
    //     url: `${siteUrl}/og-image.png`, // apna 1200x630 OG image yahan rakhein
    //     width: 1200,
    //     height: 630,
    //     alt: "PromptLibs – Free AI Prompts Library",
    //   },
    // ],
  },

  // ── Twitter / X Card ──────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "PromptLibs – Free AI Prompts Library | No Ads, 100% Free",
    description:
      "Thousands of free, unique AI prompts for ChatGPT, Claude & Midjourney. Zero ads, zero cost.",
    // images: [`${siteUrl}/og-image.png`],
    // creator: "@yourTwitterHandle", // agar Twitter ho to uncomment karein
  },

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Icons ─────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  // ── Manifest (PWA) ────────────────────────────────────────────────────────
  manifest: "/site.webmanifest",

  // ── Verification (Google Search Console etc.) ─────────────────────────────
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
  //   yandex: "YOUR_YANDEX_CODE",
  // },
};

// ── JSON-LD Structured Data ────────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "PromptLibs",
      description:
        "A completely free library of unique, high-quality AI prompts. No ads, no sign-up.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "PromptLibs",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Preconnect for performance (helps Core Web Vitals / SEO) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#ffffff" />

        {/* Disable phone number detection on iOS */}
        <meta name="format-detection" content="telephone=no" />
      </head>

      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <PromptaFooter />
      </body>
    </html>
  );
}