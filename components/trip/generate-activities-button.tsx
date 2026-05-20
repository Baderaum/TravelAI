"use client";

import { useRouter } from "next/navigation";

type Props = {
  tripId: string;
};

export default function GenerateActivitiesButton({
  tripId,
}: Props) {

  const router =
    useRouter();

  async function generateActivities() {

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
  }

  return (
    <button
      onClick={generateActivities}
      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
    >
      Generate AI Activities
    </button>
  );
}