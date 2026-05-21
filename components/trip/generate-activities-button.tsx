"use client";

import { useState } from "react";

type Activity = {
  title: string;
  description: string;
  image: string;
};

type Props = {
  tripId: string;

  onGenerated: (
    activities: Activity[]
  ) => void;
};

export default function GenerateActivitiesButton({
  tripId,
  onGenerated,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  async function generateActivities() {

    try {

      setLoading(true);

      const response =
        await fetch(
          "/api/generate-activities",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              tripId,
            }),
          }
        );

      const data =
        await response.json();

      onGenerated(
        data.activities || []
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
    }
  }

  return (
    <button
      onClick={generateActivities}
      disabled={loading}
      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
    >

      {loading
        ? "Generating..."
        : "Generate Activities"}

    </button>
  );
}