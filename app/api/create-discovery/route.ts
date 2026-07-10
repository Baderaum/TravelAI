import { openai } from "@/lib/openai";
import { NextResponse } from "next/server";
import { getDestinationImage } from "@/lib/pexels";
import { createClient } from "@/lib/supabase/server";

const DAILY_DISCOVERY_LIMIT = 5;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please Login" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const isFreePlan =
      profile?.plan !== "Monthly" &&
      profile?.plan !== "Lifetime";

    if (isFreePlan) {
      const { data: usageRows, error: usageError } =
        await supabase.rpc("consume_discovery_usage", {
          daily_limit: DAILY_DISCOVERY_LIMIT,
        });

      const usage = Array.isArray(usageRows)
        ? usageRows[0]
        : usageRows;

      if (usageError || !usage) {
        console.error(usageError);

        return NextResponse.json(
          { error: "Could not check discovery limit" },
          { status: 500 }
        );
      }

      if (!usage.allowed) {
        return NextResponse.json(
          {
            error:
              "Daily discovery limit reached. Upgrade to Pro for unlimited planning.",
            used: usage.used_count,
            limit: usage.limit_count,
          },
          { status: 403 }
        );
      }
    }

    const body = await req.json();

    const {
      groupSize,
      departure,
      temperature,
      targetCountry,
      distance,
      tripType,
      vibes,
      extraInfo,
      budgetAmount,
      startDate,
      endDate,
      homeLocation,
      travelPersonality,
      avoidTourist,
      hates,
      currency,
      ageGroup,
    } = body;

    const prompt = `
Group Size: ${groupSize}
Age (younger people are more active): ${ageGroup}
Home Location / Departure Area: ${homeLocation || departure}
Preferred Temperature: ${temperature}
Target Country: ${targetCountry || "No specific target country"}
Distance Preference: ${distance}
Trip Type: ${tripType}
Total Budget Per Person Including Estimated Round-Trip Flight: ${currency}${budgetAmount}
Trip Start Date: ${startDate || "Not provided"}
Trip End Date: ${endDate || "Not provided"}
Travel Personality: ${travelPersonality}
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
- If the user provided a Target Country, recommend ONLY destinations located in that country
- Choose the most likely nearby departure airport from the user's home location
- Choose the most useful destination airport for every destination
- Estimate realistic round-trip flight budget per person from the departure airport to the destination airport
- Use the provided trip dates for seasonal fit, activity timing assumptions, and budget realism
- Include that flight estimate inside estimated_budget, so estimated_budget feels like a complete trip budget
- Consider travel distance carefully
- Match the group's vibe and budget
- Avoid generic recommendations if possible
- Return ONLY valid JSON

VERY IMPORTANT: If the Budget is too low to fly (less then 300€), then you have to recommend only destinations inside the same country or a bordering country (but not too far inside)

The last destination has to be very special, not what a normal person would think about.

The maximum amount of destinations is 3, // IGNORE THIS PART: "but if it is 3 or 4 also okay. It depends on how good the options are."

The activities should be at least 3 in amount. Look for things to do only at that locations and also "going to beach" and basic stuff

Every activity needs a realistic estimated_cost per person in the selected currency. Use 0 for genuinely free activities.

The flight_time has to be the flight time from the departure airport to the destination airport and ONLY if there is a necessary ferry or bus ride to take, then say it inside flightime too (like "3,5h + 1,5h ferry")

The flight_budget must be a realistic estimated round-trip economy flight price per person in the selected currency.
Use IATA airport codes for departure_airport_code and destination_airport_code, for example CGN, DUS, FRA, MUC, BER, MXP, LIN, FCO, BCN.


JSON format:

{
  "destinations": [
    {
      "name": "Mallorca",
      "summary": "Perfect for beach vacations and nightlife.",
      "match_score": 92,
      "estimated_budget": 700,
      "flight_budget": 180,
      "departure_location": "Cologne, Germany",
      "departure_airport_code": "CGN",
      "destination_airport_code": "PMI",
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
          "estimated_cost": 45,
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
      destination.start_date = startDate || null;
      destination.end_date = endDate || null;

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
