import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request
) {

  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const {
    activityId,
    vote,
  } = await request.json();

  // CHECK EXISTING VOTE
  const {
    data: existingVote,
  } = await supabase
    .from("activity_votes")
    .select("*")
    .eq("activity_id", activityId)
    .eq("user_id", user.id)
    .single();

  // SAME VOTE = REMOVE
  if (
    existingVote &&
    existingVote.vote === vote
  ) {

    const { error } =
      await supabase
        .from("activity_votes")
        .delete()
        .eq("id", existingVote.id);

    if (error) {

      console.error(error);

      return NextResponse.json(
        {
          error:
            "Failed to remove vote",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      removed: true,
    });
  }

  // NEW / UPDATED VOTE
  const { error } =
    await supabase
      .from("activity_votes")
      .upsert(
        {
          activity_id:
            activityId,

          user_id:
            user.id,

          vote,
        },
        {
          onConflict:
            "activity_id,user_id",
        }
      );

  if (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to vote",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    success: true,
  });
}