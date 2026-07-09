"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
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
  estimated_cost?: number | null;
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
    updates: Partial<Activity>
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
    useState(activity?.title || "");

  const [description, setDescription] =
    useState(activity?.description || "");

  const [startTime, setStartTime] =
    useState(
      activity?.start_time
        ? activity.start_time.slice(0, 16)
        : ""
    );

  const [endTime, setEndTime] =
    useState(
      activity?.end_time
        ? activity.end_time.slice(0, 16)
        : ""
    );

  const [estimatedCost, setEstimatedCost] = useState(
    activity?.estimated_cost != null ? String(activity.estimated_cost) : ""
  );

  const [imageOpen, setImageOpen] =
    useState(false);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

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
        estimatedCost:
          estimatedCost === ""
            ? null
            : Number(estimatedCost.replace(",", ".")),
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
    estimated_cost:
      estimatedCost === ""
        ? null
        : Number(estimatedCost.replace(",", ".")),
    });

    setEditing(false);
  }

  async function enrichDetails() {
    if (!activity?.id) return;

    setDetailsLoading(true);

    try {
      const res = await fetch("/api/enrich-activity-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activityId: activity.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to enrich activity"
        );
      }

      const updates =
        data.activity as Partial<Activity>;

      if (typeof updates.description === "string") {
        setDescription(updates.description);
      }

      if (typeof updates.estimated_cost === "number") {
        setEstimatedCost(String(updates.estimated_cost));
      }

      onUpdateActivity?.(activity.id, updates);
    } catch (error) {
      console.error(error);
    } finally {
      setDetailsLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) {
          setEditing(false);
          setImageOpen(false);
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
          <div className="relative h-[320px] w-full overflow-hidden">

            {activity.image && (
              <button
                type="button"
                onClick={() => setImageOpen(true)}
                className="absolute inset-0 h-full w-full cursor-zoom-in"
              >
                <img
                  src={activity.image}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              </button>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

            <button
                onClick={() => {

                    if (editing) {
                    saveChanges();
                    return;
                    }

                    setEditing(true);
                }}
                className="absolute bottom-8 right-8 z-10 flex h-12 min-w-[92px] items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
                >
                {editing
                    ? "Save"
                    : "Edit"}
            </button>

            <div className="absolute bottom-0 left-0 z-10 p-8 pr-24">

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

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-2xl font-semibold">Budget</h3>
                <p className="mt-2 text-sm text-neutral-500">
                  Estimated cost per person
                </p>

                {editing ? (
                  <div className="relative mt-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                      EUR
                    </span>
                    <input
                      inputMode="decimal"
                      value={estimatedCost}
                      onChange={(event) => setEstimatedCost(event.target.value)}
                      placeholder="0"
                      className="w-full rounded-2xl border border-white/10 bg-black py-3 pl-14 pr-4 text-white outline-none"
                    />
                  </div>
                ) : (
                  <p className="mt-4 text-2xl font-semibold text-green-300">
                    {activity.estimated_cost != null
                      ? `EUR ${activity.estimated_cost}`
                      : "Not estimated"}
                  </p>
                )}
              </div>

              <button
                onClick={enrichDetails}
                disabled={detailsLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-3 font-medium text-green-300 transition hover:bg-green-500/20 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {detailsLoading
                  ? "Adding details..."
                  : "Give more details"}
              </button>

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
      {activity.image && imageOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-6"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setImageOpen(false);
            }}
            className="absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          <img
            src={activity.image}
            alt={title}
            className="max-h-[90vh] max-w-[90vw] rounded-[32px] object-contain shadow-[0_0_120px_rgba(255,255,255,0.12)]"
          />
        </div>
      )}
    </Dialog>
  );
}
