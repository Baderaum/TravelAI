import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    activityId,
    title,
    description,
    startTime,
    endTime,
  } = await request.json();

  const { error } = await supabase
    .from("activities")
    .update({
      title,
      description,
      start_time: startTime || null,
      end_time: endTime || null,
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
    success: true,
  });
}