"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useEffect, useRef, useState } from "react";

import { FilterBar } from "./filter-bar";
import { ResultsGrid } from "./results-grid";
import { DestinationModal } from "./destination-modal";
import { createClient } from "@/lib/supabase/client";

export type Destination = {
  name: string;
  summary: string;
  match_score: number;
  estimated_budget: number;
  flight_budget: number;
  departure_location: string;
  departure_airport_code: string;
  destination_airport_code: string;
  start_date?: string | null;
  end_date?: string | null;
  best_for: string;
  vibes: string[];
  weather: string;
  flight_time: string;
  image: string;
  why_match: string[];
  activities: {
    title: string;
    description: string;
    image: string;
    estimated_cost?: number;
  }[];
  subtitle: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export default function DiscoverPage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] =
    useState<"Free" | "Monthly" | "Lifetime">("Free");

  const [groupSize, setGroupSize] = useState("3-5");
  const [homeCity, setHomeCity] = useState("");
  const [homeCountry, setHomeCountry] = useState("Germany");
  const [temperature, setTemperature] = useState("Warm");
  const [targetCountry, setTargetCountry] = useState("");
  const [flightTime, setFlightTime] =
    useState("Same continent");
  const [tripType, setTripType] = useState("Friends");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [budgetAmount, setBudgetAmount] =
    useState("800");

  const [currency, setCurrency] =
    useState<"EUR" | "USD">("EUR");

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

  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

  const resultsRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadPlan() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      if (
        profile?.plan === "Monthly" ||
        profile?.plan === "Lifetime"
      ) {
        setPlan(profile.plan);
      }
    }

    loadPlan();
  }, []);

  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [results]);

  async function generateTrip() {
    setLoading(true);

    try {
      const res = await fetch("/api/create-discovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupSize,
          departure: homeCountry,
          temperature,
          targetCountry,
          distance: flightTime,
          tripType,
          vibes: selectedVibes,
          extraInfo,
          budgetAmount,
          startDate,
          endDate,
          homeCity,
          homeCountry,
          homeLocation: [homeCity, homeCountry]
            .filter(Boolean)
            .join(", "),
          travelPersonality,
          avoidTourist:
            plan === "Free" ? false : avoidTourist,
          hates:
            plan === "Free" ? [] : hates,
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
      <div className="pb-20">

        <FilterBar
          loading={loading}
          isFreePlan={plan === "Free"}
          groupSize={groupSize}
          setGroupSize={setGroupSize}
          homeCity={homeCity}
          setHomeCity={setHomeCity}
          homeCountry={homeCountry}
          setHomeCountry={setHomeCountry}
          temperature={temperature}
          setTemperature={setTemperature}
          targetCountry={targetCountry}
          setTargetCountry={setTargetCountry}
          flightTime={flightTime}
          setFlightTime={setFlightTime}
          tripType={tripType}
          setTripType={setTripType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          budgetAmount={budgetAmount}
          setBudgetAmount={setBudgetAmount}
          currency={currency}
          setCurrency={setCurrency}
          travelPersonality={travelPersonality}
          setTravelPersonality={setTravelPersonality}
          avoidTourist={avoidTourist}
          setAvoidTourist={setAvoidTourist}
          extraInfo={extraInfo}
          setExtraInfo={setExtraInfo}
          selectedVibes={selectedVibes}
          setSelectedVibes={setSelectedVibes}
          hates={hates}
          setHates={setHates}
          generateTrip={generateTrip}
        />

        <div ref={resultsRef}>
          <ResultsGrid
            results={results}
            isFreePlan={plan === "Free"}
            onSelect={(destination) =>
              setSelectedDestination(destination)
            }
          />
        </div>

        <DestinationModal
          destination={selectedDestination}
          open={!!selectedDestination}
          isFreePlan={plan === "Free"}
          onOpenChange={() =>
            setSelectedDestination(null)
          }
        />
      </div>
    </DashboardShell>
  );
}
