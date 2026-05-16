import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";
import { getDestinationImage } from "@/lib/pexels";

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

Return ONLY valid JSON.

{
  "destinations": [
    {
      "name": "Mallorca",
      "summary": "Perfect for beach vacations and nightlife.",
      "match_score": 92,
      "estimated_budget": 700,
      "best_for": "Friend groups",
      "vibes": ["beach", "party", "cheap"],
      "weather": "28°C",
      "flight_time": "2h 10m",
      "image": (link for a photo that shows the place),
      "activities": [
        "Boat Tours",
        "Beach Clubs",
        "Nightlife"
      ]
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

    let parsed;

    try {
      parsed = JSON.parse(content || "{}");
    } catch {
      parsed = {
        destinations: [],
      };
    }

    for (const destination of parsed.destinations) {
        destination.image = await getDestinationImage(
            `${destination.name} travel`
        );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}