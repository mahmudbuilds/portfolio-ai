"use client";

import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink, Code2 } from "lucide-react";
import { EnhancedRepo } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <motion.div
      className={sizeClasses[size]}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <Card className="group relative h-full flex flex-col overflow-hidden bg-white/3 backdrop-blur-3xl border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--primary)]/10">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-20"
        />

        {/* Gradient glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background: `radial-gradient(circle at center, var(--primary), transparent 70%)`,
            }}
          />
        </div>

        <CardHeader className="relative z-10 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {repo.language && (
                <Badge
                  variant="outline"
                  className="bg-white/5 border-white/10 text-[10px] py-0 px-2 h-5"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mr-1.5"
                    style={{ backgroundColor: languageColor }}
                  />
                  {repo.language}
                </Badge>
              )}
            </div>
            <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-[var(--primary)] transition-colors duration-300" />
          </div>
          <CardTitle className="text-xl font-bold text-white group-hover:text-[var(--primary)] transition-colors duration-300 leading-tight">
            {repo.aiContent?.headline || repo.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 flex-1">
          <p className="text-white/60 text-sm leading-relaxed line-clamp-3 group-hover:text-white/80 transition-colors">
            {repo.aiContent?.summary ||
              repo.description ||
              "No description available"}
          </p>
        </CardContent>

        <CardFooter className="relative z-10 pt-4 border-t border-white/5 flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 text-white/40 text-[12px]">
            <Star className="w-3.5 h-3.5" />
            <span>{repo.stargazers_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/40 text-[12px]">
            <GitFork className="w-3.5 h-3.5" />
            <span>{repo.forks_count.toLocaleString()}</span>
          </div>
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {repo.topics.slice(0, 2).map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="bg-white/5 border-none text-[9px] h-4 opacity-50 group-hover:opacity-80 transition-opacity"
                >
                  {topic}
                </Badge>
              ))}
              {repo.topics.length > 2 && (
                <span className="text-[9px] text-white/30">
                  +{repo.topics.length - 2}
                </span>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
