import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are an AI travel recommendation engine.

Your task:
- Recommend destinations based on the user request
- Keep recommendations practical and realistic
- Return ONLY valid JSON

Return this exact JSON structure:

{
  "destinations": [
    {
      "name": "Mallorca",
      "summary": "Perfect for beach vacations and nightlife.",
      "match_score": 92,
      "estimated_budget": 700,
      "best_for": "Friend groups",
      "vibes": ["beach", "party", "cheap"]
    }
  ]
}
`,
        },
        {
          role: "user",
          content: body.prompt,
        },
      ],
    });

    const content = completion.choices[0].message.content;

    console.log("OPENAI RESPONSE:", content);

    let parsed;

    try {
      parsed = JSON.parse(content || "{}");
    } catch (jsonError) {
      console.error("JSON PARSE ERROR:", jsonError);

      parsed = {
        destinations: [],
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("FULL ERROR:", error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}