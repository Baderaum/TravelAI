"use client";

import { useState } from "react";

import GenerateActivitiesButton from "./generate-activities-button";

import ActivityModal from "./activity-modal";

import AskDialog from "@/components/ui/ask-dialog";

type Activity = {
  id?: string;
  title: string;
  description: string;
  image?: string;
  status?: string;
  start_time?: string | null;
  end_time?: string | null;
};

type Vote = {
  activity_id: string;
  user_id: string;
  vote: "love" | "interested" | "skip";
};

type Props = {
  activities: Activity[];
  tripId: string;
  votes: Vote[];
};

export default function TripActivities({
  activities,
  tripId,
  votes,
}: Props) {

    const [
        suggestions,
        setSuggestions,
    ] = useState<Activity[]>([]);

    const [
        localActivities,
        setLocalActivities,
        ] = useState<Activity[]>(
        activities
    );

    const [selectedActivity, setSelectedActivity] =
      useState<Activity | null>(null);

    const [
      activityToDelete,
      setActivityToDelete,
    ] = useState<Activity | null>(null);

    const [
      deleteLoading,
      setDeleteLoading,
    ] = useState(false);

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

    setLocalActivities((prev) => [
        ...prev,
        activity,
    ]);

    setSuggestions((prev) =>
      prev.filter(
        (a) =>
          a.title !== activity.title
      )
    );

  }

  async function updateActivityTime(
    activityId: string,
    startTime: string,
    endTime: string
  ) {
    await fetch("/api/update-activity-time", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        activityId,
        startTime,
        endTime,
      }),
    });

    setLocalActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              start_time: startTime,
              end_time: endTime,
            }
          : activity
      )
    );
  }

  async function voteActivity(
    activityId: string,
    vote: string
  ) {
    await fetch("/api/vote-activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        activityId,
        vote,
      }),
    });

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
        {localActivities.map((activity) => (
          <div
            key={activity.id}
            onClick={() => setSelectedActivity(activity)}
            className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-black/40 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-[0_0_40px_rgba(255,255,255,0.06)]"
          >
            <div className="flex items-center gap-4 p-3">
              {activity.image && (
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="h-24 w-32 rounded-2xl object-cover transition duration-500 group-hover:scale-105"
                />
              )}

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-xl font-semibold transition group-hover:text-green-300">
                  {activity.title}
                </h3>

                <p className="mt-2 text-sm text-neutral-400">
                  {activity.start_time ? (
                    (() => {
                      const start =
                        new Date(
                          activity.start_time
                        );
                      const end =
                        activity.end_time
                          ? new Date(
                              activity.end_time
                            )
                          : null;
                      const sameDay =
                        end &&
                        start.toDateString() === end.toDateString();

                      if (sameDay) {

                        return (
                          <>
                            {start.toLocaleDateString(
                              [],
                              {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              }
                            )}
                            {" • "}
                            {start.toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                            {" - "}
                            {end.toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </>
                        );
                      }

                      return (
                        <>
                          {start.toLocaleDateString(
                            [],
                            {
                              day: "numeric",
                              month: "short",
                            }
                          )}

                          {" "}

                          {start.toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}

                          {" → "}

                          {end
                            ? (
                                <>
                                  {end.toLocaleDateString(
                                    [],
                                    {
                                      day: "numeric",
                                      month: "short",
                                    }
                                  )}

                                  {" "}

                                  {end.toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </>
                              )
                            : ""}
                        </>
                      );
                    })()

                  ) : (
                    "No time set"
                  )}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["love", "interested", "skip"].map((vote) => {
                    const count =
                      votes.filter(
                        (v) =>
                          v.activity_id === activity.id &&
                          v.vote === vote
                      ).length;

                    return (
                      <button
                        key={vote}
                        onClick={(e) => {
                          e.stopPropagation();

                          voteActivity(activity.id!, vote);
                        }}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white transition hover:bg-white/10"
                      >
                        {vote} {count}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  setActivityToDelete(activity);
                }}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 active:scale-[0.98]"
              >
                Delete
              </button>
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
                  className="h-44 w-56 object-cover transition duration-500 group-hover:scale-105"
                />
              )}

              <div className="flex flex-1 flex-col justify-between p-5">

                <div>

                  <div className="mb-3 inline-flex rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-300">
                    AI Suggestion
                  </div>

                  <h3 className="text-2xl font-semibold transition group-hover:text-green-300">
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
      <ActivityModal
        activity={selectedActivity}
        open={!!selectedActivity}
        onOpenChange={() =>
          setSelectedActivity(null)
        }
        onDelete={(activityId) => {
          const activity =
            localActivities.find(
              (item) => item.id === activityId
            );

          if (activity) {
            setActivityToDelete(activity);
          }
        }}
        onUpdateTime={updateActivityTime}

        onUpdateActivity={(
          activityId,
          updates
        ) => {

          setLocalActivities((prev) =>
            prev.map((activity) =>
              activity.id === activityId
                ? {
                    ...activity,
                    ...updates,
                  }
                : activity
            )
          );

          setSelectedActivity((prev) =>
            prev?.id === activityId
              ? {
                  ...prev,
                  ...updates,
                }
              : prev
          );
        }}
      />
      <AskDialog
        open={!!activityToDelete}
        title="Delete activity?"
        question={`Do you really want to delete "${activityToDelete?.title}"? This cannot be undone.`}
        yesLabel="Delete"
        noLabel="Cancel"
        loading={deleteLoading}
        onAnswer={async (result) => {
          if (result === "no" || result === "closed") {
            setActivityToDelete(null);
            return;
          }

          if (!activityToDelete?.id) return;

          setDeleteLoading(true);

          await deleteActivity(activityToDelete.id);

          setDeleteLoading(false);
          setActivityToDelete(null);
          setSelectedActivity(null);
        }}
      />
    </div>
  );
}