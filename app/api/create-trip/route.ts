import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type DestinationActivity = {
  title: string;
  description: string;
  image: string;
  estimated_cost?: number;
};

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

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (profile?.plan !== "Monthly" && profile?.plan !== "Lifetime") {
      return NextResponse.json(
        {
          error: "Creating trips requires Pro",
        },
        {
          status: 403,
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

        description:
          destination.subtitle,

        destination:
          destination.name,

        cover_image:
          destination.image,

        start_date:
          destination.start_date || null,

        end_date:
          destination.end_date || null,

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

    // SAVE ACTIVITIES
    if (destination.activities?.length) {

    const formattedActivities =
        destination.activities.map(
        (activity: DestinationActivity) => ({
            trip_id: trips.id,

            title:
            activity.title,

            description:
            activity.description,

            image:
            activity.image,

            estimated_cost:
            typeof activity.estimated_cost === "number"
              ? Math.max(0, activity.estimated_cost)
              : null,

            status: "suggested",
        })
        );

    const {
        error: activityError,
    } = await supabase
        .from("activities")
        .insert(formattedActivities);

    if (activityError) {
        console.error(activityError);
    }
    }

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
