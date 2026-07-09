import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const { tripId } = await request.json();

  if (!tripId) {
    return NextResponse.json(
      { error: "Missing trip id" },
      { status: 400 }
    );
  }

  const { data: membership } = await supabase
    .from("trip_members")
    .select("role")
    .eq("trip_id", tripId)
    .eq("user_id", user.id)
    .single();

  if (!membership) {
    return NextResponse.json(
      { error: "Not allowed" },
      { status: 403 }
    );
  }

  if (membership.role !== "owner") {
    const { error } = await supabase
      .from("trip_members")
      .delete()
      .eq("trip_id", tripId)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: "Failed to leave trip" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action: "left_trip",
    });
  }

  const { data: activities } = await supabase
    .from("activities")
    .select("id")
    .eq("trip_id", tripId);

  const activityIds =
    activities?.map((activity) => activity.id) || [];

  if (activityIds.length > 0) {
    const { error: votesError } = await supabase
      .from("activity_votes")
      .delete()
      .in("activity_id", activityIds);

    if (votesError) {
      console.error(votesError);
    }
  }

  const optionalDeleteSteps = [
    supabase.from("daily_plans").delete().eq("trip_id", tripId),
    supabase.from("expenses").delete().eq("trip_id", tripId),
  ];

  for (const step of optionalDeleteSteps) {
    const { error } = await step;

    if (error) {
      console.error(error);
    }
  }

  const deleteSteps = [
    supabase.from("activities").delete().eq("trip_id", tripId),
    supabase.from("trip_destinations").delete().eq("trip_id", tripId),
    supabase.from("trip_members").delete().eq("trip_id", tripId),
    supabase.from("trips").delete().eq("id", tripId),
  ];

  for (const step of deleteSteps) {
    const { error } = await step;

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: "Failed to delete trip" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
