"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ExternalLink, Plane, Wallet } from "lucide-react";

import CollapsibleSection from "@/components/ui/collapsible-section";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type PlanningCenterProps = {
  tripId: string;
  destination: string;
  departureLocation?: string | null;
  departureAirportCode?: string | null;
  destinationAirportCode?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  initialFlightBudget?: number | null;
};

function normalizeAirportCode(value: string) {
  const trimmed = value.trim();

  if (/^[a-zA-Z]{3}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }

  return trimmed;
}

function formatDateInput(value?: string | null) {
  if (!value) return "";

  return value.slice(0, 10);
}

function buildSkyscannerUrl({
  origin,
  destination,
  outboundDate,
  inboundDate,
}: {
  origin: string;
  destination: string;
  outboundDate: string;
  inboundDate: string;
}) {
  const params = new URLSearchParams();

  if (origin.trim()) {
    params.set("origin", normalizeAirportCode(origin));
  }

  if (destination.trim()) {
    params.set("destination", normalizeAirportCode(destination));
  }

  if (outboundDate) {
    params.set("outboundDate", outboundDate);
  }

  if (inboundDate) {
    params.set("inboundDate", inboundDate);
  }

  params.set("adultsv2", "1");
  params.set("cabinclass", "economy");
  params.set("currency", "EUR");
  params.set("locale", "en-GB");
  params.set("market", "DE");

  const partnerId =
    process.env.NEXT_PUBLIC_SKYSCANNER_MEDIA_PARTNER_ID;

  if (partnerId) {
    params.set("mediaPartnerId", partnerId);
  }

  return `https://skyscanner.net/g/referrals/v1/flights/day-view/?${params.toString()}`;
}

export default function PlanningCenter({
  tripId,
  destination,
  departureLocation,
  departureAirportCode,
  destinationAirportCode,
  startDate,
  endDate,
  initialFlightBudget,
}: PlanningCenterProps) {
  const [flightOpen, setFlightOpen] = useState(false);
  const [origin, setOrigin] = useState(
    departureAirportCode || ""
  );
  const [flightDestination, setFlightDestination] =
    useState(destinationAirportCode || "");
  const [outboundDate, setOutboundDate] =
    useState(formatDateInput(startDate));
  const [inboundDate, setInboundDate] =
    useState(formatDateInput(endDate));
  const [flightBudget, setFlightBudget] = useState(
    initialFlightBudget ? String(initialFlightBudget) : ""
  );
  const [saving, setSaving] = useState(false);
  const [savedBudget, setSavedBudget] =
    useState(initialFlightBudget || null);

  const skyscannerUrl = useMemo(
    () =>
      buildSkyscannerUrl({
        origin,
        destination: flightDestination,
        outboundDate,
        inboundDate,
      }),
    [
      origin,
      flightDestination,
      outboundDate,
      inboundDate,
    ]
  );

  async function saveFlightBudget() {
    const amount =
      Number(flightBudget.replace(",", "."));

    if (!Number.isFinite(amount) || amount < 0) {
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/update-flight-budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId,
          flightBudget: amount,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save flight budget");
      }

      setSavedBudget(amount);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <CollapsibleSection
        title="Planning Center"
        description="Build the trip step by step with your group."
        contentClassName="grid gap-4 md:grid-cols-3"
      >
        <button
          type="button"
          onClick={() => setFlightOpen(true)}
          className="group rounded-[28px] border border-white/10 bg-black/40 p-6 text-left transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
        >
          <Plane className="h-6 w-6 text-neutral-300" />

          <h3 className="mt-5 text-2xl font-semibold">
            Flights
          </h3>

          <p className="mt-3 text-neutral-400">
            Search from {departureAirportCode || departureLocation || "your airport"} and use the AI flight estimate.
          </p>

          {savedBudget !== null && (
            <p className="mt-5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-300">
              Flight estimate: EUR {savedBudget}
            </p>
          )}
        </button>

        <div className="group rounded-[28px] border border-white/10 bg-black/40 p-6 transition hover:border-white/20 hover:bg-white/10">
          <CalendarDays className="h-6 w-6 text-neutral-300" />

          <h3 className="mt-5 text-2xl font-semibold">
            Itinerary
          </h3>

          <p className="mt-3 text-neutral-400">
            Turn accepted activities into daily plans.
          </p>
        </div>

        <div className="group rounded-[28px] border border-white/10 bg-black/40 p-6 transition hover:border-white/20 hover:bg-white/10">
          <Wallet className="h-6 w-6 text-neutral-300" />

          <h3 className="mt-5 text-2xl font-semibold">
            Budget
          </h3>

          <p className="mt-3 text-neutral-400">
            Track costs and split expenses fairly.
          </p>
        </div>
      </CollapsibleSection>

      <Dialog
        open={flightOpen}
        onOpenChange={setFlightOpen}
      >
        <DialogContent className="max-h-[90vh] w-full !max-w-3xl overflow-y-auto rounded-[32px] border border-white/10 bg-black p-0 text-white shadow-[0_0_120px_rgba(59,130,246,0.15)]">
          <DialogTitle className="sr-only">
            Flight planning
          </DialogTitle>

          <DialogDescription className="sr-only">
            Search flights for this trip and save a manual flight budget.
          </DialogDescription>

          <div className="p-6 sm:p-8">
            <div>
              <p className="w-fit rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
                Flights
              </p>

              <h2 className="mt-5 text-4xl font-semibold">
                Find flights to {destination}
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm text-neutral-400">
                  From airport code
                </span>
                <input
                  value={origin}
                  onChange={(event) =>
                    setOrigin(event.target.value)
                  }
                  placeholder="e.g. CGN, DUS, FRA"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30"
                />
              </label>

              <label className="block">
                <span className="text-sm text-neutral-400">
                  To airport code
                </span>
                <input
                  value={flightDestination}
                  onChange={(event) =>
                    setFlightDestination(event.target.value)
                  }
                  placeholder="e.g. MXP, LIN, FCO"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30"
                />
              </label>

              <label className="block">
                <span className="text-sm text-neutral-400">
                  Outbound
                </span>
                <input
                  type="date"
                  value={outboundDate}
                  onChange={(event) =>
                    setOutboundDate(event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30"
                />
              </label>

              <label className="block">
                <span className="text-sm text-neutral-400">
                  Return
                </span>
                <input
                  type="date"
                  value={inboundDate}
                  onChange={(event) =>
                    setInboundDate(event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30"
                />
              </label>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <label className="block flex-1">
                  <span className="text-sm text-neutral-400">
                    Flight price for budget
                  </span>
                  <input
                    inputMode="decimal"
                    value={flightBudget}
                    onChange={(event) =>
                      setFlightBudget(event.target.value)
                    }
                    placeholder="e.g. 180"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-white/30"
                  />
                </label>

                <button
                  type="button"
                  onClick={saveFlightBudget}
                  disabled={saving || !flightBudget}
                  className="rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save estimate"}
                </button>
              </div>

              {savedBudget !== null && (
                <p className="mt-4 text-sm text-green-300">
                  Saved flight estimate: EUR {savedBudget}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <a
                href={skyscannerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200"
              >
                Open Skyscanner
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
