import Link from "next/link";

import {
  Plus,
  Users,
  ArrowRight,
  Clock3,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

import { createClient } from "@/lib/supabase/server";

export default async function TripsPage() {

  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <DashboardShell>
        <div className="flex min-h-screen items-center justify-center p-10 text-white">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center">
            <h1 className="text-3xl font-bold">
              Please log in
            </h1>

            <p className="mt-4 text-neutral-400">
              You need to be logged in to view your trips.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:bg-neutral-200"
            >
              Login
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const {
    data: memberships,
  } = await supabase
    .from("trip_members")
    .select(`
      role,
      trips (
        id,
        title,
        destination,
        cover_image,
        status,
        created_at
      )
    `)
    .eq("user_id", user.id);

  const trips =
    memberships
      ?.map(
        (membership: any) =>
          membership.trips
      )
      .filter(Boolean)
      .sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      ) || [];

  return (
    <DashboardShell>

      <div className="p-10">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-bold text-white">
              Your Trips
            </h1>

            <p className="mt-4 text-lg text-neutral-400">
              Collaborative workspaces for group travel planning.
            </p>

          </div>

          <Link
            href="/discover"
            className="flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:bg-neutral-200"
          >

            <Plus className="h-5 w-5" />

            New Trip

          </Link>

        </div>

        {/* EMPTY STATE */}
        {!trips.length && (

          <div className="mt-20 flex flex-col items-center justify-center rounded-[32px] border border-white/10 bg-white/5 p-16 text-center">

            <h2 className="text-3xl font-bold text-white">
              No trips yet
            </h2>

            <p className="mt-4 max-w-lg text-lg text-neutral-400">
              Start discovering destinations and create
              your first collaborative travel workspace.
            </p>

            <Link
              href="/discover"
              className="mt-8 rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-neutral-200"
            >
              Explore Destinations
            </Link>

          </div>

        )}

        {/* TRIPS GRID */}
        <div className="mt-14 grid grid-cols-1 gap-8 xl:grid-cols-3">

          {trips.map((trip: any) => (

            <Link
              key={trip.id}
              href={`/trip/${trip.id}`}
              className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/5 transition hover:border-white/20"
            >

              {/* IMAGE */}
              <div className="relative h-60 w-full overflow-hidden">

                <img
                  src={trip.cover_image}
                  alt={trip.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6">

                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur">
                    {trip.status}
                  </span>

                  <h2 className="mt-4 text-3xl font-bold text-white">
                    {trip.title}
                  </h2>

                  <p className="mt-2 text-neutral-300">
                    {trip.destination}
                  </p>

                </div>

              </div>

              {/* CONTENT */}
              <div className="p-6">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-6 text-neutral-400">

                    <div className="flex items-center gap-2">

                      <Users className="h-4 w-4" />

                      Group Trip

                    </div>

                    <div className="flex items-center gap-2">

                      <Clock3 className="h-4 w-4" />

                      Active

                    </div>

                  </div>

                  <ArrowRight className="h-5 w-5 text-white transition group-hover:translate-x-1" />

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </DashboardShell>
  );
}