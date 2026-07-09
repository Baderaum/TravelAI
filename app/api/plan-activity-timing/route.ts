import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/openai";

type PlannedActivity = {
  activityId: string;
  startTime: string;
  endTime: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      tripId,
    }: {
      tripId?: string;
    } = await request.json();

    if (!tripId) {
      return NextResponse.json(
        {
          error: "Missing tripId",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data: trip,
    } = await supabase
      .from("trips")
      .select("id, destination, start_date, end_date")
      .eq("id", tripId)
      .single();

    if (!trip?.start_date || !trip?.end_date) {
      return NextResponse.json(
        {
          error: "Trip dates are required before planning activity timing.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data: activities,
    } = await supabase
      .from("activities")
      .select("id, title, description, location, start_time, end_time")
      .eq("trip_id", tripId)
      .order("created_at", {
        ascending: true,
      });

    if (!activities?.length) {
      return NextResponse.json({
        activities: [],
      });
    }

    const prompt = `
You are a precise trip itinerary planner.

Plan a logical schedule for these activities.

Rules:
- Use the trip date range.
- Put activities that are close in theme or location on the same day when reasonable.
- Avoid putting heavy or long activities directly back-to-back.
- Beach/nightlife can happen later in the day.
- Museums, viewpoints, food tours and excursions should happen at realistic times.
- Keep enough breathing room between activities.
- Return ISO-like local datetime strings without timezone, e.g. 2026-06-26T10:00.
- Return ONLY valid JSON.

Trip destination:
${trip.destination}

Trip dates:
${trip.start_date} to ${trip.end_date}

Activities:
${activities
  .map(
    (activity) => `
- id: ${activity.id}
  title: ${activity.title}
  description: ${activity.description || "None"}
  location: ${activity.location || "Unknown"}
`
  )
  .join("\n")}

JSON format:
{
  "activities": [
    {
      "activityId": "",
      "startTime": "YYYY-MM-DDTHH:mm",
      "endTime": "YYYY-MM-DDTHH:mm"
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

    const parsed = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    const plannedActivities =
      (parsed.activities || []) as PlannedActivity[];

    const validActivities =
      plannedActivities.filter(
        (activity) =>
          activity.activityId &&
          activity.startTime &&
          activity.endTime
      );

    for (const activity of validActivities) {
      const { error } = await supabase
        .from("activities")
        .update({
          start_time: activity.startTime,
          end_time: activity.endTime,
        })
        .eq("id", activity.activityId)
        .eq("trip_id", tripId);

      if (error) {
        console.error(error);
      }
    }

    return NextResponse.json({
      activities: validActivities,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to plan activity timing",
      },
      {
        status: 500,
      }
    );
  }
}
