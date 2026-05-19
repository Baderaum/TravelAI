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
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="w-full !max-w-6xl overflow-hidden border border-white/10 bg-black p-0 text-white">

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

                  <div className="mt-4 flex flex-wrap gap-3">
                    {destination.activities.map(
                      (activity) => (
                        <div
                          key={activity}
                          className={`rounded-2xl border border-white/10 bg-white/5 px-5 py-3 transition hover:bg-white/10 ${typography.tag}`}
                        >
                          {activity}
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

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p
                    className={`${typography.statLabel} text-neutral-400`}
                  >
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
                        geographies.map((geo: any) => (
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
                    Weather
                  </p>

                  <p
                    className={`${typography.statValue} font-semibold`}
                  >
                    {destination.weather}
                  </p>
                </div>

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
                </div>

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
                </div>

                <button
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