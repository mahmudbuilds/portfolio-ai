"use client";

import { motion } from "framer-motion";
import { EnhancedRepo, GitHubUser } from "@/lib/types";
import BentoCard from "./BentoCard";
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
  isGeneratingAI = false,
}: PortfolioPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl mx-auto px-4"
    >
      {/* User Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-12 p-8 rounded-3xl bg-white/[0.03] backdrop-blur-3xl border border-white/10"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-lg opacity-50" />
            <img
              src={user.avatar_url}
              alt={user.name || user.login}
              className="relative w-24 h-24 rounded-full border-2 border-white/20"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white mb-1">
              {user.name || user.login}
            </h2>
            <p className="text-white/50 text-lg mb-4">@{user.login}</p>

            {user.bio && (
              <p className="text-white/70 mb-4 max-w-2xl">{user.bio}</p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/40">
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
                  className="flex items-center gap-1.5 hover:text-violet-400 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  Portfolio
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {user.followers.toLocaleString()} followers
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
          className="flex items-center justify-center gap-3 mb-8 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20"
        >
          <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
          <span className="text-violet-300">
            AI is crafting premium project descriptions...
          </span>
        </motion.div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
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
