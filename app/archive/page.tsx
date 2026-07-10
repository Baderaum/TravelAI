import Link from "next/link";
import { Archive, Plus } from "lucide-react";

import ProLockedState from "@/components/billing/pro-locked-state";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import TripCard from "@/components/trips/trip-card";
import { createClient } from "@/lib/supabase/server";

type Trip = {
  id: string;
  title: string;
  destination: string | null;
  cover_image: string | null;
  status: string;
  created_at: string;
  role?: string;
};

type TripMembership = {
  role: string;
  trips: Trip | Trip[] | null;
};

export default async function ArchivePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <DashboardShell>
        <div className="flex min-h-screen items-center justify-center p-10 text-white">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center">
            <h1 className="text-3xl font-bold">Please log in</h1>
            <p className="mt-4 text-neutral-400">
              You need to be logged in to view archived trips.
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  if (profile?.plan !== "Monthly" && profile?.plan !== "Lifetime") {
    return (
      <DashboardShell>
        <ProLockedState
          title="Archive is a Pro feature"
          description="Upgrade to archive completed or paused trips and keep your workspace clean."
        />
      </DashboardShell>
    );
  }

  const { data: rawMemberships } = await supabase
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

  const archivedTrips =
    memberships
      ?.flatMap((membership) => {
        if (!membership.trips) return [];

        const trips = Array.isArray(membership.trips)
          ? membership.trips
          : [membership.trips];

        return trips.map((trip) => ({
          ...trip,
          role: membership.role,
        }));
      })
      .filter(Boolean)
      .filter((trip) => trip.status === "archived")
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      ) || [];

  return (
    <DashboardShell>
      <div className="p-6 sm:p-10">
        <section className="travel-card relative overflow-hidden rounded-[36px] p-8 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-neutral-200">
                <Archive className="h-6 w-6" />
              </div>

              <h1 className="mt-6 text-5xl font-bold leading-tight text-white sm:text-6xl">
                Archive
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-300">
                Finished or paused trips live here, so your active workspace
                stays clean.
              </p>
            </div>

            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:bg-neutral-200"
            >
              <Plus className="h-5 w-5" />
              New Trip
            </Link>
          </div>
        </section>

        {!archivedTrips.length && (
          <div className="travel-card mt-10 rounded-[32px] p-12 text-center">
            <h2 className="text-3xl font-bold text-white">
              No archived trips
            </h2>
            <p className="mt-4 text-neutral-400">
              Set a trip status to Archived and it will appear here.
            </p>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-7 xl:grid-cols-3">
          {archivedTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
            />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
