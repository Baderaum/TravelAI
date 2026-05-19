"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useEffect, useRef, useState } from "react";

import { FilterBar } from "./filter-bar";
import { ResultsGrid } from "./results-grid";
import { DestinationModal } from "./destination-modal";

export type Destination = {
  name: string;
  summary: string;
  match_score: number;
  estimated_budget: number;
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
  }[];
  subtitle: string;
  coordinates: {
    lat: number;
    lng: number;
  };
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

  const [selectedDestination, setSelectedDestination] =
    useState<Destination | null>(null);

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

  async function generateTrip() {
    setLoading(true);

    try {
      const res = await fetch("/api/generate-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      <div className="pb-20">

        <FilterBar
          loading={loading}
          groupSize={groupSize}
          setGroupSize={setGroupSize}
          departure={departure}
          setDeparture={setDeparture}
          temperature={temperature}
          setTemperature={setTemperature}
          flightTime={flightTime}
          setFlightTime={setFlightTime}
          tripType={tripType}
          setTripType={setTripType}
          budgetAmount={budgetAmount}
          setBudgetAmount={setBudgetAmount}
          currency={currency}
          setCurrency={setCurrency}
          pace={pace}
          setPace={setPace}
          accommodation={accommodation}
          setAccommodation={setAccommodation}
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
            onSelect={(destination) =>
              setSelectedDestination(destination)
            }
          />
        </div>

        <DestinationModal
          destination={selectedDestination}
          open={!!selectedDestination}
          onOpenChange={() =>
            setSelectedDestination(null)
          }
        />
      </div>
    </DashboardShell>
  );
}