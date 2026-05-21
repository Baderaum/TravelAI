import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request
) {
  try {

    const body =
      await request.json();

    const {
      tripId,
      activity,
    } = body;

    const supabase =
      await createClient();

    const {
      error,
    } = await supabase
      .from("activities")
      .insert({
        trip_id: tripId,

        title:
          activity.title,

        description:
          activity.description,

        image:
          activity.image,
      });

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