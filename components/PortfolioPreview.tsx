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
      )}:wght@300;400;500;600;700;800&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [brand.fontFamily]);

  // Handle Theme Preference
  useEffect(() => {
    const root = document.documentElement;
    if (brand.themePreference === "light") {
      root.setAttribute("data-theme", "light");
    } else if (brand.themePreference === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      // System preference
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.setAttribute("data-theme", isDark ? "dark" : "light");
    }
  }, [brand.themePreference]);

  const themeStyles = {
    "--primary": brand.primaryColor,
    "--accent": brand.accentColor,
    "--bg-tint": brand.backgroundColor,
    "--font-main": brand.fontFamily
      ? `'${brand.fontFamily}', sans-serif`
      : "inherit",
  } as React.CSSProperties;

  // Dynamic layout class based on AI pattern
  const layoutClass =
    brand.layoutPattern === "staggered-masonry"
      ? "columns-1 sm:columns-2 lg:columns-3 gap-4"
      : brand.layoutPattern === "minimalist-split"
      ? "grid grid-cols-1 lg:grid-cols-2 gap-8"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min md:auto-rows-[200px]";

  const isBento = brand.layoutPattern === "bento-grid";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`w-full max-w-7xl mx-auto px-4 pb-20 vibe-${brand.vibe} typography-${brand.typography} portfolio-container`}
      style={themeStyles}
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="relative mb-12 py-16 md:py-24 text-center md:text-left overflow-hidden rounded-[2.5rem] bg-white/2 border border-white/10 px-8"
      >
        {/* Abstract Background Element */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] opacity-20 transition-colors duration-1000"
          style={{ backgroundColor: brand.primaryColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          {/* Avatar with dynamic glow */}
          <div className="relative group">
            <div
              className="absolute -inset-2 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-700 animate-pulse"
              style={{
                background: `linear-gradient(to right, ${brand.primaryColor}, ${brand.accentColor})`,
              }}
            />
            <img
              src={user.avatar_url}
              alt={user.name || user.login}
              referrerPolicy="no-referrer"
              className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/10 object-cover bg-white/5 shadow-2xl"
            />
          </div>

          <div className="flex-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white mb-2">
                {user.name || user.login}
              </h1>
              <p
                className="text-xl md:text-2xl font-medium tracking-tight"
                style={{ color: brand.primaryColor }}
              >
                @{user.login}
              </p>
            </motion.div>

            {user.bio && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/60 text-lg md:text-xl max-w-3xl leading-relaxed"
              >
                {user.bio}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium"
            >
              {user.location && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </div>
              )}
              {user.company && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                  <Building2 className="w-4 h-4" />
                  {user.company}
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                <Users className="w-4 h-4" />
                {user.followers.toLocaleString()} Collectors
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* AI Status */}
      {isGeneratingAI && (
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-(--primary)/10 border border-(--primary)/20"
          >
            <Sparkles className="w-5 h-5 animate-spin-slow text-(--primary)" />
            <span className="text-(--primary) font-semibold tracking-wide uppercase text-xs">
              AI Architecting Experience...
            </span>
          </motion.div>
        </div>
      )}

      {/* Content Grid/Layout */}
      <div className={layoutClass}>
        {repos.map((repo, index) => (
          <div
            key={repo.id}
            className={
              brand.layoutPattern === "staggered-masonry"
                ? "mb-4 break-inside-avoid"
                : ""
            }
          >
            <BentoCard
              repo={repo}
              index={index}
              size={isBento ? getBentoSize(index, repos.length) : "small"}
            />
          </div>
        ))}
      </div>

      {/* Footer / Contact */}
      {user.blog && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 text-center"
        >
          <a
            href={
              user.blog.startsWith("http") ? user.blog : `https://${user.blog}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-3xl bg-white text-black font-bold text-xl transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: brand.primaryColor, color: "#000" }}
          >
            Connect & Collaborate
            <LinkIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}
