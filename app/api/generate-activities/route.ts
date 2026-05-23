import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

import { openai } from "@/lib/openai";

import { getDestinationImage } from "@/lib/pexels";

export async function POST(
  request: Request
) {
  try {

    const body =
      await request.json();

    const {
      tripId,
    } = body;

    const supabase =
      await createClient();

    // LOAD TRIP
    const {
      data: trip,
    } = await supabase
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .single();

    if (!trip) {
      return NextResponse.json(
        {
          error:
            "Trip not found",
        },
        {
          status: 404,
        }
      );
    }

    // LOAD DESTINATION
    const {
      data: destination,
    } = await supabase
      .from("trip_destinations")
      .select("*")
      .eq("trip_id", tripId)
      .single();

    // LOAD CURRENT ACTIVITIES
    const {
      data: existingActivities,
    } = await supabase
      .from("activities")
      .select("title")
      .eq("trip_id", tripId);

    const existingTitles =
      existingActivities
        ?.map(
          (activity) =>
            activity.title
        )
        .join(", ");

    const prompt = `
Generate 5 unique travel activities for this destination.

Destination:
${trip.destination}

Summary:
${destination?.summary}

Existing activities:
${existingTitles}

Do NOT generate duplicate or very similar activities.
Avoid repeating existing titles or concepts.

Return JSON only.

{
  "activities": [
    {
      "title": "",
      "description": ""
    }
  ]
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

    const content =
      completion.choices[0]
        .message.content;

    const parsed =
      JSON.parse(content || "{}");

    const activities =
      parsed.activities || [];

    // FETCH IMAGES
    for (const activity of activities) {

      activity.image =
        await getDestinationImage(
          `${activity.title} ${trip.destination}`
        );
    }

    return NextResponse.json({
      activities,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}