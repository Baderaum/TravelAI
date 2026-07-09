import Link from "next/link";

import {
  Plus,
  Users,
  ArrowRight,
  Clock3,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

import { createClient } from "@/lib/supabase/server";

type Trip = {
  id: string;
  title: string;
  destination: string | null;
  cover_image: string | null;
  status: string;
  created_at: string;
};

type TripMembership = {
  role: string;
  trips: Trip | Trip[] | null;
};

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
    data: rawMemberships,
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

  const memberships =
    rawMemberships as TripMembership[] | null;

  const trips =
    memberships
      ?.flatMap((membership) => {
        if (!membership.trips) return [];

        return Array.isArray(membership.trips)
          ? membership.trips
          : [membership.trips];
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      ) || [];

  const activeTrips =
    trips.filter((trip) => trip.status === "planning").length;

  return (
    <DashboardShell>

      <div className="p-6 sm:p-10">

        {/* HEADER */}
        <section className="travel-card relative overflow-hidden rounded-[36px] p-8 sm:p-10">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[linear-gradient(120deg,transparent,rgba(16,185,129,0.12),rgba(245,158,11,0.08))]" />

          <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl">
                Your Trips
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-300">
                Collaborative workspaces for ideas, activities, flights,
                budgets and polished itineraries.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row xl:items-center">
              <div className="grid grid-cols-2 gap-3 sm:w-[360px]">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-neutral-400">Trips</p>
                  <p className="mt-2 text-3xl font-semibold">{trips.length}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-neutral-400">Active</p>
                  <p className="mt-2 text-3xl font-semibold">{activeTrips}</p>
                </div>
              </div>

              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-medium text-black shadow-[0_18px_50px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:bg-emerald-100"
              >

                <Plus className="h-5 w-5" />

                New Trip

              </Link>
            </div>
          </div>

        </section>

        {/* EMPTY STATE */}
        {!trips.length && (

          <div className="travel-card mt-10 flex flex-col items-center justify-center rounded-[32px] p-16 text-center">

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
        <div className="mt-10 grid grid-cols-1 gap-7 xl:grid-cols-3">

          {trips.map((trip) => (

            <Link
              key={trip.id}
              href={`/trip/${trip.id}`}
              className="travel-card-hover group overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.055]"
            >

              {/* IMAGE */}
              <div className="relative h-64 w-full overflow-hidden">

                {trip.cover_image ? (
                  <img
                    src={trip.cover_image}
                    alt={trip.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(135deg,#0f2f25,#2a2415)]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#04100c] via-black/[0.35] to-black/5" />
                <div className="absolute bottom-0 left-0 p-6">

                  <span className="rounded-full border border-emerald-200/20 bg-emerald-400/20 px-3 py-1 text-sm text-emerald-50 backdrop-blur">
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
              <div className="border-t border-white/10 bg-white/[0.035] p-6">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-5 text-sm text-neutral-300">

                    <div className="flex items-center gap-2">

                      <Users className="h-4 w-4" />

                      Group Trip

                    </div>

                    <div className="flex items-center gap-2">

                      <Clock3 className="h-4 w-4" />

                      Active

                    </div>

                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-white transition group-hover:translate-x-1 group-hover:border-emerald-300/30 group-hover:text-emerald-200">
                    <ArrowRight className="h-5 w-5" />
                  </span>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </DashboardShell>
  );
}
