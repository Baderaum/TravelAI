import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const body = await request.json();

  const {
    tripId,
    title,
    description,
    startDate,
    endDate,
  } = body;

  const updates: {
    title?: string;
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
  } = {};

  if ("title" in body) {
    updates.title = title;
  }

  if ("description" in body) {
    updates.description = description;
  }

  if ("startDate" in body) {
    updates.start_date = startDate || null;
  }

  if ("endDate" in body) {
    updates.end_date = endDate || null;
  }

  const { error } = await supabase
    .from("trips")
    .update(updates)
    .eq("id", tripId);

  if (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update trip" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
