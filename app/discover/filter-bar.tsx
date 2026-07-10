import { Lock } from "lucide-react";

type Props = {
  loading: boolean;
  generateTrip: () => void;
  isFreePlan: boolean;

  groupSize: string;
  setGroupSize: (value: string) => void;

  homeCity: string;
  setHomeCity: (value: string) => void;

  homeCountry: string;
  setHomeCountry: (value: string) => void;

  temperature: string;
  setTemperature: (value: string) => void;

  targetCountry: string;
  setTargetCountry: (value: string) => void;

  flightTime: string;
  setFlightTime: (value: string) => void;

  tripType: string;
  setTripType: (value: string) => void;

  startDate: string;
  setStartDate: (value: string) => void;

  endDate: string;
  setEndDate: (value: string) => void;

  budgetAmount: string;
  setBudgetAmount: (value: string) => void;

  currency: "EUR" | "USD";
  setCurrency: (value: "EUR" | "USD") => void;

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

const countryOptions = [
  "Germany",
  "Austria",
  "Switzerland",
  "Netherlands",
  "Belgium",
  "France",
  "Italy",
  "Spain",
  "Portugal",
  "United Kingdom",
  "Ireland",
  "Denmark",
  "Sweden",
  "Norway",
  "Finland",
  "Poland",
  "Czech Republic",
  "United States",
  "Canada",
  "Australia",
];

export function FilterBar({
  loading,
  generateTrip,
  isFreePlan,

  groupSize,
  setGroupSize,

  homeCity,
  setHomeCity,

  homeCountry,
  setHomeCountry,

  temperature,
  setTemperature,

  targetCountry,
  setTargetCountry,

  flightTime,
  setFlightTime,

  tripType,
  setTripType,

  startDate,
  setStartDate,

  endDate,
  setEndDate,

  budgetAmount,
  setBudgetAmount,

  currency,
  setCurrency,

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
    if (isFreePlan) return;

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

      <div className="space-y-6">
        {/* YOUR GROUP */}
        <section className="travel-card rounded-[32px] p-6">
          <div className="grid gap-5 xl:grid-cols-[180px_1fr] xl:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Your Group
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Who is starting from where?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <label>
                <p className="mb-3 text-sm text-neutral-400">Group Size</p>
                <select
                  value={groupSize}
                  onChange={(e) => setGroupSize(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-black px-4 text-white outline-none"
                >
                  <option>1-2</option>
                  <option>3-5</option>
                  <option>6-10</option>
                  <option>10+</option>
                </select>
              </label>

              <label>
                <p className="mb-3 text-sm text-neutral-400">Home country</p>
                <select
                  value={homeCountry}
                  onChange={(e) => setHomeCountry(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-white/10 bg-black px-4 text-white outline-none"
                >
                  {countryOptions.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </label>

              <label>
                <p className="mb-3 text-sm text-neutral-400">Home city</p>
                <input
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  placeholder="Cologne"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-black px-4 text-white outline-none"
                />
              </label>

              <label>
                <p className="mb-3 text-sm text-neutral-400">Start date</p>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-14 w-full min-w-0 rounded-2xl border border-white/10 bg-black px-4 text-white outline-none"
                />
              </label>

              <label>
                <p className="mb-3 text-sm text-neutral-400">End date</p>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-14 w-full min-w-0 rounded-2xl border border-white/10 bg-black px-4 text-white outline-none"
                />
              </label>
            </div>
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="travel-card rounded-[32px] p-6">
          <div className="grid gap-5 xl:grid-cols-[180px_1fr]">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Preferences
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                Narrow down the recommendation logic.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(240px,0.8fr)_1fr]">
              <label className="rounded-3xl border border-white/10 bg-black/25 p-4 lg:row-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-300">
                      Target country
                    </p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      Optional. Leave empty for worldwide recommendations.
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-xs text-neutral-400">
                    Optional
                  </span>
                </div>

                <select
                  value={targetCountry}
                  onChange={(e) => setTargetCountry(e.target.value)}
                  className="mt-5 h-14 w-full rounded-2xl border border-white/10 bg-black px-4 text-white outline-none"
                >
                  <option value="">Any country</option>
                  {countryOptions.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label>
                  <p className="mb-3 text-sm text-neutral-400">Distance</p>
                  <select
                    value={flightTime}
                    onChange={(e) => setFlightTime(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-black px-4 text-white outline-none"
                  >
                    <option>Within 2h</option>
                    <option>Same continent</option>
                    <option>International</option>
                    <option>Doesn&apos;t matter</option>
                  </select>
                </label>

                <label>
                  <p className="mb-3 text-sm text-neutral-400">Trip Type</p>
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-black px-4 text-white outline-none"
                  >
                    <option>Friends</option>
                    <option>Couple</option>
                    <option>Solo</option>
                    <option>Family</option>
                    <option>Bachelor Party</option>
                  </select>
                </label>

                <label>
                  <p className="mb-3 text-sm text-neutral-400">Temperature</p>
                  <select
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-black px-4 text-white outline-none"
                  >
                    <option>Warm</option>
                    <option>Cold</option>
                    <option>Mixed</option>
                    <option>Doesn&apos;t matter</option>
                  </select>
                </label>

                <label>
                  <p className="mb-3 text-sm text-neutral-400">Personality</p>
                  <select
                    value={travelPersonality}
                    onChange={(e) =>
                      setTravelPersonality(e.target.value)
                    }
                    className="h-14 w-full rounded-2xl border border-white/10 bg-black px-4 text-white outline-none"
                  >
                    <option>Spontaneous</option>
                    <option>Planner</option>
                    <option>Luxury</option>
                    <option>Adventurous</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* BUDGET */}
        <section className="travel-card rounded-[32px] p-6">
          <div className="grid gap-5 xl:grid-cols-[180px_1fr] xl:items-center">
            <div>
          <h2 className="text-xl font-semibold text-white">
            Budget
          </h2>

          <p className="mt-2 text-neutral-400">
            Approximate budget per person (the budget will mostly affect the recommended activities)
          </p>
            </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-center">

            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={budgetAmount}
              onChange={(e) =>
                setBudgetAmount(e.target.value)
              }
              className="w-full md:max-w-xl"
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
                  ? "EUR "
                  : "$"}
                {budgetAmount}
              </div>
            </div>
          </div>
          </div>
        </section>
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
      <div
        className={`mt-6 rounded-[32px] border p-6 ${
          isFreePlan
            ? "border-red-400/25 bg-red-500/[0.045]"
            : "border-white/10 bg-white/5"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">
            Things To Avoid
          </h2>

          {isFreePlan && (
            <span className="inline-flex items-center gap-2 rounded-full border border-red-300/25 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-100">
              <Lock className="h-3.5 w-3.5" />
              Pro
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {hateOptions.map((hate) => (
            <button
              key={hate}
              type="button"
              disabled={isFreePlan}
              onClick={() =>
                toggleHate(hate)
              }
              className={`rounded-full px-4 py-2 text-sm transition ${
                isFreePlan
                  ? "cursor-not-allowed border border-red-300/20 bg-black/35 text-neutral-500"
                  : hates.includes(hate)
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
    <div
      className={`mt-6 rounded-[32px] border p-6 ${
        isFreePlan
          ? "border-red-400/25 bg-red-500/[0.045]"
          : "border-white/10 bg-white/5"
      }`}
    >
    <div className="flex items-center justify-between">

        <div>
        <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-white">
            Hidden Gems Mode
        </h2>

        {isFreePlan && (
          <span className="inline-flex items-center gap-2 rounded-full border border-red-300/25 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-100">
            <Lock className="h-3.5 w-3.5" />
            Pro
          </span>
        )}
        </div>

        <p className="mt-2 text-neutral-400">
            Prioritize underrated destinations and avoid mass tourism.
        </p>
        </div>

        <button
        type="button"
        disabled={isFreePlan}
        onClick={() =>
            setAvoidTourist(!avoidTourist)
        }
        className={`rounded-2xl px-5 py-3 font-medium transition ${
            isFreePlan
            ? "cursor-not-allowed border border-red-300/20 bg-black/35 text-neutral-500"
            : avoidTourist
            ? "bg-white text-black"
            : "border border-white/10 bg-black text-white"
        }`}
        >
        {isFreePlan
            ? "Locked"
            : avoidTourist
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
