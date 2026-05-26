"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  tripId: string;
  startDate?: string | null;
  endDate?: string | null;
};

export default function TripDates({
  tripId,
  startDate,
  endDate,
}: Props) {
  const router = useRouter();

  const [start, setStart] = useState(startDate || "");
  const [end, setEnd] = useState(endDate || "");
  const [saving, setSaving] = useState(false);

  async function saveDates() {
    setSaving(true);

    await fetch("/api/update-trip-dates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tripId,
        startDate: start,
        endDate: end,
      }),
    });

    setSaving(false);
    router.refresh();
  }

  return (
    <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-6">
      <h3 className="text-2xl font-semibold">
        Trip Dates
      </h3>

      <div className="mt-5 space-y-4">
        <div>
          <p className="mb-2 text-sm text-neutral-500">
            Start date
          </p>

          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-neutral-500">
            End date
          </p>

          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />
        </div>

        <button
          onClick={saveDates}
          disabled={saving}
          className="w-full rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Dates"}
        </button>
      </div>
    </div>
  );
}