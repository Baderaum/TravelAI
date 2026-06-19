"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

import { Destination } from "./page";

import { useRouter } from "next/navigation";

type Props = {
  destination: Destination | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const typography = {
  sectionTitle: "text-3xl",
  body: "text-lg",
  tag: "text-base",
  statLabel: "text-base",
  statValue: "mt-3 text-3xl",
  button: "text-lg",
};

export function DestinationModal({
  destination,
  open,
  onOpenChange,
}: Props) {

  const router = useRouter();

  async function createTrip(
    destination: Destination
  ) {
    try {

      const response =
        await fetch(
          "/api/create-trip",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              destination,
            }),
          }
        );

      const data =
        await response.json();

      router.push(
        `/trip/${data.tripId}`
      );

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] w-full !max-w-6xl overflow-y-auto rounded-[32px] border border-white/10 bg-black p-0 text-white scrollbar-thin scrollbar-thumb-white/20 shadow-[0_0_120px_rgba(59,130,246,0.15)]">

        <DialogTitle className="sr-only">
          Destination Details
        </DialogTitle>

        <DialogDescription className="sr-only">
          View detailed travel information about this destination.
        </DialogDescription>

        {destination && (
          <div className="overflow-hidden rounded-[28px]">

            {/* HERO */}
            <div className="relative h-[320px] w-full">
              <img
                src={destination.image}
                alt={destination.name}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8">
                <h2 className="text-5xl font-bold">
                  {destination.name}
                </h2>

                <p className="mt-3 text-lg text-neutral-300">
                  {destination.subtitle}
                </p>

                <p className="mt-2 text-lg text-neutral-300">
                  Match Score{" "}
                  <span className="text-green-400">
                    {destination.match_score}%
                  </span>
                </p>
              </div>
            </div>

            {/* CONTENT */}
            <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.3fr_0.7fr]">

              {/* LEFT */}
              <div>

                {/* ABOUT */}
                <div>
                  <h3
                    className={`${typography.sectionTitle} font-semibold`}
                  >
                    About
                  </h3>

                  <p
                    className={`mt-4 leading-8 text-neutral-300 ${typography.body}`}
                  >
                    {destination.summary}
                  </p>
                </div>

                {/* ACTIVITIES */}
                <div className="mt-8">
                  <h3
                    className={`${typography.sectionTitle} font-semibold`}
                  >
                    Activities
                  </h3>

                  <div className="mt-5 space-y-4">
                    {destination.activities.map(
                      (activity) => (
                        <div
                          key={activity.title}
                          className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
                        >
                          <img
                            src={activity.image}
                            alt={activity.title}
                            className="h-24 w-32 rounded-2xl object-cover"
                          />

                          <div className="flex-1">
                            <h4 className="text-lg font-semibold">
                              {activity.title}
                            </h4>

                            <p className="mt-2 text-neutral-400">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* WHY THIS MATCHES YOU */}
                <div className="mt-8">
                  <h3
                    className={`${typography.sectionTitle} font-semibold`}
                  >
                    Why This Matches You
                  </h3>

                  <div className="mt-5 space-y-3">
                    {destination.why_match.map(
                      (reason) => (
                        <div
                          key={reason}
                          className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                        >
                          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-green-400" />

                          <p
                            className={`${typography.body} text-neutral-300`}
                          >
                            {reason}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* VIBES */}
                <div className="mt-8">
                  <h3
                    className={`${typography.sectionTitle} font-semibold`}
                  >
                    Vibes
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {destination.vibes.map(
                      (vibe) => (
                        <div
                          key={vibe}
                          className={`rounded-full bg-white/10 px-5 py-3 ${typography.tag}`}
                        >
                          {vibe}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-4">

                {/* MAP */}
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3">

                  <div className="h-[220px] overflow-hidden rounded-2xl bg-[#d9f3ff]">

                    <ComposableMap
                      projectionConfig={{
                        scale: 750,
                        center: [
                          destination.coordinates.lng,
                          destination.coordinates.lat,
                        ],
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                        {({ geographies }) =>
                          geographies.map((geo: { rsmKey: string }) => (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill="#1f2937"
                              stroke="#111827"
                              strokeWidth={0.4}

                              style={{
                                default: {
                                  outline: "none",
                                },
                                hover: {
                                  fill: "#374151",
                                  outline: "none",
                                },
                                pressed: {
                                  fill: "#4b5563",
                                  outline: "none",
                                },
                              }}
                            />
                          ))
                        }
                      </Geographies>

                      <Marker
                        coordinates={[
                          destination.coordinates.lng,
                          destination.coordinates.lat,
                        ]}
                      >
                        <circle
                          r={6}
                          fill="#ff0000"
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      </Marker>
                    </ComposableMap>
                  </div>
                </div>

                {/* WEATHER */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p
                    className={`${typography.statLabel} text-neutral-400`}
                  >
                    Weather
                  </p>

                  <p
                    className={`${typography.statValue} font-semibold`}
                  >
                    {destination.weather}
                  </p>
                </div>

                {/* FLIGHT */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p
                    className={`${typography.statLabel} text-neutral-400`}
                  >
                    Flight Time
                  </p>

                  <p
                    className={`${typography.statValue} font-semibold`}
                  >
                    {destination.flight_time}
                  </p>

                  {destination.departure_airport_code &&
                    destination.destination_airport_code && (
                      <p className="mt-3 text-neutral-400">
                        {destination.departure_airport_code} {" -> "}
                        {destination.destination_airport_code}
                      </p>
                    )}
                </div>

                {/* BUDGET */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p
                    className={`${typography.statLabel} text-neutral-400`}
                  >
                    Estimated Budget
                  </p>

                  <p
                    className={`${typography.statValue} font-semibold`}
                  >
                    €{destination.estimated_budget}
                  </p>

                  {destination.flight_budget && (
                    <p className="mt-3 text-green-300">
                      Includes est. €{destination.flight_budget} flights
                    </p>
                  )}
                </div>

                {/* BUTTON */}
                <button
                  onClick={() =>
                    createTrip(destination)
                  }
                  className={`mt-4 w-full rounded-2xl bg-white py-5 font-semibold text-black transition hover:bg-neutral-200 ${typography.button}`}
                >
                  Create Trip
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
