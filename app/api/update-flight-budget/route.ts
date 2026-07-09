import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type DestinationData = {
  flight_budget?: number | null;
  estimated_budget?: number | null;
  [key: string]: unknown;
};

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    tripId,
    flightBudget,
  }: {
    tripId?: string;
    flightBudget?: number;
  } = await request.json();

  if (!tripId || typeof flightBudget !== "number") {
    return NextResponse.json(
      {
        error: "Missing tripId or flightBudget",
      },
      {
        status: 400,
      }
    );
  }

  const {
    data: destination,
    error: fetchError,
  } = await supabase
    .from("trip_destinations")
    .select("data")
    .eq("trip_id", tripId)
    .single();

  if (fetchError) {
    console.error(fetchError);

    return NextResponse.json(
      {
        error: "Failed to load destination",
      },
      {
        status: 500,
      }
    );
  }

  const currentData =
    (destination?.data || {}) as DestinationData;

  const currentFlightBudget =
    typeof currentData.flight_budget === "number"
      ? currentData.flight_budget
      : 0;

  const currentEstimatedBudget =
    typeof currentData.estimated_budget === "number"
      ? currentData.estimated_budget
      : null;

  const nextEstimatedBudget =
    currentEstimatedBudget === null
      ? null
      : Math.max(
          0,
          Math.round(
            currentEstimatedBudget -
              currentFlightBudget +
              flightBudget
          )
        );

  const { error } = await supabase
    .from("trip_destinations")
    .update({
      data: {
        ...currentData,
        flight_budget: flightBudget,
        ...(nextEstimatedBudget !== null
          ? {
              estimated_budget: nextEstimatedBudget,
            }
          : {}),
      },
    })
    .eq("trip_id", tripId);

  if (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to update flight budget",
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
