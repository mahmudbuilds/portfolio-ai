// Types for PortfolioAI

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  visibility: string;
  default_branch: string;
}

export interface SectionStyle {
  spacing: "compact" | "normal" | "spacious";
  alignment: "left" | "center" | "right";
  visualWeight: "ghost" | "card" | "full-width";
  customClasses?: string;
  backgroundGlow?: boolean;
}

export interface DesignTokens {
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
  glassOpacity: number; // 0 to 1
  borderWidth: number; // 0 to 4
  shadowIntensity: "none" | "soft" | "bold" | "glow";
  animationStyle: "fade" | "slide" | "spring" | "glitch";
}

export interface BrandIdentity {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  secondaryColor?: string;
  designRationale?: string; // AI's explanation for the design choices
  typography:
    | "modern-sans"
    | "sophisticated-serif"
    | "sleek-mono"
    | "experimental-display"
    | "brutalist-bold";
  vibe:
    | "neon-cyber"
    | "glassmorphism"
    | "hyper-minimal"
    | "organic-fluid"
    | "industrial-brutalist"
    | "futuristic-luxury"
    | "retro-future";
  layoutPattern:
    | "bento-grid"
    | "staggered-masonry"
    | "minimalist-split"
    | "magazine-editorial"
    | "one-page-scroll";
  layoutSections: string[];
  sectionStyles?: Record<string, SectionStyle>; // Per-section overrides
  designTokens: DesignTokens;
  fontFamily: string;
  themePreference: "dark" | "light" | "system";
}

export interface AIGeneratedContent {
  headline: string;
  summary: string;
}

export interface EnhancedRepo extends GitHubRepo {
  aiContent?: AIGeneratedContent;
}

export interface PortfolioData {
  user: GitHubUser;
  repos: EnhancedRepo[];
  brand: BrandIdentity;
  generatedAt: string;
}

export interface RateLimitState {
  remaining: number;
  resetTime: number;
  isLimited: boolean;
}
