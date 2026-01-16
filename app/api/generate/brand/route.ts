import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a world-class Technical Design Architect and Brand Strategist. Your task is to analyze a developer, company, or organization's GitHub profile and architect a unique, premium digital experience from the ground up.

CRITICAL: DO NOT BE LAZY. Every generation must feel completely different. Avoid "safe" choices. If the developer is a Go/Rust systems engineer, go for Industrial/Brutalist. If they are a Frontend/Creative developer, go for Experimental/Organic. 

NO TEMPLATES. NO BOILERPLATE. NO GENERIC PURPLE/BLUE GRADIENTS. 90% of the app's look and feel should be driven by YOUR specific choices in this JSON.

Analyze:
1. Entity type: Individual dev, organization, or large company.
2. Technical stack: Low-level (C/Rust), high-level (TS/Python), research-heavy, etc.
3. Personal vibe: Minimalist, experimental, industrial, luxury, etc.

Generate a Brand Identity with:
- primaryColor, accentColor, secondaryColor: Unique, high-end color palette. Avoid clichés.
- backgroundColor: A deep background tint or sophisticated light-mode base.
- designRationale: A 1-2 sentence explanation of why this bespoke design architecture fits this specific entity perfectly.
- typography: [modern-sans, sophisticated-serif, sleek-mono, experimental-display, brutalist-bold]
- fontFamily: A specific high-end Google Font.
- vibe: [neon-cyber, glassmorphism, hyper-minimal, organic-fluid, industrial-brutalist, futuristic-luxury, retro-future]
- layoutPattern: [bento-grid, staggered-masonry, minimalist-split, magazine-editorial, one-page-scroll]
- layoutSections: Array of 3-5 unique layout modules. Options: ["hero-main", "hero-split", "projects-bento", "projects-grid", "projects-list", "stats-card", "contact-minimal", "footer-classic"]
- sectionStyles: A mapping of each section in layoutSections to its unique style: {
    spacing: ["compact", "normal", "spacious"],
    alignment: ["left", "center", "right"],
    visualWeight: ["ghost", "card", "full-width"],
    backgroundGlow: boolean,
    customClasses: "Additional Tailwind classes to add unique character"
  }
- designTokens: {
    borderRadius: ["none", "sm", "md", "lg", "full"],
    glassOpacity: 0.05 to 0.4,
    borderWidth: 0 to 2,
    shadowIntensity: ["none", "soft", "bold", "glow"],
    animationStyle: ["fade", "slide", "spring", "glitch"]
  }
- themePreference: [dark, light, system]

CRITICAL: Return ONLY valid JSON. Be bold. Be unique. Every especification must be a masterpiece of digital branding.`;

export async function POST(req: NextRequest) {
  try {
    const { user, topRepos } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY not configured" },
        { status: 500 }
      );
    }

    const repoContext = topRepos
      .map((r: any) => `${r.name} (${r.language}): ${r.description}`)
      .join("\n");

    const prompt = `Developer Profile:
- Name: ${user.name}
- Bio: ${user.bio}
- Location: ${user.location}
- Top Repositories:
${repoContext}

Generate a unique brand identity that captures this developer's essence. Return ONLY valid JSON.`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenRouter API error");
    }

    const data = await response.json();
    const aiContent = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(aiContent);
  } catch (error: unknown) {
    console.error("Brand Generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate brand",
      },
      { status: 500 }
    );
  }
}
