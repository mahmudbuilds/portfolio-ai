import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `${SYSTEM_PROMPT}

Repository Details:
- Name: ${repoName}
- Description: ${description || "No description provided"}
- Primary Language: ${language || "Unknown"}
- Topics: ${topics?.join(", ") || "None"}

Generate the headline and summary now. Return ONLY valid JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const aiContent = JSON.parse(jsonMatch[0]);

    return NextResponse.json(aiContent);
  } catch (error: unknown) {
    console.error("Gemini API error:", error);

    // Handle rate limiting
    if (error instanceof Error && error.message?.includes("429")) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
