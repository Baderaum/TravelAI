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

  const { error } = await supabase
    .from("trips")
    .update({
      title,
      description,
      start_date: startDate || null,
      end_date: endDate || null,
    })
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