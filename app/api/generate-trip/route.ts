import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";
import { getDestinationImage } from "@/lib/pexels";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      groupSize,
      departure,
      temperature,
      distance,
      tripType,
      vibes,
      extraInfo,
      budgetAmount,
    pace,
    accommodation,
    travelPersonality,
    avoidTourist,
    hates,
    currency,
    } = body;

    const prompt = `
Group Size: ${groupSize}
Departure Country: ${departure}
Preferred Temperature: ${temperature}
Distance Preference: ${distance}
Trip Type: ${tripType}
Budget Per Person: ${currency}${budgetAmount}
Travel Personality: ${travelPersonality}
Travel Pace: ${pace}
Accommodation Style: ${accommodation}
Avoid Tourist Traps: ${avoidTourist ? "Yes" : "No"}

Things To Avoid:
${hates.join(", ")}

Desired Vibes:
${vibes.join(", ")}

Additional Information:
${extraInfo || "None"}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",
          content: `
You are an elite AI travel recommendation engine.

Your task:
- Recommend destinations matching the user's preferences
- Consider travel distance carefully
- Match the group's vibe and budget
- Avoid generic recommendations if possible
- Return ONLY valid JSON

VERY IMPORTANT: If the Budget is too low to fly (less then 300€), then you have to recommend only destinations inside the same country or a bordering country (but not too far inside)

The last destination has to be very special, not what a normal person would think about.

JSON format:

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
          content: prompt,
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

    if (!parsed.destinations) {
      parsed.destinations = [];
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