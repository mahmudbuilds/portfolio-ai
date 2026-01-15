"use client";

import { motion } from "framer-motion";
import { EnhancedRepo, GitHubUser, BrandIdentity } from "@/lib/types";
import BentoCard from "./BentoCard";
import { useEffect } from "react";
import {
  MapPin,
  Link as LinkIcon,
  Users,
  Building2,
  Sparkles,
} from "lucide-react";

interface PortfolioPreviewProps {
  user: GitHubUser;
  repos: EnhancedRepo[];
  brand: BrandIdentity;
  isGeneratingAI?: boolean;
}

// Variable bento sizing for visual interest
function getBentoSize(
  index: number,
  total: number
): "small" | "medium" | "large" {
  if (index === 0 && total > 3) return "large";
  if (index === 1 || index === 4) return "medium";
  return "small";
}

export default function PortfolioPreview({
  user,
  repos,
  brand,
  isGeneratingAI = false,
}: PortfolioPreviewProps) {
  // Inject Google Font
  useEffect(() => {
    if (brand.fontFamily) {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${brand.fontFamily.replace(
        / /g,
        "+"
      )}:wght@400;700&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [brand.fontFamily]);

  const themeStyles = {
    "--primary": brand.primaryColor,
    "--accent": brand.accentColor,
    "--bg-tint": brand.backgroundColor,
    "--font-main": brand.fontFamily
      ? `'${brand.fontFamily}', sans-serif`
      : "inherit",
  } as React.CSSProperties;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`w-full max-w-6xl mx-auto px-4 vibe-${brand.vibe} layout-${brand.layoutPattern} portfolio-container`}
      style={themeStyles}
    >
      {/* User Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-8 md:mb-12 p-6 md:p-8 rounded-3xl bg-white/3 backdrop-blur-3xl border border-white/10"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div
              className="absolute -inset-1 rounded-full blur-lg opacity-50"
              style={{
                background: `linear-gradient(to right, ${brand.primaryColor}, ${brand.accentColor})`,
              }}
            />
            <img
              src={user.avatar_url}
              alt={user.name || user.login}
              referrerPolicy="no-referrer"
              className="relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/20 object-cover bg-white/5"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name || user.login
                )}&background=random&color=fff`;
              }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              {user.name || user.login}
            </h2>
            <p className="text-white/50 text-base md:text-lg mb-4">
              @{user.login}
            </p>

            {user.bio && (
              <p className="text-white/70 mb-6 md:mb-4 max-w-2xl text-sm md:text-base leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-sm text-white/40">
              {user.company && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {user.company}
                </span>
              )}
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </span>
              )}
              {user.blog && (
                <a
                  href={
                    user.blog.startsWith("http")
                      ? user.blog
                      : `https://${user.blog}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                  style={{ color: brand.primaryColor }}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="truncate max-w-37.5 sm:max-w-none">
                    Portfolio
                  </span>
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {user.followers.toLocaleString()}
                <span className="hidden sm:inline">followers</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Generation Status */}
      {isGeneratingAI && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 mb-8 p-4 rounded-xl bg-white/3 border border-white/10 text-center"
        >
          <Sparkles
            className="w-5 h-5 animate-pulse shrink-0"
            style={{ color: brand.primaryColor }}
          />
          <span
            className="text-sm sm:text-base"
            style={{ color: brand.primaryColor }}
          >
            AI is crafting premium project descriptions...
          </span>
        </motion.div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min md:auto-rows-[200px]">
        {repos.map((repo, index) => (
          <BentoCard
            key={repo.id}
            repo={repo}
            index={index}
            size={getBentoSize(index, repos.length)}
          />
        ))}
      </div>

      {/* Empty state */}
      {repos.length === 0 && (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg">No public repositories found</p>
        </div>
      )}
    </motion.div>
  );
}
