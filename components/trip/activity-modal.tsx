"use client";

import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import TripMap from "@/components/trip/trip-map";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type Activity = {
  id?: string;
  title: string;
  description: string;
  image?: string | null;
  location?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  lat?: number | null;
  lng?: number | null;    
};

type Props = {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (activityId: string) => void;
  onUpdateTime?: (
    activityId: string,
    startTime: string,
    endTime: string
  ) => void;

  onUpdateActivity?: (
    activityId: string,
    updates: {
      title: string;
      description: string;
      start_time: string | null;
      end_time: string | null;
    }
  ) => void;
};

function formatDateTime(value?: string | null) {
  if (!value) return "Not set";

  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ActivityModal({
  activity,
  open,
  onOpenChange,
  onDelete,
  onUpdateTime,
  onUpdateActivity,
}: Props) {
  const [editing, setEditing] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  useEffect(() => {
    if (!activity) return;

    setEditing(false);

    setTitle(
      activity.title || ""
    );

    setDescription(
      activity.description || ""
    );

    setStartTime(
      activity.start_time
        ? activity.start_time.slice(0, 16)
        : ""
    );

    setEndTime(
      activity.end_time
        ? activity.end_time.slice(0, 16)
        : ""
    );
  }, [activity]);

  if (!activity) return null;

  async function saveChanges() {
    if (!activity?.id) return;

    await fetch("/api/update-activity-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        activityId: activity.id,
        title,
        description,
        startTime,
        endTime,
      }),
    });

    onUpdateTime?.(
      activity.id,
      startTime,
      endTime
    );

    onUpdateActivity?.(activity.id, {
    title,
    description,
    start_time: startTime || null,
    end_time: endTime || null,
    });

    setEditing(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);

        if (!value) {
          setEditing(false);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] w-full !max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-black p-0 text-white shadow-[0_0_120px_rgba(34,197,94,0.15)]">

        <DialogTitle className="sr-only">
          Activity Details
        </DialogTitle>

        <DialogDescription className="sr-only">
          View and edit activity details.
        </DialogDescription>

        <div className="max-h-[90vh] overflow-y-auto rounded-[28px]">

          {/* HERO */}
          <div className="relative h-[320px] w-full">

            {activity.image && (
              <img
                src={activity.image}
                alt={title}
                className="h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

            <button
                onClick={() => {

                    if (editing) {
                    saveChanges();
                    return;
                    }

                    setEditing(true);
                }}
                className="absolute bottom-8 right-8 flex h-12 min-w-[92px] items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
                >
                {editing
                    ? "Save"
                    : "Edit"}
            </button>

            <div className="absolute bottom-0 left-0 p-8 pr-24">

              <p className="mb-4 w-fit rounded-full bg-green-500/20 px-4 py-2 text-sm text-green-300">
                Activity
              </p>

              {editing ? (
                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  className="w-full bg-transparent text-5xl font-bold text-white outline-none"
                />
              ) : (
                <h2 className="text-5xl font-bold">
                  {title}
                </h2>
              )}

            </div>
          </div>

          {/* CONTENT */}
          <div className="grid gap-8 p-8 lg:grid-cols-[1.25fr_0.75fr]">

            {/* LEFT */}
            <div>

              <h3 className="text-3xl font-semibold">
                About
              </h3>

              {editing ? (
                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  className="mt-5 min-h-[220px] w-full rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-lg leading-8 text-white outline-none"
                />
              ) : (
                <p className="mt-5 text-lg leading-8 text-neutral-300">
                  {description}
                </p>
              )}

              {activity.location && (
                <p className="mt-6 text-neutral-400">
                  📍 {activity.location}
                </p>
              )}

            </div>

            {/* RIGHT */}
            <div className="space-y-5">

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">

                <h3 className="text-2xl font-semibold">
                  Schedule
                </h3>

                <div className="mt-5 space-y-4">

                  <div>
                    <p className="mb-2 text-sm text-neutral-500">
                      Start
                    </p>

                    {editing ? (
                      <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) =>
                          setStartTime(e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                      />
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-neutral-300">
                        {formatDateTime(activity.start_time)}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-sm text-neutral-500">
                      End
                    </p>

                    {editing ? (
                      <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) =>
                          setEndTime(e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                      />
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-neutral-300">
                        {formatDateTime(activity.end_time)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {activity.id && (
                <button
                  onClick={() => {
                    onDelete?.(activity.id!);
                    onOpenChange(false);
                  }}
                  className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 font-medium text-red-300 transition hover:bg-red-500/20"
                >
                  Delete Activity
                </button>
              )}

            </div>
          </div>
          <div className="px-8 pb-8">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-2xl font-semibold">
                Location
              </h3>

              <div className="mt-5 h-[360px] overflow-hidden rounded-[28px] border border-white/10 bg-[#d9f3ff]">
                <TripMap
                  lat={Number(activity.lat)}
                  lng={Number(activity.lng)}
                />
              </div>

              <p className="mt-4 text-neutral-400">
                {activity.location ||
                (
                    activity.lat && activity.lng
                    ? `${Number(activity.lat).toFixed(4)}, ${Number(activity.lng).toFixed(4)}`
                    : "No activity location set yet."
                )}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}