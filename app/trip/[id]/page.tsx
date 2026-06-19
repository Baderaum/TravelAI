export const dynamic = "force-dynamic";

import Link from "next/link";

import {
  ArrowLeft,
  Plane,
  Wallet,
  MapPin,
  Users,
  Sparkles,
  CheckCircle2,
  Compass,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import TripActivities from "@/components/trip/trip-activities";
import InviteMember from "@/components/trip/invite-member";
import TripMap from "@/components/trip/trip-map";
import TripDates from "@/components/trip/trip-dates";
import TripSettings from "@/components/trip/trip-settings";
import CollapsibleSection from "@/components/ui/collapsible-section";
import PlanningCenter from "@/components/trip/planning-center";

export default async function TripPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single();

  const { data: destination } = await supabase
    .from("trip_destinations")
    .select("*")
    .eq("trip_id", id)
    .single();

  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("trip_id", id)
    .order("created_at", {
      ascending: true,
    });

  const { data: members } = await supabase
    .from("trip_members")
    .select(`
      role,
      user_id,
      profiles (
        id,
        username,
        email,
        avatar_url
      )
    `)
    .eq("trip_id", id);

  const { data: votes } = await supabase
    .from("activity_votes")
    .select("*")
    .in(
      "activity_id",
      activities?.map((activity) => activity.id) || []
  );

  if (!trip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Trip not found
      </div>
    );
  }

  const data = destination?.data || {};

  const flightBudget =
    typeof data.flight_budget === "number"
      ? data.flight_budget
      : null;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative border-b border-white/10">

        <div className="absolute inset-0">
          <img
            src={trip.cover_image}
            alt={trip.title}
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-black" />
        </div>

        <div className="relative mx-auto max-w-7xl px-10 pb-16 pt-10">

          <Link
            href="/trips"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm text-white backdrop-blur transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trips
          </Link>

          <div className="mt-20 flex items-start justify-between gap-8">
            <div className="max-w-4xl">

            <div className="mb-5 flex flex-wrap items-center gap-3">

              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-neutral-200 backdrop-blur">
                Travel Workspace
              </span>

              <span className="rounded-full bg-green-500/15 px-4 py-2 text-sm text-green-300">
                {destination?.match_score
                  ? `${destination.match_score}% match`
                  : "AI planned"}
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 text-sm capitalize text-neutral-200">
                {trip.status}
              </span>

            </div>

            <h1 className="text-6xl font-bold leading-tight">
              {trip.title}
            </h1>

            <p className="mt-5 max-w-2xl text-xl leading-8 text-neutral-300">
              {trip.description}
            </p>
          </div>

          <TripSettings
            tripId={id}
            title={trip.title}
            description={trip.description}
            startDate={trip.start_date}
            endDate={trip.end_date}
            members={members || []}
          />
        </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-10 py-10">

        {/* QUICK FACTS */}
        <section className="grid gap-4 md:grid-cols-4">

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <Plane className="h-5 w-5 text-neutral-400" />
            <p className="mt-4 text-sm text-neutral-500">
              Flight Time
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {data.flight_time || "Not set"}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <Wallet className="h-5 w-5 text-neutral-400" />
            <p className="mt-4 text-sm text-neutral-500">
              Budget
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {data.estimated_budget
                ? `€${data.estimated_budget}`
                : "Not set"}
            </p>
            {flightBudget !== null && (
              <p className="mt-2 text-sm text-green-300">
                Includes est. EUR {flightBudget} flights
              </p>
            )}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <Compass className="h-5 w-5 text-neutral-400" />
            <p className="mt-4 text-sm text-neutral-500">
              Vibes
            </p>
            <p className="mt-2 truncate text-2xl font-semibold">
              {data.vibes?.length
                ? data.vibes.slice(0, 2).join(", ")
                : "Open"}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <Users className="h-5 w-5 text-neutral-400" />
            <p className="mt-4 text-sm text-neutral-500">
              Members
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {members?.length || 0}
            </p>
          </div>

        </section>

        {/* OVERVIEW GRID */}
        <section className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">

          {/* LEFT */}
          <div className="space-y-8">

            {/* NEXT ACTIONS */}
            <PlanningCenter
              key={[
                trip.start_date,
                trip.end_date,
                data.departure_airport_code,
                data.destination_airport_code,
              ].join("-")}
              tripId={id}
              destination={trip.destination}
              departureLocation={data.departure_location}
              departureAirportCode={data.departure_airport_code}
              destinationAirportCode={data.destination_airport_code}
              startDate={trip.start_date}
              endDate={trip.end_date}
              initialFlightBudget={flightBudget}
            />

            {/* ACTIVITIES */}
            <TripActivities
              activities={activities || []}
              tripId={id}
              votes={votes || []}
            />

            {/* SUMMARY */}
            <CollapsibleSection
              title="Why is this a match"
              icon={<Sparkles className="h-6 w-6 text-green-400" />}
            >

              <p className="text-lg leading-8 text-neutral-300">
                {destination?.summary ||
                  "Your collaborative trip workspace is ready. Start planning activities, flights, expenses and your daily itinerary together."}
              </p>

              {data.why_match?.length > 0 && (
                <div className="mt-7 grid gap-4 md:grid-cols-2">

                  {data.why_match.map((reason: string) => (
                    <div
                      key={reason}
                      className="flex gap-3 rounded-2xl border border-white/10 bg-black/40 p-4"
                    >
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-400" />

                      <p className="text-neutral-300">
                        {reason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>
          </div>

          {/* RIGHT */}
          <aside className="space-y-6">

            <TripDates
              startDate={trip.start_date}
              endDate={trip.end_date}
            />

            {/* MAP */}
            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-green-400" />

                  <h3 className="text-2xl font-semibold">
                    Destination
                  </h3>
                </div>

              </div>

              <div className="h-[310px] overflow-hidden rounded-[28px] border border-white/10 bg-[#d9f3ff]">
                <TripMap
                  lat={Number(data.coordinates?.lat)}
                  lng={Number(data.coordinates?.lng)}
                  activities={activities || []}
                />
              </div>

              <p className="mt-5 text-lg font-medium">
                {trip.destination}
              </p>

              <p className="mt-2 text-neutral-400">
                {data.subtitle || "Location details will appear here."}
              </p>

            </div>

            {/* VIBES */}
            {data.vibes?.length > 0 && (
              <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6">

                <h3 className="text-2xl font-semibold">
                  Trip Vibes
                </h3>

                <div className="mt-5 flex flex-wrap gap-3">

                  {data.vibes.map((vibe: string) => (
                    <span
                      key={vibe}
                      className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm text-neutral-200"
                    >
                      {vibe}
                    </span>
                  ))}

                </div>

              </div>
            )}

            {/* MEMBERS */}
            <InviteMember
              tripId={id}
              members={members || []}
            />

          </aside>

        </section>
      </main>
    </div>
  );
}
