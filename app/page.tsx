"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Github, Zap, Package, ArrowDown } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import PortfolioPreview from "@/components/PortfolioPreview";
import DownloadButton from "@/components/DownloadButton";
import NoiseOverlay from "@/components/NoiseOverlay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { fetchFullProfile } from "@/lib/github";
import {
  GitHubUser,
  EnhancedRepo,
  PortfolioData,
  AIGeneratedContent,
  BrandIdentity,
} from "@/lib/types";

// Dynamic import for 3D background to avoid SSR issues
const Background3D = dynamic(() => import("@/components/Background3D"), {
  ssr: false,
});

// Rate limiting for AI generation (15 req/min)
let lastRequestTime = 0;
let requestCount = 0;

async function generateAIContent(repo: {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
}): Promise<AIGeneratedContent | null> {
  const now = Date.now();

  // Reset counter every minute
  if (now - lastRequestTime > 60000) {
    requestCount = 0;
    lastRequestTime = now;
  }

  // Check rate limit
  if (requestCount >= 15) {
    return null;
  }

  requestCount++;

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        repoName: repo.name,
        description: repo.description,
        language: repo.language,
        topics: repo.topics,
      }),
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export default function Home() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<EnhancedRepo[]>([]);
  const [brand, setBrand] = useState<BrandIdentity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (username: string) => {
    setIsLoading(true);
    setError(null);
    setBrand(null);
    setUser(null); // Return to landing page during search
    setRepos([]);

    try {
      // 1. Fetch GitHub Profile
      const { user: fetchedUser, repos: fetchedRepos } = await fetchFullProfile(
        username
      );

      // 2. Generate Brand Identity
      const brandResponse = await fetch("/api/generate/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: fetchedUser,
          topRepos: fetchedRepos.slice(0, 5),
        }),
      });

      let finalBrand: BrandIdentity | null = null;
      if (brandResponse.ok) {
        finalBrand = await brandResponse.json();
      } else {
        // Essential fallback for resilience
        finalBrand = {
          primaryColor: "#8b5cf6",
          accentColor: "#6366f1",
          secondaryColor: "#4f46e5",
          backgroundColor: "#050505",
          typography: "modern-sans",
          vibe: "glassmorphism",
          layoutPattern: "bento-grid",
          fontFamily: "Inter",
          themePreference: "dark",
          layoutSections: [
            "hero-main",
            "projects-bento",
            "stats-card",
            "footer-classic",
          ],
          designRationale:
            "A clean, modern professional developer layout with glassmorphism accents.",
          designTokens: {
            borderRadius: "lg",
            glassOpacity: 0.1,
            borderWidth: 1,
            shadowIntensity: "soft",
            animationStyle: "spring",
          },
          sectionStyles: {
            "hero-main": {
              spacing: "spacious",
              alignment: "center",
              visualWeight: "card",
              backgroundGlow: true,
            },
            "projects-bento": {
              spacing: "normal",
              alignment: "center",
              visualWeight: "full-width",
            },
          },
        };
      }

      // 3. Set basic data and switch view
      setBrand(finalBrand);
      setRepos(fetchedRepos);
      setUser(fetchedUser);

      // 4. Generate AI content for top repos (background enhancement)
      if (fetchedRepos.length > 0) {
        setIsGeneratingAI(true);
        const topRepos = fetchedRepos.slice(0, 6);

        const enhancedRepos = await Promise.all(
          topRepos.map(async (repo) => {
            const aiContent = await generateAIContent({
              name: repo.name,
              description: repo.description,
              language: repo.language,
              topics: repo.topics || [],
            });
            return { ...repo, aiContent: aiContent || undefined };
          })
        );

        setRepos([...enhancedRepos, ...fetchedRepos.slice(6)]);
        setIsGeneratingAI(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const portfolioData: PortfolioData | null =
    user && brand
      ? {
          user,
          repos,
          brand,
          generatedAt: new Date().toISOString(),
        }
      : null;

  return (
    <>
      <Background3D
        primaryColor={brand?.primaryColor}
        accentColor={brand?.accentColor}
      />

      <NoiseOverlay />

      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <ThemeToggle />
      </div>

      <div className="relative min-h-screen">
        {/* Hero Section */}
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.section
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
            >
              <div className="absolute inset-0 bg-radial from-violet-500/5 to-transparent pointer-events-none" />

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent dark:bg-violet-500/20 border border-primary/20 dark:border-violet-500/20 mb-8 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary">
                  Powered by Gemini 2.0 Flash
                </span>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-6 leading-[1.1] md:leading-tight tracking-tighter"
              >
                <span className="gradient-text">Transform</span>
                <br />
                <span className="text-foreground">Your GitHub</span>
                <br />
                <span className="text-foreground/80 dark:text-foreground/60 transition-colors duration-500">
                  Into a Portfolio 
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base sm:text-lg md:text-xl text-muted-foreground text-center max-w-2xl mb-8 md:mb-12 font-medium px-4 transition-colors duration-500"
              >
                Unique brand identities generated for every developer.
                <br className="hidden md:block" />
                Export as a production-ready Next.js 16 web app.
              </motion.p>

              {/* Search Bar */}
              <div className="w-full max-w-xl px-4">
                <SearchBar
                  onSearch={handleSearch}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="portfolio"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="py-12 md:py-20 min-h-screen"
            >
              {/* Back button & actions */}
              <div className="max-w-6xl mx-auto px-4 md:px-6 mb-8 md:mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                <button
                  onClick={() => {
                    setUser(null);
                    setRepos([]);
                    setBrand(null);
                  }}
                  className="w-full sm:w-auto group py-2 px-6 rounded-xl border border-foreground/5 hover:border-foreground/20 transition-all flex items-center justify-center gap-2 text-foreground/40 hover:text-foreground"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">
                    ←
                  </span>
                  <span>Create Another</span>
                </button>

                {portfolioData && (
                  <div className="w-full sm:w-auto">
                    <DownloadButton portfolioData={portfolioData} />
                  </div>
                )}
              </div>

              {/* Portfolio Preview */}
              {user && brand ? (
                <PortfolioPreview
                  user={user}
                  repos={repos}
                  brand={brand}
                  isGeneratingAI={isGeneratingAI}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                  <p className="text-white/40 animate-pulse font-mono tracking-widest text-sm uppercase">
                    Designing your brand...
                  </p>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
