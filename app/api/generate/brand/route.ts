import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a world-class digital brand strategist. Your task is to analyze a developer's GitHub profile and create a unique "Brand Identity" that defines the visual style of their portfolio.

Your goal is to make every developer feel unique. Analyze their:
1. Bio and location
2. Most used languages and topics
3. Complexity and types of projects

Generate a Brand Identity including:
- primaryColor: A vibrant accent color (e.g., #FF3366)
- accentColor: A secondary complementary color
- backgroundColor: A deep background tint (e.g., #050505 or #0a0a15)
- typography: One of [modern, classic, mono, brutal]
- fontFamily: A specific Google Font name that fits the vibe
- vibe: One of [neon, glass, minimal, organic, industrial]
- layoutPattern: One of [bento, split, magazine, feed]

Return as JSON: { "primaryColor": "...", "accentColor": "...", "backgroundColor": "...", "typography": "...", "fontFamily": "...", "vibe": "...", "layoutPattern": "..." }`;

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
