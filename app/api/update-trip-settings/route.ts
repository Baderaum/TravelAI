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
    hotelBudgetAmount,
    hotelBudgetMode,
  } = body;

  const updates: {
    title?: string;
    description?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    hotel_budget_amount?: number | null;
    hotel_budget_mode?: "total" | "per_night";
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

  if ("hotelBudgetAmount" in body) {
    updates.hotel_budget_amount =
      typeof hotelBudgetAmount === "number" && hotelBudgetAmount >= 0
        ? hotelBudgetAmount
        : null;
  }

  if ("hotelBudgetMode" in body) {
    updates.hotel_budget_mode =
      hotelBudgetMode === "per_night" ? "per_night" : "total";
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
