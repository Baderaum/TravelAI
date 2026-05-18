"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Loader2, Sparkles, Users, Plane } from "lucide-react";
import { useEffect, useRef, useState,} from "react";

const vibeOptions = [
  "Beach",
  "Party",
  "Relax",
  "Luxury",
  "Adventure",
  "Nature",
  "Culture",
  "Food",
  "Roadtrip",
  "Nightlife",
];

const hateOptions = [
  "Cold Weather",
  "Tourist Traps",
  "Long Flights",
  "Expensive Places",
  "Crowded Cities",
  "Party Destinations",
];

type Destination = {
  name: string;
  summary: string;
  match_score: number;
  estimated_budget: number;
  best_for: string;
  vibes: string[];
  weather: string;
  flight_time: string;
  image: string;
  activities: string[];
};

export default function DiscoverPage() {
  const [loading, setLoading] = useState(false);

  const [groupSize, setGroupSize] = useState("3-5");
  const [departure, setDeparture] = useState("Germany");
  const [temperature, setTemperature] = useState("Warm");
  const [flightTime, setFlightTime] =
    useState("Same continent");
  const [tripType, setTripType] = useState("Friends");

  const [budgetAmount, setBudgetAmount] =
    useState("800");

  const [currency, setCurrency] =
    useState<"EUR" | "USD">("EUR");

  const [pace, setPace] =
    useState("Balanced");

  const [accommodation, setAccommodation] =
    useState("Airbnb");

  const [travelPersonality, setTravelPersonality] =
    useState("Spontaneous");

  const [avoidTourist, setAvoidTourist] =
    useState(false);

  const [extraInfo, setExtraInfo] = useState("");

  const [selectedVibes, setSelectedVibes] =
    useState<string[]>(["Beach", "Party"]);

  const [hates, setHates] = useState<string[]>([]);

  const [results, setResults] = useState<
    Destination[]
  >([]);

  const resultsRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [results]);

  function toggleVibe(vibe: string) {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(
        selectedVibes.filter((v) => v !== vibe)
      );
    } else {
      setSelectedVibes([
        ...selectedVibes,
        vibe,
      ]);
    }
  }

  function toggleHate(hate: string) {
    if (hates.includes(hate)) {
      setHates(
        hates.filter((h) => h !== hate)
      );
    } else {
      setHates([...hates, hate]);
    }
  }

  async function generateTrip() {
    setLoading(true);

    try {
      const res = await fetch("/api/generate-trip", {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          groupSize,
          departure,
          temperature,
          distance: flightTime,
          tripType,
          vibes: selectedVibes,
          extraInfo,
          budgetAmount,
          pace,
          accommodation,
          travelPersonality,
          avoidTourist,
          hates,
          currency,
        }),
      });

      const data = await res.json();

      setResults(data.destinations || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <div className="p-10">
        <div className="max-w-5xl">
          <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-300">
            <Sparkles className="h-4 w-4" />
            AI Discovery Engine
          </div>

          <h1 className="text-6xl font-bold tracking-tight text-white">
            Discover your next trip.
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-neutral-400">
            Tell AI about your group and get
            personalized destination ideas in
            seconds.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-neutral-400" />

              <h2 className="text-xl font-semibold text-white">
                Your Group
              </h2>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="mb-3 text-sm text-neutral-400">
                  Group Size
                </p>

                <select
                  value={groupSize}
                  onChange={(e) =>
                    setGroupSize(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                >
                  <option>2</option>
                  <option>3-5</option>
                  <option>6-10</option>
                  <option>10+</option>
                </select>
              </div>

              <div>
                <p className="mb-3 text-sm text-neutral-400">
                  Departure (also travel by car)
                </p>

                <select
                  value={departure}
                  onChange={(e) =>
                    setDeparture(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                >
                  <option>Germany</option>
                  <option>UK</option>
                  <option>France</option>
                  <option>USA</option>
                  <option>Netherlands</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3">
              <Plane className="h-5 w-5 text-neutral-400" />

              <h2 className="text-xl font-semibold text-white">
                Travel Preferences
              </h2>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="mb-3 text-sm text-neutral-400">
                  Temperature
                </p>

                <select
                  value={temperature}
                  onChange={(e) =>
                    setTemperature(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                >
                  <option>Warm</option>
                  <option>Cold</option>
                  <option>Mixed</option>
                  <option>
                    Doesn't matter
                  </option>
                </select>
              </div>

              <div>
                <p className="mb-3 text-sm text-neutral-400">
                  Distance
                </p>

                <select
                  value={flightTime}
                  onChange={(e) =>
                    setFlightTime(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                >
                  <option>
                    Within 2h
                  </option>

                  <option>
                    Same continent
                  </option>

                  <option>
                    International
                  </option>

                  <option>
                    Doesn't matter
                  </option>
                </select>
              </div>

              <div>
                <p className="mb-3 text-sm text-neutral-400">
                  Trip Type
                </p>

                <select
                  value={tripType}
                  onChange={(e) =>
                    setTripType(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                >
                  <option>Friends</option>
                  <option>Couple</option>
                  <option>Solo</option>
                  <option>Family</option>
                  <option>
                    Bachelor Party
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[32px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">
            Budget
          </h2>

          <p className="mt-2 text-neutral-400">
            Approximate budget per person
          </p>

            <div className="mt-6 flex items-center gap-4">
                <input
                    type="range"
                    min="200"
                    max="5000"
                    step="100"
                    value={budgetAmount}
                    onChange={(e) =>
                    setBudgetAmount(e.target.value)
                    }
                    className="w-full"
                />

                <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-2">
                    <button
                        onClick={() => setCurrency("EUR")}
                        className={`rounded-xl px-3 py-2 text-sm transition ${
                        currency === "EUR"
                            ? "bg-white text-black"
                            : "bg-black text-white"
                        }`}
                    >
                        EUR
                    </button>

                    <button
                        onClick={() => setCurrency("USD")}
                        className={`rounded-xl px-3 py-2 text-sm transition ${
                        currency === "USD"
                            ? "bg-white text-black"
                            : "bg-black text-white"
                        }`}
                    >
                        USD
                    </button>
                    </div>

                    <div className="min-w-[110px] rounded-2xl bg-black px-4 py-3 text-center text-white">
                    {currency === "EUR" ? "€" : "$"}
                    {budgetAmount}
                    </div>
                </div>
            
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <p className="mb-3 text-sm text-neutral-400">
              Travel Personality
            </p>

            <select
              value={travelPersonality}
              onChange={(e) =>
                setTravelPersonality(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            >
              <option>
                Spontaneous
              </option>
              <option>Luxury</option>
              <option>Foodie</option>
              <option>
                Adventure
              </option>
              <option>Culture</option>
              <option>
                Nightlife
              </option>
              <option>
                Digital Nomad
              </option>
            </select>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <p className="mb-3 text-sm text-neutral-400">
              Pace Preference
            </p>

            <select
              value={pace}
              onChange={(e) =>
                setPace(e.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            >
              <option>Relaxed</option>
              <option>
                Balanced
              </option>
              <option>
                Fast-paced
              </option>
            </select>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <p className="mb-3 text-sm text-neutral-400">
              Accommodation Style
            </p>

            <select
              value={accommodation}
              onChange={(e) =>
                setAccommodation(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
            >
              <option>Hostel</option>
              <option>Airbnb</option>
              <option>Hotel</option>
              <option>Resort</option>
              <option>Villa</option>
              <option>Camping</option>
            </select>
          </div>
        </div>

        <div className="mt-6 rounded-[32px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">
            What vibes are you looking for?
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {vibeOptions.map((vibe) => {
              const active =
                selectedVibes.includes(
                  vibe
                );

              return (
                <button
                  key={vibe}
                  onClick={() =>
                    toggleVibe(vibe)
                  }
                  className={`rounded-full px-5 py-3 transition ${
                    active
                      ? "bg-white text-black"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {vibe}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Hidden Gems
              </h2>

              <p className="mt-2 text-neutral-400">
                Avoid tourist traps and
                overcrowded destinations
              </p>
            </div>

            <button
              onClick={() =>
                setAvoidTourist(
                  !avoidTourist
                )
              }
              className={`rounded-full px-5 py-3 transition ${
                avoidTourist
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
            >
              {avoidTourist
                ? "Enabled"
                : "Disabled"}
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-[32px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">
            What do you want to avoid?
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {hateOptions.map((hate) => {
              const active =
                hates.includes(hate);

              return (
                <button
                  key={hate}
                  onClick={() =>
                    toggleHate(hate)
                  }
                  className={`rounded-full px-5 py-3 transition ${
                    active
                      ? "bg-red-500 text-white"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {hate}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 rounded-[32px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">
            Additional Information
          </h2>

          <textarea
            value={extraInfo}
            onChange={(e) =>
              setExtraInfo(
                e.target.value
              )
            }
            placeholder="We love techno, want underrated places and don't want tourist traps..."
            className="mt-5 min-h-[140px] w-full resize-none rounded-2xl border border-white/10 bg-black p-4 text-white outline-none placeholder:text-neutral-500"
          />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={generateTrip}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-medium text-black transition hover:scale-[1.03]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Discovering...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Discover Destinations
              </>
            )}
          </button>
        </div>

        {results.length > 0 && (
          <div ref={resultsRef}>
            <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {results.map(
                (destination, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5"
                  >
                    <div className="relative h-64">
                      <img
                        src={
                          destination.image
                        }
                        alt={
                          destination.name
                        }
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />

                      <div className="absolute bottom-5 left-5">
                        <h2 className="text-3xl font-bold text-white">
                          {
                            destination.name
                          }
                        </h2>

                        <p className="mt-1 text-sm text-neutral-300">
                          Match Score:{" "}
                          {
                            destination.match_score
                          }
                          %
                        </p>
                      </div>
                    </div>

                    <div className="p-6">
                      <p className="text-neutral-300">
                        {
                          destination.summary
                        }
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {destination.vibes?.map(
                          (
                            vibe,
                            vibeIndex
                          ) => (
                            <div
                              key={
                                vibeIndex
                              }
                              className="rounded-full bg-white/10 px-3 py-1 text-sm text-white"
                            >
                              {vibe}
                            </div>
                          )
                        )}
                      </div>

                      <button className="mt-8 w-full rounded-2xl bg-white py-3 font-medium text-black transition hover:scale-[1.02]">
                        Create Trip
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}