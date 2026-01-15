"use client";

import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink, Code2 } from "lucide-react";
import { EnhancedRepo } from "@/lib/types";

interface BentoCardProps {
  repo: EnhancedRepo;
  index: number;
  size?: "small" | "medium" | "large";
}

const sizeClasses = {
  small: "col-span-1 row-span-1",
  medium: "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
  large: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
};

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  default: "#6366f1",
};

export default function BentoCard({
  repo,
  index,
  size = "small",
}: BentoCardProps) {
  const languageColor = repo.language
    ? languageColors[repo.language] || languageColors.default
    : languageColors.default;

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        ${sizeClasses[size]}
        group relative block p-6 rounded-3xl overflow-hidden
        bg-white/3 backdrop-blur-3xl
        border border-white/10 hover:border-white/20
        transition-colors duration-500
      `}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
    >
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(to bottom right, var(--primary), transparent, var(--accent))`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            {repo.language && (
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: languageColor }}
              />
            )}
            <span className="text-white/50 text-sm font-mono">
              {repo.language || "Unknown"}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-(--primary) transition-colors">
          {repo.aiContent?.headline || repo.name}
        </h3>

        {/* Description */}
        <p className="text-white/50 text-sm leading-relaxed flex-1">
          {repo.aiContent?.summary ||
            repo.description ||
            "No description available"}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-white/40 text-sm">
            <Star className="w-4 h-4" />
            <span>{repo.stargazers_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/40 text-sm">
            <GitFork className="w-4 h-4" />
            <span>{repo.forks_count.toLocaleString()}</span>
          </div>
          {repo.topics?.length > 0 && (
            <div className="flex items-center gap-1.5 text-white/40 text-sm ml-auto">
              <Code2 className="w-4 h-4" />
              <span>{repo.topics.length}</span>
            </div>
          )}
        </div>
      </div>
    </motion.a>
  );
}
