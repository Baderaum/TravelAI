import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const destination =
      body.destination;

    // CREATE TRIP
    const {
      data: trips,
      error: tripError,
    } = await supabase
      .from("trips")
      .insert({
        title:
          destination.name,

        destination:
          destination.name,

        cover_image:
          destination.image,

        created_by:
          user.id,
      })
      .select()
      .single();

    if (tripError) {
      console.error(tripError);

      return NextResponse.json(
        {
          error:
            "Failed to create trip",
        },
        {
          status: 500,
        }
      );
    }

    // ADD MEMBER
    await supabase
      .from("trip_members")
      .insert({
        trip_id: trips.id,
        user_id: user.id,

        role: "owner",
      });

    // SAVE DESTINATION
    await supabase
      .from("trip_destinations")
      .insert({
        trip_id: trips.id,

        name:
          destination.name,

        summary:
          destination.summary,

        match_score:
          destination.match_score,

        data: destination,
      });

    return NextResponse.json({
      tripId: trips.id,
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