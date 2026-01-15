import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a luxury brand creative director working for a high-end tech portfolio agency. Your task is to transform raw GitHub repository data into premium, visionary marketing copy.

Your writing style:
- Sophisticated and technical, yet accessible
- Impressive without being arrogant
- Concise but impactful
- Uses powerful action verbs
- Avoids clichés and generic phrases

For each repository, create:
1. A HEADLINE (max 8 words): A bold, memorable tagline that captures the essence of the project
2. A SUMMARY (exactly 2 sentences): An executive summary that makes the project sound like it could change the world

Return as JSON: { "headline": "...", "summary": "..." }`;

export async function POST(req: NextRequest) {
  try {
    const { repoName, description, language, topics } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY not configured" },
        { status: 500 }
      );
    }

    const prompt = `Repository Details:
- Name: ${repoName}
- Description: ${description || "No description provided"}
- Primary Language: ${language || "Unknown"}
- Topics: ${topics?.join(", ") || "None"}

Generate the headline and summary now. Return ONLY valid JSON, no markdown.`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://portfolio-ai.vercel.app", // Optional
          "X-Title": "PortfolioAI", // Optional
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
    const responseText = data.choices[0].message.content;

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const aiContent = JSON.parse(jsonMatch[0]);

    return NextResponse.json(aiContent);
  } catch (error: unknown) {
    console.error("AI Generation error:", error);

    // Handle rate limiting
    if (
      error instanceof Error &&
      (error.message?.includes("429") || error.message?.includes("Rate limit"))
    ) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate content",
      },
      { status: 500 }
    );
  }
}
