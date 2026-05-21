"use client";

import { useState } from "react";

import GenerateActivitiesButton from "./generate-activities-button";

type Activity = {
  id?: string;

  title: string;

  description: string;

  image?: string;

  status?: string;
};

type Props = {
  activities: Activity[];

  tripId: string;
};

export default function TripActivities({
  activities,
  tripId,
}: Props) {

  const [
    suggestions,
    setSuggestions,
  ] = useState<Activity[]>([]);

    async function deleteActivity(
    activityId: string
    ) {
        await fetch(
            "/api/delete-activity",
            {
            method: "POST",

            headers: {
                "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
                activityId,
            }),
            }
        );

        window.location.reload();
    }

  async function acceptActivity(
    activity: Activity
  ) {

    await fetch(
      "/api/create-activity",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          tripId,

          activity,
        }),
      }
    );

    setSuggestions((prev) =>
      prev.filter(
        (a) =>
          a.title !== activity.title
      )
    );

    window.location.reload();
  }

  function dismissActivity(
    activity: Activity
  ) {

    setSuggestions((prev) =>
      prev.filter(
        (a) =>
          a.title !== activity.title
      )
    );
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">

      <div className="flex items-center justify-between">

        <h2 className="text-3xl font-semibold">
          Activities
        </h2>

        <GenerateActivitiesButton
          tripId={tripId}
          onGenerated={setSuggestions}
        />
      </div>

      <div className="mt-8 space-y-5">

        {/* REAL ACTIVITIES */}
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="overflow-hidden rounded-3xl border border-white/10 bg-black/40"
          >

            <div className="flex">

              {activity.image && (
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="h-44 w-56 object-cover"
                />
              )}

              <div className="flex flex-1 flex-col justify-between p-5">

                <h3 className="text-2xl font-semibold">
                  {activity.title}
                </h3>

                <p className="mt-3 text-neutral-400">
                  {activity.description}
                </p>

                <div className="mt-6 flex justify-end">

                <button
                    onClick={() =>
                        deleteActivity(
                        activity.id!
                        )
                    }
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 active:scale-[0.98]"
                    >
                    Delete
                </button>

                </div>

              </div>
            </div>
          </div>
        ))}

        {/* AI SUGGESTIONS */}
        {suggestions.map((activity) => (
          <div
            key={activity.title}
            className="overflow-hidden rounded-3xl border border-green-500/30 bg-green-500/5"
          >

            <div className="flex">

              {activity.image && (
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="h-44 w-56 object-cover"
                />
              )}

              <div className="flex flex-1 flex-col justify-between p-5">

                <div>

                  <div className="mb-3 inline-flex rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300">
                    AI Suggestion
                  </div>

                  <h3 className="text-2xl font-semibold">
                    {activity.title}
                  </h3>

                  <p className="mt-3 text-neutral-400">
                    {activity.description}
                  </p>

                </div>

                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() =>
                      acceptActivity(
                        activity
                      )
                    }
                    className="rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:scale-[1.03] hover:bg-green-300 active:scale-[0.98]"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      dismissActivity(
                        activity
                      )
                    }
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 active:scale-[0.98]"
                  >
                    Dismiss
                  </button>

                </div>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}