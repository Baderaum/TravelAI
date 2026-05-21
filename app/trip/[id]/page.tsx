import { createClient } from "@/lib/supabase/server";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import TripActivities from "@/components/trip/trip-activities";

export default async function TripPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {

  const { id } =
    await params;

  const supabase =
    await createClient();

  // LOAD TRIP
  const { data: trip } =
    await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();

  // LOAD ACTIVITIES
  const {
    data: activities,
  } = await supabase
    .from("activities")
    .select("*")
    .eq("trip_id", id)
    .order("created_at", {
      ascending: true,
    });

  if (!trip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Trip not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* BACK BUTTON */}
      <div className="absolute left-8 top-8 z-50">

        <Link
          href="/trips"
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/50 px-5 py-3 text-white backdrop-blur transition hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Link>

      </div>

      {/* HERO */}
      <div className="relative h-[420px] w-full">

        <img
          src={trip.cover_image}
          alt={trip.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 p-10">

          <h1 className="text-6xl font-bold">
            {trip.title}
          </h1>

          <p className="mt-4 text-xl text-neutral-300">
            {trip.destination}
          </p>

        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl p-10">

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">

          {/* LEFT */}
          <div className="space-y-8">

            {/* OVERVIEW */}
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">

              <h2 className="text-3xl font-semibold">
                Overview
              </h2>

              <p className="mt-5 text-lg leading-8 text-neutral-300">
                Your collaborative trip workspace is now ready.
                Start planning activities, expenses,
                flights and your daily itinerary together.
              </p>

            </div>

            {/* ACTIVITIES */}
            <TripActivities
              activities={activities || []}
              tripId={id}
            />

            {/* COMING SOON */}
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">

              <h2 className="text-3xl font-semibold">
                Coming Soon
              </h2>

              <div className="mt-6 space-y-4">

                <div className="rounded-2xl bg-black/40 p-5">
                  ✈️ Flight Planning
                </div>

                <div className="rounded-2xl bg-black/40 p-5">
                  🏨 Hotel Collaboration
                </div>

                <div className="rounded-2xl bg-black/40 p-5">
                  📍 Shared Activities
                </div>

                <div className="rounded-2xl bg-black/40 p-5">
                  💸 Expense Splitting
                </div>

                <div className="rounded-2xl bg-black/40 p-5">
                  🗓️ AI Daily Planning
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">

              <p className="text-neutral-400">
                Status
              </p>

              <h3 className="mt-3 text-3xl font-semibold capitalize">
                {trip.status}
              </h3>

            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">

              <p className="text-neutral-400">
                Trip ID
              </p>

              <p className="mt-3 break-all text-sm text-neutral-300">
                {trip.id}
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}