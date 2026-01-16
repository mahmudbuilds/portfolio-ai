import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a world-class digital brand strategist. Your task is to analyze a developer's GitHub profile and create a unique "Brand Identity" that defines the visual style of their portfolio.

Your goal is to make every developer feel unique. Analyze their:
1. Bio and location
2. Most used languages and topics
3. Complexity and types of projects

Generate a Brand Identity including:
- primaryColor: A vibrant, unique accent color (Avoid generic blue/purple unless specifically requested by dev context). Use deep, rich, or unusual hues.
- accentColor: A secondary complementary color that adds depth.
- backgroundColor: A deep background tint (e.g., #050505 or #0a0a15) or a very clean off-white (#fbfbfb) for light mode.
- typography: One of [modern-sans, sophisticated-serif, sleek-mono, experimental-display]
- fontFamily: A specific high-end Google Font (e.g., 'Inter', 'Outfit', 'Playfair Display', 'Syne', 'Clash Display', 'Space Grotesk', 'Bormioli', 'Cabinet Grotesk')
- vibe: One of [neon-cyber, glassmorphism, hyper-minimal, organic-fluid, industrial-brutalist, futuristic-luxury]
- layoutPattern: One of [bento-grid, staggered-masonry, minimalist-split, magazine-editorial]
- themePreference: One of [dark, light, system]

CRITICAL: The colors must be unique and premium. Avoid basic gradients. The design should feel like a custom-coded high-end agency site.

Return as JSON: { "primaryColor": "...", "accentColor": "...", "backgroundColor": "...", "typography": "...", "fontFamily": "...", "vibe": "...", "layoutPattern": "...", "themePreference": "..." }`;

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
