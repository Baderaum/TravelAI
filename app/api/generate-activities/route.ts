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

    const prompt = `
Generate 5 unique travel activities for this destination.

Destination:
${trip.destination}

Summary:
${destination?.summary}

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

    // SAVE TO DB
    const formattedActivities =
      activities.map(
        (activity: any) => ({
          trip_id: tripId,

          title:
            activity.title,

          description:
            activity.description,

          image:
            activity.image,

          status: "ai_suggested",
        })
      );

    const {
      error,
    } = await supabase
      .from("activities")
      .insert(formattedActivities);

    if (error) {
      console.error(error);
    }

    return NextResponse.json({
      success: true,
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