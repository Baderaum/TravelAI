"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  tripId: string;
};

export default function GenerateActivitiesButton({
  tripId,
}: Props) {

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  async function generateActivities() {

    try {

      setLoading(true);

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

      router.refresh();

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
      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
    >

      {loading
        ? "Generating..."
        : "Generate AI Activities"}

    </button>
  );
}