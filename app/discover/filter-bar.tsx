type Props = {
  loading: boolean;
  generateTrip: () => void;

  groupSize: string;
  setGroupSize: (value: string) => void;

  departure: string;
  setDeparture: (value: string) => void;

  temperature: string;
  setTemperature: (value: string) => void;

  flightTime: string;
  setFlightTime: (value: string) => void;

  tripType: string;
  setTripType: (value: string) => void;

  budgetAmount: string;
  setBudgetAmount: (value: string) => void;

  currency: "EUR" | "USD";
  setCurrency: (value: "EUR" | "USD") => void;

  pace: string;
  setPace: (value: string) => void;

  accommodation: string;
  setAccommodation: (value: string) => void;

  travelPersonality: string;
  setTravelPersonality: (value: string) => void;

  avoidTourist: boolean;
  setAvoidTourist: (value: boolean) => void;

  extraInfo: string;
  setExtraInfo: (value: string) => void;

  selectedVibes: string[];
  setSelectedVibes: (value: string[]) => void;

  hates: string[];
  setHates: (value: string[]) => void;
};

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

export function FilterBar({
  loading,
  generateTrip,

  groupSize,
  setGroupSize,

  departure,
  setDeparture,

  temperature,
  setTemperature,

  flightTime,
  setFlightTime,

  tripType,
  setTripType,

  budgetAmount,
  setBudgetAmount,

  currency,
  setCurrency,

  pace,
  setPace,

  accommodation,
  setAccommodation,

  travelPersonality,
  setTravelPersonality,

  avoidTourist,
  setAvoidTourist,

  extraInfo,
  setExtraInfo,

  selectedVibes,
  setSelectedVibes,

  hates,
  setHates,
}: Props) {
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

  return (
    <div className="p-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-white">
          Discover
        </h1>

        <p className="mt-3 text-lg text-neutral-400">
          AI-powered destination matching for your next trip.
        </p>
      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* YOUR GROUP */}
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">
            Your Group
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4">

            <div>
              <p className="mb-3 text-sm text-neutral-400">
                Group Size
              </p>

              <select
                value={groupSize}
                onChange={(e) =>
                  setGroupSize(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              >
                <option>1-2</option>
                <option>3-5</option>
                <option>6-10</option>
                <option>10+</option>
              </select>
            </div>

            <div>
              <p className="mb-3 text-sm text-neutral-400">
                Departure
              </p>

              <input
                value={departure}
                onChange={(e) =>
                  setDeparture(e.target.value)
                }
                placeholder="Germany"
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <p className="mb-3 text-sm text-neutral-400">
                Distance
              </p>

              <select
                value={flightTime}
                onChange={(e) =>
                  setFlightTime(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              >
                <option>Within 2h</option>
                <option>Same continent</option>
                <option>International</option>
                <option>Doesn't matter</option>
              </select>
            </div>

            <div>
              <p className="mb-3 text-sm text-neutral-400">
                Trip Type
              </p>

              <select
                value={tripType}
                onChange={(e) =>
                  setTripType(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              >
                <option>Friends</option>
                <option>Couple</option>
                <option>Solo</option>
                <option>Family</option>
                <option>Bachelor Party</option>
              </select>
            </div>
          </div>
        </div>

        {/* PREFERENCES */}
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold text-white">
            Preferences
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-4">

            <div>
              <p className="mb-3 text-sm text-neutral-400">
                Temperature
              </p>

              <select
                value={temperature}
                onChange={(e) =>
                  setTemperature(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              >
                <option>Warm</option>
                <option>Cold</option>
                <option>Mixed</option>
                <option>Doesn't matter</option>
              </select>
            </div>

            <div>
              <p className="mb-3 text-sm text-neutral-400">
                Pace
              </p>

              <select
                value={pace}
                onChange={(e) =>
                  setPace(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              >
                <option>Relaxed</option>
                <option>Balanced</option>
                <option>Fast-Paced</option>
              </select>
            </div>

            <div>
              <p className="mb-3 text-sm text-neutral-400">
                Accommodation
              </p>

              <select
                value={accommodation}
                onChange={(e) =>
                  setAccommodation(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              >
                <option>Airbnb</option>
                <option>Hotel</option>
                <option>Hostel</option>
                <option>Luxury Resort</option>
              </select>
            </div>

            <div>
              <p className="mb-3 text-sm text-neutral-400">
                Personality
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
                <option>Spontaneous</option>
                <option>Planner</option>
                <option>Luxury</option>
                <option>Adventurous</option>
              </select>
            </div>
          </div>
        </div>

        {/* BUDGET */}
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
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
                  onClick={() =>
                    setCurrency("EUR")
                  }
                  className={`rounded-xl px-3 py-2 text-sm transition ${
                    currency === "EUR"
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  }`}
                >
                  EUR
                </button>

                <button
                  onClick={() =>
                    setCurrency("USD")
                  }
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
                {currency === "EUR"
                  ? "€"
                  : "$"}
                {budgetAmount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIBES */}
      <div className="mt-6 rounded-[32px] border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white">
          Desired Vibes
        </h2>

        <div className="mt-6 flex flex-wrap gap-3">
          {vibeOptions.map((vibe) => (
            <button
              key={vibe}
              onClick={() =>
                toggleVibe(vibe)
              }
              className={`rounded-full px-4 py-2 text-sm transition ${
                selectedVibes.includes(vibe)
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
            >
              {vibe}
            </button>
          ))}
        </div>
      </div>

      {/* HATES */}
      <div className="mt-6 rounded-[32px] border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white">
          Things To Avoid
        </h2>

        <div className="mt-6 flex flex-wrap gap-3">
          {hateOptions.map((hate) => (
            <button
              key={hate}
              onClick={() =>
                toggleHate(hate)
              }
              className={`rounded-full px-4 py-2 text-sm transition ${
                hates.includes(hate)
                  ? "bg-red-500 text-white"
                  : "bg-black text-white"
              }`}
            >
              {hate}
            </button>
          ))}
        </div>
      </div>

      {/* HIDDEN GEMS */}
    <div className="mt-6 rounded-[32px] border border-white/10 bg-white/5 p-6">
    <div className="flex items-center justify-between">

        <div>
        <h2 className="text-xl font-semibold text-white">
            Hidden Gems Mode
        </h2>

        <p className="mt-2 text-neutral-400">
            Prioritize underrated destinations and avoid mass tourism.
        </p>
        </div>

        <button
        onClick={() =>
            setAvoidTourist(!avoidTourist)
        }
        className={`rounded-2xl px-5 py-3 font-medium transition ${
            avoidTourist
            ? "bg-white text-black"
            : "border border-white/10 bg-black text-white"
        }`}
        >
        {avoidTourist
            ? "Enabled"
            : "Disabled"}
        </button>
    </div>
    </div>

    {/* EXTRA INFO */}
    <div className="mt-6 rounded-[32px] border border-white/10 bg-white/5 p-6">
    
    <h2 className="text-xl font-semibold text-white">
        Additional Information
    </h2>

    <textarea
        value={extraInfo}
        onChange={(e) =>
        setExtraInfo(e.target.value)
        }
        placeholder="Any special wishes, preferences or ideas?"
        className="mt-6 min-h-[140px] w-full rounded-3xl border border-white/10 bg-black p-5 text-white outline-none"
    />
    </div>

      {/* GENERATE BUTTON */}
      <button
        onClick={generateTrip}
        disabled={loading}
        className="mt-10 rounded-2xl bg-white px-8 py-4 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-50"
      >
        {loading
          ? "Generating..."
          : "Generate Trip"}
      </button>
    </div>
  );
}