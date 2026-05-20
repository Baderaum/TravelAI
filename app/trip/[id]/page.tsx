// Das hier ist die Trip Page (Trip aus der DB)
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

  const { data: trip } =
    await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();

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

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">
              <h2 className="text-3xl font-semibold">
                Overview
              </h2>
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">

  <div className="flex items-center justify-between">

    <h2 className="text-3xl font-semibold">
      Activities
    </h2>

    <button className="rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200">
      Add Activity
    </button>
    </div>

    {!activities?.length && (
      <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-10 text-center text-neutral-400">
        No activities planned yet.
      </div>
    )}

    <div className="mt-8 space-y-4">

      {activities?.map((activity) => (
        <div
          key={activity.id}
          className="overflow-hidden rounded-3xl border border-white/10 bg-black/40"
        >

          <div className="flex">

            {/* IMAGE */}
            {activity.image && (
              <img
                src={activity.image}
                alt={activity.title}
                className="h-44 w-56 object-cover"
              />
            )}

            {/* CONTENT */}
            <div className="flex-1 p-5">

              <div className="flex items-start justify-between">

                <div>

                  <h3 className="text-2xl font-semibold">
                    {activity.title}
                  </h3>

                  <p className="mt-3 text-neutral-400">
                    {activity.description}
                  </p>
                </div>

                <div className="rounded-full bg-white/10 px-4 py-2 text-sm capitalize">
                  {activity.status}
                </div>

              </div>

              {activity.location && (
                <p className="mt-5 text-sm text-neutral-500">
                  📍 {activity.location}
                </p>
              )}

            </div>
          </div>
        </div>
      ))}

    </div>
  </div>

              <p className="mt-5 text-lg leading-8 text-neutral-300">
                Your collaborative trip workspace is now ready.
                Start planning activities, expenses,
                flights and your daily itinerary together.
              </p>
            </div>

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