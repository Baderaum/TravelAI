import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const allowedStatuses = [
  "planning",
  "planned",
  "active",
  "completed",
  "archived",
];

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please Login" },
      { status: 401 }
    );
  }

  const { tripId, status } = await request.json();

  if (!tripId || !allowedStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Invalid trip status" },
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

  const { error } = await supabase
    .from("trips")
    .update({ status })
    .eq("id", tripId);

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update trip status" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
