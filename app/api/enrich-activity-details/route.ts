import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/openai";

type ActivityDetails = {
  description: string;
  location: string;
  bestTime: string;
  duration: string;
  practicalTips: string[];
  lat?: number | null;
  lng?: number | null;
  estimatedCost?: number | null;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      activityId,
    }: {
      activityId?: string;
    } = await request.json();

    if (!activityId) {
      return NextResponse.json(
        {
          error: "Missing activityId",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data: activity,
    } = await supabase
      .from("activities")
      .select("id, trip_id, title, description, location, lat, lng, estimated_cost")
      .eq("id", activityId)
      .single();

    if (!activity) {
      return NextResponse.json(
        {
          error: "Activity not found",
        },
        {
          status: 404,
        }
      );
    }

    const {
      data: trip,
    } = await supabase
      .from("trips")
      .select("destination")
      .eq("id", activity.trip_id)
      .single();

    const prompt = `
Create richer practical details for this travel activity.

Destination:
${trip?.destination || "Unknown destination"}

Activity:
${activity.title}

Current description:
${activity.description || "None"}

Return helpful, concrete information:
- What the activity is
- Where to go
- Best time of day
- Approximate duration
- Practical tips
- Coordinates if you can infer a specific likely location
- Realistic estimated cost per person in EUR, including admission or tour fees

Return ONLY valid JSON.

{
  "description": "",
  "location": "",
  "bestTime": "",
  "duration": "",
  "practicalTips": ["", ""],
  "lat": null,
  "lng": null,
  "estimatedCost": 25
}
`;

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        response_format: {
          type: "json_object",
        },
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const details = JSON.parse(
      completion.choices[0].message.content || "{}"
    ) as ActivityDetails;

    const nextDescription = [
      details.description,
      details.bestTime
        ? `Best time: ${details.bestTime}`
        : null,
      details.duration
        ? `Duration: ${details.duration}`
        : null,
      details.practicalTips?.length
        ? `Tips: ${details.practicalTips.join(" ")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const { error } = await supabase
      .from("activities")
      .update({
        description:
          nextDescription || activity.description,
        location:
          details.location || activity.location,
        lat:
          typeof details.lat === "number"
            ? details.lat
            : activity.lat,
        lng:
          typeof details.lng === "number"
            ? details.lng
            : activity.lng,
        estimated_cost:
          typeof details.estimatedCost === "number"
            ? Math.max(0, details.estimatedCost)
            : activity.estimated_cost,
      })
      .eq("id", activityId);

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error: "Failed to update activity",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      activity: {
        id: activityId,
        description:
          nextDescription || activity.description,
        location:
          details.location || activity.location,
        lat:
          typeof details.lat === "number"
            ? details.lat
            : activity.lat,
        lng:
          typeof details.lng === "number"
            ? details.lng
            : activity.lng,
        estimated_cost:
          typeof details.estimatedCost === "number"
            ? Math.max(0, details.estimatedCost)
            : activity.estimated_cost,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to enrich activity",
      },
      {
        status: 500,
      }
    );
  }
}
