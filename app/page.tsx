"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Github, Zap, Package, ArrowDown } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import PortfolioPreview from "@/components/PortfolioPreview";
import DownloadButton from "@/components/DownloadButton";
import NoiseOverlay from "@/components/NoiseOverlay";
import { fetchFullProfile } from "@/lib/github";
import {
  GitHubUser,
  EnhancedRepo,
  PortfolioData,
  AIGeneratedContent,
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
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (username: string) => {
    setIsLoading(true);
    setError(null);
    setUser(null);
    setRepos([]);

    try {
      const { user: fetchedUser, repos: fetchedRepos } = await fetchFullProfile(
        username
      );
      setUser(fetchedUser);
      setRepos(fetchedRepos);

      // Generate AI content for top repos (limit to 6 for demo)
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

        // Combine AI-enhanced repos with remaining repos
        setRepos([...enhancedRepos, ...fetchedRepos.slice(6)]);
        setIsGeneratingAI(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
    } finally {
      setIsLoading(false);
    }
  };

  const portfolioData: PortfolioData | null = user
    ? {
        user,
        repos,
        generatedAt: new Date().toISOString(),
      }
    : null;

  return (
    <>
      <Background3D />
      <NoiseOverlay />

      <div className="relative min-h-screen">
        {/* Hero Section */}
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.section
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8"
              >
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-300">
                  Powered by Gemini 2.5 Flash
                </span>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-6 leading-tight"
              >
                <span className="gradient-text">Transform</span>
                <br />
                <span className="text-white">Your GitHub</span>
                <br />
                <span className="text-white/60">Into a Portfolio</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-white/50 text-center max-w-2xl mb-12"
              >
                AI-enhanced project descriptions. Premium design.
                <br className="hidden md:block" />
                Export as a complete Next.js 16 app. Zero configuration.
              </motion.p>

              {/* Search Bar */}
              <SearchBar
                onSearch={handleSearch}
                isLoading={isLoading}
                error={error}
              />

              {/* Features */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center gap-6 mt-16 text-white/40 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <span>GitHub API</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Gemini AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-violet-400" />
                  <span>Instant Export</span>
                </div>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-white/20"
                >
                  <ArrowDown className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </motion.section>
          ) : (
            <motion.section
              key="portfolio"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20"
            >
              {/* Back button & actions */}
              <div className="max-w-6xl mx-auto px-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => {
                    setUser(null);
                    setRepos([]);
                  }}
                  className="text-white/40 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>←</span>
                  <span>New Search</span>
                </button>

                {portfolioData && (
                  <DownloadButton portfolioData={portfolioData} />
                )}
              </div>

              {/* Portfolio Preview */}
              <PortfolioPreview
                user={user}
                repos={repos}
                isGeneratingAI={isGeneratingAI}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
