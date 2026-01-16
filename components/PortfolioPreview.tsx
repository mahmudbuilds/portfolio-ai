"use client";

import { motion } from "framer-motion";
import { EnhancedRepo, GitHubUser, BrandIdentity } from "@/lib/types";
import BentoCard from "./BentoCard";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
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

  // No longer manually setting data-theme here as next-themes handles it.
  // We just let the global CSS variables and class-based theming do the work.

  const themeStyles = {
    "--primary": brand.primaryColor,
    "--accent": brand.accentColor,
    "--secondary": brand.secondaryColor || brand.accentColor,
    "--bg-tint": brand.backgroundColor,
    "--radius":
      brand.designTokens.borderRadius === "none"
        ? "0"
        : brand.designTokens.borderRadius === "sm"
        ? "0.25rem"
        : brand.designTokens.borderRadius === "md"
        ? "0.5rem"
        : brand.designTokens.borderRadius === "lg"
        ? "1rem"
        : "9999px",
    "--glass-opacity": brand.designTokens.glassOpacity,
    "--border-width": `${brand.designTokens.borderWidth}px`,
    "--font-main": brand.fontFamily
      ? `'${brand.fontFamily}', sans-serif`
      : "inherit",
  } as React.CSSProperties;

  // --- Layout Modules ---

  const HeroMain = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="relative mb-12 py-16 md:py-24 text-center overflow-hidden rounded-(--radius) bg-foreground/[0.03] border border-border px-8 shadow-[var(--card-shadow)]"
      style={{
        backdropFilter: `blur(${brand.designTokens.glassOpacity * 100}px)`,
      }}
    >
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: brand.primaryColor }}
      />
      <div className="relative z-10 flex flex-col items-center gap-8">
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
            className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full border-(--border-width) border-foreground/10 object-cover bg-foreground/5 shadow-2xl"
          />
        </div>
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter text-foreground mb-2">
            {user.name || user.login}
          </h1>
          {user.bio && (
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              {user.bio}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
            {user.location && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/50">
                <MapPin className="w-4 h-4" />
                {user.location}
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/50">
              <Users className="w-4 h-4" />
              {user.followers.toLocaleString()} Followers
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const HeroSplit = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 text-left"
      >
        <h1 className="text-5xl md:text-8xl font-black tracking-tight text-foreground leading-[0.9]">
          {user.name || user.login}
        </h1>
        <p className="text-xl text-foreground/50 max-w-lg">{user.bio}</p>
        <div className="flex gap-4">
          <div
            className="h-1 w-20 rounded-full"
            style={{ backgroundColor: brand.primaryColor }}
          />
          <div
            className="h-1 w-10 rounded-full opacity-30"
            style={{ backgroundColor: brand.accentColor }}
          />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-square max-w-md mx-auto lg:ml-auto"
      >
        <div
          className="absolute inset-0 rounded-(--radius) blur-3xl opacity-20"
          style={{ backgroundColor: brand.primaryColor }}
        />
        <img
          src={user.avatar_url}
          alt={user.name || user.login}
          className="relative z-10 w-full h-full object-cover rounded-(--radius) border border-border grayscale hover:grayscale-0 transition-all duration-700 shadow-[var(--card-shadow)]"
        />
      </motion.div>
    </div>
  );

  const ProjectsBento = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min md:auto-rows-[200px] mb-20">
      {repos.map((repo, index) => (
        <BentoCard
          key={repo.id}
          repo={repo}
          index={index}
          size={getBentoSize(index, repos.length)}
          brand={brand}
        />
      ))}
    </div>
  );

  const ProjectsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
      {repos.map((repo, index) => (
        <BentoCard
          key={repo.id}
          repo={repo}
          index={index}
          size="small"
          brand={brand}
        />
      ))}
    </div>
  );

  const StatsCard = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
      {[
        { label: "Repos", value: user.public_repos, icon: Sparkles },
        { label: "Followers", value: user.followers, icon: Users },
        {
          label: "Stars",
          value: repos.reduce((a, b) => a + b.stargazers_count, 0),
          icon: Sparkles,
        },
        {
          label: "Forks",
          value: repos.reduce((a, b) => a + b.forks_count, 0),
          icon: Sparkles,
        },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="p-6 rounded-(--radius) bg-foreground/[0.03] border border-border flex flex-col items-center justify-center text-center transition-colors shadow-[var(--card-shadow)]"
        >
          <stat.icon className="w-5 h-5 mb-2 text-foreground/30" />
          <span className="text-3xl font-bold text-foreground">
            {stat.value.toLocaleString()}
          </span>
          <span className="text-xs uppercase tracking-widest text-foreground/40 mt-1">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );

  const renderSection = (section: string) => {
    const style = brand.sectionStyles?.[section] || {
      spacing: "normal",
      alignment: "center",
      visualWeight: "card",
    };

    const containerClasses = cn(
      "w-full transition-all duration-700 relative",
      style.spacing === "compact"
        ? "py-4 mb-4"
        : style.spacing === "spacious"
        ? "py-24 mb-20"
        : "py-12 mb-12",
      style.alignment === "left"
        ? "text-left items-start"
        : style.alignment === "right"
        ? "text-right items-end"
        : "text-center items-center",
      style.customClasses
    );

    let content;
    switch (section) {
      case "hero-main":
        content = <HeroMain />;
        break;
      case "hero-split":
        content = <HeroSplit />;
        break;
      case "projects-bento":
        content = <ProjectsBento />;
        break;
      case "projects-grid":
        content = <ProjectsGrid />;
        break;
      case "stats-card":
        content = <StatsCard />;
        break;
      default:
        return null;
    }

    return (
      <section key={section} className={containerClasses}>
        {style.backgroundGlow && (
          <div
            className="absolute inset-0 -z-10 blur-[100px] opacity-10 pointer-events-none"
            style={{ backgroundColor: brand.primaryColor }}
          />
        )}
        <div
          className={cn(
            "mx-auto w-full",
            style.visualWeight === "ghost"
              ? "max-w-4xl"
              : style.visualWeight === "full-width"
              ? "max-w-none"
              : "max-w-6xl"
          )}
        >
          {content}
        </div>
      </section>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`w-full max-w-7xl mx-auto px-4 pb-20 vibe-${brand.vibe} typography-${brand.typography} portfolio-container`}
      style={themeStyles}
    >
      {/* AI Rationale - Proof of bespoke architecture */}
      {brand.designRationale && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex justify-center"
        >
          <div className="px-6 py-2 rounded-full bg-foreground/[0.03] border border-foreground/10 text-[11px] uppercase tracking-[0.2em] text-foreground/40 backdrop-blur-md shadow-2xl">
            <span className="text-(--primary) font-bold mr-3">
              Architecture:
            </span>
            {brand.designRationale}
          </div>
        </motion.div>
      )}
      {/* AI Status */}
      {isGeneratingAI && (
        <div className="flex justify-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-foreground/5 border border-foreground/10"
          >
            <Sparkles
              className="w-5 h-5 animate-spin-slow"
              style={{ color: brand.primaryColor }}
            />
            <span
              className="font-semibold tracking-wide uppercase text-xs"
              style={{ color: brand.primaryColor }}
            >
              AI Architecting Experience...
            </span>
          </motion.div>
        </div>
      )}

      {/* Dynamic Sections */}
      {brand.layoutSections?.map(renderSection) || <HeroMain />}

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
