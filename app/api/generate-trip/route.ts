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
      ageGroup,
    } = body;

    const prompt = `
Group Size: ${groupSize}
Age (younger people are more active): ${ageGroup}
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

The maximum amount of destinations is 6, but if it is 3 or 4 also okay. It depends on how good the options are.

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
      "why_match": [
        "Short direct flights from Germany",
        "Fits your medium budget perfectly",
        "Strong nightlife without overwhelming crowds",
        "Great for spontaneous friend groups"
      ],
      "subtitle": "Mediterranean hidden gem • Europe",
      "coordinates": {
        "lat": 35.881,
        "lng": 14.532
      },
      "activities": [
        {
          "title": "Boat Tours",
          "description": "Explore hidden beaches and crystal-clear waters.",
          "image": ""
        }
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

      for (const activity of destination.activities || []) {
        activity.image = await getDestinationImage(
          `${activity.title} ${destination.name}`
        );
      }
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